import { Route, Navigate } from "react-router-dom";

// PrivateRoute Component
const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("access_token"); // เช็ค token
  const path = window.location.pathname; // เช็ค URL ปัจจุบัน

  // ถ้าผู้ใช้ล็อกอินแล้ว และกำลังพยายามเข้าหน้า /login หรือ /register
  if (token && (path === "/login" || path === "/register")) {
    return <Navigate to="/" />; // นำผู้ใช้ไปหน้าอื่น เช่น หน้า Home
  }

  // ถ้าผู้ใช้ไม่ได้ล็อกอินและเข้าหน้าอื่น
  if (!token) {
    return <Navigate to="/login" />; // ถ้าไม่มี token ให้ไปหน้า login
  }

  return element; // ถ้ามี token ให้แสดงหน้า route ที่ต้องการ
};

export default PrivateRoute;