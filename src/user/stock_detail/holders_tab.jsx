// src/user/stock_detail/HoldersTab.jsx
import "../../css/stock_detail/holders_tab.css";

export default function HoldersTab({ holdersSummary, majorHolders }) {
    return (
        <section className="detail-holders-section">

            {/* KPI */}
            <div className="holders-summary-row">
                <article className="detail-card holders-kpi-card">
                    <div className="holders-kpi-label">จำนวนผู้ถือหุ้น</div>
                    <div className="holders-kpi-value">
                        {holdersSummary.totalHolders.toLocaleString("th-TH")}
                    </div>
                    <div className="holders-kpi-sub">ราย</div>
                </article>

                <article className="detail-card holders-kpi-card">
                    <div className="holders-kpi-label">Free Float</div>
                    <div className="holders-kpi-value">{holdersSummary.freeFloat}%</div>
                    <div className="holders-kpi-sub">หุ้นที่ซื้อขายได้</div>
                </article>

                <article className="detail-card holders-kpi-card">
                    <div className="holders-kpi-label">หุ้นที่ออก</div>
                    <div className="holders-kpi-value">{holdersSummary.listedShares}</div>
                    <div className="holders-kpi-sub">หน่วย</div>
                </article>
            </div>

            {/* Pie + Top 5 */}
            <div className="holders-main-grid">
                <article className="detail-card holders-chart-card">
                    <header className="holders-card-header">
                        <h3 className="holders-card-title">โครงสร้างผู้ถือหุ้น</h3>
                    </header>

                    <div className="holders-chart-layout">
                        <div className="holders-donut-shell">
                            <div className="holders-donut-ring">
                                <div className="holders-donut-center" />
                            </div>
                        </div>
                    </div>
                </article>

                <article className="detail-card holders-top5-card">
                    <header className="holders-card-header">
                        <h3 className="holders-card-title">ผู้ถือหุ้นรายใหญ่ 5 อันดับแรก</h3>
                    </header>

                    <ul className="holders-top5-list">
                        {majorHolders.map((h) => (
                            <li
                                key={h.id}
                                className={`holders-top5-item holders-top5-item--${h.color}`}
                            >
                                <div className="holders-top5-main">
                                    <div className="holders-rank-badge"><span>{h.id}</span></div>
                                    <div className="holders-top5-text">
                                        <div className="holders-top5-name">{h.name}</div>
                                        <div className="holders-top5-shares">{h.sharesText}</div>
                                    </div>
                                </div>

                                <div className="holders-top5-meta">
                                    <div className="holders-top5-bar">
                                        <div
                                            className="holders-top5-bar-fill"
                                            style={{ width: `${h.percent}%` }}
                                        />
                                    </div>
                                    <div className="holders-top5-percent">{h.percent}%</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </section>
    );
}
