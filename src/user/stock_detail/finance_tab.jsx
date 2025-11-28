import { useState } from "react";
import "../../css/stock_detail/finance_tab.css";

export default function FinanceTab() {

    const [year, setYear] = useState("2567");

    // mock table summary
    const summary = {
        assets: "3,312,019.06",
        debt: "1,673,811.29",
        equity: "1,132,810.36",
        roa: "5.43",
        roe: "6.09",
        margin: "4.37",
    };

    return (
        <>
        <section className="finance-tab">

            {/* ============ FILTER ROW ============ */}
            <div className="fin-filter-row">
                <button className="fin-filter-btn">ตัวกรอง</button>

                <div className="fin-year-select-wrapper">
                    <select
                        className="fin-year-select"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="2568">2568</option>
                        <option value="2567">2567</option>
                        <option value="2566">2566</option>
                        <option value="2565">2565</option>
                        <option value="2564">2564</option>
                    </select>

                    <img src="/pics/drop-down.png" className="fin-select-arrow" />
                </div>
            </div>

            {/* ============ GRID (LEFT GRAPH + RIGHT SUMMARY) ============ */}
            <div className="fin-grid">

                {/* -------- LEFT: CHARTS -------- */}
                <div className="fin-left">

                    <div className="fin-card fin-chart-card">
                        <h3 className="fin-card-title">รายได้ & กำไรสุทธิ</h3>
                        <div className="fin-chart-placeholder">
                            [ กราฟรายได้ & กำไรสุทธิ ]
                        </div>
                    </div>

                    <div className="fin-card fin-chart-card">
                        <h3 className="fin-card-title">สินทรัพย์รวม & หนี้สินรวม</h3>
                        <div className="fin-chart-placeholder">
                            [ กราฟสินทรัพย์รวม & หนี้สินรวม ]
                        </div>
                    </div>

                    <div className="fin-card fin-chart-card">
                        <h3 className="fin-card-title">ROA / ROE / Margin</h3>
                        <div className="fin-chart-placeholder">
                            [ กราฟ ROA / ROE / Margin ]
                        </div>
                    </div>

                </div>

                {/* -------- RIGHT: SUMMARY TABLE -------- */}
                <div className="fin-right">
                    <div className="fin-card fin-summary-card">
                        <h3 className="fin-card-title">สรุปงบการเงินปี {year}</h3>

                        <div className="fin-summary-grid">
                            <div className="fin-sum-row">
                                <span>สินทรัพย์รวม</span>
                                <span>{summary.assets}</span>
                            </div>
                            <div className="fin-sum-row">
                                <span>หนี้สินรวม</span>
                                <span>{summary.debt}</span>
                            </div>
                            <div className="fin-sum-row">
                                <span>ส่วนของผู้ถือหุ้น</span>
                                <span>{summary.equity}</span>
                            </div>

                            <div className="fin-sum-row">
                                <span>ROA (%)</span>
                                <span>{summary.roa}%</span>
                            </div>
                            <div className="fin-sum-row">
                                <span>ROE (%)</span>
                                <span>{summary.roe}%</span>
                            </div>
                            <div className="fin-sum-row">
                                <span>อัตรากำไรสุทธิ</span>
                                <span>{summary.margin}%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
        </>
    );
}
