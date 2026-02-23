import { useNavigate } from "react-router-dom";
import "../css/risk_result.css";

export default function RiskResult() {

  const navigate = useNavigate();

  // src/data/riskResultData.js

 const riskProfile = {
  level: "ความเสี่ยงสูง",
  desc: "เหมาะสำหรับนักลงทุนที่ต้องการผลตอบแทนสูงและยอมรับความเสี่ยงได้มาก",
  bullets: [
    "ยอมรับความเสี่ยงได้สูง",
    "ต้องการผลตอบแทนสูงเหนือเฉลี่ยตลาด",
    "มีประสบการณ์ด้านการลงทุน",
    "สามารถรับมือกับความผันผวนได้"
  ],
  budget: "10,000 บาท",
  period: "2 ปี",
  expected: "25% ต่อปี",
};
/* อย่าลืมแก้ logo */
  const recommendedStocks = [
    {
      id: "GLUF",
      name: "GLUF",
      fullname: "กัลฟ์ เอ็นเนอร์จี ดีเวลลอปเมนต์",
      logo: "/pics/marckris.jpg",
      price: "42.00 บาท",
      risk: "สูง",
      returnY: "18.5%",
      profit: "+92,500",
      profitText: "กำไรคาดการณ์ (2 ปี)",
      tags: ["SET", "ENERG", "POWER"],
      position: "อันดับที่ 1 – แนะนำสำหรับโปรไฟล์ความเสี่ยงสูง"
    },
    {
      id: "DELTA",
      name: "DELTA",
      fullname: "เดลต้า อีเล็กทรอนิกส์",
      logo: "/pics/marckris.jpg",
      price: "85.50 บาท",
      risk: "สูง",
      returnY: "16.8%",
      profit: "+84,000",
      profitText: "กำไรคาดการณ์ (2 ปี)",
      tags: ["SET", "TECH", "ELEC"],
      position: "อันดับที่ 2 – แนะนำสำหรับโปรไฟล์ความเสี่ยงสูง"
    },
    {
      id: "INTUCH",
      name: "INTUCH",
      fullname: "อินทัช โฮลดิ้งส์",
      logo: "/pics/marckris.jpg",
      price: "58.25 บาท",
      risk: "ปานกลาง",
      returnY: "15.3%",
      profit: "+76,500",
      profitText: "กำไรคาดการณ์ (2 ปี)",
      tags: ["SET", "COMM", "HOLD"],
      position: "อันดับที่ 3 – แนะนำสำหรับโปรไฟล์ความเสี่ยงปานกลาง"
    },
    {
      id: "BANPU",
      name: "BANPU",
      fullname: "บ้านปู",
      logo: "/pics/marckris.jpg",
      price: "12.40 บาท",
      risk: "สูง",
      returnY: "19.2%",
      profit: "+96,000",
      profitText: "กำไรคาดการณ์ (2 ปี)",
      tags: ["SET", "ENERG", "COAL"],
      position: "อันดับที่ 4 – เหมาะสำหรับโปรไฟล์ความเสี่ยงสูง"
    },
    {
      id: "PTTEP",
      name: "PTTEP",
      fullname: "ปตท. สำรวจและผลิตปิโตรเลียม",
      logo: "/pics/marckris.jpg",
      price: "192.50 บาท",
      risk: "ปานกลาง",
      returnY: "17.6%",
      profit: "+88,000",
      profitText: "กำไรคาดการณ์ (2 ปี)",
      tags: ["SET", "ENERG", "GAS"],
      position: "อันดับที่ 5 – เหมาะสำหรับโปรไฟล์ความเสี่ยงปานกลาง"
    }
  ];

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

      {/* RISK PROFILE CARD */}
      <div className="risk-profile-card">

        {/* LEFT */}
        <div className="risk-left">
          <div className="risk-row-1">
            <img src="/pics/target.png" className="risk-target-icon" />
            <h2 className="risk-title">โปรไฟล์ความเสี่ยงของคุณ</h2>
          </div>

          <div className="risk-row-2">
            <div className="risk-ans-badge risk-high">{riskProfile.level}</div>
            <p className="risk-ans-desc">{riskProfile.desc}</p>
          </div>

        <div className="risk-row-3">

            {/* LEFT: bullet */}
            <div className="risk-bullet-left">
                <h3 className="risk-subtitle">ลักษณะการลงทุนของคุณ :</h3>

                <ul className="risk-bullet">
                {riskProfile.bullets.map((b, i) => (
                    <li key={i}>
                    <img src="/pics/star.png" className="star-icon" />
                    {b}
                    </li>
                ))}
                </ul>
            </div>

            {/* RIGHT: budget/period/expected */}
            <div className="risk-bullet-right">
                <p>งบประมาณเริ่มต้น : <span>{riskProfile.budget}</span></p>
                <p>ระยะเวลาลงทุน : <span>{riskProfile.period}</span></p>
                <p>ผลตอบแทนที่คาดหวัง : <span>{riskProfile.expected}</span></p>
            </div>

        </div>
        </div>
      </div>

      {/* STOCK TITLE */}
      <h2 className="stock-title">หุ้นแนะนำสำหรับคุณ</h2>

      {/* STOCK GRID */}
      <div className="stock-grid">
        {recommendedStocks.map((stock, index) => (
            <div
            key={stock.id}
            className={`stock-card ${index === recommendedStocks.length - 1 ? "center-last" : ""}`}
            >

            {/* TOP ROW: LEFT + VALUE BOXES */}
            <div className="stock-top-row">

                {/* LEFT SIDE */}
                <div className="stock-left-block">
                <img src={stock.logo} className="stock-logo" />

                <div className="stock-left-text">
                    <h3 className="stock-name">{stock.name}</h3>
                    <p className="stock-full">{stock.fullname}</p>

                    {/* TAGS */}
                    <div className="tag-row">
                    {stock.tags.map((tag, i) => (
                        <span key={i} className="tag-pill">{tag}</span>
                    ))}
                    </div>

                    <p className="stock-price">ราคาปัจจุบัน : <span>{stock.price}</span></p>
                    <p className="stock-risk">
                    ความเสี่ยง : 
                    <span className={`risk-result-badge risk-${stock.risk === "สูง" ? "high" : "mid"}`}>
                        {stock.risk}
                    </span>
                    </p>
                </div>
                </div>

                {/* RIGHT VALUE BOXES */}
                <div className="stock-right-block">
                <div className="value-box">
                    <p className="value-title">$ ผลตอบแทนที่คาดหวัง</p>
                    <h3 className="value-rate">{stock.returnY}</h3>
                    <p className="value-sub">ต่อปี</p>
                </div>

                <div className="value-box">
                    <h3 className="profit">{stock.profit}</h3>
                    <p className="profit-sub">{stock.profitText}</p>
                </div>
                </div>

            </div>

            {/* FOOTER */}
            <div className="stock-footer">
                <p className="stock-position">{stock.position}</p>
                <button className="btn-detail">ดูรายละเอียด →</button>
            </div>

            </div>
        ))}
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
