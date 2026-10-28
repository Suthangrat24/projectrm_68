import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getStock, getStockForecast, addFavorite, deleteFavorite, checkFavorite } from "../fetchapi/call_api_user";
import Swal from "sweetalert2";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import "../css/stock_future.css";

// backend (production_forecast.py) พยากรณ์ล่วงหน้าได้สูงสุด 126 วันทำการ (~6 เดือน) เท่านั้น
// ตัวเลือก 9M/1Y/2Y ยังไม่มีข้อมูลรองรับ เลย disable ไว้ก่อน ไม่ลบออก เผื่อจะทำต่อทีหลัง
const HORIZON_DAYS = { "3M": 63, "6M": 126 };
const UNSUPPORTED_HORIZONS = [
  { value: "9M", label: "9 เดือน" },
  { value: "1Y", label: "1 ปี" },
  { value: "2Y", label: "2 ปี" },
];

const CONFIDENCE_LABEL = {
  high: "ความเชื่อมั่นสูง",
  medium: "ความเชื่อมั่นปานกลาง",
  low: "ความเชื่อมั่นต่ำ",
};

// Tooltip ของกราฟที่ธีมเข้ากับพื้นหลังมืดของหน้า (แทน tooltip สีขาวเริ่มต้นของ Recharts)
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const actualPoint = payload.find((p) => p.dataKey === "actual" && p.value != null);
  const forecastPoint = payload.find((p) => p.dataKey === "forecast" && p.value != null);
  const bandPoint = payload.find((p) => p.dataKey === "low80");

  return (
    <div className="future-chart-tooltip">
      <div className="future-chart-tooltip-date">{label}</div>
      {actualPoint && (
        <div className="future-chart-tooltip-row">
          <span className="future-chart-tooltip-dot future-chart-tooltip-dot--actual" />
          ราคาจริง: <strong>฿{actualPoint.value.toFixed(2)}</strong>
        </div>
      )}
      {forecastPoint && (
        <div className="future-chart-tooltip-row">
          <span className="future-chart-tooltip-dot future-chart-tooltip-dot--forecast" />
          ราคาพยากรณ์: <strong>฿{forecastPoint.value.toFixed(2)}</strong>
        </div>
      )}
      {forecastPoint && bandPoint && (
        <div className="future-chart-tooltip-row future-chart-tooltip-row--muted">
          <span className="future-chart-tooltip-dot future-chart-tooltip-dot--confidence" />
          ช่วง 80%: ฿{bandPoint.value.toFixed(2)} – ฿
          {(bandPoint.value + (payload.find((p) => p.dataKey === "band")?.value ?? 0)).toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default function StockFuture() {
  const navigate = useNavigate();
  const { symbol } = useParams();

  // ── ข้อมูลบริษัท (ชื่อ, badge, tags, โลโก้) — ดึงแบบเดียวกับ stock_detail.jsx ──
  const [stock, setStock] = useState({});

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await getStock(symbol);
        setStock(res.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }
    if (symbol) fetchStock();
  }, [symbol]);

  // ── Favorite (❤) — เหมือน stock_detail.jsx ──
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function checkFav() {
      if (!token || !stock?.stock_id) return;
      try {
        const res = await checkFavorite(token, stock.stock_id);
        setIsFavorite(res.is_favorite);
        setFavoriteId(res.favorite_id);
      } catch (err) {
        console.error("เช็ค favorite ไม่สำเร็จ", err);
      }
    }
    if (stock?.stock_id) checkFav();
  }, [stock]);

  const handleToggleFavorite = async () => {
    if (!token) {
      Swal.fire("กรุณาเข้าสู่ระบบก่อน", "", "warning");
      return;
    }
    if (!stock?.stock_id) return;

    try {
      if (isFavorite) {
        await deleteFavorite(token, favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const res = await addFavorite(token, stock.stock_id);
        setIsFavorite(true);
        setFavoriteId(res.favorite_id);
      }
    } catch (err) {
      console.error("favorite error", err);
    }
  };

  // ── ข้อมูลพยากรณ์ (ราคา/กราฟ/แนวรับ-แนวต้าน) ──
  const [forecast, setForecast] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [forecastError, setForecastError] = useState(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoadingForecast(true);
        setForecastError(null);
        const res = await getStockForecast(symbol);
        setForecast(res);
      } catch (err) {
        console.error("โหลด forecast ไม่สำเร็จ", err);
        setForecastError("ยังไม่มีข้อมูลพยากรณ์ของหุ้นนี้");
      } finally {
        setLoadingForecast(false);
      }
    }
    if (symbol) fetchForecast();
  }, [symbol]);

  const [activeTab, setActiveTab] = useState("price"); // price | dividend
  const [horizon, setHorizon] = useState("6M");
  const [chartType, setChartType] = useState("line"); // line | volume | radar

  // ต่อ "ราคาจริง" (history) กับ "ราคาพยากรณ์" (forecast, ตัดตาม horizon ที่เลือก)
  // ให้เป็น array เดียวบนแกนเวลาเดียวกัน สำหรับ ComposedChart
  const chartData = useMemo(() => {
    if (!forecast) return [];
    const days = HORIZON_DAYS[horizon] ?? HORIZON_DAYS["6M"];
    const forecastSlice = forecast.chart.forecast.slice(0, days);

    return [
      ...forecast.chart.history.map((h) => ({
        date: h.date,
        actual: h.price,
        forecast: null,
        low80: null,
        band: null,
      })),
      ...forecastSlice.map((f) => ({
        date: f.date,
        actual: null,
        forecast: f.median,
        low80: f.low80,
        band: +(f.high80 - f.low80).toFixed(2), // ความสูงของแถบ ต่อจาก low80 (stacked area trick)
      })),
    ];
  }, [forecast, horizon]);

  const target6m = forecast?.forecast_6m?.median ?? 0;
  const growthProb = forecast?.forecast_6m?.pct_change ?? 0;
  const currentPrice = forecast?.last_price ?? 0;
  const sr = forecast?.support_resistance;

  return (
    <section className="future-page">
      {/* ===== แถวบนสุด: เลือกระยะเวลา ===== */}
      <div className="future-top-row">
        <div className="future-horizon">
          <span className="future-horizon-label">ระยะเวลาที่ดูแนวโน้ม</span>
          <div className="future-horizon-selectwrap">
            <select
              className="future-horizon-select"
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
            >
              <option value="3M">3 เดือน</option>
              <option value="6M">6 เดือน</option>
              {/* {UNSUPPORTED_HORIZONS.map((h) => (
                <option key={h.value} value={h.value} disabled>
                  {h.label} (ยังไม่รองรับ)
                </option>
              ))} */}
            </select>
            <span className="future-horizon-arrow">▾</span>
          </div>
        </div>
      </div>

      {/* ===== การ์ดหัวข้อหลักหุ้น + metric 3 ใบ ===== */}
      <header className="future-header-card">
        <div className="future-header-left">
          <div className="detail-logo">
            {stock?.logo_path ? (
              <img src={stock.logo_path} alt={stock.symbol} className="detail-logo-img" />
            ) : (
              <div className="detail-logo-mark">{stock?.symbol?.charAt(0)}</div>
            )}
          </div>

          <div className="detail-name-block">
            <div className="detail-symbol-row">
              <span className="detail-symbol">{stock.symbol || symbol}</span>
              <span className="detail-status-badge">ความเสี่ยง{stock.level_name}</span>
              <button className="detail-heart" onClick={handleToggleFavorite}>
                <img
                  src={isFavorite ? "/pics/fav.png" : "/pics/notfav.png"}
                  alt="favorite"
                  className="detail-heart-icon"
                />
              </button>
            </div>
            <p className="detail-fullname">{stock.stock_name}</p>

            <div className="detail-tag-row">
              {stock.market_type_name && (
                <span className="detail-tag">{stock.market_type_name}</span>
              )}
              {stock.industry_group_symbol && (
                <span className="detail-tag">{stock.industry_group_symbol}</span>
              )}
              {stock.sector_symbol && (
                <span className="detail-tag">{stock.sector_symbol}</span>
              )}
            </div>
          </div>
        </div>

        <div className="future-header-right">
          <div className="future-metrics-row">
            <div className="future-metric-card">
              <div className="future-metric-label">ราคาปัจจุบัน</div>
              <div className="future-metric-value">฿{currentPrice.toFixed(2)}</div>
            </div>
            <div className="future-metric-card">
              <div className="future-metric-label">เป้าหมาย 6 เดือน</div>
              <div className="future-metric-value">฿{target6m.toFixed(2)}</div>
            </div>
            <div className="future-metric-card">
              <div className="future-metric-label">% โอกาสเติบโต</div>
              <div
                className={
                  "future-metric-value " +
                  (growthProb >= 0 ? "future-metric-value--green" : "future-metric-value--red")
                }
              >
                {growthProb >= 0 ? "+" : ""}
                {growthProb.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Tabs: ราคากับปันผล ===== */}
      <div className="future-tabs-row">
        <button
          className={"future-tab " + (activeTab === "price" ? "future-tab--active" : "")}
          onClick={() => setActiveTab("price")}
        >
          แนวโน้มราคา
        </button>
        <button
          className={"future-tab " + (activeTab === "dividend" ? "future-tab--active" : "")}
          onClick={() => setActiveTab("dividend")}
        >
          แนวโน้มปันผล
        </button>
      </div>

      {/* ===== TAB: แนวโน้มราคา ===== */}
      {activeTab === "price" && (
        <>
          <section className="future-grid future-grid--price">
            {/* ซ้าย: กราฟ */}
            <article className="future-card chart-card">
              <header className="future-chart-header">
                <div className="future-chart-title-row">
                  <h2 className="future-chart-title">กราฟแนวโน้มราคา</h2>
                  {/* {forecast && (
                    <span
                      className={
                        "future-confidence-badge future-confidence-badge--" + forecast.confidence
                      }
                      title="มาจากผล backtest ย้อนหลังของหุ้นตัวนี้"
                    >
                      {CONFIDENCE_LABEL[forecast.confidence] || forecast.confidence}
                    </span>
                  )} */}
                </div>

                {/* ปุ่มเลือกประเภทกราฟ — ตอนนี้ implement จริงแค่ "line"
                    ส่วน volume/radar ยังเป็นแค่ toggle UI รอข้อมูล/กราฟแบบอื่นมาต่อ */}
                <div className="future-chart-type-row">
                  <button
                    className={"chart-type-btn " + (chartType === "line" ? "chart-type-btn--active" : "")}
                    onClick={() => setChartType("line")}
                  >
                    <img
                      src={chartType === "line" ? "/pics/graph_active.png" : "/pics/graph_norm.png"}
                      alt="กราฟเส้น"
                      className="chart-type-img"
                    />
                  </button>

                  {/* <button
                    className={"chart-type-btn " + (chartType === "volume" ? "chart-type-btn--active" : "")}
                    onClick={() => setChartType("volume")}
                  >
                    <img
                      src={chartType === "volume" ? "/pics/volume_active.png" : "/pics/volume_norm.png"}
                      alt="กราฟแท่ง"
                      className="chart-type-img"
                    />
                  </button>

                  <button
                    className={"chart-type-btn " + (chartType === "radar" ? "chart-type-btn--active" : "")}
                    onClick={() => setChartType("radar")}
                  >
                    <img
                      src={chartType === "radar" ? "/pics/radar_active.png" : "/pics/radar_norm.png"}
                      alt="กราฟ Radar"
                      className="chart-type-img"
                    />
                  </button> */}
                </div>
              </header>

              <div className="future-chart-body">
                {loadingForecast && (
                  <div className="future-chart-placeholder">กำลังโหลดกราฟ...</div>
                )}
                {!loadingForecast && forecastError && (
                  <div className="future-chart-placeholder">{forecastError}</div>
                )}
                {!loadingForecast && !forecastError && chartType === "line" && chartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={340}>
                    <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
                      <CartesianGrid stroke="#4b5568" strokeOpacity={0.55} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        minTickGap={40}
                        tick={{ fill: "#7d859c", fontSize: 12 }}
                        axisLine={{ stroke: "#242a42" }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fill: "#7d859c", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `฿${v}`}
                        width={56}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#3a4266", strokeDasharray: "3 3" }} />

                      {/* ช่วงความเชื่อมั่น: low80 เป็นฐานโปร่งใส, band = high80-low80 คือความสูงที่แสดงจริง */}
                      <Area dataKey="low80" stackId="band" stroke="none" fill="transparent" legendType="none" />
                      <Area dataKey="band" stackId="band" stroke="none" fill="#f97316" fillOpacity={0.14} />

                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#22c55e"
                        strokeWidth={2.25}
                        dot={false}
                        activeDot={{ r: 4, fill: "#22c55e", stroke: "#0d0f1a", strokeWidth: 2 }}
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#3b82f6"
                        strokeWidth={2.25}
                        strokeDasharray="5 4"
                        dot={false}
                        activeDot={{ r: 4, fill: "#3b82f6", stroke: "#0d0f1a", strokeWidth: 2 }}
                        connectNulls={false}
                      />

                      {forecast && (
                        <ReferenceLine x={forecast.last_date} stroke="#3a4266" strokeDasharray="2 2" />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
                {!loadingForecast && !forecastError && forecast?.method_used === "naive" && chartType === "line" && (
                  <p className="future-chart-note">
                    ระบบไม่พบสัญญาณทิศทางที่ชัดเจนจากข้อมูลราคาย้อนหลังของหุ้นนี้ เส้นพยากรณ์จึงประมาณการแบบไม่มีอคติทิศทาง
                    (ไม่ฟันธงขึ้นหรือลง) โดยความไม่แน่นอนจะกว้างขึ้นตามระยะเวลา
                  </p>
                )}
                {!loadingForecast && !forecastError && chartType !== "line" && (
                  <div className="future-chart-placeholder">
                    กราฟ {chartType === "volume" ? "ปริมาณ" : "Radar"} ยังไม่ implement — ตอนนี้มีแค่กราฟเส้น
                  </div>
                )}
              </div>

              <footer className="future-chart-footer">
                <div className="future-legend">
                  <span className="legend-dot legend-dot--actual" />
                  <span className="legend-label">ราคาจริง</span>
                  <span className="legend-dot legend-dot--forecast" />
                  <span className="legend-label">ราคาพยากรณ์</span>
                  <span className="legend-dot legend-dot--confidence" />
                  <span className="legend-label">ช่วงความเชื่อมั่น</span>
                </div>
              </footer>
            </article>

            {/* ขวา: แนวรับ–แนวต้าน */}
            <aside className="future-support-section">
              <div className="future-support-shell">
                <div className="future-support-card">
                  <div className="future-support-header">
                    <div className="future-support-title">แนวรับ–แนวต้าน</div>
                  </div>

                  <div className="future-support-body">
                    <div className="support-grid">
                      <div className="support-tile">
                        <span className="support-tag support-tag--support">แนวรับ</span>
                        <div className="support-price-block">
                          <div className="support-price support-price--up">
                            ฿{sr ? sr.support_main.toFixed(2) : "-"}
                          </div>
                          <div className="support-sub">แนวรับหลัก</div>
                        </div>
                      </div>

                      <div className="support-tile">
                        <span className="support-tag support-tag--support">แนวรับ</span>
                        <div className="support-price-block">
                          <div className="support-price support-price--up">
                            ฿{sr ? sr.support_minor.toFixed(2) : "-"}
                          </div>
                          <div className="support-sub">แนวรับรอง</div>
                        </div>
                      </div>

                      <div className="support-tile">
                        <span className="support-tag support-tag--resist">แนวต้าน</span>
                        <div className="support-price-block">
                          <div className="support-price support-price--down">
                            ฿{sr ? sr.resistance_main.toFixed(2) : "-"}
                          </div>
                          <div className="support-sub">แนวต้านหลัก</div>
                        </div>
                      </div>

                      <div className="support-tile">
                        <span className="support-tag support-tag--resist">แนวต้าน</span>
                        <div className="support-price-block">
                          <div className="support-price support-price--down">
                            ฿{sr ? sr.resistance_mid.toFixed(2) : "-"}
                          </div>
                          <div className="support-sub">แนวต้านระยะกลาง</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          {/* กล่องเตือน */}
          <section className="future-warning">
            <img src="/pics/warning.png" alt="warning" className="warning-icon" />
            <div className="future-warning-text">
              <div className="future-warning-title">ข้อควรระวัง</div>
              <div className="future-warning-des">
                การพยากรณ์นี้เป็นเพียงการประมาณการจากแบบจำลองทางสถิติและไม่รับประกันความแม่นยำ
                ผู้ลงทุนควรศึกษาข้อมูลเพิ่มเติม วิเคราะห์ปัจจัยต่าง ๆ
                และปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจลงทุน
                {forecast?.backtest_mape_pct != null && (
                  <>
                    {" "}
                    (ผลทดสอบย้อนหลัง: คลาดเคลื่อนเฉลี่ย {forecast.backtest_mape_pct}%
                    ที่ระยะ 6 เดือน)
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ===== TAB: แนวโน้มปันผล — ยังไม่มีข้อมูลจาก backend เก็บ mockup เดิมไว้ก่อน ===== */}
      {activeTab === "dividend" && (
        <section className="future-card chart-card future-div-chart">
          <header className="future-chart-header">
            <div className="future-chart-title-row">
              <h2 className="future-chart-title">แนวโน้มปันผล</h2>
            </div>
          </header>

          <div className="future-chart-body">
            <div className="future-chart-placeholder">
              [ พื้นที่สำหรับกราฟแนวโน้มปันผล 2025–2027 — ยังไม่มี endpoint จาก backend ]
            </div>
          </div>
        </section>
      )}
    </section>
  );
}