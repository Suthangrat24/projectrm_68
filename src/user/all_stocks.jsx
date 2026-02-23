import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStocks } from "../fetchapi/call_api_user";
import { Pagination } from "antd";
import "antd/dist/reset.css";
import "../css/allstocks.css";

export default function AllStocks() {
    const navigate = useNavigate(); 

    const [stock, setStock] = useState([]);
    
    useEffect(() => {
        async function fetchStock() {
            try {
                const res = await getStocks();
                console.log("res data stock:", res);
                setStock(res.data);
            } catch (err) {
                console.error("Error loading data:", err);
            }
        }
    
        fetchStock();
    }, []);
         

    // ===== state สำหรับ sort =====
    const [sortField, setSortField] = useState("symbol"); // column ที่ใช้ sort
    const [sortDir, setSortDir] = useState("asc");        // 'asc' | 'desc'

    const sortedStocks = useMemo(() => {
        const data = [...stock];

        data.sort((a, b) => {
        const av = String(a[sortField] ?? "");
        const bv = String(b[sortField] ?? "");

        // ใช้ localeCompare ให้รองรับไทย
        const cmp = av.localeCompare(bv, "th-TH", { sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
        });

        return data;
    }, [stock, sortField, sortDir]);

    const handleSort = (field) => {
        if (sortField === field) {
        // ถ้าคลิกซ้ำคอลัมน์เดิม -> toggle asc/desc
        setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
        setSortField(field);
        setSortDir("asc");
        }
    };

    const [keyword, setKeyword] = useState("");
    const [sector, setSector] = useState("all");

    const filteredStocks = sortedStocks.filter((s) => {
        const matchKeyword =
            !keyword ||
            s.symbol.toLowerCase().includes(keyword.toLowerCase()) ||
            s.stock_name.toLowerCase().includes(keyword.toLowerCase());

        const matchSector =
            sector === "all" || s.market_type_name === sector;

        return matchKeyword && matchSector;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const paginatedStocks = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredStocks.slice(start, end);
    }, [filteredStocks, currentPage, pageSize]);

    return (
        <>
            <section className="stocks-hero">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <p className="hero-desc">ข้อมูลชื่อย่อ</p>
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
                            <div className="filter-item grow">
                                <input
                                    className="filter-input"
                                    placeholder="ใส่ชื่อย่อหลักทรัพย์ / ชื่อเต็มหลักทรัพย์"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>

                            <div className="filter-item">
                                <span className="filter-select-caption">กลุ่มอุตสาหกรรม / หมวดธุรกิจ</span>

                                <div className="filter-select-wrapper">
                                    <select
                                        className="filter-select-native"
                                        value={sector}
                                        onChange={(e) => setSector(e.target.value)}
                                    >
                                        <option value="all">ทั้งหมด</option>
                                        <option value="SET">SET</option>
                                        <option value="mai">MAI</option>
                                    </select>

                                    <img src="/pics/drop-down.png" alt="drop-down" className="filter-select-arrow" />
                                </div>
                            </div>

                            <div className="filter-item buttons">
                                <button className="btn-search">
                                    <img src="/pics/search_white.png" className="btn-icon" />
                                    ค้นหา
                                </button>

                                <button className="btn-reset">
                                    <img src="/pics/clear_filter.png" className="btn-icon" />
                                    ล้างตัวกรอง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Table */}
            <section className="stocks-table-section">
                <div className="stocks-table-wrapper">
                <div className="stocks-result-text">
                    ผลลัพธ์การค้นหา {filteredStocks.length} รายการ
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
                            onClick={() => handleSort("stock_name")}
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
                                (sortField === "industry" ? `is-sorted ${sortDir}` : "")
                            }
                            onClick={() => handleSort("industry")}
                            >
                            <div className="th-inner">
                                <span className="th-label">กลุ่มอุตสาหกรรม</span>
                                <span
                                className={
                                    "sort-icon " +
                                    (sortField === "industry" ? `is-${sortDir}` : "")
                                }
                                />
                            </div>
                            </th>

                            {/* 5) หมวดธุรกิจ */}
                            <th
                            className={
                                "sortable " +
                                (sortField === "sector" ? `is-sorted ${sortDir}` : "")
                            }
                            onClick={() => handleSort("sector")}
                            >
                            <div className="th-inner">
                                <span className="th-label">หมวดธุรกิจ</span>
                                <span
                                className={
                                    "sort-icon " +
                                    (sortField === "sector" ? `is-${sortDir}` : "")
                                }
                                />
                            </div>
                            </th>

                            {/* 6) Factsheet – ไม่ sortable */}
                            <th className="col-factsheet">Factsheet</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedStocks.map((s) => (
                        <tr key={s.symbol}>
                            <td className="col-symbol">
                            <span
                            className="badge-symbol"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/${s.symbol}/detail`)}
                            >
                            {s.symbol}
                            </span>
                            </td>
                            <td>{s.stock_name}</td>
                            <td>
                                <span className={`badge-market market-${s.market_type_name?.toLowerCase() || ""}`}>
                                    {s.market_type_name}
                                </span>
                            </td>
                            <td>{s.industry_group_symbol}</td>
                            <td>{s.sector_symbol}</td>
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

                    <div className="stocks-table-footer" style={{ marginTop: 24, textAlign: "right" }}>
                        <Pagination
                            total={filteredStocks.length}
                            current={currentPage}
                            pageSize={pageSize}
                            showSizeChanger
                            pageSizeOptions={["20", "50", "100"]}
                            onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                            }}
                            showTotal={(total, range) =>
                            `${range[0]}-${range[1]} จาก ${total} รายการ`
                            }
                        />
                    </div>
                </div>
            </section>
        </>
    );

}