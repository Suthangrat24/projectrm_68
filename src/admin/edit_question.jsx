import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../css/admin_css/edit_question.css";

export default function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  // mock data (ในอนาคตดึงจาก backend)
  const mockQuestion = {
    id,
    category: "ฐานะการเงิน",
    question: "ความมั่นคงของรายได้",
    type: "single",
    choices: [
      "ผันผวนมาก / ไม่แน่นอน",
      "ค่อนข้างผันผวน",
      "ปานกลาง",
      "มั่นคง",
      "มั่นคงมาก",
    ],
  };

  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("single");
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    // load mock (แทนที่จะ fetch backend)
    setCategory(mockQuestion.category);
    setQuestion(mockQuestion.question);
    setType(mockQuestion.type);
    setChoices(mockQuestion.choices || []);
  }, [id]);

  // เพิ่มช้อยส์ใหม่
  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  // ลบช้อยส์
  const removeChoice = (index) => {
    const updated = choices.filter((_, i) => i !== index);
    setChoices(updated);
  };

  // แก้ไขข้อความช้อยส์
  const updateChoice = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

    // บันทึก 
    const confirmSave = () => {
    Swal.fire({
        title: "ต้องการบันทึกการแก้ไข?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#2563EB"
    }).then((result) => {
        if (result.isConfirmed) {

        Swal.fire({
            title: "บันทึกสำเร็จ",
            text: "แก้ไขข้อมูลคำถามเรียบร้อยแล้ว",
            icon: "success",
            confirmButtonColor: "#2563EB"
        }).then(() => navigate("/admin/question"));

        }
    });
    };

    // ยกเลิก 
    const confirmCancel = () => {
    Swal.fire({
        title: "ยกเลิกการแก้ไข?",
        text: "ข้อมูลที่แก้ไขจะไม่ถูกบันทึก",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ออกจากการแก้ไข",
        cancelButtonText: "แก้ไขต่อ",
        confirmButtonColor: "#6b7280"
    }).then((result) => {
        if (result.isConfirmed) {
        navigate(-1);
        }
    });
    };

  const handleDeleteChoice = (index) => {
    Swal.fire({
        title: "ยืนยันลบตัวเลือก?",
        text: "การลบนี้ไม่สามารถย้อนกลับได้",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#dc2626",
    }).then((result) => {
        if (result.isConfirmed) {
        const updated = [...choices];
        updated.splice(index, 1);
        setChoices(updated);

        Swal.fire({
            icon: "success",
            title: "ลบสำเร็จ",
            timer: 1500,
            showConfirmButton: false,
        });
        }
    });
    };

  return (
    <>
        <section className="edit-question-page">

            {/* HEADER */}
            <div className="edit-question-header">
                <h2 className="edit-question-title">แก้ไขคำถาม (Q{id})</h2>

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
                        <select className="custom-select" value={type} onChange={(e) => setType(e.target.value)}>
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
                        onClick={() => handleDeleteChoice(i)}
                        >
                        <img src="/pics/admin_pics/delete.png" alt="del" />
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
    </>
  );
}
