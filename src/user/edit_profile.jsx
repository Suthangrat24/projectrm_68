import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/edit_profile.css";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "โกจิ",
    lastName: "เบอร์รี่",
    email: "gojiberry007@gmail.com",
    phone: "063-063-6540",
    birthday: "2005-05-01",
    gender: "ไม่"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("บันทึกข้อมูลเรียบร้อย!");
    navigate("/profile");
  };

  return (
    <>
    <section className="edit-profile-page">

      {/* ===== HEADER ===== */}
      <div className="edit-header">

        {/* row 1 — back button */}
        <div className="edit-header-top">
            <button className="edit-back-btn" onClick={() => navigate("/profile")}>
              <img src="/pics/back.png" className="edit-back-icon" />
              ย้อนกลับ
            </button>
        </div>

        {/* row 2 — title + save button */}
        <div className="edit-header-bottom">
            <h1 className="edit-title">แก้ไขข้อมูลส่วนตัว</h1>

            <button className="edit-save-btn" onClick={handleSave}>
              บันทึก
            </button>
          </div>
      </div>

      {/* ===== MAIN CARD ===== */}
      <div className="edit-card">

        <div className="edit-section-title">
          <img src="/pics/user.png" className="section-icon" />
          <span>ข้อมูลส่วนตัว</span>
        </div>

        <div className="edit-grid">

          <div className="field">
            <label>ชื่อ</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>นามสกุล</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>อีเมล</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>วันเกิด</label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
            />
          </div>

          
          <div className="field">
            <label>เพศ</label>

            <div className="select-wrapper">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="select-native"
              >
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
              </select>

              <img src="/pics/drop-down.png" className="select-arrow" />
            </div>
          </div>

        </div>
      </div>

      {/* ===== CHANGE PASSWORD CARD ===== */}
      <div className="edit-card password-card">

        <div className="edit-section-title">
          <img src="/pics/reset_password.png" className="section-icon" />
          <span>เปลี่ยนรหัสผ่าน</span>
        </div>

        <div className="password-grid">

          <div className="field">
            <label>รหัสผ่านใหม่</label>
            <input
              type="password"
              name="newPassword"
              placeholder="กรอกรหัสผ่านใหม่"
            />
          </div>

          <div className="field">
            <label>ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
            />
          </div>

        </div>

        <button className="password-save-btn">
          เปลี่ยนรหัสผ่าน
        </button>

      </div>

    </section>
    </>
  );
}
