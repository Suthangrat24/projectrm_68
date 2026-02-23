import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addQuestion } from "../fetchapi/call_api_admin";
import "../css/admin_css/edit_question.css";

export default function AddQuestion() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("single");
  const [choices, setChoices] = useState([]);

  /* ===== MAP ค่าให้ตรง backend ===== */
  const questionTypeMap = {
    single: 1,
    multiple: 2,
    text: 3,
  };

  const questionGroupMap = {
    "ฐานะการเงิน": 1,
    "เป้าหมาย": 2,
    "ความเสี่ยง": 3,
    "พฤติกรรม": 4,
    "ความรู้": 5,
  };

  /* ===== CHOICES ===== */
  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  const removeChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const updateChoice = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const confirmRemoveChoice = (index) => {
    Swal.fire({
      title: "ต้องการลบตัวเลือกนี้หรือไม่?",
      text: "ตัวเลือกที่ลบจะไม่สามารถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบตัวเลือก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        removeChoice(index);
        Swal.fire({
          title: "ลบเรียบร้อย",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
      }
    });
  };

  /* ===== CANCEL ===== */
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

  /* ===== SAVE ===== */
  const confirmSave = () => {
    /* --- VALIDATE --- */
    if (!category || !question || !type) {
      Swal.fire("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบ", "warning");
      return;
    }

    if (type !== "text") {
      if (choices.length < 2) {
        Swal.fire("ช้อยส์ไม่พอ", "ต้องมีอย่างน้อย 2 ตัวเลือก", "warning");
        return;
      }

      if (choices.some(c => !c.trim())) {
        Swal.fire("ช้อยส์ว่าง", "กรุณากรอกข้อความทุกตัวเลือก", "warning");
        return;
      }
    }

    Swal.fire({
      title: "ต้องการเพิ่มคำถามใหม่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#2563EB",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await addQuestion({
            question,
            question_type_id: questionTypeMap[type],
            question_group_id: questionGroupMap[category],
            choices: type === "text"
              ? []
              : choices.filter(c => c.trim()),
          });

          Swal.fire({
            title: "เพิ่มคำถามสำเร็จ",
            icon: "success",
            confirmButtonColor: "#2563EB",
          }).then(() => navigate("/admin/question"));

        } catch (err) {
          Swal.fire("ผิดพลาด", "ไม่สามารถเพิ่มคำถามได้", "error");
        }
      }
    });
  };

  return (
    <section className="edit-question-page">

      <div className="edit-question-header">
        <h2 className="edit-question-title">เพิ่มคำถามใหม่</h2>
      </div>


      <div className="edit-card">

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

        <div className="form-group">
          <label>ข้อความคำถาม</label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="พิมพ์ข้อความคำถาม..."
          />
        </div>

        <div className="form-group">
          <label>ประเภทคำถาม</label>
          <div className="select-wrapper">
            <select
              className="custom-select"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value === "text") setChoices([]);
              }}
            >
              <option value="single">ตัวเลือกเดียว (Single Choice)</option>
              <option value="multiple">หลายตัวเลือก (Multiple Choice)</option>
              <option value="text">กรอกคำตอบ (Text)</option>
            </select>
            <img src="/pics/drop-down.png" className="select-arrow" />
          </div>
        </div>

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
                  type="button"
                  className="delete-choice-btn"
                  onClick={() => confirmRemoveChoice(i)}
                >
                  <img src="/pics/admin_pics/delete.png" alt="delete" />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-choice-btn"
              onClick={addChoice}
            >
              + เพิ่มช้อยใหม่
            </button>
          </div>
        )}

        <div className="form-actions-bottom">
          <button type="button" className="cancel-btn" onClick={confirmCancel}>
            ยกเลิก
          </button>
          <button type="button" className="save-btn" onClick={confirmSave}>
            บันทึก
          </button>
        </div>

      </div>
    </section>
  );
}
