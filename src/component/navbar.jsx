import { NavLink, Link } from "react-router-dom";
import "../css/navbar.css";

export default function Navbar() {
  return (
    <>
      <header className="main-nav">
        <div className="nav-inner">
          {/* ==== ซ้าย: โลโก้ + เมนู ==== */}
          <div className="nav-left">
              <Link to="/" className="nav-logo-wrap">
                  <img src="/pics/logo_test.png" alt="Stockii Logo" className="nav-logo-img" />
              </Link>

            <nav className="nav-menu">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " is-active" : "")
                }
              >
                หน้าแรก
              </NavLink>

              <NavLink
                to="/stocks"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " is-active" : "")
                }
              >
                หุ้นทั้งหมด
              </NavLink>

              <NavLink
                to="/risk-evaluation"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " is-active" : "")
                }
              >
                แนะนำหุ้น
              </NavLink>

              <NavLink
                to="/portfolio"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " is-active" : "")
                }
              >
                พอร์ตของฉัน
              </NavLink>
            </nav>
          </div>

          {/* ==== ขวา: search + user ==== */}
          <div className="nav-right">
            {/* เว้นที่สำหรับ icon search / เดี๋ยวค่อยใส่รูปเองได้ */}
            <div className="nav-search">
              <img src="/pics/search.png" alt="Search Icon" className="nav-search-icon"/>
              <input
                type="text"
                placeholder="ค้นหาหุ้น..."
                className="nav-search-input"
              />
            </div>

            <Link to="/profile" className="nav-user-link">
              <button className="nav-user">
                <div className="nav-avatar">
                  <img src="/pics/marckris.jpg" alt="profile-picture" className="profile-picture" />
                </div>
                <span className="nav-username">โกจิ เบอรี่</span>
              </button>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
