import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/portfolio.css";

export default function Portfolio() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");

    const summaryStats = [
        {
            label: "มูลค่าพอร์ตทั้งหมด",
            value: "217,300.00 ฿",
            sub: "+5,300.00 ฿",
            green: true
        },
        {
            label: "เงินลงทุนรวม",
            value: "212,000.00 ฿",
            sub: "ลงทุนทั้งหมด: 4 ตัว"
        },
        {
            label: "% กำไร/ขาดทุน",
            value: "+2.50%",
            sub: "+5,300.00 ฿",
            green: true
        },
        {
            label: "กำไร/ขาดทุนวันนี้",
            value: "+1,250 ฿",
            sub: "+0.58%",
            green: true
        }
    ];

    const portfolioList = [
        {
            symbol: "PTT",
            fullname: "ปตท.",
            date: "15 ม.ค. 2568",
            type: "ซื้อ",
            shares: 1000,
            price: "32.50 ฿",
            value: "32,500.00 ฿",
            pl: "+750.00 ฿",
            percent: "+2.35%",
            note: "เป็นพอร์ตลงทุนหลัก",
            plGreen: true
        },
        {
            symbol: "BDMS",
            fullname: "กรุงเทพดุสิตเวชการ",
            date: "10 ม.ค. 2568",
            type: "ซื้อ",
            shares: 2000,
            price: "22.80 ฿",
            value: "45,600.00 ฿",
            pl: "+1,200.00 ฿",
            percent: "+2.31%",
            note: "ถือยาว",
            plGreen: true
        }
    ];

    const historyList = [
        {
            date: "15 ม.ค. 2568",
            type: "ซื้อ",
            stock: "PTT",
            shares: 500,
            price: "32.50 ฿",
            total: "16,250.00 ฿",
            note: "เพิ่มพอร์ตพลังงาน",
        },
        {
            date: "10 ม.ค. 2568",
            type: "ซื้อ",
            stock: "BDMS",
            shares: 1000,
            price: "22.80 ฿",
            total: "22,800.00 ฿",
            note: "รับจังหวะปลายแดง",
        },
        {
            date: "8 ม.ค. 2568",
            type: "ซื้อ",
            stock: "PTT",
            shares: 500,
            price: "32.50 ฿",
            total: "16,250.00 ฿",
            note: "เพิ่มพอร์ตพลังงาน",
        },
        {
            date: "5 ม.ค. 2568",
            type: "ซื้อ",
            stock: "ADVANC",
            shares: 500,
            price: "185.00 ฿",
            total: "92,500.00 ฿",
            note: "หุ้นเทคโนโลยี",
        },
        {
            date: "3 ม.ค. 2568",
            type: "ซื้อ",
            stock: "BDMS",
            shares: 1000,
            price: "22.80 ฿",
            total: "22,800.00 ฿",
            note: "รับจังหวะปลายแดง",
        },
        {
            date: "2 ม.ค. 2568",
            type: "ซื้อ",
            stock: "KBANK",
            shares: 300,
            price: "138.00 ฿",
            total: "41,400.00 ฿",
            note: "ธนาคารใหญ่",
        },
    ];

  return (
    <>
    {/* ===== HERO SECTION (เหมือนหน้า stocks) ===== */}
    <section className="portfolio-hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">พอร์ตการลงทุนของฉัน</h1>
          <p className="hero-eyebrow">จัดการและติดตามการลงทุนของคุณ</p>
        </div>
    </section>

    <section className="portfolio-page">
      {/* ===== TOP SUMMARY CARD – 4 การ์ด ===== */}
        <section className="portfolio-summary-grid">
            {summaryStats.map((item, index) => (
                <div 
                key={index}
                className={`portfolio-summary-card ${item.green ? "green" : ""}`}
                >
                <p className="summary-label">{item.label}</p>
                <h2 className={`summary-value ${item.green ? "green-text" : ""}`}>
                    {item.value}
                </h2>
                <span className={`summary-sub ${item.green ? "green-text" : ""}`}>
                    {item.sub}
                </span>
                </div>
            ))}
        </section>

      {/* ===== TABS ===== */}
      <section className="portfolio-tabs-card">
        <div className="portfolio-tabs-row">

          <button
            className={
              "portfolio-tab " + (activeTab === "all" ? "portfolio-tab--active" : "")
            }
            onClick={() => setActiveTab("all")}
          >
            รายการหุ้นทั้งหมด
          </button>

          <button
            className={
              "portfolio-tab " + (activeTab === "analysis" ? "portfolio-tab--active" : "")
            }
            onClick={() => setActiveTab("analysis")}
          >
            การวิเคราะห์
          </button>

          <button
            className={
              "portfolio-tab " + (activeTab === "history" ? "portfolio-tab--active" : "")
            }
            onClick={() => setActiveTab("history")}
          >
            ประวัติการลงทุน
          </button>

        </div>
      </section>

        {/* ===== TABLE SECTION (Tab: รายการหุ้นทั้งหมด) ===== */}
        {activeTab === "all" && (
        <section className="portfolio-table-card">

          <div className="table-header">
            <h2 className="table-title">รายการหุ้นทั้งหมด</h2>

            <button className="add-invest-btn" onClick={() => navigate("/add-investment")}>
              + เพิ่มการลงทุน
            </button>
          </div>

          <table className="portfolio-table">
            <thead>
              <tr>
                <th>ชื่อย่อ</th>
                <th>วันที่ซื้อ</th>
                <th>ประเภท</th>
                <th>จำนวนหุ้น</th>
                <th>ราคาซื้อ</th>
                <th>มูลค่า</th>
                <th>กำไร/ขาดทุน</th>
                <th>หมายเหตุ</th>
                <th>จัดการ</th>
              </tr>
            </thead>

            <tbody>
                {portfolioList.map((row, i) => (
                    <tr key={i}>
                    <td className="stock-name-cell">
                        <div className="stock-symbol">{row.symbol}</div>
                        <div className="stock-fullname">{row.fullname}</div>
                    </td>
                    <td className="text-muted">{row.date}</td>
                    <td>
                        <span className="tag-buy">{row.type}</span>
                    </td>

                    <td className="text-muted">{row.shares}</td>
                    <td className="text-muted">{row.price}</td>
                    <td className="text-muted">{row.value}</td>

                    <td className="pl-wrapper">
                        <div className={row.plGreen ? "pl-main green-text" : "pl-main red-text"}>
                            {row.pl}
                        </div>
                        <div className={row.plGreen ? "pl-sub green-text" : "pl-sub red-text"}>
                            {row.percent ?? "(0.00%)"}
                        </div>
                    </td>
                    <td className="text-muted">{row.note}</td>

                    <td className="action-icons">
                        <img src="/pics/edit.png" className="action-icon" onClick={() => navigate("/edit-investment")}/>
                        <img src="/pics/delete.png" className="action-icon" />
                    </td>
                    </tr>
                ))}
            </tbody>
          </table>

        </section>
        )}

        {activeTab === "analysis" && (
          <section className="analysis-wrapper">

              {/* ===== GRID: TOP TWO PIE CHARTS ===== */}
              <div className="analysis-top-grid">

                  {/* =========== การกระจายตามหมวดอุตสาหกรรม =========== */}
                  <article className="analysis-card chart-card">
                      <h3 className="analysis-card-title">การกระจายตามหมวดอุตสาหกรรม</h3>

                      <div className="analysis-chart-body">
                          <div className="chart-placeholder">
                              [ พื้นที่กราฟวงกลม – อุตสาหกรรม ]
                          </div>
                      </div>

                      {/* <div className="analysis-legend-row">
                          <span className="legend-dot legend-red" /> การเงิน
                          <span className="legend-dot legend-green" /> พลังงาน
                          <span className="legend-dot legend-cyan" /> สุขภาพ
                          <span className="legend-dot legend-yellow" /> เทคโนโลยี
                      </div> */}
                  </article>

                  {/* =========== การกระจายตามความเสี่ยง =========== */}
                  <article className="analysis-card chart-card">
                      <h3 className="analysis-card-title">การกระจายตามความเสี่ยง</h3>

                      <div className="analysis-chart-body">
                          <div className="chart-placeholder">
                              [ พื้นที่กราฟวงกลม – ความเสี่ยง ]
                          </div>
                      </div>

                      {/* <div className="analysis-legend-row">
                          <span className="legend-dot legend-cyan" /> ต่ำ
                          <span className="legend-dot legend-yellow" /> ปานกลาง
                      </div> */}
                  </article>

              </div>

              {/* ===== GRAPH: ผลตอบแทนแต่ละหุ้น ===== */}
              <article className="analysis-card bar-card">
                  <h3 className="analysis-card-title">ผลตอบแทนแต่ละหุ้น</h3>

                  <div className="analysis-chart-body">
                      <div className="bar-placeholder">
                          [ พื้นที่กราฟแท่ง – ผลตอบแทนรายตัว ]
                      </div>
                  </div>
              </article>

          </section>
        )}

        {activeTab === "history" && (
        <section className="portfolio-table-card">

            <div className="table-header">
            <h2 className="table-title">ประวัติการซื้อขายทั้งหมด</h2>

            <button className="filter-date-btn">
                <img src="/pics/filter.png" alt="filter" className="filter-icon" />
                กรองตามวันที่
            </button>
            </div>

            <table className="portfolio-table">
            <thead>
                <tr>
                <th>วันที่ทำรายการ</th>
                <th>ประเภทรายการ</th>
                <th>ชื่อหุ้น</th>
                <th>จำนวนหุ้น</th>
                <th>ราคาต่อหุ้น</th>
                <th>มูลค่ารวม</th>
                <th>หมายเหตุ</th>
                </tr>
            </thead>

            <tbody>
                {historyList.map((row, i) => (
                <tr key={i}>
                    <td>{row.date}</td>
                    <td>
                    <span className="tag-buy">{row.type}</span>
                    </td>
                    <td>{row.stock}</td>
                    <td>{row.shares}</td>
                    <td>{row.price}</td>
                    <td>{row.total}</td>
                    <td>{row.note}</td>
                </tr>
                ))}
            </tbody>
            </table>

        </section>
        )}

    </section>
    </>
  );
}
