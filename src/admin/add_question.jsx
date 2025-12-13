import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/admin_css/edit_question.css";

export default function AddQuestion() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("single");
  const [choices, setChoices] = useState([]);

  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  const removeChoice = (index) => {
    const updated = choices.filter((_, i) => i !== index);
    setChoices(updated);
  };

  const updateChoice = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const confirmSave = () => {
    Swal.fire({
      title: "ต้องการเพิ่มคำถามใหม่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#2563EB",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "เพิ่มคำถามสำเร็จ",
          text: "คำถามถูกบันทึกลงระบบแล้ว",
          icon: "success",
          confirmButtonColor: "#2563EB",
        }).then(() => navigate("/admin/question"));
      }
    });
  };

  const confirmCancel = () => {
    Swal.fire({
      title: "ยกเลิกการเพิ่มคำถาม?",
      text: "ข้อมูลที่กรอกจะไม่ถูกบันทึก",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ออกจากหน้านี้",
      cancelButtonText: "กรอกต่อ",
      confirmButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) navigate(-1);
    });
  };

  return (
    <section className="edit-question-page">

      {/* HEADER */}
      <div className="edit-question-header">
        <h2 className="edit-question-title">เพิ่มคำถามใหม่</h2>

        <div className="edit-question-actions">
          <button className="cancel-btn" onClick={confirmCancel}>ยกเลิก</button>
          <button className="save-btn" onClick={confirmSave}>บันทึก</button>
        </div>
      </div>

      {/* CARD */}
      <div className="edit-card">

        {/* หมวดคำถาม */}
        <div className="form-group">
          <label>หมวดคำถาม</label>

          <div className="select-wrapper">
            <select
              className="custom-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- เลือกหมวดคำถาม --</option>
              <option>ฐานะการเงิน</option>
              <option>เป้าหมาย</option>
              <option>ความเสี่ยง</option>
              <option>พฤติกรรม</option>
              <option>ความรู้</option>
            </select>

            <img src="/pics/drop-down.png" className="select-arrow" />
          </div>
        </div>

        {/* ข้อคำถาม */}
        <div className="form-group">
          <label>ข้อความคำถาม</label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="พิมพ์ข้อความคำถาม..."
          />
        </div>

        {/* ประเภทคำถาม */}
        <div className="form-group">
          <label>ประเภทคำถาม</label>

          <div className="select-wrapper">
            <select
              className="custom-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="single">ตัวเลือกเดียว (Single Choice)</option>
              <option value="multiple">หลายตัวเลือก (Multiple Choice)</option>
              <option value="text">กรอกคำตอบ (Text)</option>
            </select>

            <img src="/pics/drop-down.png" className="select-arrow" />
          </div>
        </div>

        {/* ช้อยส์ */}
        {type !== "text" && (
          <div className="form-group">
            <label>ช้อยส์คำตอบ</label>

            {choices.map((c, i) => (
              <div key={i} className="choice-item">
                
                <div className="choice-index">{i + 1}.</div>

                <input
                  className="choice-input"
                  value={c}
                  onChange={(e) => updateChoice(i, e.target.value)}
                  placeholder={`ตัวเลือกที่ ${i + 1}`}
                />

                <button 
                  className="delete-choice-btn"
                  onClick={() => removeChoice(i)}
                >
                  <img src="/pics/admin_pics/delete.png" alt="delete" />
                </button>
              </div>
            ))}

            <button className="add-choice-btn" onClick={addChoice}>
              + เพิ่มช้อยใหม่
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
