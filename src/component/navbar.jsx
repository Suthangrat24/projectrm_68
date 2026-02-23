import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { getUserById, getStocks } from "../fetchapi/call_api_user";
import Swal from "sweetalert2";
import "../css/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const location = useLocation();

  /* ===== USER ===== */
  const user_id = "01b9d117-f56d-4884-a617-26b2e3177cf4";
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // เช็คสถานะการล็อกอิน

  /* ===== SEARCH ===== */
  const [stocks, setStocks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  /* ------------------ LOAD USER ------------------ */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);  // ถ้ามี token ให้ถือว่า logged in
    } else {
      setIsLoggedIn(false);  // ถ้าไม่มี token ก็คือไม่ได้ล็อกอิน
    }

    if (isLoggedIn) {
      async function loadUser() {
        try {
          const data = await getUserById(user_id);
          setUser(data);
        } catch (err) {
          console.error("โหลดข้อมูลผู้ใช้ล้มเหลว", err);
        }
      }
      loadUser();
    }
  }, [user_id, isLoggedIn]);

  /* ------------------ LOAD STOCKS ------------------ */
  useEffect(() => {
    async function loadStocks() {
      try {
        const res = await getStocks();
        setStocks(res.data || []);
      } catch (err) {
        console.error("โหลด stock ล้มเหลว", err);
      }
    }
    loadStocks();
  }, []);

  /* ------------------ CLICK OUTSIDE ------------------ */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ------------------ FILTER SEARCH ------------------ */
  const filteredStocks = stocks
    .filter(
      (s) =>
        keyword &&
        (s.symbol?.toLowerCase().includes(keyword.toLowerCase()) ||
          s.stock_name?.toLowerCase().includes(keyword.toLowerCase()))
    )
    .slice(0, 5);

  return (
    <header className="main-nav">
      <div className="nav-inner">

        {/* ===== LEFT ===== */}
        <div className="nav-left">
          <Link to="/" className="nav-logo-wrap">
            <img src="/pics/logo_test.png" className="nav-logo-img" />
          </Link>

          <nav className="nav-menu">
            <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive || location.pathname === "/" ? " is-active" : "")}>
              หน้าแรก
            </NavLink>
            <NavLink to="/stocks" className={({ isActive }) => "nav-link" + (location.pathname.includes('/stocks') ? " is-active" : "")}>
              หุ้นทั้งหมด
            </NavLink>
            <NavLink to="/risk" className={({ isActive }) => "nav-link" + (location.pathname.includes('/risk') ? " is-active" : "")}>
              แนะนำหุ้น
            </NavLink>
            <NavLink to="/portfolio" className={({ isActive }) => "nav-link" + (location.pathname.includes('/portfolio') ? " is-active" : "")}>
              พอร์ตของฉัน
            </NavLink>
          </nav>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="nav-right" ref={dropdownRef}>

          {/* 🔥 SEARCH WRAPPER (สำคัญมาก) */}
          <div className="nav-search-wrapper">
            <div className="nav-search">
              <img src="/pics/search.png" className="nav-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาหุ้น..."
                className="nav-search-input"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
              />
            </div>

            {showSearch && keyword && (
              <div className="nav-search-dropdown">
                {filteredStocks.length === 0 && (
                  <div className="search-empty">ไม่พบข้อมูล</div>
                )}

                {filteredStocks.map((s) => (
                  <div
                    key={s.symbol}
                    className="search-item"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigate(`/${s.symbol}/detail`);
                      setShowSearch(false);
                      setKeyword("");
                    }}
                  >
                    <div>
                      <div className="search-symbol">{s.symbol}</div>
                      <div className="search-name">{s.stock_name}</div>
                    </div>
                    {s.last_price && (
                      <div className="search-price">{s.last_price} ฿</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== USER ===== */}
          {isLoggedIn ? (
            <button className="nav-user" onClick={() => navigate(`/profile/${user_id}`)}>
              <div className="nav-avatar">
                <img src={user?.photo_path || "/pics/default.png"} className="profile-picture" />
              </div>
              <span className="nav-username">
                {user?.first_name} {user?.last_name}
                <img
                  src="/pics/drop-down.png"
                  className="dropdown-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                  }}
                />
              </span>
            </button>
          ) : (
            <button className="nav-login" onClick={() => navigate("/login")}>
              เข้าสู่ระบบ
            </button>
          )}

          {open && (
            <div className="user-dropdown">
              <Link to={`/profile/${user_id}?tab=info`} className="drop-item">ข้อมูลส่วนตัว</Link>
              <Link to={`/profile/${user_id}?tab=risk`} className="drop-item">ประวัติการประเมิน</Link>
              <Link to={`/profile/${user_id}?tab=favorite`} className="drop-item">หุ้นรายการโปรด</Link>
              <Link to={`/profile/${user_id}?tab=settings`} className="drop-item">ตั้งค่า</Link>

              <div
                className="drop-item logout"
                onClick={() => {
                  Swal.fire({
                    title: "ต้องการออกจากระบบ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "ออกจากระบบ",
                    confirmButtonColor: "#ef4444",
                  }).then((res) => {
                    if (res.isConfirmed) {
                      localStorage.clear();
                      navigate("/login");
                      window.location.reload();
                    }
                  });
                }}
              >
                ออกจากระบบ
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
