import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();

  /* user data */
  const userInfo = {
    name: "โกจิ",
    lastname: "เบอรี่",
    username: "goji_berry",
    riskLevel: "ปานกลาง",
    riskLevelColor: "mid", // mid | low | high
    email: "gojiberry007@gmail.com",
    phone: "063-063-6540",
    gender: "ไก่",
    birthday: "01/05/2548",
    joinDate: "01/01/2567",
    evaluateCount: 2,
    favoriteCount: 4,
  };

  /* history data */
  const riskHistory = [
    {
      id: 2,
      level: "ปานกลาง",
      levelColor: "mid",
      date: "12/01/2568 14:30:00",
      score: "3.2 / 5.0",
      stocks: ["PTT", "AOT", "ADVANC", "PTTEP", "AP"],
    },
    {
      id: 1,
      level: "ต่ำ",
      levelColor: "low",
      date: "15/06/2567 10:15:00",
      score: "2.8 / 5.0",
      stocks: ["BBL", "KBANK", "CPALL", "SCB", "TU"],
    },
  ];

  /* favorite data อย่าลืมมาแก้รูป*/ 
  const favoriteStocks = [
    {
        symbol: "PTT",
        name: "บริษัท ปตท. จำกัด (มหาชน)",
        price: 33.25,
        change: +0.25,
        percent: "+0.76%",
        logo: "/pics/marckris.jpg",
    },
    {
        symbol: "KBANK",
        name: "ธนาคารกสิกรไทย จำกัด (มหาชน)",
        price: 166.00,
        change: -1.50,
        percent: "-0.90%",
        logo: "/pics/marckris.jpg",
    },
    {
        symbol: "CPALL",
        name: "บริษัท ซีพี ออลล์ จำกัด (มหาชน)",
        price: 58.75,
        change: +1.25,
        percent: "+2.17%",
        logo: "/pics/marckris.jpg",
    },
    {
        symbol: "WAVE",
        name: "บริษัท เวฟ เอ็นเตอร์เทนเมนท์ จำกัด (มหาชน)",
        price: 0.04,
        change: +0.01,
        percent: "+3.33%",
        logo: "/pics/marckris.jpg",
    }
    ];

  return (
    <>
        <section className="profile-page">

        {/* ===== BACK HEADER ===== */}
        <div className="back-header">
            <div className="back-row" onClick={() => navigate(-1)}>
                <img src="/pics/back.png" className="back-arrow" />
                <span className="back-text">ย้อนกลับ</span>
            </div>

            <h1 className="page-main-title">โปรไฟล์ผู้ใช้</h1>
        </div>

        {/* ===== Card: Header โปรไฟล์ ===== */}
        <section className="profile-header-card">
            <div className="profile-top">
            <div className="profile-avatar">
                <img src="/pics/marckris.jpg" alt="profile-picture" className="profile-picture" />
            </div>

            <div className="profile-info">
                <h2 className="profile-name">{userInfo.name} {userInfo.lastname}</h2>
                <p className="profile-username">@{userInfo.username}</p>

                <div className="profile-badges">
                <span className="badge badge-mid">ความเสี่ยง{userInfo.riskLevel}</span>
                <span className="badge badge-small">
                    <img src="/pics/history.png" alt="history" className="history-icon" />
                    {userInfo.evaluateCount} ครั้งที่ประเมิน
                </span>
                <span className="badge badge-small">
                    <img src="/pics/favorite.png" alt="favorite" className="favorite-icon" />
                    {userInfo.favoriteCount} หุ้นรายการโปรด
                </span>
                </div>

                <div className="profile-join">เข้าร่วมเมื่อ {userInfo.joinDate}</div>
            </div>
            </div>
        </section>

        {/* ===== Profile Tabs (เหมือนหน้า detail เด๊ะๆ) ===== */}
        <section className="profile-tabs-card">
        <div className="profile-tabs-row">

            <button
            className={
                "profile-tab " + (activeTab === "info" ? "profile-tab--active" : "")
            }
            onClick={() => setActiveTab("info")}
            >
            <img src="/pics/user.png" alt="user" className="user-icon" />
            ข้อมูลส่วนตัว
            </button>

            <button
            className={
                "profile-tab " + (activeTab === "risk" ? "profile-tab--active" : "")
            }
            onClick={() => setActiveTab("risk")}
            >
            <img src="/pics/history.png" alt="history" className="history-icon" />
            ประวัติการประเมินความเสี่ยง
            </button>

            <button
            className={
                "profile-tab " + (activeTab === "favorite" ? "profile-tab--active" : "")
            }
            onClick={() => setActiveTab("favorite")}
            >
            <img src="/pics/favorite.png" alt="favorite" className="favorite-icon" />
            หุ้นรายการโปรด
            </button>

            <button
            className={
                "profile-tab " + (activeTab === "settings" ? "profile-tab--active" : "")
            }
            onClick={() => setActiveTab("settings")}
            >
            <img src="/pics/setting.png" alt="setting" className="setting-icon" />
            ตั้งค่า
            </button>

        </div>
        </section>

        {/* ===== Card เนื้อหาแต่ละ Tab ===== */}
        <section className="profile-content-card">

            {activeTab === "info" && (
                <div className="tab-section">

                    {/* Header ของ section ข้อมูลส่วนตัว */}
                    <div className="profile-section-header">
                    <div className="profile-section-left">
                        <img src="/pics/user.png" alt="user" className="user-icon" />
                        <span className="profile-section-title">ข้อมูลส่วนตัว</span>
                    </div>

                    <button className="profile-edit-btn" onClick={() => navigate("/edit-profile")}>
                        <img src="/pics/edit.png" className="edit-icon" />
                        แก้ไข
                    </button>
                    </div>

                    {/* ช่องกรอกข้อมูล */}
                    <div className="info-grid">
                        <div className="info-field"><label>ชื่อ</label><input value={userInfo.name} readOnly /></div>
                        <div className="info-field"><label>นามสกุล</label><input value={userInfo.lastname} readOnly /></div>
                        <div className="info-field"><label>อีเมล</label><input value={userInfo.email} readOnly /></div>
                        <div className="info-field"><label>เบอร์โทรศัพท์</label><input value={userInfo.phone} readOnly /></div>
                        <div className="info-field"><label>วันเกิด</label><input value={userInfo.birthday} readOnly /></div>
                        <div className="info-field"><label>เพศ</label><input value={userInfo.gender} readOnly /></div>
                    </div>

                </div>
            )}

            {/* ประวัติประเมิน */}
            {activeTab === "risk" && (
                <div className="tab-section">

                <div className="profile-section-header">
                    <div className="profile-section-left">
                    <img src="/pics/history.png" className="history-icon" />
                    <span className="profile-section-title">ประวัติการประเมินความเสี่ยง</span>
                    </div>
                </div>

                {riskHistory.map((item) => (
                    <div key={item.id} className="risk-card">

                    <div className="risk-card-header">
                        <div>
                        <div className="risk-title">การประเมินครั้งที่ {item.id}</div>
                        <span className={`risk-badge risk-${item.levelColor}`}>{item.level}</span>
                        </div>

                        <button className="risk-detail-btn">ดูรายละเอียด</button>
                    </div>

                    <div className="risk-row">
                        <span className="risk-label">วันที่ประเมิน:</span>
                        <span className="risk-text">{item.date}</span>
                    </div>

                    <div className="risk-row">
                        <span className="risk-label">คะแนน:</span>
                        <span className="risk-score">{item.score}</span>
                    </div>

                    <div className="risk-row">
                        <span className="risk-label">หุ้นแนะนำ:</span>
                        <div className="risk-stock-list">
                        {item.stocks.map((s) => (
                            <span key={s} className="risk-stock">{s}</span>
                        ))}
                        </div>
                    </div>

                    </div>
                ))}

                </div>
            )}

            {activeTab === "favorite" && (
            <div className="tab-section">

                {/* Title */}
                <div className="profile-section-header">
                <div className="profile-section-left">
                    <img src="/pics/favorite.png" className="favorite-icon" />
                    <span className="profile-section-title">
                    หุ้นรายการโปรด ({favoriteStocks.length} หุ้น)
                    </span>
                </div>
                </div>

                {/* Grid ของการ์ด */}
                <div className="favorite-grid">

                {favoriteStocks.map((stock, idx) => (
                    <div key={idx} className="favorite-card">

                    {/* บรรทัดบน: โลโก้ + ชื่อหุ้น + icon heart */}
                    <div className="fav-header">
                        <div className="fav-left">
                        <img src={stock.logo} className="fav-logo" />
                        <div className="fav-info">
                            <div className="fav-symbol">{stock.symbol}</div>
                            <div className="fav-name">{stock.name}</div>
                        </div>
                        </div>
                        {/* F13434 */}
                        <img src="/pics/heart.png" className="fav-heart" />
                    </div>

                    {/* ราคา */}
                    <div className="fav-price-block">
                        <div className="fav-price">฿{stock.price}</div>

                        <div
                        className={
                            "fav-change " +
                            (stock.change >= 0 ? "fav-up" : "fav-down")
                        }
                        >
                        {stock.change >= 0 ? "▲" : "▼"} {stock.change} ({stock.percent})
                        </div>
                    </div>

                    {/* ปุ่ม */}
                    <button className="fav-detail-btn">ดูรายละเอียด</button>

                    </div>
                ))}

                </div>
            </div>
            )}

            {activeTab === "settings" && (
            <div className="tab-section">

                {/* ===== Header ===== */}
                <div className="profile-section-header">
                <div className="profile-section-left">
                    <img src="/pics/setting.png" className="setting-icon" />
                    <span className="profile-section-title">การจัดการ</span>
                </div>
                </div>

                {/* ===== การ์ดใหญ่ครอบทั้งหมด ===== */}
                <div className="settings-container">

                {/* === การ์ดย่อย: โหมดมืด === */}
                <div className="settings-card">
                    <div className="settings-left">
                    <span className="settings-title">โหมดมืด</span>
                    <p className="settings-desc">ใช้ธีมสีมืดสำหรับการแสดงผล</p>
                    </div>

                    {/* Toggle แบบใน Figma */}
                    <button className="dark-toggle on">
                    <div className="toggle-circle">
                        <img src="/pics/dark_mode.png" alt="dark" className="toggle-icon"/>
                    </div>
                    </button>
                </div>

                {/* === การ์ดย่อย: ออกจากระบบ === */}
                <div className="settings-card logout-card">
                    <div className="logout-left">
                    <span className="settings-title">ออกจากระบบ</span>
                    <p className="settings-desc">ออกจากระบบในอุปกรณ์นี้</p>
                    </div>

                    <button className="logout-btn">
                    <img src="/pics/logout.png" className="logout-icon" />
                    ออกจากระบบ
                    </button>
                </div>

                </div>

            </div>
            )}

        </section>
    </section>
    </>
  );
}
