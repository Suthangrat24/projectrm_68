import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { editQuestion, getAllQuestions } from "../fetchapi/call_api_admin";
import "../css/admin_css/edit_question.css";

export default function EditQuestion() {
  const { question_id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("single");
  const [choices, setChoices] = useState([]);

  /* ===== MAP ให้ตรง backend ===== */
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

  /* ===== LOAD QUESTION ===== */
  useEffect(() => {
    async function load() {
      try {
        const res = await getAllQuestions();

        const q = res.find(
          (item) => item.question_id === Number(question_id)
        );

        if (!q) throw new Error("not found");

        setQuestion(q.question);
        setCategory(q.question_group_name);

        // map type จาก backend (ภาษาไทย)
        setType(
          q.question_type_name === "เลือกคำตอบเดียว"
            ? "single"
            : q.question_type_name === "เลือกได้หลายคำตอบ"
            ? "multiple"
            : "text"
        );

        // ⭐ สำคัญที่สุด: ต้องใช้ q.choices เท่านั้น
        setChoices(
          (q.choices || []).map((c) => ({
            choice_id: c.choice_id,
            choice_text: c.choice_text,
          }))
        );
      } catch (err) {
        Swal.fire("ผิดพลาด", "ไม่พบคำถาม", "error");
        navigate(-1);
      }
    }

    load();
  }, [question_id, navigate]);

  /* ===== CHOICE HANDLERS ===== */
  const addChoice = () => {
    setChoices([...choices, { choice_id: null, choice_text: "" }]);
  };

  const updateChoice = (index, value) => {
    const updated = [...choices];
    updated[index].choice_text = value;
    setChoices(updated);
  };

  const confirmRemoveChoice = (index) => {
    Swal.fire({
      title: "ต้องการลบตัวเลือกนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    }).then((res) => {
      if (res.isConfirmed) {
        setChoices(choices.filter((_, i) => i !== index));
      }
    });
  };

  /* ===== SAVE ===== */
  const confirmSave = () => {
    if (!question || !category) {
      Swal.fire("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบ", "warning");
      return;
    }

    if (type !== "text") {
      if (
        choices.length < 2 ||
        choices.some((c) => !c.choice_text.trim())
      ) {
        Swal.fire(
          "ช้อยส์ไม่ถูกต้อง",
          "ต้องมีอย่างน้อย 2 ตัวเลือก และห้ามเว้นว่าง",
          "warning"
        );
        return;
      }
    }

    Swal.fire({
      title: "บันทึกการแก้ไข?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#2563EB",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await editQuestion(question_id, {
            question,
            question_type_id: questionTypeMap[type],
            question_group_id: questionGroupMap[category],
            choices: type === "text" ? null : choices,
          });

          Swal.fire("สำเร็จ", "บันทึกเรียบร้อยแล้ว", "success").then(
            () => navigate("/admin/question")
          );
        } catch (err) {
          Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกได้", "error");
        }
      }
    });
  };

  const confirmCancel = () => {
    Swal.fire({
      title: "ยกเลิกการแก้ไข?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ออก",
      cancelButtonText: "อยู่ต่อ",
    }).then((res) => res.isConfirmed && navigate(-1));
  };

  /* ===== UI ===== */
  return (
    <section className="edit-question-page">
      <div className="edit-question-header">
        <h2 className="edit-question-title">แก้ไขคำถาม</h2>
      </div>

      <div className="edit-card">
        {/* หมวด */}
        <div className="form-group">
          <label>หมวดคำถาม</label>
          <div className="select-wrapper">
            <select
              className="custom-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>ฐานะการเงิน</option>
              <option>เป้าหมาย</option>
              <option>ความเสี่ยง</option>
              <option>พฤติกรรม</option>
              <option>ความรู้</option>
            </select>
            <img src="/pics/drop-down.png" className="select-arrow" />
          </div>
        </div>

        {/* คำถาม */}
        <div className="form-group">
          <label>ข้อความคำถาม</label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        {/* ประเภท */}
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
              <option value="single">ตัวเลือกเดียว</option>
              <option value="multiple">หลายตัวเลือก</option>
              <option value="text">กรอกคำตอบ</option>
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
                  value={c.choice_text}
                  onChange={(e) => updateChoice(i, e.target.value)}
                />
                <button
                  className="delete-choice-btn"
                  onClick={() => confirmRemoveChoice(i)}
                >
                  <img src="/pics/admin_pics/delete.png" />
                </button>
              </div>
            ))}

            <button className="add-choice-btn" onClick={addChoice}>
              + เพิ่มช้อยใหม่
            </button>
          </div>
        )}

        <div className="form-actions-bottom">
          <button className="cancel-btn" onClick={confirmCancel}>
            ยกเลิก
          </button>
          <button className="save-btn" onClick={confirmSave}>
            บันทึก
          </button>
        </div>
      </div>
    </section>
  );
}
