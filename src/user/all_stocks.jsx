import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../css/allstocks.css";

export default function AllStocks() {

    const navigate = useNavigate(); 

    const MOCK_STOCKS = [
        {
            symbol: "24CS",
            name: "บริษัท ทเวนตี้ โฟร์ คอน แอนด์ ซัพพลาย จำกัด (มหาชน)",
            market: "mai",
            sector: "PROPCON",
            industry: "-",
        },
        {
            symbol: "2S",
            name: "บริษัท 2 เอส เมทัล จำกัด (มหาชน)",
            market: "SET",
            sector: "INDUS",
            industry: "STEEL",
        },
        {
            symbol: "3BBIF",
            name: "กองทุนรวมโครงสร้างพื้นฐานบรอดแบนด์อินเทอร์เน็ต จัสมิน",
            market: "SET",
            sector: "TECH",
            industry: "ICT",
        },
        {
            symbol: "A",
            name: "บริษัท อริยะ พร็อพเพอร์ตี้ จำกัด (มหาชน)",
            market: "SET",
            sector: "PROPCON",
            industry: "PROP",
        },
        {
            symbol: "A5",
            name: "บริษัท แอสเซท ไฟว์ กรุ๊ป จำกัด (มหาชน)",
            market: "SET",
            sector: "PROPCON",
            industry: "PROP",
        },
    ];

    // ===== state สำหรับ sort =====
    const [sortField, setSortField] = useState("symbol"); // column ที่ใช้ sort
    const [sortDir, setSortDir] = useState("asc");        // 'asc' | 'desc'

    const sortedStocks = useMemo(() => {
        const data = [...MOCK_STOCKS];

        data.sort((a, b) => {
        const av = String(a[sortField] ?? "");
        const bv = String(b[sortField] ?? "");

        // ใช้ localeCompare ให้รองรับไทย
        const cmp = av.localeCompare(bv, "th-TH", { sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
        });

        return data;
    }, [sortField, sortDir]);

    const handleSort = (field) => {
        if (sortField === field) {
        // ถ้าคลิกซ้ำคอลัมน์เดิม -> toggle asc/desc
        setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
        setSortField(field);
        setSortDir("asc");
        }
    };

    return (
        <>
            <section className="stocks-hero">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <p className="hero-eyebrow">ข้อมูลชื่อย่อ</p>
                    <h1 className="hero-title">หุ้นไทยทั้งหมด</h1>
                </div>
            </section>

            {/* ===== Filter ===== */}
            <section className="stocks-filter-section">
                <div className="stocks-filter-shell">
                    <div className="stocks-filter-card">
                        <div className="stocks-filter-header">
                        {/* ตรงนี้เดี๋ยวค่อยเอา img filter.png มาใส่แทน background ก็ได้ */}
                        <div className="filter-icon-wrap">
                            <img src="/pics/filter.png" alt="filter" className="filter-icon" />
                        </div>
                        <span className="stocks-filter-title">ค้นหาและกรองข้อมูล</span>
                        </div>

                        <div className="stocks-filter-row">
                        {/* ค้นหาตามชื่อย่อ / ชื่อเต็ม */}
                        <div className="filter-item grow">
                            <input
                            type="text"
                            className="filter-input"
                            placeholder="ใส่ชื่อย่อหลักทรัพย์ / ชื่อเต็มหลักทรัพย์"
                            />
                        </div>

                        {/* กลุ่มอุตสาหกรรม / หมวดธุรกิจ */}
                        <div className="filter-item">
                            <div className="filter-selectcard">
                                <span className="filter-select-caption">
                                    กลุ่มอุตสาหกรรม / หมวดธุรกิจ
                                </span>

                                <div className="filter-select-wrapper">
                                    <select
                                        className="filter-select-native"
                                        defaultValue="all"
                                    >
                                        <option value="all">ทั้งหมด</option>
                                        <option value="SET">SET</option>
                                        <option value="mai">MAI</option>
                                    </select>

                                    {/* เว้นที่ไว้สำหรับ icon ลูกศร (drop-down.png) */}
                                    <img src="/pics/drop-down.png" alt="drop-down" className="filter-select-arrow" />
                                </div>
                            </div>
                        </div>

                        {/* ปุ่มค้นหา / ล้างตัวกรอง */}
                        <div className="filter-item buttons">
                            <button className="btn-search">ค้นหา</button>
                            <button className="btn-reset">ล้างตัวกรอง</button>
                        </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Table */}
            <section className="stocks-table-section">
                <div className="stocks-table-wrapper">
                <div className="stocks-result-text">
                    ผลลัพธ์การค้นหา {sortedStocks.length} รายการ
                </div>

                <div className="table-scroll">
                    <table className="stocks-table">
                    <thead>
                        <tr>
                            {/* 1) ชื่อย่อหลักทรัพย์ */}
                            <th
                            className={
                                "col-symbol sortable " +
                                (sortField === "symbol" ? `is-sorted ${sortDir}` : "")
                            }
                            onClick={() => handleSort("symbol")}
                            >
                            <div className="th-inner">
                                <span className="th-label">ชื่อย่อหลักทรัพย์</span>
                                <span
                                className={
                                    "sort-icon " +
                                    (sortField === "symbol" ? `is-${sortDir}` : "")
                                }
                                />
                            </div>
                            </th>

                            {/* 2) ชื่อเต็มหลักทรัพย์ */}
                            <th
                            className={
                                "sortable " +
                                (sortField === "name" ? `is-sorted ${sortDir}` : "")
                            }
                            onClick={() => handleSort("name")}
                            >
                            <div className="th-inner">
                                <span className="th-label">ชื่อเต็มหลักทรัพย์</span>
                                <span
                                className={
                                    "sort-icon " +
                                    (sortField === "name" ? `is-${sortDir}` : "")
                                }
                                />
                            </div>
                            </th>

                            {/* 3) ตลาด */}
                            <th
                            className={
                                "col-market sortable " +
                                (sortField === "market" ? `is-sorted ${sortDir}` : "")
                            }
                            onClick={() => handleSort("market")}
                            >
                            <div className="th-inner">
                                <span className="th-label">ตลาด</span>
                                <span
                                className={
                                    "sort-icon " +
                                    (sortField === "market" ? `is-${sortDir}` : "")
                                }
                                />
                            </div>
                            </th>

                            {/* 4) กลุ่มอุตสาหกรรม */}
                            <th
                            className={
                                "sortable " +
                                (sortField === "sector" ? `is-sorted ${sortDir}` : "")
                            }
                            onClick={() => handleSort("sector")}
                            >
                            <div className="th-inner">
                                <span className="th-label">กลุ่มอุตสาหกรรม</span>
                                <span
                                className={
                                    "sort-icon " +
                                    (sortField === "sector" ? `is-${sortDir}` : "")
                                }
                                />
                            </div>
                            </th>

                            {/* 5) หมวดธุรกิจ */}
                            <th
                            className={
                                "sortable " +
                                (sortField === "industry" ? `is-sorted ${sortDir}` : "")
                            }
                            onClick={() => handleSort("industry")}
                            >
                            <div className="th-inner">
                                <span className="th-label">หมวดธุรกิจ</span>
                                <span
                                className={
                                    "sort-icon " +
                                    (sortField === "industry" ? `is-${sortDir}` : "")
                                }
                                />
                            </div>
                            </th>

                            {/* 6) Factsheet – ไม่ sortable */}
                            <th className="col-factsheet">Factsheet</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedStocks.map((s) => (
                        <tr key={s.symbol}>
                            <td className="col-symbol">
                            <span
                            className="badge-symbol"
                            style={{ cursor: "pointer" }}          // มี cursor ให้รู้ว่ากดได้
                            onClick={() => navigate("/detail")}    // เปลี่ยนหน้าไป /detail
                            >
                            {s.symbol}
                            </span>
                            </td>
                            <td>{s.name}</td>
                            <td className="col-market">
                            <span className="badge-market">{s.market}</span>
                            </td>
                            <td>{s.sector}</td>
                            <td>{s.industry}</td>
                            <td className="col-factsheet">
                            <button className="factsheet-btn" title="ดู Factsheet">
                                <span className="factsheet-icon" />
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                {/* footer เดิม */}
                <div className="stocks-table-footer">
                    <div className="rows-control">
                    แสดง
                    <select className="rows-select">
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                    รายการ
                    </div>
                    <div className="pagination">
                    <span>หน้า 1</span>
                    <button className="page-btn" disabled>
                        ‹
                    </button>
                    <button className="page-btn">›</button>
                    </div>
                </div>
                </div>
            </section>
        </>
    );

}