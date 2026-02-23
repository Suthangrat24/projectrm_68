import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllQuestions, deleteQuestion } from "../fetchapi/call_api_admin";
import "../css/admin_css/question.css";

export default function Questions() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchQuestions() {
        try {
            const data = await getAllQuestions();

            const formatted = data.map(q => ({
            id: q.question_id,
            question: q.question,
            type:
                q.question_type_name === "เลือกคำตอบเดียว"
                ? "single"
                : q.question_type_name === "เลือกได้หลายคำตอบ"
                ? "multiple"
                : "text",
            group: q.question_group_name,
            choices: q.choices || []
            }));

            setQuestions(formatted);
            setLoading(false);
        } catch (err) {
            console.error("โหลดคำถามไม่สำเร็จ", err);
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดคำถามได้", "error");
        }
        }

        fetchQuestions();
    }, []);

    const getQuestionGroup = (group) => {
        switch (group) {
        case "ฐานะการเงิน":
            return "financial";
        case "เป้าหมาย":
            return "goal";
        case "ความเสี่ยง":
            return "risk";
        case "พฤติกรรม":
            return "behavior";
        case "ความรู้":
            return "knowledge";
        }
    };

    const handleDelete = (id, questionText) => {
    Swal.fire({
        title: "ต้องการลบคำถามนี้หรือไม่?",
        text: questionText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "ลบคำถาม",
        cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
        if (result.isConfirmed) {
        try {
            await deleteQuestion(id);

            Swal.fire({
            title: "ลบสำเร็จ",
            text: "คำถามถูกลบออกจากแบบประเมินแล้ว",
            icon: "success",
            });

            setQuestions(prev =>
            prev.filter(q => q.id !== id)
            );

        } catch (err) {
            Swal.fire("ผิดพลาด", "ไม่สามารถลบคำถามได้", "error");
        }
        }
    });
    };

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const totalPages = Math.ceil(questions.length / perPage);

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    const shownQuestions = questions.slice(startIndex, endIndex);

  return (
    <>
        <div className="admin-questions-page">
            <div className="question-header">
                <div>
                    <h2 className="page-title">จัดการแบบประเมินความเสี่ยง</h2>
                    <p className="page-sub">คำถามทั้งหมด {questions.length} ข้อ</p>
                </div>

                <Link to="/admin/question/add" className="add-btn">
                    + เพิ่มคำถาม
                </Link>
            </div>

            <div className="question-card-wrapper">

                {shownQuestions.map((q, index) => (
                <div key={q.id} className="question-item">

                    {/* ปุ่มแก้ไข/ลบ */}
                    <div className="q-actions">
                        <Link to={`/admin/question/${q.id}/edit`}>
                            <img src="/pics/admin_pics/edit.png" className="action-icon" />
                        </Link>
                        <img src="/pics/delete.png" className="action-icon delete" onClick={() => handleDelete(q.id, q.question)} />
                    </div>

                    {/* ส่วนเนื้อหา */}
                    <div className="question-row">
                        <div className="q-num">Q{startIndex + index + 1}</div>

                        <div className="q-content">
                            <span className={`category-badge cat-${getQuestionGroup(q.group)}` }>
                                {q.group}
                            </span>

                            <h3 className="q-question">{q.question}</h3>

                            {q.type !== "text" ? (
                                <ol className="choice-list">
                                    {q.choices.map((c, i) => (
                                        <li key={c.choice_id}>{c.choice_text}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="q-text-placeholder">(คำถามแบบกรอกคำตอบ)</p>
                            )}
                        </div>
                    </div>

                    {/* เส้นคั่นระหว่างข้อ */}
                    {index !== shownQuestions.length - 1 && <div className="divider" />}

                </div>
                ))}

                {/* ====== FOOTER (PER PAGE + PAGINATION) ====== */}
                <div className="question-footer">

                    {/* ซ้าย: เลือกจำนวนแสดง */}
                    <div className="footer-left">
                        <span>แสดง</span>

                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>

                        <span>รายการ</span>
                    </div>

                    {/* ขวา: pagination */}
                    <div className="footer-right">
                        <span>หน้า {page}</span>
                        {/* <span>หน้า {page} จาก {totalPages} หน้า</span> */}

                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="page-circle"
                        >
                            <img src="/pics/left.png" className="circle-icon" />
                        </button>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="page-circle"
                        >
                            <img src="/pics/right.png" className="circle-icon" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </>
  );
}
