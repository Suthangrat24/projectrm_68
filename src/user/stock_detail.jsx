import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import "../css/stock_detail.css";

export default function StockDetail() {
    const navigate = useNavigate();
    const { symbol } = useParams(); // ตอนนี้ยังไม่ใช้ แต่เผื่ออนาคต

    // mock data PTT เอาไว้จัด layout ก่อน
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
        low: 32.5,
        pe: 15.2,
        pbv: 1.1,
        dividend: 5.8,
    };

    // mock ราคาย้อนหลัง – เอาไว้จัด table
    const historyRows = [
        {
        date: "22 ก.ย. 2568",
        close: 33.25,
        high: 33.50,
        low: 32.75,
        open: 33.25,
        change: 0.0,
        changePct: 0.0,
        volume: 51665948,
        value: 1707883.53,
        },
        {
        date: "19 ก.ย. 2568",
        close: 33.25,
        high: 33.50,
        low: 32.75,
        open: 33.00,
        change: 0.25,
        changePct: 0.76,
        volume: 151136551,
        value: 5006746.21,
        },
        {
        date: "18 ก.ย. 2568",
        close: 33.50,
        high: 33.50,
        low: 32.75,
        open: 33.25,
        change: 0.25,
        changePct: 0.75,
        volume: 46567892,
        value: 1543416.24,
        },
        {
        date: "17 ก.ย. 2568",
        close: 33.25,
        high: 33.50,
        low: 33.25,
        open: 33.00,
        change: 0.0,
        changePct: 0.0,
        volume: 97624680,
        value: 3269027.31,
        },
        {
        date: "16 ก.ย. 2568",
        close: 33.25,
        high: 33.25,
        low: 32.75,
        open: 33.25,
        change: 0.0,
        changePct: 0.0,
        volume: 71805497,
        value: 2272430.02,
        },
    ];

    const isUp = data.change >= 0;

    const [activeTab, setActiveTab] = useState("price");

    // ===== SORT สำหรับตารางราคาย้อนหลัง =====
    const [historySortField, setHistorySortField] = useState("date"); // date, close, high, low, open, change, changePct, volume, value
    const [historySortDir, setHistorySortDir] = useState("desc");      // asc | desc

    const sortedHistory = useMemo(() => {
    const rows = [...historyRows];

    rows.sort((a, b) => {
        const field = historySortField;
        const av = a[field];
        const bv = b[field];

        // ถ้าเป็นตัวเลขให้เทียบแบบ number
        if (typeof av === "number" && typeof bv === "number") {
        return historySortDir === "asc" ? av - bv : bv - av;
        }

        // อย่างอื่น (เช่น date เป็น string)
        const sa = String(av ?? "");
        const sb = String(bv ?? "");
        const cmp = sa.localeCompare(sb, "th-TH", { sensitivity: "base" });
        return historySortDir === "asc" ? cmp : -cmp;
    });

    return rows;
    }, [historySortField, historySortDir]);

    const handleHistorySort = (field) => {
        if (historySortField === field) {
            setHistorySortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setHistorySortField(field);
            setHistorySortDir("asc");
        }
    };

    const [year, setYear] = useState("2567");

    // =============== MOCK DATA แบบตามตารางจริง ===============
    const financeData = {
        "2564": {
            asset: 3078018.83,
            debt: 1605079.11,
            equity: 1006696.22,
            parPaid: 28563.00,
            revenue: 2287758.51,
            otherProfit: -29416.61,
            netProfit: 108363.41,
            eps: 3.79,
            roa: 8.82,
            roe: 11.47,
            margin: 6.65,
            lastPrice: 38.00,
            marketCap: 1085393.86,
            pe: 11.55,
            pbv: 1.11,
            bookValue: 34.26,
            dividendYield: 2.63,
        },
        "2565": {
            asset: 3415632.29,
            debt: 1881939.53,
            equity: 1052590.88,
            parPaid: 28563.00,
            revenue: 3391622.87,
            otherProfit: -63512.46,
            netProfit: 91174.86,
            eps: 3.20,
            roa: 7.69,
            roe: 8.85,
            margin: 3.60,
            lastPrice: 33.25,
            marketCap: 949719.63,
            pe: 9.42,
            pbv: 0.88,
            bookValue: 37.64,
            dividendYield: 6.02,
        },
        "2566": {
            asset: 3460461.90,
            debt: 1835486.49,
            equity: 1121197.88,
            parPaid: 28563.00,
            revenue: 3185256.08,
            otherProfit: 12103.41,
            netProfit: 112023.88,
            eps: 3.92,
            roa: 8.20,
            roe: 10.31,
            margin: 4.87,
            lastPrice: 35.75,
            marketCap: 1021127.12,
            pe: 10.51,
            pbv: 0.91,
            bookValue: 39.34,
            dividendYield: 5.59,
        },
        "2567": {
            asset: 3438784.28,
            debt: 1781907.19,
            equity: 1149652.17,
            parPaid: 28563.00,
            revenue: 3138378.01,
            otherProfit: 1634.31,
            netProfit: 90072.03,
            eps: 3.15,
            roa: 6.59,
            roe: 7.93,
            margin: 3.62,
            lastPrice: 31.75,
            marketCap: 906875.13,
            pe: 7.99,
            pbv: 0.81,
            bookValue: 39.18,
            dividendYield: 6.30,
        },
        "2568": {
            asset: 3312019.06,
            debt: 1673811.29,
            equity: 1132810.36,
            parPaid: 28563.00,
            revenue: 1397289.78,
            otherProfit: 19737.47,
            netProfit: 44848.37,
            eps: 1.57,
            roa: 5.43,
            roe: 6.09,
            margin: 4.37,
            lastPrice: 33.00,
            marketCap: 942578.88,
            pe: 13.26,
            pbv: 0.83,
            bookValue: 39.98,
            dividendYield: 6.42,
        },
    };

    const d = financeData[year];

    const majorHolders = [
        { id: 1, name: "กระทรวงการคลัง", sharesText: "1.85B หุ้น", percent: 51.11, color: "teal" },
        { id: 2, name: "บริษัท ไทยเอ็นวีดีอาร์", sharesText: "0.42B หุ้น", percent: 11.74, color: "blue" },
        { id: 3, name: "นักลงทุนสถาบันต่างประเทศ", sharesText: "0.32B หุ้น", percent: 8.84, color: "orange" },
        { id: 4, name: "กองทุนรวม LTF/RMF", sharesText: "0.28B หุ้น", percent: 7.87, color: "purple" },
        { id: 5, name: "ผู้ถือหุ้นรายย่อย", sharesText: "0.74B หุ้น", percent: 20.44, color: "red" },
    ];

    // เพิ่มอันนี้ลงมา
    const holdersSummary = {
        totalHolders: 52345,
        freeFloat: 43.21,
        listedShares: "2,856,300,000",
    };

    return (
        <>
            <section className="detail-page">
                <div className="detail-back-row">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                            <img src="/pics/back.png" alt="back" className="back-icon" />
                        <span>ย้อนกลับ</span>
                    </button>
                </div>

                <section className="detail-main-card">
                    {/* ซ้าย: โลโก้ + ชื่อหุ้น */}
                    <div className="detail-main-left">
                    <div className="detail-logo">
                        {/* เดี๋ยวค่อยเอารูปโลโก้จริงมาใส่แทน background */}
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

                    {/* ขวา: ราคาปัจจุบัน */}
                    <div className="detail-main-right">
                    <div className="detail-price-block">
                        <div className="detail-price-row">
                        <span
                            className={
                            "detail-price-arrow " + (isUp ? "up" : "down")
                            }
                        >
                            {isUp ? "▲" : "▼"}
                        </span>
                        <span className="detail-price">
                            {data.lastPrice.toFixed(2)}
                        </span>
                        </div>
                        <div
                        className={
                            "detail-change " + (isUp ? "up" : "down")
                        }
                        >
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
                            {data.value.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })}
                        </div>
                        </div>
                    </div>

                    <div className="detail-main-update">
                        อัปเดต: {data.lastUpdate}
                    </div>
                    </div>
                </section>

                {/* Tabs – กรอบโค้ง ๆ เหมือน Figma */}
                <section className="detail-tabs-card">
                <div className="detail-tabs-row">
                    <button
                    className={
                        "detail-tab " +
                        (activeTab === "price" ? "detail-tab--active" : "")
                    }
                    onClick={() => setActiveTab("price")}
                    >
                    ราคา
                    </button>

                    <button
                    className={
                        "detail-tab " +
                        (activeTab === "history" ? "detail-tab--active" : "")
                    }
                    onClick={() => setActiveTab("history")}
                    >
                    ราคาย้อนหลัง
                    </button>

                    <button
                    className={
                        "detail-tab " +
                        (activeTab === "finance" ? "detail-tab--active" : "")
                    }
                    onClick={() => setActiveTab("finance")}
                    >
                    งบการเงิน
                    </button>

                    <button
                    className={
                        "detail-tab " +
                        (activeTab === "holders" ? "detail-tab--active" : "")
                    }
                    onClick={() => setActiveTab("holders")}
                    >
                    ข้อมูลผู้ถือหุ้น
                    </button>
                </div>
                </section>

                {/* ======= TAB: ราคา (กราฟ + การ์ดขวา) ======= */}
                {activeTab === "price" && (
                    <section className="detail-grid">
                        {/* ส่วนล่าง: กราฟ + การ์ดข้อมูล */}

                        {/* ซ้าย: กราฟราคา */}
                        <article className="detail-card chart-card">
                            <header className="chart-header">
                                {/* บรรทัดที่ 1: ชื่อกราฟ */}
                                <div className="chart-title">กราฟราคา</div>

                                {/* บรรทัดที่ 2–3: แบ่งสองฝั่ง + เส้นคั่นแนวตั้ง */}
                                <div className="chart-two-col">
                                    {/* ฝั่งซ้าย: ราคา + Intraday (บรรทัดถัดไป) */}
                                    <div className="chart-col chart-col-left">
                                        <span className="chart-label-main">ราคา</span>
                                        <button className="range-pill range-pill--active">
                                            Intraday
                                        </button>
                                    </div>

                                    {/* เส้นคั่นแนวตั้ง ยาวจากบรรทัด 2 ถึง 3 */}
                                    <span className="chart-divider-vert" />

                                    {/* ฝั่งขวา: ประสิทธิภาพด้านราคา + ปุ่มช่วงเวลาอื่น */}
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
                                {/* พื้นที่สำหรับกราฟจริง – ตอนนี้แค่ placeholder */}
                                <div className="chart-placeholder">
                                [ พื้นที่สำหรับกราฟราคา ]
                                </div>
                            </div>
                            
                            {/* onClick={() => navigate(`/detail/${data.symbol}/future`)} */}
                            <footer className="chart-footer">
                                <span>อัปเดต: {data.lastUpdate}</span>
                                <button
                                    className="btn-future"
                                    onClick={() => navigate(`/detail/${data.symbol}/future`)}
                                >
                                    <img src="/pics/future.png" alt="future" className="btn-future-icon" />
                                    <span>ดูแนวโน้มในอนาคต</span>
                                </button>
                            </footer>
                        </article>

                        {/* ขวา: การ์ดข้อมูล */}
                        <div className="detail-right-col">
                            {/* การ์ดข้อมูลการซื้อขาย */}
                            <div className="info-card-shell">
                                <article className="detail-card info-card info-card--border">
                                    <div className="info-topstrip" />
                                    <div className="info-inner">
                                        <div className="info-header">
                                            <span>ข้อมูลการซื้อขาย</span>
                                        </div>

                                        {/* ด้านบน: ล่าสุด / เปิด / สูงสุด / ต่ำสุด */}
                                        <div className="info-grid">
                                            <div className="info-col">
                                                <div className="info-label">ล่าสุด</div>
                                                <div className="info-value">
                                                    {data.lastPrice.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="info-col">
                                                <div className="info-label">เปิด</div>
                                                <div className="info-value">
                                                    {data.open.toFixed(2)}
                                                </div>
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

                                        {/* เส้นคั่นแนวนอน */}
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
                                                {data.value.toLocaleString("th-TH", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>

                            {/* การ์ดอัตราส่วนทางการเงิน */}
                            <article className="detail-card info-card">
                                <div className="info-header">
                                    <span>อัตราส่วนทางการเงิน</span>
                                </div>
                                <div className="ratio-row">
                                    <span className="ratio-label">P/E Ratio:</span>
                                    <span className="ratio-value">
                                        {data.pe.toFixed(2)}
                                    </span>
                                </div>
                                <div className="ratio-row">
                                    <span className="ratio-label">P/BV Ratio:</span>
                                    <span className="ratio-value">
                                        {data.pbv.toFixed(2)}
                                    </span>
                                </div>
                                <div className="ratio-row">
                                    <span className="ratio-label">Dividend Yield:</span>
                                    <span className="ratio-value">
                                        {data.dividend.toFixed(2)}%
                                    </span>
                                </div>
                            </article>
                        </div>
                    </section>
                )}

                {/* ======= TAB: ราคาย้อนหลัง (ตารางเต็มกว้าง) ======= */}
                {activeTab === "history" && (
                <section className="detail-history-section">
                    <article className="detail-card history-card">
                    <header className="history-header">
                        <div className="history-title">ราคาย้อนหลัง</div>
                        <div className="history-latest">
                        ข้อมูลล่าสุด : {data.lastUpdate}
                        </div>
                    </header>

                    <div className="history-table-scroll">
                        <table className="history-table stocks-table">
                            <thead>
                                <tr>
                                {/* วันที่ */}
                                <th
                                    className={
                                    "col-history-date sortable " +
                                    (historySortField === "date" ? `is-sorted ${historySortDir}` : "")
                                    }
                                    onClick={() => handleHistorySort("date")}
                                >
                                    <div className="th-inner">
                                    <span className="th-label">วันที่</span>
                                    <span
                                        className={
                                        "sort-icon " +
                                        (historySortField === "date" ? `is-${historySortDir}` : "")
                                        }
                                    />
                                    </div>
                                </th>

                                {/* ราคาปิด */}
                                <th
                                    className={
                                    "sortable " +
                                    (historySortField === "close" ? `is-sorted ${historySortDir}` : "")
                                    }
                                    onClick={() => handleHistorySort("close")}
                                >
                                    <div className="th-inner">
                                    <span className="th-label">ราคาปิด</span>
                                    <span
                                        className={
                                        "sort-icon " +
                                        (historySortField === "close" ? `is-${historySortDir}` : "")
                                        }
                                    />
                                    </div>
                                </th>

                                {/* ราคาสูงสุด */}
                                <th
                                    className={
                                    "sortable " +
                                    (historySortField === "high" ? `is-sorted ${historySortDir}` : "")
                                    }
                                    onClick={() => handleHistorySort("high")}
                                >
                                    <div className="th-inner">
                                    <span className="th-label">ราคาสูงสุด</span>
                                    <span
                                        className={
                                        "sort-icon " +
                                        (historySortField === "high" ? `is-${historySortDir}` : "")
                                        }
                                    />
                                    </div>
                                </th>

                                {/* ราคาต่ำสุด */}
                                <th
                                    className={
                                    "sortable " +
                                    (historySortField === "low" ? `is-sorted ${historySortDir}` : "")
                                    }
                                    onClick={() => handleHistorySort("low")}
                                >
                                    <div className="th-inner">
                                    <span className="th-label">ราคาต่ำสุด</span>
                                    <span
                                        className={
                                        "sort-icon " +
                                        (historySortField === "low" ? `is-${historySortDir}` : "")
                                        }
                                    />
                                    </div>
                                </th>

                                {/* ราคาเปิด */}
                                <th
                                    className={
                                    "sortable " +
                                    (historySortField === "open" ? `is-sorted ${historySortDir}` : "")
                                    }
                                    onClick={() => handleHistorySort("open")}
                                >
                                    <div className="th-inner">
                                    <span className="th-label">ราคาเปิด</span>
                                    <span
                                        className={
                                        "sort-icon " +
                                        (historySortField === "open" ? `is-${historySortDir}` : "")
                                        }
                                    />
                                    </div>
                                </th>

                                {/* เปลี่ยนแปลง */}
                                <th
                                    className={
                                    "sortable " +
                                    (historySortField === "change" ? `is-sorted ${historySortDir}` : "")
                                    }
                                    onClick={() => handleHistorySort("change")}
                                >
                                    <div className="th-inner">
                                    <span className="th-label">เปลี่ยนแปลง</span>
                                    <span
                                        className={
                                        "sort-icon " +
                                        (historySortField === "change" ? `is-${historySortDir}` : "")
                                        }
                                    />
                                    </div>
                                </th>

                                {/* % เปลี่ยนแปลง */}
                                <th
                                    className={
                                    "sortable " +
                                    (historySortField === "changePct" ? `is-sorted ${historySortDir}` : "")
                                    }
                                    onClick={() => handleHistorySort("changePct")}
                                >
                                    <div className="th-inner">
                                    <span className="th-label">% เปลี่ยนแปลง</span>
                                    <span
                                        className={
                                        "sort-icon " +
                                        (historySortField === "changePct" ? `is-${historySortDir}` : "")
                                        }
                                    />
                                    </div>
                                </th>

                                {/* ปริมาณ (หุ้น) */}
                                <th
                                    className={
                                    "sortable " +
                                    (historySortField === "volume" ? `is-sorted ${historySortDir}` : "")
                                    }
                                    onClick={() => handleHistorySort("volume")}
                                >
                                    <div className="th-inner">
                                    <span className="th-label">ปริมาณ (หุ้น)</span>
                                    <span
                                        className={
                                        "sort-icon " +
                                        (historySortField === "volume" ? `is-${historySortDir}` : "")
                                        }
                                    />
                                    </div>
                                </th>

                                {/* มูลค่า (‘000 บาท) */}
                                <th
                                    className={
                                    "sortable " +
                                    (historySortField === "value" ? `is-sorted ${historySortDir}` : "")
                                    }
                                    onClick={() => handleHistorySort("value")}
                                >
                                    <div className="th-inner">
                                    <span className="th-label">มูลค่า (‘000 บาท)</span>
                                    <span
                                        className={
                                        "sort-icon " +
                                        (historySortField === "value" ? `is-${historySortDir}` : "")
                                        }
                                    />
                                    </div>
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                            {sortedHistory.map((row, idx) => (
                                <tr key={idx}>
                                <td>{row.date}</td>
                                <td>{row.close.toFixed(2)}</td>
                                <td>{row.high.toFixed(2)}</td>
                                <td>{row.low.toFixed(2)}</td>
                                <td>{row.open.toFixed(2)}</td>
                                <td className={row.change >= 0 ? "text-up" : "text-down"}>
                                    {row.change > 0 ? "+" : ""}
                                    {row.change.toFixed(2)}
                                </td>
                                <td className={row.changePct >= 0 ? "text-up" : "text-down"}>
                                    {row.changePct > 0 ? "+" : ""}
                                    {row.changePct.toFixed(2)}
                                </td>
                                <td>{row.volume.toLocaleString("th-TH")}</td>
                                <td>
                                    {row.value.toLocaleString("th-TH", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                    })}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <footer className="history-footer">
                        <span>ข้อมูลราคาย้อนหลัง 6 เดือน</span>

                        <div className="history-footer-right">
                        <div className="history-rows-control">
                            แสดง
                            <select className="history-rows-select">
                            <option>20</option>
                            <option>50</option>
                            <option>100</option>
                            </select>
                            รายการ
                        </div>

                        <div className="history-pagination">
                            <span>หน้า 1</span>
                            <button className="history-page-btn" disabled>
                            ‹
                            </button>
                            <button className="history-page-btn">›</button>
                        </div>
                        </div>
                    </footer>
                    </article>
                </section>
                )}

                {activeTab === "finance" && (
                    <section className="fin-wrapper">

                        {/* ===== FILTER ===== */}
                        <div className="fin-filter-row">
                            <div className="fin-filter-text">ตัวกรอง</div>

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

                        <div className="fin-grid">

                            {/* ============= LEFT SIDE (CARDS + CHARTS) ============= */}
                            <div className="fin-left">

                                {/* ===== Summary Cards ===== */}
                                <div className="fin-card-row">
                                    <div className="fin-small-card green">
                                        <h4>สินทรัพย์รวม</h4>
                                        <p>{(d.asset / 1e6).toFixed(2)}M</p>
                                    </div>

                                    <div className="fin-small-card blue">
                                        <h4>รายได้รวม</h4>
                                        <p>{(d.revenue / 1e6).toFixed(2)}M</p>
                                    </div>

                                    <div className="fin-small-card yellow">
                                        <h4>กำไรสุทธิ</h4>
                                        <p>{(d.netProfit / 1e6).toFixed(2)}M</p>
                                    </div>

                                    <div className="fin-small-card purple">
                                        <h4>ROE (%)</h4>
                                        <p>{d.roe}%</p>
                                    </div>
                                </div>

                                {/* ===== Chart placeholders ===== */}
                                <div className="fin-chart-card">
                                    <h3>รายได้ & กำไรสุทธิ</h3>
                                    <div className="fin-chart-placeholder">[ กราฟรายได้ / กำไรสุทธิ ]</div>
                                </div>

                                <div className="fin-chart-card">
                                    <h3>ROA / ROE / Margin</h3>
                                    <div className="fin-chart-placeholder">[ กราฟ ROA / ROE / Margin ]</div>
                                </div>
                            </div>

                            {/* ===== RIGHT SIDE: FINANCE SUMMARY TABLE ===== */}
                            <div className="fin-right">
                                <div className="fin-card fin-summary-card">
                                    <h3 className="fin-card-title">ข้อมูลการเงินปี {year}</h3>

                                    <div className="fin-summary-grid">

                                        {/* -------- บัญชีทางการเงินที่สำคัญ -------- */}
                                        <div className="fin-summary-section">บัญชีทางการเงินที่สำคัญ</div>

                                        <div className="fin-sum-row"><span>สินทรัพย์รวม</span><span>{d.asset}</span></div>
                                        <div className="fin-sum-row"><span>หนี้สินรวม</span><span>{d.debt}</span></div>
                                        <div className="fin-sum-row"><span>ส่วนของผู้ถือหุ้น</span><span>{d.equity}</span></div>
                                        <div className="fin-sum-row"><span>มูลค่าหุ้นที่เรียกชำระแล้ว</span><span>{d.parPaid}</span></div>
                                        <div className="fin-sum-row"><span>รายได้รวม</span><span>{d.revenue}</span></div>
                                        <div className="fin-sum-row"><span>กำไร (ขาดทุน) อื่น</span><span>{d.otherProfit}</span></div>
                                        <div className="fin-sum-row"><span>กำไรสุทธิ</span><span>{d.netProfit}</span></div>
                                        <div className="fin-sum-row"><span>กำไรต่อหุ้น (บาท)</span><span>{d.eps}</span></div>

                                        {/* -------- อัตราส่วนทางการเงิน -------- */}
                                        <div className="fin-summary-section">อัตราส่วนทางการเงินที่สำคัญ</div>

                                        <div className="fin-sum-row"><span>ROA (%)</span><span>{d.roa}</span></div>
                                        <div className="fin-sum-row"><span>ROE (%)</span><span>{d.roe}</span></div>
                                        <div className="fin-sum-row"><span>อัตรากำไรสุทธิ (%)</span><span>{d.margin}</span></div>

                                        {/* -------- ราคา + Market -------- */}
                                        <div className="fin-summary-section">ข้อมูลราคา</div>

                                        <div className="fin-sum-row"><span>ราคาล่าสุด (บาท)</span><span>{d.lastPrice}</span></div>
                                        <div className="fin-sum-row"><span>มูลค่าหลักทรัพย์ตามราคาตลาด</span><span>{d.marketCap}</span></div>

                                        {/* -------- การลงทุน -------- */}
                                        <div className="fin-summary-section">ข้อมูลการลงทุน</div>

                                        <div className="fin-sum-row"><span>P/E (เท่า)</span><span>{d.pe}</span></div>
                                        <div className="fin-sum-row"><span>P/BV (เท่า)</span><span>{d.pbv}</span></div>
                                        <div className="fin-sum-row"><span>Book Value (บาท)</span><span>{d.bookValue}</span></div>
                                        <div className="fin-sum-row"><span>Dividend Yield (%)</span><span>{d.dividendYield}</span></div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                )}

                {/* ======= TAB: ข้อมูลผู้ถือหุ้น ======= */}
                {activeTab === "holders" && (
                    <section className="detail-holders-section">
                        {/* แถวบน: สรุปจำนวนผู้ถือหุ้น / Free Float / หุ้นที่ออก */}
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
                                <div className="holders-kpi-value">
                                    {holdersSummary.freeFloat.toFixed(2)}%
                                </div>
                                <div className="holders-kpi-sub">หุ้นที่ซื้อขายได้</div>
                            </article>

                            <article className="detail-card holders-kpi-card">
                                <div className="holders-kpi-label">หุ้นที่ออก</div>
                                <div className="holders-kpi-value">
                                    {holdersSummary.listedShares}
                                </div>
                                <div className="holders-kpi-sub">หน่วย</div>
                            </article>
                        </div>

                        {/* แถวกลาง: ซ้าย Pie / ขวา Top 5 */}
                        <div className="holders-main-grid">
                            {/* ซ้าย: โครงสร้างผู้ถือหุ้น (pie + legend) */}
                            <article className="detail-card holders-plain-card">
                                <header className="holders-plain-header">
                                    <h3 className="holders-plain-title">โครงสร้างผู้ถือหุ้น</h3>
                                </header>

                                <div className="holders-plain-body">
                                    <div className="holders-plain-placeholder">
                                        [ พื้นที่สำหรับกราฟโครงสร้างผู้ถือหุ้น ]
                                    </div>
                                </div>
                            </article>

                            {/* ขวา: ผู้ถือหุ้นรายใหญ่ 5 อันดับแรก */}
                            <article className="detail-card holders-top5-card">
                                <header className="holders-card-header">
                                    <h3 className="holders-card-title">
                                        ผู้ถือหุ้นรายใหญ่ 5 อันดับแรก
                                    </h3>
                                </header>

                                <ul className="holders-top5-list">
                                    {majorHolders.map((h) => (
                                        <li
                                            key={h.id}
                                            className={`holders-top5-item holders-top5-item--${h.color}`}
                                        >
                                            <div className="holders-top5-main">
                                                <div className="holders-rank-badge">
                                                    <span>{h.id}</span>
                                                </div>
                                                <div className="holders-top5-text">
                                                    <div className="holders-top5-name">{h.name}</div>
                                                    <div className="holders-top5-shares">
                                                        {h.sharesText}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="holders-top5-meta">
                                                <div className="holders-top5-bar">
                                                    <div
                                                        className="holders-top5-bar-fill"
                                                        style={{ width: `${h.percent}%` }}
                                                    />
                                                </div>
                                                <div className="holders-top5-percent">
                                                    {h.percent.toFixed(2)}%
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        </div>

                        {/* แถวล่าง: รายชื่อผู้ถือหุ้นทั้งหมด (แบบสองคอลัมน์) */}
                        <article className="detail-card holders-list-card">
                            <header className="holders-card-header holders-list-header">
                                <h3 className="holders-card-title">
                                    รายชื่อผู้ถือหุ้นทั้งหมด
                                </h3>
                            </header>

                            <div className="holders-list-grid">
                                <div className="holders-list-col">
                                    {/* 1 */}
                                    <div className="holders-list-row">
                                        <div className="holders-rank-badge holders-rank-badge--teal">
                                            <span>1</span>
                                        </div>
                                        <div className="holders-list-name">
                                            กระทรวงการคลัง
                                        </div>
                                        <span className="holders-chip">
                                            51.11%
                                        </span>
                                    </div>

                                    {/* 3 */}
                                    <div className="holders-list-row">
                                        <div className="holders-rank-badge holders-rank-badge--orange">
                                            <span>3</span>
                                        </div>
                                        <div className="holders-list-name">
                                            นักลงทุนสถาบันต่างประเทศ
                                        </div>
                                        <span className="holders-chip">
                                            8.84%
                                        </span>
                                    </div>

                                    {/* 5 */}
                                    <div className="holders-list-row">
                                        <div className="holders-rank-badge holders-rank-badge--red">
                                            <span>5</span>
                                        </div>
                                        <div className="holders-list-name">
                                            ผู้ถือหุ้นรายย่อย
                                        </div>
                                        <span className="holders-chip">
                                            20.44%
                                        </span>
                                    </div>
                                </div>

                                <div className="holders-list-col">
                                    {/* 2 */}
                                    <div className="holders-list-row">
                                        <div className="holders-rank-badge holders-rank-badge--blue">
                                            <span>2</span>
                                        </div>
                                        <div className="holders-list-name">
                                            บริษัท ไทยเอ็นวีดีอาร์
                                        </div>
                                        <span className="holders-chip">
                                            11.74%
                                        </span>
                                    </div>

                                    {/* 4 */}
                                    <div className="holders-list-row">
                                        <div className="holders-rank-badge holders-rank-badge--purple">
                                            <span>4</span>
                                        </div>
                                        <div className="holders-list-name">
                                            กองทุนรวม LTF/RMF
                                        </div>
                                        <span className="holders-chip">
                                            7.87%
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </article>
                    </section>
                )}

            </section>
        </>
    );
}