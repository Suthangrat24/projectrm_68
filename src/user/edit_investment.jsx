import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPortfolioById, editPortfolio } from "../fetchapi/call_api_user";
import Swal from "sweetalert2";
import "../css/add_investment.css";

export default function EditInvestment() {
  const navigate = useNavigate();
  const { portfolio_id } = useParams();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    symbol: "",
    date: "",
    type: "",
    shares: "",
    price: "",
    note: "",
  });

  useEffect(() => {
    async function loadInvestment() {
      try {
        const res = await getPortfolioById(token, portfolio_id);
        setForm({
          symbol: res.symbol,
          date: res.invest_date,
          type: res.invest_type_id,
          shares: res.number_of_share,
          price: res.price_per_share,
          note: res.note,
        });
      } catch (err) {
        console.error("ไม่สามารถดึงข้อมูลการลงทุนได้", err);
      }
    }

    loadInvestment();
  }, [portfolio_id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการบันทึก?",
      text: "คุณต้องการบันทึกข้อมูลการลงทุนนี้ใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00C853",
      cancelButtonColor: "#d33",
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return; // ถ้าผู้ใช้ยกเลิก จะไม่ทำการบันทึก

    try {
      // ตรวจสอบว่ามีข้อมูลครบหรือไม่
      if (!form.symbol) {
        alert("กรุณาเลือกหุ้น");
        return;
      }

      if (!form.date || !form.type || !form.shares || !form.price) {
        alert("กรอกข้อมูลให้ครบ");
        return;
      }

      // สร้างข้อมูลที่จะส่งไปอัปเดต
      const payload = {
        symbol: form.symbol,
        invest_date: form.date, // format: YYYY-MM-DD
        invest_type_id: form.type, // 1 / 2
        number_of_share: Number(form.shares),
        price_per_share: Number(form.price),
        note: form.note || "",
      };

      console.log("payload:", payload);

      // เรียก API เพื่ออัปเดตข้อมูล
      await editPortfolio(token, portfolio_id, payload);

      // แจ้งผู้ใช้ว่าอัปเดตสำเร็จ
      await Swal.fire({
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonColor: "#00C853",
      });

      // กลับไปยังหน้า portfolio
      navigate("/portfolio");

    } catch (err) {
      console.error(err);

      // แจ้งผู้ใช้กรณีเกิดข้อผิดพลาด
      Swal.fire({
        title: "ผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <>
      <section className="addinv-page">

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
              <img src="/pics/graph-2.png" className="addinv-icon" />
            </div>
            <div className="addinv-title">เลือกหุ้น</div>
          </div>

          <div className="addinv-field">
            <label>
              ชื่อย่อ / ชื่อเต็มหุ้น<span className="required">*</span>
            </label>
            <input
              type="text"
              name="symbol"
              placeholder="กรอกรหัสหุ้น เช่น PTT"
              value={form.symbol}
              onChange={handleChange}
              disabled
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
              <label>
                วันที่ทำรายการ<span className="required">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="addinv-field">
              <label>
                ประเภท<span className="required">*</span>
              </label>

              <div className="select-invest-wrapper">
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="">เลือกประเภท</option>
                  <option value="1">ซื้อ</option>
                  <option value="2">ขาย</option>
                </select>

                {/* --- icon ใหม่ --- */}
                <img src="/pics/drop-down.png" className="select-icon" alt="drop" />
              </div>
            </div>
          </div>

          <div className="addinv-grid">
            <div className="addinv-field">
              <label>
                จำนวนหุ้น<span className="required">*</span>
              </label>
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
