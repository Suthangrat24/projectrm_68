import { NavLink, useNavigate } from "react-router-dom";
import "../css/admin_css/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  // ฟังก์ชันเลือก icon ตาม active state
  const getIcon = (name, isActive) =>
    isActive
      ? `/pics/admin_pics/${name}_active.png`
      : `/pics/admin_pics/${name}_norm.png`;

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-title">
        <img src="/pics/logo_test.png" className="side-logo" />
        <span>ระบบแนะนำหุ้นระยะยาว</span>
      </div>

      <nav className="side-menu">

        {/* ภาพรวมระบบ */}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            "side-item" + (isActive ? " active" : "")
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={getIcon("overview", isActive)}
                className="side-icon"
              />
              ภาพรวมระบบ
            </>
          )}
        </NavLink>

        {/* ผู้ใช้งาน */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            "side-item" + (isActive ? " active" : "")
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={getIcon("users", isActive)}
                className="side-icon"
              />
              ผู้ใช้งาน
            </>
          )}
        </NavLink>

        {/* แบบประเมินความเสี่ยง */}
        <NavLink
          to="/admin/question"
          className={({ isActive }) =>
            "side-item" + (isActive ? " active" : "")
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={getIcon("risk", isActive)}
                className="side-icon"
              />
              แบบประเมินความเสี่ยง
            </>
          )}
        </NavLink>

        {/* ตั้งค่าระบบ */}
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            "side-item" + (isActive ? " active" : "")
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={getIcon("setting", isActive)}
                className="side-icon"
              />
              ตั้งค่าระบบ
            </>
          )}
        </NavLink>

        <button
          className="side-item logout-btn"
          onClick={() => navigate("/login")}
        >
          <img
            src="/pics/logout_dropdown.png"
            className="side-icon"
          />
          ออกจากระบบ
        </button>

      </nav>
    </aside>
  );
}
