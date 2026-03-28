import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStocks, addPortfolio } from "../fetchapi/call_api_user";
import Swal from "sweetalert2";
import "../css/add_investment.css";

export default function AddInvestment() {
  const navigate = useNavigate();

  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function loadStocks() {
      try {
        const res = await getStocks();
        setStocks(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadStocks();
  }, []);

  const [form, setForm] = useState({
    symbol: "",
    stock_id: "",
    date: "",
    type: "",
    shares: "",
    price: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "symbol") {
      if (!value) {
        setShowDropdown(false); // ปิด dropdown
      } else {
        setShowDropdown(true); // เปิด dropdown
      }
    }

    setForm({
      ...form,
      [name]: value,
    });

    if (name === "symbol") {
      const keyword = value.toLowerCase();

      const filtered = stocks.filter((s) =>
        s.symbol.toLowerCase().includes(keyword) ||
        s.stock_name.toLowerCase().includes(keyword)
      );

      setFilteredStocks(filtered.slice(0, 10)); // เอาแค่ 10 ตัว
      setShowDropdown(true);
    }
  };

  const handleSelectStock = (stock) => {
    setForm({
      ...form,
      symbol: stock.symbol,
      stock_id: stock.stock_id,
    });

    setShowDropdown(false);
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

    if (!result.isConfirmed) return;
    const token = localStorage.getItem("token");

    try {
      if (!form.stock_id) {
        alert("กรุณาเลือกหุ้น");
        return;
      }

      if (!form.date || !form.type || !form.shares || !form.price) {
        alert("กรอกข้อมูลให้ครบ");
        return;
      }

      const payload = {
        stock_id: Number(form.stock_id), 
        invest_date: form.date, // format: YYYY-MM-DD
        invest_type_id: Number(form.type), // 1 / 2
        number_of_share: Number(form.shares),
        price_per_share: Number(form.price),
        note: form.note || "",
      };

      console.log("payload:", payload);

      await addPortfolio(token, payload);

      await Swal.fire({
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonColor: "#00C853",
      });

      navigate("/portfolio");

    } catch (err) {
      console.error(err);

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
          <h1 className="addinv-title">เพิ่มข้อมูลการลงทุน</h1>

          <button className="btn-save" onClick={handleSave}>
            บันทึกข้อมูล
          </button>
        </div>

        {/* ===== CARD 1: เลือกหุ้น ===== */}
        <div className="addinv-card">
          <div className="addinv-card-header">
            <div className="addinv-icon-wrap">
              <img src="/pics/graph-2.png" className="addinv-icon" />
            </div>
            <div className="addinv-title">เลือกหุ้น</div>
          </div>

          <div className="addinv-field autocomplete">
            <label>
              ชื่อย่อ / ชื่อเต็มหุ้น<span className="required">*</span>
            </label>

            <input
              type="text"
              name="symbol"
              placeholder="กรอกรหัสหุ้น เช่น PTT"
              value={form.symbol}
              onChange={handleChange}
              onFocus={() => setShowDropdown(true)}
            />

            {showDropdown && filteredStocks.length > 0 && (
              <div className="autocomplete-dropdown">
                {filteredStocks.map((stock) => (
                  <div
                    key={stock.stock_id}
                    className="autocomplete-item"
                    onClick={() => handleSelectStock(stock)}
                  >
                    <div className="symbol">{stock.symbol}</div>
                    <div className="name">{stock.stock_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== CARD 2: รายละเอียดการทำรายการ ===== */}
        <div className="addinv-card">
          <div className="addinv-card-header">
            <div className="add-detail-icon-wrap">
              {/* 4086F4 */}
              <img src="/pics/add_detail.png" className="add-detail-icon" />
            </div>
            <div className="addinv-title">รายละเอียดการลงทุน</div>
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
              <label>
                ราคาต่อหุ้น (บาท)<span className="required">*</span>
              </label>
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
              placeholder="เช่น เหตุผลที่ซื้อ, กลยุทธ์การลงทุน หรือเป้าหมายกำไร"
              value={form.note}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </section>
    </>
  );
}
