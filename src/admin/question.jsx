import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/admin_css/question.css";

export default function Questions() {
  
    const questions = [
        // หมวด 1 — ฐานะการเงิน
        { id: 1, category: "ฐานะการเงิน", question: "ความมั่นคงของรายได้", type: "single", choices: [
            "ผันผวนมาก / ไม่แน่นอน (ไม่มีรายได้ประจำ)",
            "ค่อนข้างผันผวน (รายได้เปลี่ยนแปลงสูง)",
            "ปานกลาง (มีรายได้หลัก แต่บางเดือนอาจไม่แน่นอน)",
            "มั่นคง (มีรายได้ประจำและเสริมบางส่วน)",
            "มั่นคงมาก (รายได้ประจำสม่ำเสมอชัดเจน)",
        ]},

        { id: 2, category: "ฐานะการเงิน", question: "คุณมีเงินสำรองฉุกเฉินเพียงพอกี่เดือน?", type: "single", choices: [
            "ไม่มีเลย / น้อยกว่า 1 เดือน",
            "1 - 3 เดือน",
            "4 - 6 เดือน",
            "7 - 12 เดือน",
            "มากกว่า 12 เดือน",
        ]},

        { id: 3, category: "ฐานะการเงิน", question: "ค่าใช้จ่ายของคุณคิดเป็นกี่เปอร์เซ็นต์ของรายได้?", type: "single", choices: [
            "มากกว่า 80% (เหลือเงินเก็บน้อยมาก)",
            "60–80%",
            "40–60%",
            "20–40%",
            "น้อยกว่า 20% (เหลือเงินเก็บเยอะ)",
        ]},

        { id: 4, category: "ฐานะการเงิน", question: "ท่านมีหนี้สินเป็นสัดส่วนเท่าใดของรายได้ทั้งหมด?", type: "single", choices: [
            "มากกว่า 80%",
            "50–80%",
            "20–50%",
            "น้อยกว่า 20%",
            "ไม่มีหนี้สินเลย",
        ]},

        // หมวด 2 — เป้าหมาย
        { id: 5, category: "เป้าหมาย", question: "เป้าหมายทางการเงินหลักของคุณคืออะไร?", type: "single", choices: [
            "รักษาเงินต้น",
            "มีรายได้เสริมจากดอกเบี้ย/ปันผล",
            "เติบโตแบบค่อยเป็นค่อยไป",
            "สร้างความมั่งคั่งระยะยาว",
            "เก็งกำไรเพื่อผลตอบแทนสูงสุด",
        ]},

        // หมวด 3 — ความเสี่ยง
        { id: 6, category: "ความเสี่ยง", question: "คุณสามารถยอมรับความเสี่ยงได้มากน้อยเพียงใด?", type: "single", choices: [
            "ไม่ยอมรับเลย",
            "ยอมรับได้น้อย",
            "ปานกลาง",
            "ยอมรับได้มาก",
            "ยอมรับได้มากที่สุด",
        ]},

        { id: 7, category: "ความเสี่ยง", question: "คุณยอมรับการขาดทุนได้สูงสุดกี่เปอร์เซ็นต์?", type: "single", choices: [
            "ไม่เกิน 5%",
            "5–10%",
            "10–15%",
            "15–20%",
            "มากกว่า 20%",
        ]},

        { id: 8, category: "ความเสี่ยง", question: "หากพอร์ตลดลง 20% คุณจะทำอย่างไร?", type: "single", choices: [
            "ขายทั้งหมดทันที",
            "ขายบางส่วน",
            "ถือรอดู",
            "ทยอยซื้อเพิ่ม",
            "ซื้อเพิ่มทันที",
        ]},

        { id: 9, category: "ความเสี่ยง", question: "ถ้าเงินปันผลหรือรายได้การลงทุนลดลงหรือหยุดจ่าย คุณจะทำอย่างไร?", type: "single", choices: [
            "ขายทันที",
            "ลดสัดส่วน",
            "ถือไว้",
            "ถือและซื้อเพิ่ม",
            "รอประเมินก่อน",
        ]},

        { id: 10, category: "ความเสี่ยง", question: "หากมีข้อมูลจำกัด คุณจะทำอย่างไร?", type: "single", choices: [
            "ไม่ลงทุน",
            "ลงทุนเล็กน้อย",
            "ลงทุนปานกลาง",
            "ลงทุนมากขึ้น",
            "ลงทุนเต็มพอร์ตทันที",
        ]},

        { id: 11, category: "ความเสี่ยง", question: "เมื่อมีข่าวลบ คุณจะทำอย่างไร?", type: "single", choices: [
            "ขายทันที",
            "ลดสัดส่วน",
            "ถือรอดู",
            "ถือและซื้อเพิ่มเล็กน้อย",
            "ซื้อเพิ่มมาก",
        ]},

        // หมวด 4 — พฤติกรรม
        { id: 12, category: "พฤติกรรม", question: "ระดับความรู้ด้านการลงทุนของคุณ", type: "single", choices: [
            "ไม่มีความรู้",
            "พอรู้พื้นฐาน",
            "ระดับกลาง",
            "มีประสบการณ์จริง",
            "เชี่ยวชาญ",
        ]},

        { id: 13, category: "พฤติกรรม", question: "ประสบการณ์ลงทุน", type: "single", choices: [
            "ไม่เคยลงทุน",
            "เคยลองเล็กน้อย",
            "ลงทุน ≤3 ปี",
            "ลงทุน 4–7 ปี",
            "มากกว่า 7 ปี",
        ]},

        { id: 14, category: "พฤติกรรม", question: "ประเภทสินทรัพย์ที่คุณเคยลงทุน", type: "multiple", choices: [
            "เงินฝาก/พันธบัตร",
            "กองทุนรวม",
            "หุ้นไทย",
            "หุ้นต่างประเทศ/ทอง",
            "ตราสารอนุพันธ์/คริปโต",
        ]},

        // หมวด 5 — ความรู้
        { id: 15, category: "ความรู้", question: "ถ้าไม่ได้กำไรตามหวัง คุณจะทำอย่างไร?", type: "single", choices: [
            "เลิกลงทุนทันที",
            "ลดสัดส่วน",
            "ถือรอดู",
            "ซื้อเพิ่มเพื่อเฉลี่ยต้นทุน",
            "เพิ่มเงินลงทุนสำหรับกำไรเร็ว",
        ]},

        { id: 16, category: "ความรู้", question: "เมื่อมีความผันผวน คุณควบคุมอารมณ์ได้ไหม?", type: "single", choices: [
            "ไม่ได้เลย",
            "ควบคุมได้น้อย",
            "ปานกลาง",
            "ควบคุมได้ดี",
            "ได้ดีมาก",
        ]},

        { id: 17, category: "ความรู้", question: "คุณให้ความสำคัญกับสิ่งใดมากที่สุด?", type: "single", choices: [
            "ปลอดภัย 100%",
            "ปลอดภัยมากกว่าเล็กน้อย",
            "สมดุลความเสี่ยง-ผลตอบแทน",
            "ผลตอบแทนสูง เสี่ยงบ้าง",
            "ผลตอบแทนสูงสุด เสี่ยงสูง",
        ]},

        // หมวด 2 — เป้าหมาย (ข้อสุดท้าย)
        { id: 18, category: "เป้าหมาย", question: "งบประมาณเริ่มต้นของคุณ (บาท)", type: "text" },
        { id: 19, category: "เป้าหมาย", question: "ระยะเวลาที่ตั้งใจจะลงทุน (ปี)", type: "text" },
        { id: 20, category: "เป้าหมาย", question: "ผลตอบแทนที่คุณคาดหวังต่อปี (%)", type: "text" },
    ];

        const handleDelete = (id, questionText) => {
            Swal.fire({
                title: "ต้องการลบคำถามนี้หรือไม่?",
                text: `Q${id}: ${questionText}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6b7280",
                confirmButtonText: "ลบคำถาม",
                cancelButtonText: "ยกเลิก",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "ลบสำเร็จ",
                        text: "คำถามถูกลบออกจากแบบประเมินแล้ว",
                        icon: "success",
                        confirmButtonColor: "#2563EB",
                    });
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
                        <Link to={"/admin/question/edit"}>
                        {/* <Link to={`/admin/question/edit/${q.id}`}> */}
                            <img src="/pics/admin_pics/edit.png" className="action-icon" />
                        </Link>
                        <img src="/pics/delete.png" className="action-icon delete" onClick={() => handleDelete(q.id, q.question)} />
                    </div>

                    {/* ส่วนเนื้อหา */}
                    <div className="question-row">
                        <div className="q-num">Q{startIndex + index + 1}</div>

                        <div className="q-content">
                            <span className={`category-badge cat-${q.category}`}>
                                {q.category}
                            </span>

                            <h3 className="q-question">{q.question}</h3>

                            {q.type !== "text" ? (
                                <ol className="choice-list">
                                    {q.choices.map((c, i) => (
                                    <li key={i}>{c}</li>
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
