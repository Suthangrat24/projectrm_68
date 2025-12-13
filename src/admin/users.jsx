import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/admin_css/users.css";

export default function Users() {
  const users = [
    { name: "สมชาย ใจดี", email: "somchai@email.com", date: "15/11/2567", risk: "กลาง" },
    { name: "สมนัญจ์ รักดี", email: "somying@email.com", date: "18/11/2567", risk: "ต่ำ" },
    { name: "ประยุทธ์ มั่นคง", email: "prayut@email.com", date: "20/11/2567", risk: "สูง" },
    { name: "นภา ศรีสุข", email: "napa@email.com", date: "22/11/2567", risk: "กลาง" },
    { name: "วิชัย เจริญ", email: "wichai@email.com", date: "25/11/2567", risk: "ต่ำ" },
    { name: "สุดา มีสุข", email: "suda@email.com", date: "28/11/2567", risk: "สูง" },
  ];

    const handleDelete = (name) => {
        Swal.fire({
        title: "ต้องการลบผู้ใช้นี้หรือไม่?",
        text: `ผู้ใช้: ${name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "ลบข้อมูล",
        cancelButtonText: "ยกเลิก",
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: "ลบสำเร็จ",
            text: "ข้อมูลผู้ใช้ถูกลบออกจากระบบแล้ว",
            icon: "success",
            confirmButtonColor: "#2563EB",
            });
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
                <input type="text" placeholder="ค้นหาชื่อหรืออีเมล..." />
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
                    <th>ชื่อ</th>
                    <th>อีเมล</th>
                    <th>วันที่สมัคร</th>
                    <th>ระดับความเสี่ยง</th>
                    <th style={{ width: "120px", textAlign: "center" }}>การจัดการ</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u, index) => (
                    <tr key={u.id}>
                        <td>{index + 1}</td>

                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.date}</td>

                        <td>
                            <span className={`risk-badge ${
                                u.risk === "ต่ำ" ? "low" :
                                u.risk === "กลาง" ? "mid" :
                                "high"
                            }`}>
                                {u.risk}
                            </span>
                        </td>

                        {/* ไอคอนจัดการ */}
                        <td>
                        <div className="actions">
                            <Link to="/admin/user/detail">
                                <img src="/pics/admin_pics/view.png" className="action-icon" />
                            </Link>
                            <Link to="/admin/user/edit">
                                <img src="/pics/admin_pics/edit.png" className="action-icon" />
                            </Link>
                            <img src="/pics/delete.png" className="action-icon delete" onClick={() => handleDelete(u.name)} />
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
