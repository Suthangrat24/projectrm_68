import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/add_investment.css";

export default function EditInvestment() {
  const navigate = useNavigate();

  // โหลดข้อมูลเดิมมาแก้ไข — เดี๋ยวคุณค่อยดึงจาก API จริง
  const [form, setForm] = useState({
    symbol: "BDMS",
    date: "2025-01-10",
    type: "buy",
    shares: "2000",
    price: "22.80",
    note: "ถือยาว",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("แก้ไขข้อมูลสำเร็จแล้ว (ไว้ต่อ API ทีหลังได้)");
    navigate("/portfolio");
  };

  return (
    <>
    <section className="addinv-page">

      {/* ===== ROW 1: BACK BUTTON ===== */}
      <div className="addinv-row-back">
        <button className="addinv-back" onClick={() => navigate("/portfolio")}>
          <img src="/pics/back.png" alt="back" className="back-icon" />
          ย้อนกลับ
        </button>
      </div>

      {/* ===== ROW 2: TITLE + SAVE BUTTON ===== */}
      <div className="addinv-row-header">
        <h1 className="addinv-title">แก้ไขข้อมูลการลงทุน</h1>

        <button className="btn-save" onClick={handleSave}>
          บันทึกข้อมูล
        </button>
      </div>

      {/* ===== CARD 1 ===== */}
      <div className="addinv-card">
        <div className="addinv-card-header">
          <div className="addinv-icon-wrap">
            <img src="/pics/select_stock.png" className="addinv-icon" />
          </div>
          <div className="addinv-title">เลือกหุ้น</div>
        </div>

        <div className="addinv-field">
          <label>ชื่อย่อ / ชื่อเต็มหุ้น *</label>
          <input
            type="text"
            name="symbol"
            placeholder="กรอกรหัสหุ้น เช่น PTT"
            value={form.symbol}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ===== CARD 2 ===== */}
      <div className="addinv-card">
        <div className="addinv-card-header">
          <div className="add-detail-icon-wrap">
            <img src="/pics/add_detail.png" className="add-detail-icon" />
          </div>
          <div className="addinv-title">รายละเอียดการทำรายการ</div>
        </div>

        <div className="addinv-grid">
          <div className="addinv-field">
            <label>วันที่ทำรายการ *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="addinv-field">
            <label>ประเภทรายการ *</label>
            
            <div className="select-wrapper">
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">เลือกประเภทรายการ</option>
                <option value="buy">ซื้อ</option>
                <option value="sell">ขาย</option>
              </select>

              {/* --- icon ใหม่ --- */}
              <img src="/pics/drop-down.png" className="select-icon" alt="drop"/>
            </div>
          </div>
        </div>

        <div className="addinv-grid">
          <div className="addinv-field">
            <label>จำนวนหุ้น *</label>
            <input
              type="number"
              name="shares"
              placeholder="เช่น 100"
              value={form.shares}
              onChange={handleChange}
            />
          </div>

          <div className="addinv-field">
            <label>ราคาต่อหุ้น (บาท) *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="เช่น 32.50"
              value={form.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="addinv-field">
          <label>หมายเหตุ</label>
          <textarea
            name="note"
            placeholder="เขียนหมายเหตุเพิ่มเติม"
            value={form.note}
            onChange={handleChange}
          ></textarea>
        </div>

      </div>
    </section>
    </>
  );
}
