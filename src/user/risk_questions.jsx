import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../css/risk_questions.css";

export default function RiskQuestions() {
  const total = 20;
  const navigate = useNavigate();

  const questions = [
    { id: 1, question: "ความมั่นคงของรายได้", type: "single", choices: [
      "ผันผวนมาก / ไม่แน่นอน (ไม่มีรายได้ประจำ)",
      "ค่อนข้างผันผวน (รายได้เปลี่ยนแปลงสูง)",
      "ปานกลาง (มีรายได้หลัก แต่บางเดือนอาจไม่แน่นอน)",
      "มั่นคง (มีรายได้ประจำและเสริมบางส่วน)",
      "มั่นคงมาก (รายได้ประจำสม่ำเสมอชัดเจน)",
    ]},

    { id: 2, question: "คุณมีเงินสำรองฉุกเฉินเพียงพอกี่เดือน?", type: "single", choices: [
      "ไม่มีเลย / น้อยกว่า 1 เดือน",
      "1 - 3 เดือน",
      "4 - 6 เดือน",
      "7 - 12 เดือน",
      "มากกว่า 12 เดือน",
    ]},

    { id: 3, question: "ค่าใช้จ่ายของคุณคิดเป็นกี่เปอร์เซ็นต์ของรายได้?", type: "single", choices: [
      "มากกว่า 80% (เหลือเงินเก็บน้อยมาก)",
      "60–80%",
      "40–60%",
      "20–40%",
      "น้อยกว่า 20% (เหลือเงินเก็บเยอะ)",
    ]},

    { id: 4, question: "ท่านมีหนี้สินเป็นสัดส่วนเท่าใดของรายได้ทั้งหมด?", type: "single", choices: [
      "มากกว่า 80%",
      "50–80%",
      "20–50%",
      "น้อยกว่า 20%",
      "ไม่มีหนี้สินเลย",
    ]},

    { id: 5, question: "เป้าหมายทางการเงินหลักของคุณคืออะไร?", type: "single", choices: [
      "รักษาเงินต้น",
      "มีรายได้เสริมจากดอกเบี้ย/ปันผล",
      "เติบโตแบบค่อยเป็นค่อยไป",
      "สร้างความมั่งคั่งระยะยาว",
      "เก็งกำไรเพื่อผลตอบแทนสูงสุด",
    ]},

    { id: 6, question: "คุณสามารถยอมรับความเสี่ยงได้มากน้อยเพียงใด?", type: "single", choices: [
      "ไม่ยอมรับเลย",
      "ยอมรับได้น้อย",
      "ปานกลาง",
      "ยอมรับได้มาก",
      "ยอมรับได้มากที่สุด",
    ]},

    { id: 7, question: "คุณยอมรับการขาดทุนได้สูงสุดกี่เปอร์เซ็นต์?", type: "single", choices: [
      "ไม่เกิน 5%",
      "5–10%",
      "10–15%",
      "15–20%",
      "มากกว่า 20%",
    ]},

    { id: 8, question: "หากพอร์ตลดลง 20% คุณจะทำอย่างไร?", type: "single", choices: [
      "ขายทั้งหมดทันที",
      "ขายบางส่วน",
      "ถือรอดู",
      "ทยอยซื้อเพิ่ม",
      "ซื้อเพิ่มทันที",
    ]},

    { id: 9, question: "ถ้าเงินปันผลหรือรายได้การลงทุนลดลงหรือหยุดจ่าย คุณจะทำอย่างไร?", type: "single", choices: [
      "ขายทันที",
      "ลดสัดส่วน",
      "ถือไว้",
      "ถือและซื้อเพิ่ม",
      "รอประเมินก่อน",
    ]},

    { id: 10, question: "หากมีข้อมูลจำกัด คุณจะทำอย่างไร?", type: "single", choices: [
      "ไม่ลงทุน",
      "ลงทุนเล็กน้อย",
      "ลงทุนปานกลาง",
      "ลงทุนมากขึ้น",
      "ลงทุนเต็มพอร์ตทันที",
    ]},

    { id: 11, question: "เมื่อมีข่าวลบ คุณจะทำอย่างไร?", type: "single", choices: [
      "ขายทันที",
      "ลดสัดส่วน",
      "ถือรอดู",
      "ถือและซื้อเพิ่มเล็กน้อย",
      "ซื้อเพิ่มมาก",
    ]},

    { id: 12, question: "ระดับความรู้ด้านการลงทุนของคุณ", type: "single", choices: [
      "ไม่มีความรู้",
      "พอรู้พื้นฐาน",
      "ระดับกลาง",
      "มีประสบการณ์จริง",
      "เชี่ยวชาญ",
    ]},

    { id: 13, question: "ประสบการณ์ลงทุน", type: "single", choices: [
      "ไม่เคยลงทุน",
      "เคยลองเล็กน้อย",
      "ลงทุน ≤3 ปี",
      "ลงทุน 4–7 ปี",
      "มากกว่า 7 ปี",
    ]},

    { id: 14, question: "ประเภทสินทรัพย์ที่คุณเคยลงทุน", type: "multiple", choices: [
      "เงินฝาก/พันธบัตร",
      "กองทุนรวม",
      "หุ้นไทย",
      "หุ้นต่างประเทศ/ทอง",
      "ตราสารอนุพันธ์/คริปโต",
    ]},

    { id: 15, question: "ถ้าไม่ได้กำไรตามหวัง คุณจะทำอย่างไร?", type: "single", choices: [
      "เลิกลงทุนทันที",
      "ลดสัดส่วน",
      "ถือรอดู",
      "ซื้อเพิ่มเพื่อเฉลี่ยต้นทุน",
      "เพิ่มเงินลงทุนสำหรับกำไรเร็ว",
    ]},

    { id: 16, question: "เมื่อมีความผันผวน คุณควบคุมอารมณ์ได้ไหม?", type: "single", choices: [
      "ไม่ได้เลย",
      "ควบคุมได้น้อย",
      "ปานกลาง",
      "ควบคุมได้ดี",
      "ได้ดีมาก",
    ]},

    { id: 17, question: "คุณให้ความสำคัญกับสิ่งใดมากที่สุด?", type: "single", choices: [
      "ปลอดภัย 100%",
      "ปลอดภัยมากกว่าเล็กน้อย",
      "สมดุลความเสี่ยง-ผลตอบแทน",
      "ผลตอบแทนสูง เสี่ยงบ้าง",
      "ผลตอบแทนสูงสุด เสี่ยงสูง",
    ]},

    { id: 18, question: "งบประมาณเริ่มต้นของคุณ (บาท)", type: "text" },
    { id: 19, question: "ระยะเวลาที่ตั้งใจจะลงทุน (ปี)", type: "text" },
    { id: 20, question: "ผลตอบแทนที่คุณคาดหวังต่อปี (%)", type: "text" },
  ];

  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState({});

  const percent = Math.floor(((current - 1) / total) * 100);

  const handleNext = () => {
    if (!answers[current]) {
        Swal.fire({
            icon: "warning",
            title: questions[current - 1].type === "text"
                ? "กรุณากรอกคำตอบ"
                : "โปรดเลือกคำตอบ",
            text: questions[current - 1].type === "text"
                ? "กรุณากรอกคำตอบก่อนกดถัดไป"
                : "กรุณาเลือกคำตอบก่อนกดถัดไป",
            confirmButtonColor: "#22c55e"
        });
        return;
    }

    if (current === total) {
        navigate("/risk-result");
        return;
    }
    setCurrent(current + 1);
  };

  const handleBack = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const renderChoices = () => {
    const q = questions[current - 1];

    // MULTIPLE
    if (q.type === "multiple") {
      return q.choices.map((c, i) => (
        <label key={i} className="risk-option">
          <span className={`checkbox ${answers[current]?.includes(c) ? "active" : ""}`}></span>
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

    // TEXT
    if (q.type === "text") {
      return (
        <div className="risk-input-wrap">
          <input
            type="number"
            className="risk-input"
            placeholder="กรอกจำนวน..."
            value={answers[current] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [current]: e.target.value })
            }
          />
          {q.id === 20 && <span className="unit">%</span>}
        </div>
      );
    }

    // SINGLE
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

  return (
    <>
    <section className="risk-page">

      <h1 className="risk-title">แบบประเมินความเสี่ยงการลงทุนเพื่อใช้ในการแนะนำหุ้น</h1>
      <p className="risk-desc">กรุณาตอบคำถามทั้งหมด 20 ข้อเพื่อให้ระบบแนะนำหุ้นที่เหมาะสมกับคุณ</p>

      <div className="risk-progress-header">
        <span className="risk-left">ข้อ {current} จาก {total}</span>
        <span className="risk-right">{percent}% เสร็จสิ้น</span>
      </div>

      <div className="risk-progress-bar">
        <div className="risk-progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="risk-card">
        <>
          <h2 className="risk-question">{questions[current - 1].id}. {questions[current - 1].question}</h2>
          <div className="risk-choices">{renderChoices()}</div>
        </>
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
