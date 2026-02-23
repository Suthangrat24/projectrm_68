import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateUser, getUserById } from "../fetchapi/call_api_user";
import Swal from "sweetalert2";
import "../css/edit_profile.css";

export default function EditProfile() {
  const navigate = useNavigate();

  const { user_id } = useParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    gender: ""
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUserById(user_id);

        setForm({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone_num || "",
          birthday: data.birth_date ? data.birth_date.split("T")[0] : "",
          gender:
            data.gender_id === 1
              ? "ชาย"
              : data.gender_id === 2
              ? "หญิง"
              : "ไม่ระบุ"
        });

      } catch (err) {
        console.error("โหลดข้อมูลผู้ใช้ล้มเหลว", err);
      }
    }

    if (user_id) {
      loadUser();
    }
  }, [user_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการบันทึกข้อมูล?",
      text: "คุณต้องการบันทึกข้อมูลใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "กลับไปแก้ไข",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone_num: form.phone,
        birth_date: form.birthday,
        gender_id:
          form.gender === "ชาย"
            ? 1
            : form.gender === "หญิง"
            ? 2
            : 3
      };

      await updateUser(user_id, payload);

      await Swal.fire({
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonColor: "#22c55e"
      });

      navigate(`/profile/${user_id}`);

    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  return (
    <>
    <section className="edit-profile-page">

      <div className="edit-header">
        <div className="edit-header-main">
            <h1 className="edit-title">แก้ไขข้อมูลส่วนตัว</h1>
            <button className="edit-save-btn" onClick={handleSave}>
                บันทึก
            </button>
        </div>
      </div>

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

            <div className="select-wrapper-edit">
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
