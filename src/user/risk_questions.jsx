import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { getQuestions, submitAssessment, getRecommendation, getAssessmentAnswers } from "../fetchapi/call_api_user";

import "../css/risk_questions.css";

// หน่วยของข้อที่ตอบเป็นตัวเลข (ข้อ 18 งบประมาณ, 19 ระยะเวลา, 20 ผลตอบแทนต่อปี)
// แสดง 2 จุด: ต่อท้ายคำถามเป็นวงเล็บ และต่อท้ายช่องกรอก
const UNIT_BY_QUESTION = { 18: "บาท", 19: "ปี", 20: "%" };

// ข้อความคำถาม + หน่วยในวงเล็บ เช่น "ระยะเวลาที่ตั้งใจจะลงทุน (ปี)"
// ถ้าข้อความคำถามในฐานข้อมูลมีหน่วยในวงเล็บอยู่แล้ว จะไม่ต่อซ้ำ
const questionTitle = (q) => {
  const unit = UNIT_BY_QUESTION[q.id];
  if (!unit || q.question.includes(`(${unit})`)) return q.question;
  return `${q.question} (${unit})`;
};

const formatWithComma = (num) => {
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

// แปลงคำตอบที่บันทึกไว้ใน DB → รูปแบบ answers ของหน้านี้
const buildPrefill = (formatted, raw, saved) => {
  const byQ = {};
  saved.forEach((a) => { byQ[a.question_id] = a; });

  const result = {};
  formatted.forEach((q) => {
    const a = byQ[q.id];
    if (!a) return;

    // ข้อกรอกตัวเลข (18–20)
    if (q.type === "text") {
      const v = (a.answer || "").replace(/,/g, "");
      if (v === "") return;
      result[q.id] = q.id === 20 ? v : formatWithComma(v);
      return;
    }

    // ข้อเลือก → หาข้อความตัวเลือกจาก choice_id
    const rawQ = raw.find((x) => x.question_id === q.id);
    const choice = rawQ?.choices.find((c) => c.choice_id === a.choice_id);
    if (!choice) return; // ตัวเลือกถูกลบไปแล้ว หรือเป็นข้อที่ถูกข้าม → ให้ผู้ใช้ตอบใหม่
    result[q.id] = q.type === "multiple" ? [choice.choice_text] : choice.choice_text;
  });

  // ข้อ 13 ตอบว่าไม่เคยลงทุน → ข้อ 14 ต้องถูกข้ามเหมือนตอนทำครั้งแรก
  if (result[13] === "ไม่เคยลงทุนมาก่อน") result[14] = ["__skip__"];

  return result;
};

export default function RiskQuestions() {
  const total = 20;
  const navigate = useNavigate();
  const location = useLocation();
  const prefillAttemptId = location.state?.prefillAttemptId;
  const prefillNo = location.state?.prefillNo;

  const [questions, setQuestions] = useState([]);
  const [rawQuestions, setRawQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await getQuestions();
        setRawQuestions(data);

        const formatted = data.map(q => ({
          id: q.question_id,
          question: q.question,
          type: q.question_type_name === "เลือกคำตอบเดียว" ? "single"
            : q.question_type_name === "เลือกหลายคำตอบ" ? "multiple"
              : "text",
          choices: q.choices?.map(c => c.choice_text) || []
        }));

        setQuestions(formatted);

        // มาจากปุ่ม "ประเมินใหม่จากคำตอบนี้" → เติมคำตอบเดิมให้
        if (prefillAttemptId) {
          try {
            const token = localStorage.getItem("token");
            const saved = await getAssessmentAnswers(token, prefillAttemptId);
            setAnswers(buildPrefill(formatted, data, saved));
          } catch (err) {
            console.error("ดึงคำตอบเดิมไม่สำเร็จ", err);
            Swal.fire("ดึงคำตอบเดิมไม่สำเร็จ", "สามารถทำแบบประเมินใหม่ได้ตามปกติ", "warning");
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("โหลดคำถามไม่สำเร็จ", err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดคำถามได้", "error");
      }
    }

    fetchQuestions();
  }, [prefillAttemptId]);

  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState({});

  // เช็คว่ามีข้อไหนยังไม่ได้ตอบ
  const checkIncomplete = () => {
    for (let i = 1; i <= total; i++) {
      if (!answers[i] || answers[i].length === 0) return i;
    }
    return null;
  };

  const handleNext = async () => {
    if (current < total) {
      // ข้อ 13 ตอบว่า "ไม่เคยลงทุนมาก่อน" → ข้ามข้อ 14 ไปข้อ 15 เลย
      if (current === 13 && answers[14]?.[0] === "__skip__") {
        setCurrent(15);
        return;
      }
      setCurrent(current + 1);
      return;
    }

    // เช็คครบไหม
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

    try {
      Swal.fire({
        title: "กำลังประมวลผล...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const token = localStorage.getItem("token");

      // แปลง answers → payload
      const answersPayload = questions.map((q) => {
        if (q.type === "text") {
          // ข้อกรอก → ส่ง answer เป็น string (ลบ comma ออก)
          const raw = answers[q.id] || "";
          return {
            question_id: q.id,
            answer: raw.replace(/,/g, ""),
          };
        } else {
          // ข้อเลือก → หา choice_id จาก choice_text
          const selectedText = Array.isArray(answers[q.id])
            ? answers[q.id][0]   // multiple → เอาตัวแรก
            : answers[q.id];

          const originalQ = questions.find((x) => x.id === q.id);
          // หา choice_id จาก raw data
          const rawQ = rawQuestions.find((x) => x.question_id === q.id);
          const choice = rawQ?.choices.find((c) => c.choice_text === selectedText);

          return {
            question_id: q.id,
            choice_id: choice?.choice_id || null,
          };
        }
      });

      // budget/invest_years/expected_return จากข้อ 18-20
      const budget = parseFloat((answers[18] || "0").replace(/,/g, ""));
      const invest_years = parseInt((answers[19] || "0").replace(/,/g, ""));
      const expected_return = parseFloat((answers[20] || "0").replace(/,/g, ""));

      const payload = {
        answers: answersPayload,
        budget,
        invest_years,
        expected_return,
      };

      const assessmentRes = await submitAssessment(token, payload);
      const attempt_id = assessmentRes.attempt_id;

      const recommendRes = await getRecommendation(token, attempt_id);

      Swal.close();

      navigate("/risk-result", { state: { assessment: assessmentRes, recommend: recommendRes } });

    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถประมวลผลได้", "error");
      console.error(err);
    }
  };

  const handleBack = () => {
    // ถ้าข้อ 14 ถูกข้ามไว้ (ตอบข้อ 13 ว่าไม่เคยลงทุนมาก่อน) กด "ก่อนหน้า" จากข้อ 15 ให้ย้อนกลับไปข้อ 13 เลย
    if (current === 15 && answers[14]?.[0] === "__skip__") {
      setCurrent(13);
      return;
    }
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

              // ❗ ข้อ 19 → ต้องเป็นจำนวนเต็ม และไม่เกิน 50 ปี
              if (q.id === 19) {
                v = v.replace(/\./g, ""); // ไม่อนุญาตจุด
                if (v === "") {
                  setAnswers({ ...answers, [current]: "" });
                  return;
                }

                const yearsNumeric = parseInt(v, 10);
                if (!isNaN(yearsNumeric) && yearsNumeric > 50) return; // เกิน 50 ปี ไม่ยอมรับค่าที่พิมพ์เข้ามา

                v = formatNumber(v);
                setAnswers({ ...answers, [current]: v });
                return;
              }

              // ❗ ข้อ 20 → เป็น % รับทศนิยมได้ แต่ห้ามเกิน 100
              if (q.id === 20) {
                const parts20 = v.split(".");
                if (parts20.length > 2) return; // มีจุดเกิน 1 จุดไม่ได้

                if (parts20[1]) parts20[1] = parts20[1].slice(0, 2); // ทศนิยมไม่เกิน 2 หลัก

                v = parts20.join(".");

                if (v === "" || v === ".") {
                  setAnswers({ ...answers, [current]: v });
                  return;
                }

                const numeric = parseFloat(v);
                if (!isNaN(numeric) && numeric > 100) return; // เกิน 100 ไม่ยอมรับค่าที่พิมพ์เข้ามา

                // ไม่ต้องใส่ comma คั่นหลักพัน เพราะค่าสูงสุดคือ 100 อยู่แล้ว
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

          {/* หน่วยหลังช่องกรอก: ข้อ 18 = บาท, ข้อ 19 = ปี, ข้อ 20 = % */}
          {UNIT_BY_QUESTION[q.id] && (
            <span className="unit">{UNIT_BY_QUESTION[q.id]}</span>
          )}
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
          onChange={() => {
            const updated = { ...answers, [current]: c };

            // ข้อ 13 = "ไม่เคยลงทุนมาก่อน" → ข้ามข้อ 14 อัตโนมัติ (ไม่เคยลงทุนแล้วไม่มีประเภทสินทรัพย์ให้เลือก)
            if (current === 13) {
              if (c === "ไม่เคยลงทุนมาก่อน") {
                updated[14] = ["__skip__"];
              } else if (answers[14]?.[0] === "__skip__") {
                // เปลี่ยนใจจากเดิมที่ตอบว่าไม่เคยลงทุน → เคลียร์ค่าที่ข้ามไว้ ให้กลับไปตอบข้อ 14 ใหม่
                updated[14] = undefined;
              }
            }

            setAnswers(updated);
          }}
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
            if (result.isConfirmed) navigate("/risk");
          });
        }}
      >
        ✕
      </button>
      <section className="risk-page">

        <h1 className="risk-header-title">แบบประเมินความเสี่ยงการลงทุนเพื่อใช้ในการแนะนำหุ้น</h1>
        <p className="risk-header-desc">กรุณาตอบคำถามทั้งหมด 20 ข้อเพื่อให้ระบบแนะนำหุ้นที่เหมาะสมกับคุณ</p>
        {prefillAttemptId && (
          <p className="risk-header-desc">
            ระบบเติมคำตอบจากการประเมิน{prefillNo ? `ครั้งที่ ${prefillNo}` : "ครั้งก่อน"}ไว้ให้แล้ว
            แก้เฉพาะข้อที่ต้องการ แล้วกดวงกลมข้อ 20 เพื่อดูผลได้เลย (การประเมินครั้งเดิมจะไม่ถูกแก้ไข)
          </p>
        )}

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
        <div className="risk-question-card">
          <div className="card-header">
            <h2 className="risk-question">
              {questions[current - 1].id}. {questionTitle(questions[current - 1])}
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