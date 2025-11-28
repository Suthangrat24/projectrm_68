// src/user/stock_detail/PriceTab.jsx
import { useNavigate, useParams } from "react-router-dom";
import "../../css/stock_detail/price_tab.css";


export default function PriceTab({ data }) {
    const navigate = useNavigate();
    const { symbol } = useParams();
    const isUp = data.change >= 0;

    return (
        <section className="detail-grid">

            {/* ======== กราฟ ======== */}
            <article className="detail-card chart-card">
                <header className="chart-header">
                    <div className="chart-title">กราฟราคา</div>

                    <div className="chart-two-col">
                        <div className="chart-col">
                            <span className="chart-label-main">ราคา</span>
                            <button className="range-pill range-pill--active">Intraday</button>
                        </div>

                        <span className="chart-divider-vert" />

                        <div className="chart-col chart-col-right">
                            <span className="chart-label-muted">ประสิทธิภาพด้านราคา</span>
                            <div className="chart-range-row">
                                <button className="range-pill">1M</button>
                                <button className="range-pill">3M</button>
                                <button className="range-pill">6M</button>
                                <button className="range-pill">YTD</button>
                                <button className="range-pill">1Y</button>
                                <button className="range-pill">3Y</button>
                                <button className="range-pill">5Y</button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="chart-body">
                    <div className="chart-placeholder">
                        [ พื้นที่สำหรับกราฟราคา ]
                    </div>
                </div>

                <footer className="chart-footer">
                    <span>อัปเดต: {data.lastUpdate}</span>
                    <button
                        className="btn-future"
                        onClick={() => navigate(`/detail/${symbol}/future`)}
                    >
                        <img src="/pics/future.png" className="btn-future-icon" />
                        <span>ดูแนวโน้มในอนาคต</span>
                    </button>
                </footer>
            </article>

            {/* ======== การ์ดข้อมูลขวา ======== */}
            <div className="detail-right-col">
                {/* การ์ดข้อมูลการซื้อขาย */}
                <div className="info-card-shell">
                    <article className="detail-card info-card info-card--border">
                        <div className="info-inner">
                            <div className="info-header">ข้อมูลการซื้อขาย</div>

                            <div className="info-grid">
                                <div className="info-col">
                                    <div className="info-label">ล่าสุด</div>
                                    <div className="info-value">{data.lastPrice.toFixed(2)}</div>
                                </div>

                                <div className="info-col">
                                    <div className="info-label">เปิด</div>
                                    <div className="info-value">{data.open.toFixed(2)}</div>
                                </div>

                                <div className="info-col">
                                    <div className="info-label">สูงสุด</div>
                                    <div className="info-value info-value--up">
                                        {data.high.toFixed(2)}
                                    </div>
                                </div>

                                <div className="info-col">
                                    <div className="info-label">ต่ำสุด</div>
                                    <div className="info-value info-value--down">
                                        {data.low.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="info-bottom-separator" />

                            <div className="info-meta">
                                <div className="info-meta-item">
                                    <span className="info-meta-label">ปริมาณ (หุ้น):</span>
                                    <span className="info-meta-value">
                                        {data.volume.toLocaleString("th-TH")}
                                    </span>
                                </div>

                                <div className="info-meta-item">
                                    <span className="info-meta-label">มูลค่า (‘000 บาท):</span>
                                    <span className="info-meta-value">
                                        {data.value.toLocaleString("th-TH")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>

                {/* การ์ดอัตราส่วน */}
                <article className="detail-card info-card">
                    <div className="info-header">อัตราส่วนทางการเงิน</div>

                    <div className="ratio-row">
                        <span className="ratio-label">P/E Ratio:</span>
                        <span className="ratio-value">{data.pe.toFixed(2)}</span>
                    </div>

                    <div className="ratio-row">
                        <span className="ratio-label">P/BV Ratio:</span>
                        <span className="ratio-value">{data.pbv.toFixed(2)}</span>
                    </div>

                    <div className="ratio-row">
                        <span className="ratio-label">Dividend Yield:</span>
                        <span className="ratio-value">{data.dividend.toFixed(2)}%</span>
                    </div>
                </article>
            </div>

        </section>
    );
}
