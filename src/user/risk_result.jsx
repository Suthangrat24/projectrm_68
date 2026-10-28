import { useNavigate, useLocation } from "react-router-dom";
import "../css/risk_result.css";
import StockLogo from "./stock_logo";

export default function RiskResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const assessment = location.state?.assessment;
  const recommend = location.state?.recommend;

  if (!assessment || !recommend) {
    return (
      <section className="risk-result-page">
        <div className="result-header">
          <h1 className="result-title">ไม่พบข้อมูลการประเมิน</h1>
          <p className="result-subtitle">กรุณาทำแบบประเมินก่อน</p>
          <button className="btn-retake" onClick={() => navigate("/risk-evaluation")}>
            ทำแบบประเมิน
          </button>
        </div>
      </section>
    );
  }

  const userTypeMap = {
    Conservative: { label: "ความเสี่ยงต่ำ", badge: "risk-low", accent: "accent-low", desc: "เหมาะสำหรับนักลงทุนที่ต้องการความมั่นคง เน้นรักษาเงินต้น" },
    Moderate: { label: "ความเสี่ยงปานกลาง", badge: "risk-mid", accent: "accent-mid", desc: "เหมาะสำหรับนักลงทุนที่ต้องการสมดุลระหว่างความเสี่ยงและผลตอบแทน" },
    Aggressive: { label: "ความเสี่ยงสูง", badge: "risk-high", accent: "accent-high", desc: "เหมาะสำหรับนักลงทุนที่ต้องการผลตอบแทนสูงและยอมรับความเสี่ยงได้มาก" },
  };

  const goalTypeMap = {
    stability: "รักษาเงินต้น",
    dividend: "รายได้จากปันผล",
    growth: "เติบโตระยะยาว",
    aggressive: "เก็งกำไรสูงสุด",
  };

  const profile = userTypeMap[recommend.user_type] || userTypeMap["Moderate"];
  const goalLabel = goalTypeMap[recommend.goal_type] || recommend.goal_type;
  const riskPercent = Math.round(recommend.risk_index * 100);

  const bulletsMap = {
    Conservative: [
      "เน้นความปลอดภัยของเงินต้น",
      "รับความเสี่ยงได้น้อย",
      "ชอบหุ้นปันผลสม่ำเสมอ",
      "หลีกเลี่ยงหุ้นผันผวนสูง",
    ],
    Moderate: [
      "สมดุลระหว่างความเสี่ยงและผลตอบแทน",
      "ลงทุนระยะกลางถึงยาว",
      "ยอมรับความผันผวนได้บ้าง",
      "มองหาหุ้นพื้นฐานดีและเติบโต",
    ],
    Aggressive: [
      "ยอมรับความเสี่ยงได้สูง",
      "ต้องการผลตอบแทนเหนือตลาด",
      "มีประสบการณ์ด้านการลงทุน",
      "สามารถรับมือกับความผันผวนได้",
    ],
  };

  const bullets = bulletsMap[recommend.user_type] || bulletsMap["Moderate"];

  const formatBudget = (n) =>
    Number(n).toLocaleString("th-TH", { minimumFractionDigits: 0 });

  const riskLabel = (vol) => {
    if (vol < 0.3) return { text: "ต่ำ", cls: "risk-low" };
    if (vol < 0.5) return { text: "ปานกลาง", cls: "risk-mid" };
    return { text: "สูง", cls: "risk-high" };
  };

  // ── ผลตอบแทนเฉลี่ยต่อปี (ย้อนหลัง) เทียบกับเป้าที่ผู้ใช้กรอกในแบบประเมินข้อ 20 ──
  // ann_return_3y / 5y เป็นสัดส่วน (0.10 = 10%) — null ถ้าหุ้นไม่มีข้อมูลย้อนหลัง
  const targetPct = recommend.target_annual_pct ?? assessment.expected_return;

  const fmtPct = (x) =>
    x == null ? "ไม่มีข้อมูล" : `${x >= 0 ? "+" : ""}${(x * 100).toFixed(1)}%`;

  // "2023-10-27" → "27 ต.ค. 66"
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })
      : "-";

  // แบ่งกลุ่ม "ถึงเป้า" / "ต่ำกว่าเป้า" เฉพาะเมื่อมีข้อมูลเทียบเป้าจริง
  const stocks = recommend.stocks;
  const hasTargetData = stocks.some((s) => s.meets_target != null);
  const meetsCount = stocks.filter((s) => s.meets_target === true).length;

  const groups = hasTargetData
    ? [
      {
        key: "meets",
        title: `ถึงเป้าของคุณ (${targetPct}% ต่อปี)`,
        items: stocks.filter((s) => s.meets_target === true),
      },
      {
        key: "below",
        title: "ต่ำกว่าเป้า หรือไม่มีข้อมูลย้อนหลัง",
        items: stocks.filter((s) => s.meets_target !== true),
      },
    ].filter((g) => g.items.length > 0)
    : [{ key: "all", title: null, items: stocks }];

  const bannerTone =
    meetsCount === 0 ? "warn" : meetsCount === stocks.length ? "ok" : "info";

  // ── ไปหน้าเพิ่มพอร์ต พร้อมแนบ attempt_id เพื่อผูกกลับมาที่คำแนะนำนี้ ──
  const handleAddToPortfolio = (stock) => {
    navigate("/add-investment", {
      state: {
        prefill_symbol: stock.symbol,
        prefill_price: stock.current_price,
        attempt_id: recommend.attempt_id,
      },
    });
  };

  const renderStockCard = (stock, isLast) => {
    const risk = riskLabel(stock.ann_vol);

    const retCls =
      stock.ann_return_3y == null
        ? ""
        : stock.ann_return_3y >= 0
          ? "positive"
          : "negative";

    const badge =
      stock.meets_target === true
        ? { cls: "meets", text: `ถึงเป้า ${targetPct}%` }
        : stock.meets_target === false
          ? { cls: "below", text: `ต่ำกว่าเป้า ${targetPct}%` }
          : { cls: "nodata", text: "ไม่มีข้อมูลย้อนหลัง" };

    return (
      <div
        key={stock.symbol}
        className={`stock-card rank ${isLast ? "center-last" : ""}`}
      >
        {/* RANK SIDE */}
        <div className="stock-rank-side">
          <span className="rank-lbl">rank</span>
          <div className="rank-divider" />
          <span className="rank-num">{stock.rank}</span>
        </div>

        {/* MAIN */}
        <div className="stock-main">

          {/* TOP ROW */}
          <div className="stock-top-row">

            {/* LEFT */}
            <div className="stock-left-block">
              <StockLogo
                symbol={stock.symbol}
                src={stock.logo_path}
                size={64}
                className="stock-logo"
              />
              <div className="stock-left-text">
                <h3 className="stock-name">{stock.symbol}</h3>

                {/* market / industry_group / sector pills */}
                <div className="tag-row">
                  {stock.market_type && <span className="tag-pill">{stock.market_type}</span>}
                  {stock.industry_group && <span className="tag-pill">{stock.industry_group}</span>}
                  {stock.sector && stock.sector !== "-" && <span className="tag-pill">{stock.sector}</span>}
                </div>

                <p className="stock-price">
                  ราคาปัจจุบัน :{" "}
                  <span>
                    {stock.current_price != null
                      ? `${stock.current_price.toFixed(2)} บาท`
                      : "ไม่มีข้อมูล"}
                  </span>
                </p>
                <p className="stock-risk">
                  ความเสี่ยง :
                  <span className={`risk-result-badge ${risk.cls}`}>
                    {risk.text}
                  </span>
                </p>
              </div>
            </div>

            {/* RIGHT VALUE BOXES */}
            <div className="stock-right-block">
              <div className="value-box">
                <p className="value-title">$ ผลตอบแทนเฉลี่ยต่อปี (ย้อนหลัง 3 ปี)</p>
                <h3 className={`value-rate ${retCls}`}>
                  {fmtPct(stock.ann_return_3y)}
                  {stock.ann_return_3y != null && <small className="value-unit"> /ปี</small>}
                </h3>

                {/* ราคาต้น → ปลาย ที่ใช้คำนวณ ให้ผู้ใช้เทียบกับกราฟ 3Y ได้เอง */}
                {stock.start_price_3y != null && stock.end_price != null && (
                  <p className="value-sub value-prices">
                    {fmtDate(stock.start_date_3y)} {stock.start_price_3y.toFixed(2)} ฿
                    {" → "}
                    {fmtDate(stock.as_of)} {stock.end_price.toFixed(2)} ฿
                  </p>
                )}

                <p className="value-sub">
                  1 ปีล่าสุด :{" "}
                  <span className={stock.return_1y == null ? "" : stock.return_1y >= 0 ? "positive" : "negative"}>
                    {fmtPct(stock.return_1y)}
                  </span>
                  {"  ·  "}5 ปี : {fmtPct(stock.ann_return_5y)}<span>/ปี</span>
                </p>
                <span className={`target-badge ${badge.cls}`}>{badge.text}</span>
              </div>

              <div className="value-box">
                <p className="value-title">Fit Score</p>
                {/* Fit Score ติดลบ → สีแดง */}
                <h3 className={`profit ${stock.fit_score < 0 ? "negative" : ""}`}>
                  {(stock.fit_score * 100).toFixed(1)}
                </h3>
                <p className="profit-sub">คะแนนความเหมาะสม</p>
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <div className="stock-footer">
            <button
              className="btn-add-portfolio"
              onClick={() => handleAddToPortfolio(stock)}
            >
              + เพิ่มเข้าพอร์ต
            </button>
            <button
              className="btn-detail"
              onClick={() => navigate(`/${stock.symbol}/detail`)}
            >
              ดูรายละเอียด →
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <>
      <section className="risk-result-page">

        {/* HEADER */}
        <div className="result-header">
          <div className="result-head-row">
            <img src="/pics/risk.png" className="result-icon" />
            <h1 className="result-title">ผลการประเมินความเสี่ยงและหุ้นที่เหมาะสม</h1>
          </div>
          <p className="result-subtitle">
            ระบบได้วิเคราะห์ข้อมูลของคุณแล้ว ต่อไปนี้คือหุ้นที่เหมาะสมกับโปรไฟล์ของคุณ
          </p>
        </div>

        {/* RISK PROFILE CARD — เพิ่ม accent class ตาม risk level */}
        <div className={`risk-profile-card ${profile.accent}`}>
          <div className="risk-left">

            <div className="risk-row-1">
              <img src="/pics/target.png" className="risk-target-icon" />
              <h2 className="risk-title">โปรไฟล์ความเสี่ยงของคุณ</h2>
            </div>

            <div className="risk-row-2">
              <div className={`risk-ans-badge ${profile.badge}`}>
                {profile.label}
              </div>
              <p className="risk-ans-desc">{profile.desc}</p>
            </div>

            <div className="risk-row-3">

              {/* LEFT: bullet */}
              <div className="risk-bullet-left">
                <h3 className="risk-subtitle">ลักษณะการลงทุนของคุณ :</h3>
                <ul className="risk-bullet">
                  {bullets.map((b, i) => (
                    <li key={i}>
                      <img src="/pics/star.png" className="star-icon" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* RIGHT: budget/period/expected */}
              <div className="risk-bullet-right">
                <p>ระดับความเสี่ยง :
                  <span> {riskPercent}%</span>
                </p>
                <p>เป้าหมายการลงทุน :
                  <span> {goalLabel}</span>
                </p>
                <p>งบประมาณเริ่มต้น :
                  <span> {formatBudget(assessment.budget)} บาท</span>
                </p>
                <p>ระยะเวลาลงทุน :
                  <span> {assessment.invest_years} ปี</span>
                </p>
                <p>ผลตอบแทนที่คาดหวัง :
                  <span> {assessment.expected_return}% ต่อปี</span>
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* STOCK TITLE */}
        <h2 className="stock-title">หุ้นแนะนำสำหรับคุณ</h2>

        {/* สรุปว่าหุ้นที่แนะนำถึงเป้าผลตอบแทนของผู้ใช้กี่ตัว (ข้อความมาจาก backend) */}
        {recommend.message && (
          <div className={`target-banner ${bannerTone}`}>{recommend.message}</div>
        )}

        {/* STOCK GROUPS */}
        {groups.map((g) => (
          <div key={g.key} className={`target-group ${g.key}`}>
            {g.title && groups.length > 1 && (
              <h3 className="target-group-title">{g.title}</h3>
            )}
            <div className="stock-grid">
              {g.items.map((stock, index) =>
                renderStockCard(
                  stock,
                  index === g.items.length - 1 && g.items.length % 2 !== 0
                )
              )}
            </div>
          </div>
        ))}

        {hasTargetData && (
          <p className="disclaimer-note">
            ผลตอบแทนเฉลี่ยต่อปี (CAGR) คำนวณจากราคาปิด ไม่รวมเงินปันผล
            {recommend.returns_as_of && <> · ข้อมูล ณ {fmtDate(recommend.returns_as_of)}</>}
            <br />
            เป็นข้อมูลย้อนหลัง ไม่ใช่การรับประกันผลตอบแทนในอนาคต
          </p>
        )}

        {/* BOTTOM BUTTONS */}
        <div className="result-buttons">
          <button className="btn-back" onClick={() => navigate("/")}>
            ← กลับหน้าหลัก
          </button>
          <button
            className="btn-retake btn-retake-outline"
            onClick={() => navigate("/risk-evaluation", {
              state: { prefillAttemptId: recommend.attempt_id },
            })}
          >
            ↻ ปรับคำตอบแล้วประเมินใหม่
          </button>
          <button className="btn-retake" onClick={() => navigate("/risk-evaluation")}>
            ทำแบบประเมินอีกครั้ง
          </button>
        </div>

      </section>
    </>
  );
}