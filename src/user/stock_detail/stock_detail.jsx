// src/user/stock_detail/StockDetail.jsx
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import "../css/stock_detail.css"; // CSS เดิมใช้ได้เลย

export default function StockDetail() {
    const navigate = useNavigate();
    const { symbol } = useParams();
    const location = useLocation();

    // mock data
    const data = {
        symbol: symbol || "PTT",
        name: "บริษัท ปตท. จำกัด (มหาชน)",
        statusBadge: "หุ้นมั่นคง",
        marketTags: ["SET", "RESOURC", "ENERG"],
        lastPrice: 33.25,
        change: 0.25,
        changePct: 0.76,
        volume: 151136551,
        value: 4996684.08,
        lastUpdate: "11 ก.ย. 2568 02:30:10",
        open: 33.0,
        high: 33.75,
        low: 32.50,
        pe: 15.2,
        pbv: 1.1,
        dividend: 5.8,
    };

    const isUp = data.change >= 0;

    return (
        <section className="detail-page">

            {/* ปุ่มย้อนกลับ */}
            <div className="detail-back-row">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <img src="/pics/back.png" className="back-icon" />
                    <span>ย้อนกลับ</span>
                </button>
            </div>

            {/* === Header: ชื่อหุ้น + ราคา === */}
            <section className="detail-main-card">
                {/* โลโก้ / ชื่อ / แท็ก */}
                <div className="detail-main-left">
                    <div className="detail-logo">
                        <div className="detail-logo-mark" />
                    </div>

                    <div className="detail-name-block">
                        <div className="detail-symbol-row">
                            <span className="detail-symbol">{data.symbol}</span>
                            <span className="detail-status-badge">
                                {data.statusBadge}
                            </span>
                            <button className="detail-heart">♥</button>
                        </div>

                        <p className="detail-fullname">{data.name}</p>

                        <div className="detail-tag-row">
                            {data.marketTags.map((t) => (
                                <span className="detail-tag" key={t}>{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ราคาปัจจุบัน */}
                <div className="detail-main-right">
                    <div className="detail-price-block">
                        <div className="detail-price-row">
                            <span className={"detail-price-arrow " + (isUp ? "up" : "down")}>
                                {isUp ? "▲" : "▼"}
                            </span>
                            <span className="detail-price">{data.lastPrice.toFixed(2)}</span>
                        </div>
                        <div className={"detail-change " + (isUp ? "up" : "down")}>
                            {`${isUp ? "+" : ""}${data.change.toFixed(2)} (+${data.changePct.toFixed(2)}%)`}
                        </div>
                    </div>

                    <div className="detail-meta-block">
                        <div className="detail-meta-col">
                            <div className="detail-meta-label">ปริมาณ (หุ้น)</div>
                            <div className="detail-meta-value">
                                {data.volume.toLocaleString("th-TH")}
                            </div>
                        </div>

                        <div className="detail-meta-col">
                            <div className="detail-meta-label">มูลค่า (‘000 บาท)</div>
                            <div className="detail-meta-value">
                                {data.value.toLocaleString("th-TH")}
                            </div>
                        </div>
                    </div>

                    <div className="detail-main-update">
                        อัปเดต: {data.lastUpdate}
                    </div>
                </div>
            </section>

            {/* === Tabs === */}
            <section className="detail-tabs-card">
                <div className="detail-tabs-row">
                    {/* /detail/${symbol} */}
                    <button
                        className={
                            "detail-tab " +
                            (location.pathname === '/detail' ? "detail-tab--active" : "")
                        }
                        onClick={() => navigate('/detail')}
                    >
                        ราคา
                    </button>

                    <button
                        className={
                            "detail-tab " +
                            (location.pathname.includes("history") ? "detail-tab--active" : "")
                        }
                        onClick={() => navigate('/detail/history')}
                    >
                        ราคาย้อนหลัง
                    </button>

                    <button
                        className={
                            "detail-tab " +
                            (location.pathname.includes("finance") ? "detail-tab--active" : "")
                        }
                        onClick={() => navigate('/detail/finance')}
                    >
                        งบการเงิน
                    </button>

                    <button
                        className={
                            "detail-tab " +
                            (location.pathname.includes("holders") ? "detail-tab--active" : "")
                        }
                        onClick={() => navigate('/detail/holders')}
                    >
                        ข้อมูลผู้ถือหุ้น
                    </button>

                </div>
            </section>

            {/* ตรงนี้จะแสดงแท็บ */}
            <Outlet />

        </section>
    );
}
