import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/index.css"; 

export default function Navbar() {

    const navigate = useNavigate();

    // ------ Top Five (ไม่ fetch) ------
    const top_five = [
        { rank: 1, symbol: "PT",   name: "ปตท.",                     price: 33.25, change: +0.25, pct: +0.76, value: 151136551, amount: 4996684.08 },
        { rank: 2, symbol: "DELTA", name: "เดลต้า อีเลคโทรนิคส์",     price: 91.50, change: -0.30, pct: -0.21, value: 98765432,  amount: 3210000.50 },
        { rank: 3, symbol: "BDMS",  name: "กรุงเทพดุสิตเวชการ",       price: 28.75, change: +0.10, pct: +0.35, value: 75643123,  amount: 2755000.20 },
        { rank: 4, symbol: "ADVANC",name: "แอดวานซ์ อินโฟร์ เซอร์วิส", price: 189.0, change: +0.50, pct: +0.26, value: 65431234,  amount: 1669000.10 },
        { rank: 5, symbol: "CRC",   name: "เซ็นทรัล รีเทล คอร์ปอเรชั่น", price: 39.75, change: +0.20, pct: +0.50, value: 54321234,  amount: 1511104.00 },
    ];

    const [selected, setSelected] = useState(0);
    const [tab, setTab] = useState("value");
    const s = top_five[selected];

    const favorites = [
        { symbol: "PTT",   name: "ปตท.",        price: 33.25, pct: +2.31, bar: 70 },
        { symbol: "KBANK", name: "กสิกรไทย",    price: 166.00, pct: -1.50, bar: 60 },
        { symbol: "CPALL", name: "ซีพี ออลล์",  price: 58.75, pct: +1.25, bar: 55 },
        { symbol: "WAVE",  name: "เวฟ เอ็นเตอร์เทนเมนท์", price: 0.04, pct: +0.01, bar: 40 },
    ];

    return (
        <>
        {/*Recommend*/}
        <section className="rec">
            <div className="rec_container">
                <div className="rec_text">
                    <h1 className="rec_title">แนะนำหุ้นที่เหมาะสมกับคุณในการลงทุนระยะยาว</h1>
                    <p className="rec_des">
                        จากข้อมูลที่คุณกรอกในแบบประเมิน ระบบจะวิเคราะห์โปรไฟล์และพฤติกรรมการลงทุนของคุณ
                        และแนะนำหุ้นที่ตรงกับคุณ เพื่อเลือกหุ้นที่สอดคล้องกับผลการประเมิน ช่วยให้คุณตัดสินใจลงทุนได้ง่ายและมั่นใจยิ่งขึ้น
                    </p>
                    <p className="rec_note">
                        <span className="fw-bold">หมายเหตุ: </span>
                        ระบบนี้เป็นเพียงเครื่องมือช่วยแนะนำ ไม่ใช่คำแนะนำการลงทุนโดยตรง<br />
                        <span className="text-danger">การลงทุนมีความเสี่ยง</span><br />
                        กรุณาศึกษาข้อมูลให้รอบคอบ และตัดสินใจลงทุนตามความเหมาะสมของตนเอง
                    </p>
                </div>
                <div className="rec_button">
                    <button className="rec_cta" onClick={() => navigate("/risk-evaluation")}>
                        เริ่มต้นใช้งาน
                        <img src="/pics/next.png" alt="next" className="next-icon" />
                    </button>
                </div>
            </div>
        </section>

        {/*ติดตามพอร์ต*/}
        <section className="invest">
            {/*หัวข้อ*/}
            <div className="invest_top">
                <div className="invest_title">
                <div>
                    <h3>ติดตามสถานะหุ้นที่ลงทุน</h3>
                    <p>เปรียบเทียบราคาปัจจุบัน ณ เวลาที่ล็อกอิน และการคาดการณ์</p>
                </div>
                </div>
                <a className="invest_manage" href="#">
                จัดการพอร์ต →
                </a>
            </div>

            <div className="invest_grid">
                {/* ซ้าย: รายการหุ้นในพอร์ต */}
                <aside className="invest_list">
                <div className="stockcard stockcard--active">
                    <div className="stockcard_left">
                    <h4>PTT</h4>
                    <p>ปตท.</p>
                    <span className="label">ราคาตลาด</span>
                    <div className="bar">
                        <div className="bar_fill" style={{ width: '72%' }} />
                    </div>
                    </div>
                    <div className="stockcard_right">
                    <div className="price">33.25 B</div>
                    <div className="chg">+750.00 ฿</div>
                    <div className="pct pct--up">+2.31%</div>
                    </div>
                </div>

                <div className="stockcard">
                    <div className="stockcard_left">
                    <h4>BDMS</h4>
                    <p>กรุงเทพดุสิตเวชการ</p>
                    <span className="label">ราคาตลาด</span>
                    <div className="bar">
                        <div className="bar_fill" style={{ width: '43%' }} />
                    </div>
                    </div>
                    <div className="stockcard_right">
                    <div className="price">23.40 B</div>
                    <div className="chg">+1,200.00 ฿</div>
                    <div className="pct pct--up">+2.63%</div>
                    </div>
                </div>

                <div className="stockcard">
                    <div className="stockcard_left">
                    <h4>ADVANC</h4>
                    <p>แอดวานซ์ อินโฟร์ เซอร์วิส</p>
                    <span className="label">ราคาตลาด</span>
                    <div className="bar">
                        <div className="bar_fill" style={{ width: '58%' }} />
                    </div>
                    </div>
                    <div className="stockcard_right">
                    <div className="price">189.00 B</div>
                    <div className="chg">+2,000.00 ฿</div>
                    <div className="pct pct--up">+2.16%</div>
                    </div>
                </div>

                <div className="stockcard">
                    <div className="stockcard_left">
                    <h4>KBANK</h4>
                    <p>กสิกรไทย</p>
                    <span className="label">ราคาตลาด</span>
                    <div className="bar">
                        <div className="bar_fill" style={{ width: '36%' }} />
                    </div>
                    </div>
                    <div className="stockcard_right">
                    <div className="price">142.50 B</div>
                    <div className="chg">+1,350.00 ฿</div>
                    <div className="pct pct--up">+3.26%</div>
                    </div>
                </div>

                <button className="invest_add">+ เพิ่มหุ้นใหม่</button>
                </aside>

                <div className="invest_panel">
                    <div className="panel_head">
                        <div>
                        <div className="panel_title">PTT</div>
                        <div className="panel_sub">บริษัท ปตท. จำกัด (มหาชน)</div>
                        <div className="panel_line">
                            <span className="muted">ราคาปัจจุบัน: </span>
                            <span className="panel_price">33.25 B</span>
                            <span className="panel_pct">+0.75 (+2.31%)</span>
                        </div>
                        </div>
                        <button className="btn--pill">ดูรายละเอียด</button>
                    </div>

                    <div className="panel_chart">
                        [ พื้นที่สำหรับกราฟจริง ]
                    </div>

                    <div className="panel_legend">
                        <span className="dot dot--actual" /> Actual (Real-time)
                        <span className="dot dot--base" /> Baseline @ Login
                        <span className="dot dot--model" /> Predicted (model)
                        <span className="ghost">predictedHigh</span>
                        <span className="ghost">predictedLow</span>
                    </div>

                    <div className="panel_foot">
                        แสดงราคาจริง ณ เวลาเดียวกับข้อมูล | Baseline = ราคาตอนผู้ใช้ล็อกอินครั้งล่าสุด
                        <span className="right">อัปเดตล่าสุด: 17/10/2568 18:47:32 (UTC+7)</span>
                    </div>
                </div>
            </div>
        </section>

        {/* ===== Top Five ===== */}
        <section className="top_five">
            <div className="top_container">

                {/* หัวข้อ + แท็บ */}
                <div className="top_header">
                    <h3>5 อันดับสูงสุด</h3>
                    <div className="top_tabs">
                        <button className={`tab_btn ${tab === "value" ? "is-active" : ""}`} onClick={() => setTab("value")}>
                            {/* icon มูลค่า (ตัวอย่าง path) */}
                            <img className="btn_icon" src={ tab === "value" ? "../public/pics/value_active.png" : "../public/pics/value_norm.png"} alt="" />
                            มูลค่าการซื้อขาย
                        </button>
                        <button className={`tab_btn ${tab === "volume" ? "is-active" : ""}`} onClick={() => setTab("volume")}>
                            {/* icon ปริมาณ (ตัวอย่าง path) */}
                            <img className="btn_icon" src={ tab === "volume" ? "../public/pics/volume_active.png" : "../public/pics/volume_norm.png"} alt="" />
                            ปริมาณการซื้อขาย
                        </button>
                        <button className={`tab_btn ${tab === "up" ? "is-active" : ""}`} onClick={() => setTab("up")}>
                            {/* icon ราคาเพิ่มขึ้น */}
                            <img className="btn_icon" src={ tab === "up" ? "../public/pics/up_active.png" : "../public/pics/up_norm.png"} alt="" />
                            ราคาเพิ่มขึ้น
                        </button>
                        <button className={`tab_btn ${tab === "down" ? "is-active" : ""}`} onClick={() => setTab("down")}>
                            {/* icon ราคาลดลง */}
                            <img className="btn_icon" src={ tab === "down" ? "../public/pics/down_active.png" : "../public/pics/down_norm.png"} alt="" />
                            ราคาลดลง
                        </button>
                    </div>
                </div>

                <div className="top_content">
                    {/* ซ้าย: รายการ 5 อันดับ */}
                    <aside className="top_list">
                        {top_five.map((it, idx) => (
                        <button
                            key={it.symbol}
                            className={`top_item ${idx === selected ? "active" : ""}`}
                            onClick={() => setSelected(idx)}
                        >
                            <div className="left">
                            <span className="top_rank">{it.rank}</span>

                            {/* โลโก้ – ใส่รูปจริงภายหลังได้ (ตั้งชื่อไฟล์ /logos/SYMBOL.png) */}
                            <div
                                className="top_logo"
                                style={{ backgroundImage: `url(/logos/${it.symbol}.png)` }}
                                aria-hidden
                            />

                            <div className="top_symbolwrap">
                                <div className="top_symbol">{it.symbol}</div>
                                <div className="top_name">{it.name}</div>
                            </div>
                            </div>

                            <div className="right">
                            <div className="top_amount">
                                ฿ {it.amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                            </div>
                            </div>
                        </button>
                        ))}
                    </aside>

                    {/* ขวา: กล่องรายละเอียด (bubble) */}
                    <div className="top_panel" style={{ "--sel": selected }}>
                        <div className="top_panel_in">
                            <div className="top_panel_head">
                                <div className="price_block">
                                    <div className="price_now_row">
                                        <span className={`arrow_icon ${s.change >= 0 ? "up" : "down"}`}>{s.change >= 0 ? "▲" : "▼"}</span>
                                        <span className="price_now">฿{s.price.toFixed(2)}</span>
                                    </div>
                                    <div className={`price_chg ${s.change >= 0 ? "up" : "down"}`}>
                                        {(s.change >= 0 ? "+" : "") + s.change.toFixed(2)}{" "}
                                        ({(s.pct >= 0 ? "+" : "") + s.pct.toFixed(2)}%)
                                    </div>
                                </div>

                                {/* ขวา: ข้อมูลล่าสุด + ปริมาณ/มูลค่า (ใช้ของเดิมที่ทำไว้แล้วได้เลย) */}
                                <div className="meta_wrap">
                                    <div className="latest_text">ข้อมูลล่าสุด : 11 ก.ย. 2568 02:30:10</div>

                                    <div className="meta_block right">
                                    <div className="meta_col">
                                        <div className="meta_val">฿ {s.value.toLocaleString("th-TH")}</div>
                                        <div className="meta_lbl">ปริมาณ (หุ้น)</div>
                                    </div>
                                    <div className="meta_col">
                                        <div className="meta_val">฿ {s.amount.toLocaleString("th-TH")}</div>
                                        <div className="meta_lbl">มูลค่า (‘000 บาท)</div>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <div className="top_chartbox">[ พื้นที่สำหรับกราฟจริง ]</div>

                            <div className="top_panel_foot">
                                <div className="foot_left">
                                    <span className="foot_label">ราคาสูงสุด</span>
                                    <span className="foot_val">33.50</span>

                                    <span className="foot_divider" />

                                    <span className="foot_label">ราคาต่ำสุด</span>
                                    <span className="foot_val">32.75</span>
                                </div>

                                <button className="btn-soft">ดูรายละเอียด →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="favorite">
            <div className="fav_container">
                <div className="fav_head">
                    <div className="fav_titlewrap">
                        <div>
                            <h3>หุ้นที่ติดตาม</h3>
                            <p>หุ้นที่คุณสนใจและติดตาม</p>
                        </div>
                    </div>

                    <button className="fav_all">ดูทั้งหมด →</button>
                </div>

                {/* การ์ดแบบเลื่อนแนวนอน */}
                <div className="fav_scroller">
                    {favorites.map((f) => {
                        const isUp = f.pct >= 0;
                        return (
                            <article key={f.symbol} className="fav_card">
                                <header className="fav_card_head">
                                    <div className="fav_symbol_block">
                                        <div className="fav_symbol">{f.symbol}</div>
                                        <div className="fav_name">{f.name}</div>
                                    </div>

                                    {/* ไอคอนหัวใจขวาบน – เปลี่ยนเป็น <img> ใช้รูปจริงภายหลังได้ */}
                                    {/* ตัวอย่าง: <img className="fav_heart" src="/icons/heart_fill.png" alt="" /> */}
                                    <span className="fav_heart">♡</span>
                                </header>

                                <div className="fav_price">฿ {f.price.toFixed(2)}</div>

                                <div className={`fav_change ${isUp ? "up" : "down"}`}> {isUp ? "+" : ""} {f.pct.toFixed(2)}%</div>

                                <div className="fav_bar">
                                    <div className={`fav_bar_fill ${isUp ? "up" : "down"}`} style={{ width: `${f.bar}%` }} />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
        </> 
    );
}