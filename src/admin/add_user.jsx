import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUser } from "../fetchapi/call_api_admin";
import "../css/admin_css/edit_user.css";

export default function AddUser() {

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_num: "",
    birth_date: "",
    gender_id: "",
    level_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const genderMap = {
    "ชาย": 1,
    "หญิง": 2,
    "ไม่ระบุ": 3,
  };

  const levelMap = {
    "ต่ำ": 1,
    "กลาง": 2,
    "สูง": 3,
  };

  const REQUIRED_FIELDS = [
    { key: "first_name", label: "ชื่อ" },
    { key: "last_name", label: "นามสกุล" },
    { key: "email", label: "อีเมล" },
    { key: "phone_num", label: "เบอร์โทรศัพท์" },
    { key: "birth_date", label: "วันเกิด" },
    { key: "gender_id", label: "เพศ" },
  ];

  const validateForm = () => {
    const missing = REQUIRED_FIELDS
      .filter((f) => !form[f.key])
      .map((f) => f.label);

    return missing;
  };

  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();

    const missingFields = validateForm();

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบ",
        html: `
          <div style="text-align:left">
            <p>คุณยังไม่ได้กรอกข้อมูลต่อไปนี้:</p>
            <ul>
              ${missingFields.map((f) => `<li>• ${f}</li>`).join("")}
            </ul>
          </div>
        `,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

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
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await createUser({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone_num: form.phone_num,
            birth_date: form.birth_date,
            gender_id: Number(form.gender_id),
            level_id: form.level_id ? Number(form.level_id) : null,
          });

          Swal.fire({
            title: "เพิ่มผู้ใช้งานสำเร็จ!",
            text: "ข้อมูลถูกบันทึกลงระบบแล้ว",
            icon: "success",
            confirmButtonColor: "#10b981",
          }).then(() => navigate("/admin/users"));

        } catch (err) {
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มผู้ใช้งานได้", "error");
        }
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
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="ชื่อ"
              required
            />
          </div>

          <div className="form-group">
            <label>นามสกุล</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="นามสกุล"
              required
            />
          </div>

          <div className="form-group">
            <label>อีเมล</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              name="phone_num"
              value={form.phone_num}
              onChange={handleChange}
              placeholder="0XX-XXX-XXXX"
              required
            />
          </div>

          <div className="form-group">
            <label>เพศ</label>
            <select
              name="gender_id"
              value={form.gender_id}
              onChange={handleChange}
              required
            >
              <option value="">เลือกเพศ</option>
              <option value="1">ชาย</option>
              <option value="2">หญิง</option>
              <option value="3">ไม่ระบุ</option>
            </select>
          </div>

          <div className="form-group">
            <label>วันเกิด</label>
            <input
              type="date"
              name="birth_date"
              value={form.birth_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>ระดับความเสี่ยง</label>

            <div className="filter-select-wrapper">
              <select
                name="level_id"
                value={form.level_id}
                disabled
                className="filter-select-native"
              >
                <option value="">เลือกระดับความเสี่ยง</option>
                <option value="1">ต่ำ</option>
                <option value="2">กลาง</option>
                <option value="3">สูง</option>
              </select>

              <img
                src="/pics/drop-down.png"
                alt="drop-down"
                className="filter-select-arrow"
              />
            </div>
          </div>

        </div>

        <div className="form-actions-bottom">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
          >
            ยกเลิก
          </button>

          <button
            type="button"
            className="btn-save"
            onClick={handleSave}
          >
            บันทึก
          </button>
        </div>

      </form>
    </div>
  );
}
