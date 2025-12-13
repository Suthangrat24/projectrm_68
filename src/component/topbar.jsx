import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/admin_css/topbar.css";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="admin-topbar">
      <div className="topbar-right" ref={menuRef}>
        <button className="top-profile" onClick={() => setOpen(!open)}>
          <div className="top-avatar">
            <img src="/pics/marckris.jpg" />
          </div>
          <span className="top-name">Admin</span>
          <img src="/pics/drop-down.png" className="top-arrow" />
        </button>

        {open && (
          <div className="top-dropdown">
            {/* <button className="drop-item">โปรไฟล์</button> */}
            <Link
                to="/setting"
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
    </header>
  );
}
