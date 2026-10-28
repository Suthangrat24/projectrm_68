import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getPortfolio, getStockLatest } from "../fetchapi/call_api_user";
import RecommendationPerformance from "./recommendation_performance";
import "../css/portfolio.css";

export default function Portfolio() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");

    const [portfolioList, setPortfolioList] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        async function loadPortfolio() {
            try {
                const data = await getPortfolio(token);
                if (data && Array.isArray(data)) {
                    setPortfolioList(data);
                } else {
                    console.error('ข้อมูลที่ได้ไม่ใช่รูปแบบที่คาดหวัง');
                }
            } catch (err) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลพอร์ต:", err);
            }
        }

        loadPortfolio();
    }, []);

    // ── ดึงราคาล่าสุดของทุก symbol ที่ถืออยู่ (unique) เพื่อเอามาคำนวณ KPI จริง ──
    // getPortfolio() มีแค่ราคาตอนซื้อ (price_per_share) ไม่มีราคาปัจจุบัน
    // ต้องดึงเพิ่มแบบเดียวกับที่ profile.jsx ทำกับหุ้นโปรด
    const [latestPrices, setLatestPrices] = useState({}); // { symbol: {price, change, change_pct} }

    useEffect(() => {
        if (portfolioList.length === 0) return;

        const uniqueSymbols = [...new Set(portfolioList.map((r) => r.symbol))];

        async function loadLatestPrices() {
            const results = await Promise.all(
                uniqueSymbols.map(async (symbol) => {
                    try {
                        const latest = await getStockLatest(`${symbol}.BK`);
                        return [symbol, latest];
                    } catch (err) {
                        console.error(`โหลดราคาล่าสุดของ ${symbol} ไม่สำเร็จ`, err);
                        return [symbol, null];
                    }
                })
            );
            setLatestPrices(Object.fromEntries(results));
        }

        loadLatestPrices();
    }, [portfolioList]);

    // ── คำนวณพอร์ตด้วย "ต้นทุนเฉลี่ย" (average cost) ──
    // แก้ปัญหาเดิม: เงินลงทุนรวมเคยนับทุกรายการซื้อ แม้หุ้นที่ขายไปแล้ว แต่มูลค่าพอร์ตนับแค่หุ้นที่ยังถือ
    // → % กำไร/ขาดทุนบนการ์ดไม่ตรงกับตาราง ตอนนี้ทั้งสองฝั่งนับเฉพาะหุ้นที่ยังถืออยู่
    const positions = useMemo(() => {
        const sorted = [...portfolioList].sort(
            (a, b) =>
                new Date(a.invest_date) - new Date(b.invest_date) || a.portfolio_id - b.portfolio_id
        );
        const pos = {}; // { symbol: { shares, cost, realized } }
        sorted.forEach((row) => {
            const p = (pos[row.symbol] ||= { shares: 0, cost: 0, realized: 0 });
            const n = Number(row.number_of_share) || 0;
            const price = Number(row.price_per_share) || 0;
            if (row.invest_type_id === 1) {
                p.shares += n;
                p.cost += n * price;
            } else {
                const sellN = Math.min(n, p.shares); // ขายเกินที่ถือ → นับเท่าที่มี
                const avg = p.shares > 0 ? p.cost / p.shares : 0;
                p.realized += sellN * (price - avg);
                p.cost -= sellN * avg;
                p.shares -= sellN;
            }
        });
        return pos;
    }, [portfolioList]);

    const summaryStats = useMemo(() => {
        const fmt = (n) =>
            n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const sign = (n) => (n >= 0 ? "+" : "");

        const held = Object.entries(positions).filter(([, p]) => p.shares > 0);

        if (held.length === 0) {
            return [
                { label: "มูลค่าพอร์ตทั้งหมด", value: "0.00 ฿", sub: "-" },
                { label: "ต้นทุนหุ้นที่ถืออยู่", value: "0.00 ฿", sub: "ถืออยู่: 0 ตัว" },
                { label: "% กำไร/ขาดทุน", value: "0.00%", sub: "0.00 ฿" },
                { label: "กำไร/ขาดทุนวันนี้", value: "0.00 ฿", sub: "0.00%" },
            ];
        }

        // ราคาล่าสุดยังโหลดไม่ครบ → ยังไม่คำนวณ ไม่งั้นมูลค่าจะขาดไปบางตัวแล้วดูเหมือนขาดทุน
        const missing = held.filter(([s]) => latestPrices[s]?.price == null).map(([s]) => s);
        if (missing.length > 0) {
            const loading = { value: "กำลังโหลด...", sub: `รอราคา ${missing.join(", ")}` };
            return [
                { label: "มูลค่าพอร์ตทั้งหมด", ...loading },
                { label: "ต้นทุนหุ้นที่ถืออยู่", ...loading },
                { label: "% กำไร/ขาดทุน", ...loading },
                { label: "กำไร/ขาดทุนวันนี้", ...loading },
            ];
        }

        let totalCost = 0;
        let currentValue = 0;
        let todayChange = 0;
        let realized = 0;
        Object.values(positions).forEach((p) => (realized += p.realized));
        held.forEach(([symbol, p]) => {
            const latest = latestPrices[symbol];
            totalCost += p.cost;
            currentValue += p.shares * latest.price;
            todayChange += p.shares * (latest.change ?? 0);
        });

        const unrealized = currentValue - totalCost;
        const unrealizedPct = totalCost > 0 ? (unrealized / totalCost) * 100 : 0;
        const yesterdayValue = currentValue - todayChange;
        const todayChangePct = yesterdayValue > 0 ? (todayChange / yesterdayValue) * 100 : 0;

        return [
            {
                label: "มูลค่าพอร์ตทั้งหมด",
                value: `${fmt(currentValue)} ฿`,
                sub: `${sign(unrealized)}${fmt(unrealized)} ฿`,
                green: unrealized >= 0,
            },
            {
                label: "ต้นทุนหุ้นที่ถืออยู่",
                value: `${fmt(totalCost)} ฿`,
                sub: `ถืออยู่: ${held.length} ตัว`,
            },
            {
                label: "% กำไร/ขาดทุน",
                value: `${sign(unrealizedPct)}${unrealizedPct.toFixed(2)}%`,
                sub:
                    realized !== 0
                        ? `ยังไม่ขาย ${sign(unrealized)}${fmt(unrealized)} ฿ · ขายแล้ว ${sign(realized)}${fmt(realized)} ฿`
                        : `${sign(unrealized)}${fmt(unrealized)} ฿`,
                green: unrealizedPct >= 0,
            },
            {
                label: "กำไร/ขาดทุนวันนี้",
                value: `${sign(todayChange)}${fmt(todayChange)} ฿`,
                sub: `${sign(todayChangePct)}${todayChangePct.toFixed(2)}%`,
                green: todayChange >= 0,
            },
        ];
    }, [positions, latestPrices]);

    return (
        <>
            {/* ===== HERO SECTION (เหมือนหน้า stocks) ===== */}
            <section className="portfolio-hero">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <p className="hero-eyebrow">จัดการและติดตามการลงทุนของคุณ</p>
                    <h1 className="hero-title">พอร์ตการลงทุนของฉัน</h1>
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

                {/* ===== ผลตอบแทนจากคำแนะนำของระบบ (feedback loop) ===== */}
                <RecommendationPerformance />

                {/* ===== TABS ===== */}
                <section className="portfolio-tabs-card">
                    <div className="portfolio-tabs-row">

                        <button
                            className={
                                "portfolio-tab " + (activeTab === "all" ? "portfolio-tab--active" : "")
                            }
                            onClick={() => setActiveTab("all")}
                        >
                            รายการลงทุนทั้งหมด
                        </button>

                        <button
                            className={
                                "portfolio-tab " + (activeTab === "analysis" ? "portfolio-tab--active" : "")
                            }
                            onClick={() => setActiveTab("analysis")}
                        >
                            การวิเคราะห์
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
                            <colgroup>
                                <col style={{ width: "8%" }} />   {/* ชื่อย่อ */}
                                <col style={{ width: "8%" }} />   {/* วันที่ซื้อ */}
                                <col style={{ width: "7%" }} />   {/* ประเภท */}
                                <col style={{ width: "8%" }} />   {/* จำนวนหุ้น */}
                                <col style={{ width: "8%" }} />   {/* ราคาซื้อ */}
                                <col style={{ width: "8%" }} />   {/* มูลค่า */}
                                <col style={{ width: "12%" }} />  {/* ราคาปัจจุบัน */}
                                <col style={{ width: "12%" }} />  {/* กำไร/ขาดทุน */}
                                <col style={{ width: "19%" }} />  {/* หมายเหตุ */}
                                <col style={{ width: "10%" }} />  {/* จัดการ */}
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>หุ้น</th>
                                    <th>วันที่ลงทุน</th>
                                    <th>ประเภท</th>
                                    <th>จำนวนหุ้น</th>
                                    <th>ราคาที่ซื้อ</th>
                                    <th>มูลค่า</th>
                                    <th>ราคาปัจจุบัน</th>
                                    <th>กำไร/ขาดทุน</th>
                                    <th>หมายเหตุ</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>

                            <tbody>
                                {portfolioList.map((row) => {
                                    const latest = latestPrices[row.symbol];
                                    const currentPrice = latest?.price;
                                    const isBuy = row.invest_type_id === 1;

                                    // กำไร/ขาดทุนคำนวณเทียบกับต้นทุนของรายการนี้โดยตรง (มีความหมายเฉพาะรายการ "ซื้อ" ที่ยังถืออยู่)
                                    const cost = row.number_of_share * row.price_per_share;
                                    const currentValue = currentPrice != null ? row.number_of_share * currentPrice : null;
                                    const plValue = currentValue != null ? currentValue - cost : null;
                                    const plPct = plValue != null && cost > 0 ? (plValue / cost) * 100 : null;
                                    const isUp = plPct != null && plPct >= 0;

                                    // ราคาซื้อห่างจากราคาตลาดเกิน 3 เท่า → น่าจะกรอกผิด (เช่น TFG ซื้อ 100 บาท ทั้งที่ราคาจริง ~10)
                                    const ratio = currentPrice ? row.price_per_share / currentPrice : 1;
                                    const suspicious = ratio > 3 || ratio < 1 / 3;

                                    return (
                                        <tr key={row.portfolio_id}>
                                            <td className="text-muted">
                                                <div className="portfolio-stock-symbol">{row.symbol}</div>
                                            </td>
                                            <td className="text-muted">
                                                {new Date(row.invest_date).toLocaleDateString("th-TH")}
                                            </td>
                                            <td>
                                                <span className={isBuy ? "tag-buy" : "tag-sell"}>
                                                    {isBuy ? "ซื้อ" : "ขาย"}
                                                </span>
                                            </td>

                                            <td className="text-muted">{row.number_of_share}</td>
                                            <td className="text-muted">
                                                {Number(row.price_per_share).toFixed(2)}
                                                {suspicious && (
                                                    <div
                                                        style={{ color: "#f59e0b", fontSize: "0.75rem", marginTop: 2 }}
                                                        title="ราคาซื้อต่างจากราคาตลาดมาก กรุณาตรวจสอบว่ากรอกถูกต้อง"
                                                    >
                                                        ⚠ ตรวจสอบราคา
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-muted">
                                                {cost.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>

                                            <td className="text-muted">
                                                {isBuy
                                                    ? (currentPrice != null ? `${currentPrice.toFixed(2)} บาท` : "กำลังโหลด...")
                                                    : "-"}
                                            </td>

                                            <td>
                                                {isBuy && plPct != null ? (
                                                    <div className="pl-cell">
                                                        <span className={`pl-pill ${isUp ? "up" : "down"}`}>
                                                            {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
                                                            {plPct.toFixed(2)}%
                                                        </span>
                                                        <span className={`pl-amount ${isUp ? "up" : "down"}`}>
                                                            {isUp ? "+" : ""}{plValue.toFixed(2)} บาท
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>

                                            <td className="text-muted" title={row.note || ""}>
                                                <span className="col-note">{row.note || "-"}</span>
                                            </td>

                                            <td className="portfolio-action-icon">
                                                <img
                                                    src="/pics/edit.png"
                                                    className="edit-icon"
                                                    onClick={() => navigate(`/edit-investment/${row.portfolio_id}`)}
                                                />
                                                <img src="/pics/delete.png" className="delete-icon" />
                                            </td>
                                        </tr>
                                    );
                                })}
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
                            </article>

                            {/* =========== การกระจายตามความเสี่ยง =========== */}
                            <article className="analysis-card chart-card">
                                <h3 className="analysis-card-title">การกระจายตามความเสี่ยง</h3>

                                <div className="analysis-chart-body">
                                    <div className="chart-placeholder">
                                        [ พื้นที่กราฟวงกลม – ความเสี่ยง ]
                                    </div>
                                </div>
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

            </section>
        </>
    );
}