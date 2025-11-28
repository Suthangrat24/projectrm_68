import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "../css/stock_future.css";

export default function StockFuture() {
  const navigate = useNavigate();
  const { symbol } = useParams();

  const data = {
    symbol: symbol || "PTT",
    name: "บริษัท ปตท. จำกัด (มหาชน)",
    statusBadge: "หุ้นมั่นคง",
    marketTags: ["SET", "RESOURC", "ENERG"],
    currentPrice: 33.25,
    target6m: 37.27,
    growthProb: 12.1,
  };

  const [activeTab, setActiveTab] = useState("price"); // price | dividend
  const [horizon, setHorizon] = useState("6M"); // 3M,6M,9M,1Y,2Y
  const [chartType, setChartType] = useState("line"); // line | volume | radar


  return (
    <section className="future-page">
      {/* ===== แถวบนสุด: ย้อนกลับ + เลือกระยะเวลา ===== */}
      <div className="future-top-row">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <img
            src="/pics/back.png"
            alt="ย้อนกลับ"
            className="back-icon-img"
          />
          <span>ย้อนกลับ</span>
        </button>

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
              <option value="9M">9 เดือน</option>
              <option value="1Y">1 ปี</option>
              <option value="2Y">2 ปี</option>
            </select>
            <span className="future-horizon-arrow">▾</span>
          </div>
        </div>
      </div>

      {/* ===== การ์ดหัวข้อหลักหุ้น + metric 3 ใบ ===== */}
      <header className="future-header-card">
        <div className="future-header-left">
          <div className="detail-logo">
            <div className="detail-logo-mark" />
          </div>

          <div className="detail-name-block">
            <div className="detail-symbol-row">
              <span className="detail-symbol">{data.symbol}</span>
              <span className="detail-status-badge">{data.statusBadge}</span>
              <button className="detail-heart">♥</button>
            </div>
            <p className="detail-fullname">{data.name}</p>

            <div className="detail-tag-row">
              {data.marketTags.map((t) => (
                <span key={t} className="detail-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="future-header-right">
          <div className="future-metrics-row">
            <div className="future-metric-card">
              <div className="future-metric-label">ราคาปัจจุบัน</div>
              <div className="future-metric-value">
                ฿{data.currentPrice.toFixed(2)}
              </div>
            </div>
            <div className="future-metric-card">
              <div className="future-metric-label">เป้าหมาย 6 เดือน</div>
              <div className="future-metric-value">
                ฿{data.target6m.toFixed(2)}
              </div>
            </div>
            <div className="future-metric-card">
              <div className="future-metric-label">% โอกาสเติบโต</div>
              <div className="future-metric-value future-metric-value--green">
                {data.growthProb.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Tabs: ราคากับปันผล ===== */}
      <div className="future-tabs-row">
        <button
          className={
            "future-tab " + (activeTab === "price" ? "future-tab--active" : "")
          }
          onClick={() => setActiveTab("price")}
        >
          แนวโน้มราคา
        </button>
        <button
          className={
            "future-tab " +
            (activeTab === "dividend" ? "future-tab--active" : "")
          }
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
                </div>

                {/* ปุ่มเลือกประเภทกราฟ (icon active / inactive) */}
                <div className="future-chart-type-row">
                {/* กราฟเส้น */}
                <button
                    className={
                    "chart-type-btn " + (chartType === "line" ? "chart-type-btn--active" : "")
                    }
                    onClick={() => setChartType("line")}
                >
                    <img
                    src={
                        chartType === "line"
                        ? "/pics/graph_active.png"
                        : "/pics/graph_norm.png"
                    }
                    alt="กราฟเส้น"
                    className="chart-type-img"
                    />
                </button>

                {/* กราฟแท่ง (volume) */}
                <button
                    className={
                    "chart-type-btn " +
                    (chartType === "volume" ? "chart-type-btn--active" : "")
                    }
                    onClick={() => setChartType("volume")}
                >
                    <img
                    src={
                        chartType === "volume"
                        ? "/pics/volume_active.png"
                        : "/pics/volume_norm.png"
                    }
                    alt="กราฟแท่ง"
                    className="chart-type-img"
                    />
                </button>

                {/* กราฟ radar */}
                <button
                    className={
                    "chart-type-btn " +
                    (chartType === "radar" ? "chart-type-btn--active" : "")
                    }
                    onClick={() => setChartType("radar")}
                >
                    <img
                    src={
                        chartType === "radar"
                        ? "/pics/radar_active.png"
                        : "/pics/radar_norm.png"
                    }
                    alt="กราฟ Radar"
                    className="chart-type-img"
                    />
                </button>
                </div>
              </header>

              <div className="future-chart-body">
                <div className="future-chart-placeholder">
                  [ พื้นที่สำหรับกราฟแนวโน้มราคา {horizon} ]
                </div>
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

            {/* ขวา: แนวรับ–แนวต้าน (ดีไซน์เหมือนการ์ด filter + การ์ดข้อมูลการซื้อขาย) */}
            {/* ขวา: แนวรับ–แนวต้าน (ใช้โครงแบบ stocks-filter-card) */}
<aside className="future-support-section">
  <div className="future-support-shell">
    <div className="future-support-card">

      {/* Header เหมือน filter-card */}
      <div className="future-support-header">
        <div className="future-support-title">แนวรับ–แนวต้าน</div>
      </div>

      {/* Body */}
      <div className="future-support-body">
        <div className="support-grid">

          {/* แนวรับหลัก */}
          <div className="support-tile">
            <span className="support-tag support-tag--support">แนวรับ</span>
            <div className="support-price-block">
              <div className="support-price support-price--up">฿30.59</div>
              <div className="support-sub">แนวรับหลัก</div>
            </div>
          </div>

          {/* แนวรับรอง */}
          <div className="support-tile">
            <span className="support-tag support-tag--support">แนวรับ</span>
            <div className="support-price-block">
              <div className="support-price support-price--up">฿28.26</div>
              <div className="support-sub">แนวรับรอง</div>
            </div>
          </div>

          {/* แนวต้านหลัก */}
          <div className="support-tile">
            <span className="support-tag support-tag--resist">แนวต้าน</span>
            <div className="support-price-block">
              <div className="support-price support-price--down">฿35.91</div>
              <div className="support-sub">แนวต้านหลัก</div>
            </div>
          </div>

          {/* แนวต้านระยะกลาง */}
          <div className="support-tile">
            <span className="support-tag support-tag--resist">แนวต้าน</span>
            <div className="support-price-block">
              <div className="support-price support-price--down">฿38.24</div>
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
              </div>
            </div>
          </section>
        </>
      )}

      {/* ===== TAB: แนวโน้มปันผล ===== */}
      {activeTab === "dividend" && (
        <>
          <section className="future-card chart-card future-div-chart">
            <header className="future-chart-header">
              <div className="future-chart-title-row">
                <h2 className="future-chart-title">แนวโน้มปันผล</h2>
              </div>

              {/* ปุ่มเลือกประเภทกราฟ (icon active / inactive) */}
                <div className="future-chart-type-row">
                {/* กราฟเส้น */}
                <button
                    className={
                    "chart-type-btn " + (chartType === "line" ? "chart-type-btn--active" : "")
                    }
                    onClick={() => setChartType("line")}
                >
                    <img
                    src={
                        chartType === "line"
                        ? "/pics/graph_active.png"
                        : "/pics/graph_norm.png"
                    }
                    alt="กราฟเส้น"
                    className="chart-type-img"
                    />
                </button>

                {/* กราฟแท่ง (volume) */}
                <button
                    className={
                    "chart-type-btn " +
                    (chartType === "volume" ? "chart-type-btn--active" : "")
                    }
                    onClick={() => setChartType("volume")}
                >
                    <img
                    src={
                        chartType === "volume"
                        ? "/pics/volume_active.png"
                        : "/pics/volume_norm.png"
                    }
                    alt="กราฟแท่ง"
                    className="chart-type-img"
                    />
                </button>

                {/* กราฟ radar */}
                <button
                    className={
                    "chart-type-btn " +
                    (chartType === "radar" ? "chart-type-btn--active" : "")
                    }
                    onClick={() => setChartType("radar")}
                >
                    <img
                    src={
                        chartType === "radar"
                        ? "/pics/radar_active.png"
                        : "/pics/radar_norm.png"
                    }
                    alt="กราฟ Radar"
                    className="chart-type-img"
                    />
                </button>
                </div>
            </header>

            <div className="future-chart-body">
              <div className="future-chart-placeholder">
                [ พื้นที่สำหรับกราฟแนวโน้มปันผล 2025–2027 ]
              </div>
            </div>
          </section>

          <section className="future-warning">
            <img src="/pics/warning.png" alt="warning" className="warning-icon" />
            <div className="future-warning-text">
              <div className="future-warning-title">ข้อควรระวัง</div>
              <div className="future-warning-des">
                การพยากรณ์นี้เป็นเพียงการประมาณการจากแบบจำลองทางสถิติและไม่รับประกันความแม่นยำ
                ผู้ลงทุนควรศึกษาข้อมูลเพิ่มเติม วิเคราะห์ปัจจัยต่าง ๆ
                และปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจลงทุน
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
