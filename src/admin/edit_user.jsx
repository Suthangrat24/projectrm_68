import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../css/admin_css/edit_user.css";

export default function EditUser() {

  const user = {
    firstName: "โกจิ",
    lastName: "เบอรี่",
    email: "gojiberry007@gmail.com",
    phone: "063-063-6540",
    gender: "ไม่ระบุ",
    birthdate: "2005-05-01",
    joinDate: "2024-01-01",
    riskLevel: "ปานกลาง",
    profileImg: "/pics/marckris.jpg",
  };

  const navigate = useNavigate();

  const handleSave = () => {
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
      }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "บันทึกสำเร็จ!",
              text: "ข้อมูลผู้ใช้งานถูกบันทึกแล้ว",
              icon: "success",
              confirmButtonColor: "#10b981",
            }).then(() => {
              navigate("/admin/users");
            });
          }
      });
    };

    const handleCancel = () => {
        Swal.fire({
            title: "ยกเลิกการแก้ไข?",
            text: "ข้อมูลที่แก้ไขจะไม่ถูกบันทึก ต้องการกลับหรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ออกจากการแก้ไข",
            cancelButtonText: "แก้ไขต่อ",
            reverseButtons: true,
            confirmButtonColor: "#ef4444",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/admin/users");
            }
        });
    };

  return (
    <>
      <div className="edit-user-page">

        <div className="edit-user-header">
            <h2>แก้ไขข้อมูลผู้ใช้งาน</h2>

            <div className="edit-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                ยกเลิก
              </button>
              <button className="btn-save" onClick={handleSave}>บันทึก</button>
            </div>
        </div>

        <div className="edit-user-card">

          <div className="profile-section">
            <img src={user.profileImg} className="edit-profile-img" />
            <button className="btn-change-img">เปลี่ยนรูปภาพ</button>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>ชื่อ</label>
              <input defaultValue={user.firstName} />
            </div>

            <div className="form-group">
              <label>นามสกุล</label>
              <input defaultValue={user.lastName} />
            </div>

            <div className="form-group">
              <label>อีเมล</label>
              <input defaultValue={user.email} />
            </div>

            <div className="form-group">
              <label>เบอร์โทรศัพท์</label>
              <input defaultValue={user.phone} />
            </div>

            <div className="form-group">
              <label>เพศ</label>
              <select defaultValue={user.gender}>
                <option>ชาย</option>
                <option>หญิง</option>
                <option>ไม่ระบุ</option>
              </select>
            </div>

            <div className="form-group">
              <label>วันเกิด</label>
              <input type="date" defaultValue={user.birthdate} />
            </div>

            <div className="form-group">
              <label>วันที่สมัคร</label>
              <input value={user.joinDate} disabled />
            </div>

            <div className="form-group">
              <label>ระดับความเสี่ยง</label>
              <input value={user.riskLevel} disabled />
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
