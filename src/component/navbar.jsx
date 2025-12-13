import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import "../css/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="main-nav">
        <div className="nav-inner">

          <div className="nav-left">

            <Link to="/" className="nav-logo-wrap">
              <img src="/pics/logo_test.png" alt="Stockii Logo" className="nav-logo-img" />
            </Link>

            <nav className="nav-menu">
              <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " is-active" : "")}>
                หน้าแรก
              </NavLink>

              <NavLink to="/stocks" className={({ isActive }) => "nav-link" + (isActive ? " is-active" : "")}>
                หุ้นทั้งหมด
              </NavLink>

              <NavLink to="/risk" className={({ isActive }) => "nav-link" + (isActive ? " is-active" : "")}>
                แนะนำหุ้น
              </NavLink>

              <NavLink to="/portfolio" className={({ isActive }) => "nav-link" + (isActive ? " is-active" : "")}>
                พอร์ตของฉัน
              </NavLink>
            </nav>
          </div>

          <div className="nav-right" ref={dropdownRef}>

            <div className="nav-search">
              <img src="/pics/search.png" alt="Search Icon" className="nav-search-icon" />
              <input type="text" placeholder="ค้นหาหุ้น..." className="nav-search-input" />
            </div>

            <button className="nav-user" onClick={() => setOpen(!open)}>
              <div className="nav-avatar">
                <img src="/pics/marckris.jpg" alt="profile" className="profile-picture" />
              </div>
              <span className="nav-username">โกจิ เบอรี่</span>
            </button>

            {open && (
              <div className="user-dropdown">

                <Link
                  to="/profile?tab=info"
                  className="drop-item"
                  onClick={() => setOpen(false)}
                >
                  <img src="/pics/user.png" className="drop-icon" />
                  <span>ข้อมูลส่วนตัว</span>
                </Link>

                <Link
                  to="/profile?tab=risk"
                  className="drop-item"
                  onClick={() => setOpen(false)}
                >
                  <img src="/pics/history.png" className="drop-icon" />
                  <span>ประวัติการประเมิน</span>
                </Link>

                <Link
                  to="/profile?tab=favorite"
                  className="drop-item"
                  onClick={() => setOpen(false)}
                >
                  <img src="/pics/favorite.png" className="drop-icon" />
                  <span>หุ้นรายการโปรด</span>
                </Link>

                <Link
                  to="/profile?tab=settings"
                  className="drop-item"
                  onClick={() => setOpen(false)}
                >
                  <img src="/pics/setting.png" className="drop-icon" />
                  <span>ตั้งค่า</span>
                </Link>

                <div
                  className="drop-item logout"
                  onClick={() => {
                    setOpen(false); // ปิด dropdown ก่อน
                    Swal.fire({
                      title: "ต้องการออกจากระบบ?",
                      text: "คุณจะต้องเข้าสู่ระบบใหม่อีกครั้ง",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "ออกจากระบบ",
                      cancelButtonText: "ยกเลิก",
                      confirmButtonColor: "#ef4444",
                      cancelButtonColor: "#6b7280",
                    }).then((res) => {
                      if (res.isConfirmed) {
                        localStorage.clear();
                        navigate("/login");
                      }
                    });
                  }}
                >
                  <img src="/pics/logout_dropdown.png" className="drop-icon" />
                  <span>ออกจากระบบ</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </header>
    </>
  );
}
