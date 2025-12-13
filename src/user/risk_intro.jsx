import { useState } from "react";
import "../css/risk_intro.css";
import { useNavigate } from "react-router-dom";

export default function RiskIntro() {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);

  return (
    <>
      {/* HERO */}
      <section className="risk-hero">
        <div className="risk-hero-bg"></div>
        <div className="risk-hero-overlay"></div>

        <div className="risk-hero-content">
          <p className="risk-hero-eyebrow">แบบประเมินความเสี่ยง</p>
          <h1 className="risk-hero-title">ประเมินระดับความเสี่ยงของคุณ</h1>
        </div>
      </section>

      {/* MAIN PAGE */}
      <section className="intro-page">
        <div className="intro-container">

          {/* 3 FEATURE BOXES */}
          <div className="intro-feature-row">
            <div className="intro-feature-card">
              <img src="/pics/time.png" className="feature-icon" />
              <p className="feature-title">ใช้เวลาเพียง</p>
              <p className="feature-value">3 – 5 นาที</p>
            </div>

            <div className="intro-feature-card">
              <img src="/pics/question.png" className="feature-icon" />
              <p className="feature-title">มีทั้งหมด</p>
              <p className="feature-value">20 คำถาม</p>
            </div>

            <div className="intro-feature-card">
              <img src="/pics/show.png" className="feature-icon" />
              <p className="feature-title">แสดงผลลัพธ์</p>
              <p className="feature-value">ระดับความเสี่ยงของคุณ</p>
            </div>
          </div>

          {/* BENEFIT BOX */}
            <div className="intro-benefit-card">
            <div className="benefit-header-row">
                <img src="/pics/receive.png" className="benefit-header-icon" />
                <h2 className="benefit-header">สิ่งที่คุณจะได้รับ</h2>
            </div>

            <div className="benefit-list">

                <div className="benefit-block">
                    <div className="benefit-num">1</div>
                    <div className="benefit-text">
                        <p className="benefit-title">ผลการประเมินความเสี่ยงส่วนบุคคล</p>
                        <p className="benefit-desc">
                            รู้ระดับความเสี่ยงของคุณ พร้อมคำอธิบายโดยละเอียด
                        </p>
                    </div>
                </div>

                <div className="benefit-block">
                    <div className="benefit-num">2</div>
                    <div className="benefit-text">
                        <p className="benefit-title">รายชื่อหุ้นที่แนะนำ</p>
                        <p className="benefit-desc">
                            รับคำแนะนำหุ้นที่เหมาะสมกับระดับความเสี่ยงและเป้าหมายของคุณ
                        </p>
                    </div>
                </div>

                <div className="benefit-block">
                    <div className="benefit-num">3</div>
                    <div className="benefit-text">
                        <p className="benefit-title">กลยุทธ์การกระจายพอร์ตการลงทุน</p>
                        <p className="benefit-desc">
                            ได้รับคำแนะนำสัดส่วนการลงทุนที่เหมาะสมในหมวดประเภทต่าง ๆ
                        </p>
                    </div>
                </div>

                <div className="benefit-block">
                    <div className="benefit-num">4</div>
                    <div className="benefit-text">
                        <p className="benefit-title">คำแนะนำและข้อควรระวัง</p>
                        <p className="benefit-desc">
                            เรียนรู้จุดที่ควรระวังและแนวทางการบริหารความเสี่ยงที่เหมาะกับคุณ
                        </p>
                    </div>
                </div>

            </div>
        </div>

          {/* INFO BOX — ข้อมูลที่จะใช้ในการประเมิน */}
          <div className="intro-info-card">
            <div className="info-header">
              <img src="/pics/document.png" className="info-icon" />
              <span>ข้อมูลที่เราจะใช้ในการประเมิน</span>
            </div>

            <div className="info-grid">
              <div>
                <p><span className="dot"></span> อายุและสถานภาพการทำงาน</p>
                <p><span className="dot"></span> รายได้และค่าใช้จ่ายรายเดือน</p>
                <p><span className="dot"></span> ประสบการณ์การลงทุน</p>
              </div>

              <div>
                <p><span className="dot"></span> เป้าหมายการลงทุน</p>
                <p><span className="dot"></span> ระยะเวลาการลงทุนที่คาดหวัง</p>
                <p><span className="dot"></span> ทัศนคติต่อความเสี่ยง</p>
              </div>
            </div>
          </div>

          {/* CONFIRMATION CARD */}
          <div className="intro-confirm-card">
            <div className="confirm-row">
              <img src="/pics/shield.png" className="confirm-icon" />
              <span>
                เพื่อความปลอดภัยและความถูกต้องของข้อมูล กรุณายืนยันว่าคุณยินยอมให้ระบบใช้ข้อมูลในการวิเคราะห์ 
                เพื่อแนะนำหุ้นที่เหมาะสมกับคุณ
              </span>
            </div>

            <label className="confirm-checkbox-row">
              <input
                type="checkbox"
                className="modern-checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>ฉันยินยอมให้ระบบใช้ข้อมูลจากแบบประเมินเพื่อแนะนำหุ้นที่เหมาะสมกับฉัน</span>
            </label>
          </div>

          {/* START BUTTON */}
          <div className="intro-start-wrap">
            <button
              className={`intro-start-btn ${agree ? "active" : ""}`}
              disabled={!agree}
              onClick={() => agree && navigate("/risk-evaluation")}
            >
              เริ่มทำแบบประเมิน
            </button>
          </div>

          {/* WARNING */}
          <div className="intro-warning">
            <img src="/pics/warning.png" className="warning-icon" />

            <div className="warning-text">
              <p className="warning-title">ข้อควรระวัง</p>
              <p>
                ผลการประเมินนี้เป็นเพียงคำแนะนำเบื้องต้น ไม่ใช่คำแนะนำการลงทุนโดยตรง 
                ผู้ลงทุนควรศึกษาข้อมูลเพิ่มเติม และปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจลงทุนจริง
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
