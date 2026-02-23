import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getdataUser, updateUser } from "../fetchapi/call_api_admin";
import "../css/admin_css/edit_user.css";

export default function EditUser() {

  const { user_id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_num: "",
    birth_date: "",
    gender_id: "",
    level_name: "",
    photo_path: "/pics/admin_pics/default_profile.jpg",
  });

    useEffect(() => {
      async function fetchUser() {
        try {
          const res = await getdataUser(user_id);
          const u = res.data;

          setForm({
            first_name: u.first_name,
            last_name: u.last_name,
            email: u.email,
            phone_num: u.phone_num,
            birth_date: u.birth_date,
            gender_id: String(u.gender_id),
            level_name: u.level_name || "-",
            photo_path: u.photo_path,
          });
        } catch (err) {
          Swal.fire("ผิดพลาด", "ไม่พบข้อมูลผู้ใช้งาน", "error");
          navigate("/admin/users");
        }
      }
      fetchUser();
  }, [user_id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.phone_num || !form.birth_date || !form.gender_id) {
      Swal.fire("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบถ้วน", "warning");
      return;
    }

    Swal.fire({
      title: "บันทึกข้อมูล?",
      text: "คุณต้องการบันทึกการแก้ไขข้อมูลผู้ใช้งานนี้ใช่ไหม?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await updateUser(user_id, {
            first_name: form.first_name,
            last_name: form.last_name,
            phone_num: form.phone_num,
            birth_date: form.birth_date,
            gender_id: Number(form.gender_id),
          });

          Swal.fire("สำเร็จ", "บันทึกข้อมูลเรียบร้อยแล้ว", "success")
            .then(() => navigate("/admin/users"));
        } catch (err) {
          Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
        }
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "ยกเลิกการแก้ไข?",
      text: "ข้อมูลที่แก้ไขจะไม่ถูกบันทึก",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ออกจากหน้านี้",
      cancelButtonText: "แก้ไขต่อ",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
    }).then((res) => {
      if (res.isConfirmed) navigate("/admin/users");
    });
  };

  return (
    <>
      <div className="edit-user-page">

        <div className="edit-user-header">
            <h2>แก้ไขข้อมูลผู้ใช้งาน</h2>
        </div>

        <form className="edit-user-card">

          <div className="profile-section">
            <img src={form.photo_path} className="edit-profile-img" />
            <button className="btn-change-img">เปลี่ยนรูปภาพ</button>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>ชื่อ</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>นามสกุล</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>อีเมล</label>
              <input value={form.email} disabled />
            </div>

            <div className="form-group">
              <label>เบอร์โทรศัพท์</label>
              <input name="phone_num" value={form.phone_num} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>เพศ</label>
              <div className="filter-select-wrapper">
                <select 
                  name="gender_id" 
                  value={form.gender_id} 
                  onChange={handleChange} 
                  className="filter-select-native"
                >
                  <option value="">เลือกเพศ</option>
                  <option value="1">ชาย</option>
                  <option value="2">หญิง</option>
                  <option value="3">ไม่ระบุ</option>
                </select>

                <img
                  src="/pics/drop-down.png"
                  alt="drop-down"
                  className="filter-select-arrow"
                />
              </div>
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
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              ยกเลิก
            </button>
            <button type="button" className="btn-save" onClick={handleSave}>
              บันทึก
            </button>
          </div>
        </form>

      </div>
    </>
  );
}
