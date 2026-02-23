import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { getQuestions } from "../fetchapi/call_api_user";

import "../css/risk_questions.css";

export default function RiskQuestions() {
  const total = 20;
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await getQuestions();
        
        const formatted = data.map(q => ({
          id: q.question_id,
          question: q.question,
          type: q.question_type_name === "เลือกคำตอบเดียว" ? "single"
              : q.question_type_name === "เลือกหลายคำตอบ" ? "multiple"
              : "text",
          choices: q.choice_list || []
        }));

        console.log("formatted questions:", formatted);

        setQuestions(formatted);
        setLoading(false);
      } catch (err) {
        console.error("โหลดคำถามไม่สำเร็จ", err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดคำถามได้", "error");
      }
    }

    fetchQuestions();
  }, []);

  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState({});

  // เช็คว่ามีข้อไหนยังไม่ได้ตอบ
  const checkIncomplete = () => {
    for (let i = 1; i <= total; i++) {
      if (!answers[i] || answers[i].length === 0) return i;
    }
    return null;
  };

  const handleNext = () => {
    // อนุญาตให้ข้ามข้อได้ → ไม่ขึ้น alert
    if (current < total) {
      setCurrent(current + 1);
      return;
    }

    // ถ้ากดดูผล → ต้องเช็คว่าทำครบไหม
    const missing = checkIncomplete();
    if (missing) {
      Swal.fire({
        icon: "warning",
        title: "ยังตอบคำถามไม่ครบ",
        text: `กรุณาตอบข้อที่ ${missing} ให้เรียบร้อยก่อนดูผลประเมิน`,
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    navigate("/risk-result");
  };

  const handleBack = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const clearCurrentAnswer = () => {
    setAnswers({ ...answers, [current]: undefined });
  };

  const renderChoices = () => {
    const q = questions[current - 1];

    // MULTIPLE
    if (q.type === "multiple") {
      return q.choices.map((c, i) => (
        <label key={i} className="risk-option">
          <span className={`checkbox ${answers[current]?.includes(c) ? "active" : ""}`}>
            {answers[current]?.includes(c) && (
              <img src="/pics/checked.png" className="tick" />
            )}
          </span>

          <input
            type="checkbox"
            checked={answers[current]?.includes(c) || false}
            onChange={(e) => {
              let arr = answers[current] || [];
              if (e.target.checked) arr = [...arr, c];
              else arr = arr.filter((x) => x !== c);
              setAnswers({ ...answers, [current]: arr });
            }}
            style={{ display: "none" }}
          />
          <span className="opt-text">{c}</span>
        </label>
      ));
    }

    if (q.type === "text") {
      // ฟังก์ชัน format ใส่ comma
      const formatNumber = (num) => {
        if (!num) return "";
        let parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
      };

      return (
        <div className="risk-input-wrap">
          <input
            type="text"
            className="risk-input"
            placeholder="กรอกจำนวน..."
            value={answers[current] || ""}
            onChange={(e) => {
              let v = e.target.value;

              // ลบ comma ก่อนประมวลผล
              v = v.replace(/,/g, "");

              // ⛔ ห้ามตัวอักษรหรือสัญลักษณ์แปลก ๆ
              if (!/^[0-9.]*$/.test(v)) return;

              // ========== เงื่อนไขพิเศษแต่ละข้อ ==========

              // ❗ ข้อ 19 → ต้องเป็นจำนวนเต็ม
              if (q.id === 19) {
                v = v.replace(/\./g, ""); // ไม่อนุญาตจุด
                if (v === "") {
                  setAnswers({ ...answers, [current]: "" });
                  return;
                }
                v = formatNumber(v);
                setAnswers({ ...answers, [current]: v });
                return;
              }

              const parts = v.split(".");
              if (parts.length > 2) return;

              if (parts[1]) parts[1] = parts[1].slice(0, 2); // จำกัดทศนิยม 2 หลัก

              v = parts.join(".");

              let formatted = formatNumber(v);

              setAnswers({ ...answers, [current]: formatted });
            }}
          />

          {q.id === 20 && <span className="unit">%</span>}
        </div>
      );
    }

    return q.choices.map((c, i) => (
      <label key={i} className="risk-option">
        
        <span className={`radio ${answers[current] === c ? "active" : ""}`}></span>


        <input
          type="radio"
          name="choice"
          checked={answers[current] === c}
          onChange={() => setAnswers({ ...answers, [current]: c })}
          style={{ display: "none" }}
        />
        <span className="opt-text">{c}</span>
      </label>
    ));
  };

  if (loading || questions.length === 0) {
    return (
      <div className="risk-loading">
        กำลังโหลดคำถาม...
      </div>
    );
  }

  return (
    <>
    <button 
      className="exit-btn"
      onClick={() => {
        Swal.fire({
          title: "ต้องการออกจากแบบประเมิน?",
          text: "ข้อมูลที่ตอบไว้จะไม่ถูกบันทึก",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ออก",
          cancelButtonText: "ยกเลิก",
          confirmButtonColor: "#ef4444",
          cancelButtonColor: "#6b7280"
        }).then(result => {
          if (result.isConfirmed) navigate("/");
        });
      }}
    >
      ✕
    </button>
    <section className="risk-page">

      <h1 className="risk-header-title">แบบประเมินความเสี่ยงการลงทุนเพื่อใช้ในการแนะนำหุ้น</h1>
      <p className="risk-header-desc">กรุณาตอบคำถามทั้งหมด 20 ข้อเพื่อให้ระบบแนะนำหุ้นที่เหมาะสมกับคุณ</p>

      {/* Progress Circles */}
      <div className="progress-circles">
        {[...Array(total)].map((_, i) => {
          const qNum = i + 1;
          const answered = answers[qNum];

          return (
            <div
              key={i}
              className={`circle 
                ${current === qNum ? "current" : ""} 
                ${answered ? "done" : ""}
              `}
              onClick={() => setCurrent(qNum)}
            >
              {qNum}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="risk-card">
        <div className="card-header">
          <h2 className="risk-question">
            {questions[current - 1].id}. {questions[current - 1].question}
          </h2>

          {/* ปุ่มเคลียร์คำตอบ */}
          <button className="clear-btn" onClick={clearCurrentAnswer}>
            ล้างคำตอบ
          </button>
        </div>

        <div className="risk-choices">
          {renderChoices()}
        </div>
      </div>

      <div className={`risk-card-buttons ${current === 1 ? "first-page" : ""}`}>
        {current > 1 && (
          <button className="btn-back" onClick={handleBack}>← ก่อนหน้า</button>
        )}

        <button
          className={current === total ? "btn-result" : "btn-next"}
          onClick={handleNext}
        >
          {current === total ? (
            <>
              <img src="/pics/check.png" className="check-icon" />
              ดูผลการประเมิน
            </>
          ) : "ถัดไป →"}
        </button>
      </div>

    </section>
    </>
  );
}
