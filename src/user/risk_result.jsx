import { useNavigate, useLocation } from "react-router-dom";
import "../css/risk_result.css";

export default function RiskResult() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const assessment = location.state?.assessment;
  const recommend  = location.state?.recommend;

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
    Conservative: { label: "ความเสี่ยงต่ำ",    badge: "risk-low",  accent: "accent-low",  desc: "เหมาะสำหรับนักลงทุนที่ต้องการความมั่นคง เน้นรักษาเงินต้น" },
    Moderate:     { label: "ความเสี่ยงปานกลาง", badge: "risk-mid",  accent: "accent-mid",  desc: "เหมาะสำหรับนักลงทุนที่ต้องการสมดุลระหว่างความเสี่ยงและผลตอบแทน" },
    Aggressive:   { label: "ความเสี่ยงสูง",     badge: "risk-high", accent: "accent-high", desc: "เหมาะสำหรับนักลงทุนที่ต้องการผลตอบแทนสูงและยอมรับความเสี่ยงได้มาก" },
  };

  const goalTypeMap = {
    stability:  "รักษาเงินต้น",
    dividend:   "รายได้จากปันผล",
    growth:     "เติบโตระยะยาว",
    aggressive: "เก็งกำไรสูงสุด",
  };

  const profile     = userTypeMap[recommend.user_type] || userTypeMap["Moderate"];
  const goalLabel   = goalTypeMap[recommend.goal_type]  || recommend.goal_type;
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
    if (vol < 0.3) return { text: "ต่ำ",     cls: "risk-low"  };
    if (vol < 0.5) return { text: "ปานกลาง", cls: "risk-mid"  };
    return               { text: "สูง",       cls: "risk-high" };
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

        {/* STOCK GRID */}
        <div className="stock-grid">
          {recommend.stocks.map((stock, index) => {
            const risk    = riskLabel(stock.ann_vol);
            const retSign = stock.expected_return_6m >= 0 ? "+" : "";
            // const rankCls = `rank-${stock.rank}`;
            const isLast  = index === recommend.stocks.length - 1 && recommend.stocks.length % 2 !== 0;

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
                      <img
                        src={`/pics/stocks/${stock.symbol}.png`}
                        className="stock-logo"
                        
                      />
                      {/* onError={(e) => { e.target.src = "/pics/default_stock.png"; }} */}
                      <div className="stock-left-text">
                        <h3 className="stock-name">{stock.symbol}</h3>

                        {/* market / industry_group / sector pills */}
                        <div className="tag-row">
                          {stock.market_type  && <span className="tag-pill">{stock.market_type}</span>}
                          {stock.industry_group && <span className="tag-pill">{stock.industry_group}</span>}
                          {stock.sector && stock.sector !== "-" && <span className="tag-pill">{stock.sector}</span>}
                        </div>

                        <p className="stock-price">
                          ราคาปัจจุบัน : <span>{stock.current_price?.toFixed(2)} บาท</span>
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
                        <p className="value-title">$ ผลตอบแทนคาด 6 เดือน</p>
                        <h3 className={`value-rate ${stock.expected_return_6m >= 0 ? "positive" : "negative"}`}>
                          {retSign}{(stock.expected_return_6m * 100).toFixed(2)}%
                        </h3>
                        <p className="value-sub">ใน 6 เดือน</p>
                      </div>

                      <div className="value-box">
                        <p className="value-title">Fit Score</p>
                        <h3 className="profit">
                          {(stock.fit_score * 100).toFixed(1)}
                        </h3>
                        <p className="profit-sub">คะแนนความเหมาะสม</p>
                      </div>
                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="stock-footer">
                    <button
                      className="btn-detail"
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                    >
                      ดูรายละเอียด →
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="result-buttons">
          <button className="btn-back" onClick={() => navigate("/")}>
            ← กลับหน้าหลัก
          </button>
          <button className="btn-retake" onClick={() => navigate("/risk-evaluation")}>
            ทำแบบประเมินอีกครั้ง
          </button>
        </div>

      </section>
    </>
  );
}