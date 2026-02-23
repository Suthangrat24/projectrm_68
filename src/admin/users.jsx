import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getdataUsers, deleteUser } from "../fetchapi/call_api_admin";
import Swal from "sweetalert2";
import "../css/admin_css/users.css";

export default function Users() {
    
    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {

                const res = await getdataUsers();
                console.log("res data users: ", res);
                setData(res.data);

            } catch (err) {
                console.error("Error loading data:", err);
            }
        }

        fetchData();
    }, []);

    const [sortCol, setSortCol] = useState("date");
    const [sortDir, setSortDir] = useState("desc");

    const handleSort = (col) => {
        if (sortCol === col) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortCol(col);
            setSortDir("asc");
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortCol) return 0;

        let A, B;

        switch (sortCol) {
            case "name":
                A = `${a.first_name} ${a.last_name}`;
                B = `${b.first_name} ${b.last_name}`;
                break;

            case "email":
                A = a.email;
                B = b.email;
                break;

            case "date":
                A = new Date(a.created_at);
                B = new Date(b.created_at);
                break;

            case "risk":
                A = a.level_name || "";
                B = b.level_name || "";
                break;

            default:
                return 0;
        }

        if (A < B) return sortDir === "asc" ? -1 : 1;
        if (A > B) return sortDir === "asc" ? 1 : -1;
        return 0;
    });
    
    const [keyword, setKeyword] = useState("");

    const filteredData = sortedData.filter((u) => {
        if (!keyword) return true;
        const k = keyword.toLowerCase();
        return (
            `${u.first_name} ${u.last_name}`.toLowerCase().includes(k) ||
            u.email.toLowerCase().includes(k)
        );
    });

    const handleDelete = (user_id, name) => {
        Swal.fire({
            title: "ต้องการลบผู้ใช้นี้หรือไม่?",
            text: `ผู้ใช้: ${name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ลบข้อมูล",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser(user_id);

                    Swal.fire({
                        title: "ลบสำเร็จ",
                        icon: "success",
                        confirmButtonColor: "#2563EB",
                    });

                    // 🔥 เอา user ออกจาก state ทันที (ไม่ต้อง reload)
                    setData(prev => prev.filter(u => u.user_id !== user_id));

                } catch (err) {
                    Swal.fire("ผิดพลาด", "ไม่สามารถลบผู้ใช้ได้", "error");
                }
            }
        });
    };

    return (
        <>
            <div className="admin-users-page">

                <div className="users-header">
                    <div className="users-header-left">
                        <h2 className="page-title">จัดการผู้ใช้งาน</h2>
                        <p className="page-sub">รายชื่อผู้ใช้งานทั้งหมดในระบบ</p>
                    </div>

                    <Link to="/admin/user/add" className="add-btn">
                        + เพิ่มผู้ใช้งาน
                    </Link>
                </div>

                <div className="users-search-bar">
                    <div className="search-box">
                        <img src="/pics/search.png" className="search-icon" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อหรืออีเมล..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    <div className="filter-box">
                        <img src="/pics/filter.png" className="filter-icon" />
                        <select>
                        <option>ทั้งหมด</option>
                        <option>ระดับความเสี่ยงต่ำ</option>
                        <option>ระดับความเสี่ยงกลาง</option>
                        <option>ระดับความเสี่ยงสูง</option>
                        </select>
                    </div>
                </div>

                <div className="users-table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th style={{ width: "60px" }}>ลำดับ</th>

                                <th
                                    className={`sortable ${sortCol === "name" ? "is-sorted" : ""}`}
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="th-inner">
                                        <span className="th-label">ชื่อ</span>
                                        <span
                                            className={`sort-icon ${
                                                sortCol === "name"
                                                    ? sortDir === "asc"
                                                        ? "is-asc"
                                                        : "is-desc"
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                </th>

                                <th
                                    className={`sortable ${sortCol === "email" ? "is-sorted" : ""}`}
                                    onClick={() => handleSort("email")}
                                >
                                    <div className="th-inner">
                                        <span className="th-label">อีเมล</span>
                                        <span
                                            className={`sort-icon ${
                                                sortCol === "email"
                                                    ? sortDir === "asc"
                                                        ? "is-asc"
                                                        : "is-desc"
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                </th>

                                <th
                                    className={`sortable ${sortCol === "date" ? "is-sorted" : ""}`}
                                    onClick={() => handleSort("date")}
                                >
                                    <div className="th-inner">
                                        <span className="th-label">วันที่สมัคร</span>
                                        <span
                                            className={`sort-icon ${
                                                sortCol === "date"
                                                    ? sortDir === "asc"
                                                        ? "is-asc"
                                                        : "is-desc"
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                </th>

                                <th
                                    className={`sortable ${sortCol === "risk" ? "is-sorted" : ""}`}
                                    onClick={() => handleSort("risk")}
                                >
                                    <div className="th-inner">
                                        <span className="th-label">ระดับความเสี่ยง</span>
                                        <span
                                            className={`sort-icon ${
                                                sortCol === "risk"
                                                    ? sortDir === "asc"
                                                        ? "is-asc"
                                                        : "is-desc"
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                </th>

                                <th style={{ width: "120px", textAlign: "center" }}>การจัดการ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.map((u, index) => (
                                <tr key={u.id}>
                                    <td>{index + 1}</td>

                                    <td>{u.first_name} {u.last_name}</td>
                                    <td>{u.email}</td>
                                    <td>{new Date(u.created_at).toLocaleString("th-TH")}</td>

                                    <td>
                                        {/* {u.level_name ? ( */}
                                            <span
                                            className={`risk-user-badge ${
                                                u.level_name === "ตํ่า"
                                                ? "low"
                                                : u.level_name === "ปานกลาง"
                                                ? "mid"
                                                : u.level_name === "ปานกลาง"
                                                ? "high"
                                                : "none"
                                            }`}
                                            >
                                            {u.level_name ? ( u.level_name ) : ( "ไม่มีข้อมูล" )}
                                            </span>
                                        {/* ) : (
                                            <span>-</span>
                                        )} */}
                                    </td>

                                    {/* ไอคอนจัดการ */}
                                    <td>
                                        <div className="actions">
                                            <Link to={`/admin/user/${u.user_id}/detail`}>
                                                <img src="/pics/admin_pics/view.png" className="action-icon" />
                                            </Link>
                                            <Link to={`/admin/user/${u.user_id}/edit`}>
                                                <img src="/pics/admin_pics/edit.png" className="action-icon" />
                                            </Link>
                                            <img src="/pics/delete.png" className="action-icon delete" onClick={() => handleDelete(u.user_id, `${u.first_name} ${u.last_name}`)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="users-footer">

                        {/* Left side */}
                        <div className="footer-left">
                            <span>แสดง</span>

                            <select className="rows-select" defaultValue={10}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                            </select>

                            <span>รายการ</span>
                        </div>

                        {/* Right side */}
                        <div className="footer-right">
                            <span>หน้า 1</span>

                            <button className="page-circle" disabled>
                                <img src="/pics/left.png" className="circle-icon" />
                            </button>

                            <button className="page-circle">
                                <img src="/pics/right.png" className="circle-icon" />
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}
