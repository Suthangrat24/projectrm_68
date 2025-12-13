import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../css/admin_css/edit_user.css";

export default function AddUser() {

  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "ต้องการเพิ่มผู้ใช้งานใหม่หรือไม่?",
      text: "ตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "เพิ่มผู้ใช้งาน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: "เพิ่มผู้ใช้งานสำเร็จ!",
          text: "ข้อมูลถูกบันทึกลงระบบแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
        }).then(() => navigate("/admin/users"));
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "ต้องการยกเลิกหรือไม่?",
      text: "ข้อมูลที่กรอกจะไม่ถูกบันทึก",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ออกจากหน้านี้",
      cancelButtonText: "กรอกต่อ",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then((res) => {
      if (res.isConfirmed) navigate("/admin/users");
    });
  };

  return (
    <div className="edit-user-page">

        <div className="edit-user-header">
            <h2>เพิ่มผู้ใช้งานใหม่</h2>

            <div className="edit-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                ยกเลิก
              </button>
              <button className="btn-save" onClick={handleSave}>บันทึก</button>
            </div>
        </div>

      <form className="edit-user-card">

        {/* ---- รูปโปรไฟล์ ---- */}
        <div className="profile-section">
          <img
            src="/pics/admin_pics/default_profile.jpg"
            className="edit-profile-img"
          />
          <button type="button" className="btn-change-img">
            เลือกรูปภาพ
          </button>
        </div>

        {/* ---- FORM GRID ---- */}
        <div className="form-grid">

          <div className="form-group">
            <label>ชื่อ</label>
            <input type="text" placeholder="ชื่อ" required />
          </div>

          <div className="form-group">
            <label>นามสกุล</label>
            <input type="text" placeholder="นามสกุล" required />
          </div>

          <div className="form-group">
            <label>อีเมล</label>
            <input type="email" placeholder="example@email.com" required />
          </div>

          <div className="form-group">
            <label>เบอร์โทรศัพท์</label>
            <input type="text" placeholder="0XX-XXX-XXXX" required />
          </div>

          <div className="form-group">
            <label>เพศ</label>
            <select defaultValue="">
              <option value="" disabled>เลือกเพศ</option>
              <option>ชาย</option>
              <option>หญิง</option>
              <option>ไม่ระบุ</option>
            </select>
          </div>

          <div className="form-group">
            <label>วันเกิด</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>วันที่สมัคร</label>
            <input type="date" required />
          </div>

          <div className="form-group">
            <label>ระดับความเสี่ยง</label>
            <select defaultValue="">
              <option value="" disabled>เลือกระดับความเสี่ยง</option>
              <option>ต่ำ</option>
              <option>กลาง</option>
              <option>สูง</option>
            </select>
          </div>

        </div>

      </form>
    </div>
  );
}
