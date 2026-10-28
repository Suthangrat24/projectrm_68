import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStocks, addPortfolio } from "../fetchapi/call_api_user";
import Swal from "sweetalert2";
import "../css/add_investment.css";

const MAX_DROPDOWN_ITEMS = 10;

export default function AddInvestment() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── ค่าที่ส่งมาจากหน้าคำแนะนำ (ปุ่ม "+ เพิ่มเข้าพอร์ต") ──
  // ถ้ามาจากที่อื่น (เช่นเมนู "เพิ่มการลงทุน" ตรงๆ) location.state จะเป็น null ตามปกติ
  const prefill = location.state || {};
  const attemptId = prefill.attempt_id ?? null;

  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const TYPE_OPTIONS = [
    { value: "1", label: "ซื้อ" },
    { value: "2", label: "ขาย" },
  ];

  useEffect(() => {
    async function loadStocks() {
      try {
        const res = await getStocks();
        setStocks(res.data);

        // ถ้ามาจากหน้าคำแนะนำ พอโหลดหุ้นเสร็จ ให้หา stock_id ของ symbol ที่ prefill มา
        if (prefill.prefill_symbol) {
          const matched = res.data.find(
            (s) => s.symbol.toLowerCase() === prefill.prefill_symbol.toLowerCase()
          );
          if (matched) {
            setForm((prev) => ({
              ...prev,
              symbol: matched.symbol,
              stock_id: matched.stock_id,
            }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form, setForm] = useState({
    symbol: prefill.prefill_symbol || "",
    stock_id: "",
    date: "",
    type: prefill.prefill_symbol ? "1" : "", // มาจากคำแนะนำ = ค่าเริ่มต้นเป็น "ซื้อ"
    shares: "",
    price: prefill.prefill_price ?? "",
    note: prefill.prefill_symbol ? `เพิ่มจากคำแนะนำระบบ` : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "symbol") {
      setShowDropdown(true);

      const keyword = value.toLowerCase();
      const filtered = keyword
        ? stocks.filter(
            (s) =>
              s.symbol.toLowerCase().includes(keyword) ||
              s.stock_name.toLowerCase().includes(keyword)
          )
        : stocks; // ช่องว่าง = โชว์ทั้งหมด (ตัด slice ทีหลัง)

      setFilteredStocks(filtered.slice(0, MAX_DROPDOWN_ITEMS));

      // พิมพ์เองใหม่ = ยกเลิกการเลือกหุ้นเดิม จนกว่าจะกดเลือกจาก dropdown อีกครั้ง
      setForm((prev) => ({ ...prev, symbol: value, stock_id: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocusSymbol = () => {
    // โฟกัสครั้งแรก (ยังไม่พิมพ์อะไร) ให้โชว์ตัวเลือกทั้งหมดทันที เหมือนเปิด dropdown
    // พิมพ์ต่อแล้วค่อยกรองแคบลงใน handleChange
    if (!form.symbol) {
      setFilteredStocks(stocks.slice(0, MAX_DROPDOWN_ITEMS));
    }
    setShowDropdown(true);
  };

  const handleSelectStock = (stock) => {
    setForm((prev) => ({
      ...prev,
      symbol: stock.symbol,
      stock_id: stock.stock_id,
    }));
    setShowDropdown(false);
  };

  const handleSelectType = (value) => {
    setForm((prev) => ({ ...prev, type: value }));
    setShowTypeDropdown(false);
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
        alert("กรุณาเลือกหุ้นจากรายการ");
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
        attempt_id: attemptId, // null ถ้าไม่ได้มาจากหน้าคำแนะนำ — backend ต้องรองรับ field นี้
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

        {attemptId && (
          <div className="addinv-prefill-banner">
            หุ้นตัวนี้มาจากคำแนะนำของระบบ — ราคาที่กรอกไว้คือราคาตอนแนะนำ
            แก้ไขได้ถ้าราคาซื้อจริงต่างไป
          </div>
        )}

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

            <div className="autocomplete-input-wrapper">
              <input
                type="text"
                name="symbol"
                placeholder="พิมพ์ค้นหา หรือกดเพื่อดูรายการหุ้นทั้งหมด"
                value={form.symbol}
                onChange={handleChange}
                onFocus={handleFocusSymbol}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                autoComplete="off"
              />
              <img
                src="/pics/drop-down.png"
                className={`autocomplete-dropdown-icon${showDropdown ? " is-open" : ""}`}
                alt="drop"
                onMouseDown={(e) => e.preventDefault()} // กันไม่ให้แย่ง focus ไปจาก input
                onClick={handleFocusSymbol}
              />
            </div>

            {showDropdown && filteredStocks.length > 0 && (
              <div className="autocomplete-dropdown">
                {filteredStocks.map((stock) => (
                  <div
                    key={stock.stock_id}
                    className="autocomplete-item"
                    onMouseDown={() => handleSelectStock(stock)}
                  >
                    <div className="symbol">{stock.symbol}</div>
                    <div className="name">{stock.stock_name}</div>
                  </div>
                ))}
              </div>
            )}

            {form.symbol && !form.stock_id && (
              <div className="addinv-hint-warning">
                ยังไม่ได้เลือกหุ้นจากรายการ — กดเลือกจากดรอปดาวน์ก่อนบันทึก
              </div>
            )}
          </div>
        </div>

        {/* ===== CARD 2: รายละเอียดการทำรายการ ===== */}
        <div className="addinv-card">
          <div className="addinv-card-header">
            <div className="add-detail-icon-wrap">
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

              <div className="type-dropdown-wrapper autocomplete">
                <div
                  className="type-dropdown-trigger"
                  tabIndex={0}
                  onClick={() => setShowTypeDropdown((prev) => !prev)}
                  onBlur={() => setTimeout(() => setShowTypeDropdown(false), 150)}
                >
                  <span className={form.type ? "" : "type-placeholder"}>
                    {TYPE_OPTIONS.find((t) => t.value === form.type)?.label || "เลือกประเภท"}
                  </span>
                  <img
                    src="/pics/drop-down.png"
                    className={`autocomplete-dropdown-icon${showTypeDropdown ? " is-open" : ""}`}
                    alt="drop"
                  />
                </div>

                {showTypeDropdown && (
                  <div className="autocomplete-dropdown">
                    {TYPE_OPTIONS.map((t) => (
                      <div
                        key={t.value}
                        className={`autocomplete-item type-item${form.type === t.value ? " is-selected" : ""}`}
                        onMouseDown={() => handleSelectType(t.value)}
                      >
                        {t.label}
                      </div>
                    ))}
                  </div>
                )}
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