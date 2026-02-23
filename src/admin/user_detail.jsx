import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getdataUser } from "../fetchapi/call_api_admin";
import "../css/admin_css/user_detail.css";

export default function AdminUserDetail() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info");

  const { user_id } = useParams();

  const [user, setUser] = useState([]);
  useEffect(() => {
      async function fetchData() {
          try {
            const res = await getdataUser(user_id);
            console.log("res data user: ", res);
            setUser(res.data);
          } catch (err) {
            console.error("Error loading data:", err);
          }
      }
    fetchData();
  }, [user_id]);

  const getRiskClass = (level) => {
    switch (level) {
      case "ต่ำ":
        return "low";
      case "ปานกลาง":
        return "mid";
      default:
        return "high";
    }
  };

  /* ========== SAMPLE USER DATA ========== */
  const us = {
    name: "โกจิ",
    lastname: "เบอรี่",
    username: "goji_berry",
    avatar: "/pics/marckris.jpg",
    riskLevel: "ปานกลาง",
    riskColor: "mid",
    email: "gojiberry007@gmail.com",
    phone: "063-063-6540",
    gender: "ไก่",
    birthday: "01/05/2548",
    joined: "01/01/2567",
    evaluateCount: 2,
    favoriteCount: 4,
  };

  const riskHistory = [
    {
      id: 2,
      level: "ปานกลาง",
      levelColor: "mid",
      date: "12/01/2568 14:30",
      score: "3.2 / 5.0",
      stocks: ["PTT", "AOT", "ADVANC", "PTTEP", "CPALL"],
    },
    {
      id: 1,
      level: "ต่ำ",
      levelColor: "low",
      date: "22/09/2567 10:15",
      score: "2.8 / 5.0",
      stocks: ["BBL", "KBANK", "BTS", "SCB"],
    },
  ];

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
      price: 166,
      change: -1.5,
      percent: "-0.90%",
      logo: "/pics/marckris.jpg",
    },
  ];

  const portfolio = [
    { symbol: "PTT", units: 120, avg: 31.5, value: 3780 },
    { symbol: "AOT", units: 50, avg: 67, value: 3350 },
    { symbol: "ADVANC", units: 10, avg: 215, value: 2150 },
  ];

  return (
    <div className="admin-user-detail-page">

      <h1 className="admin-title">ข้อมูลผู้ใช้งาน</h1>

      {/* ===== PROFILE HEADER ===== */}
      <section className="profile-header-card">
        <div className="profile-top">

          <div className="profile-avatar">
            <img src={user.photo_path} className="profile-picture" />
          </div>

          <div className="profile-info">
            <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
            <p className="profile-username">{user.email}</p>

            <div className="profile-badges">
              <span className={`badge badge-${getRiskClass(user.level_name)}`}>
                ความเสี่ยง{user.level_name}
              </span>

              <span className="badge badge-small">
                <img src="/pics/history.png" alt="history" className="history-icon"/>
                {user.assessment_count} ครั้งที่ประเมิน
              </span>

              <span className="badge badge-small">
                <img src="/pics/favorite.png" alt="favorite" className="favorite-icon"/>
                {user.favorite_stock_count} หุ้นรายการโปรด
              </span>
            </div>

            <div className="profile-join">
              เข้าร่วมเมื่อ{" "}
              {new Date(user.created_at).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TABS ===== */}
      <section className="profile-tabs-card">
        <div className="profile-tabs-row">

          <button
            className={"profile-tab " + (activeTab === "info" ? "profile-tab--active" : "")}
            onClick={() => setActiveTab("info")}
          >
            <img src="/pics/user.png" />
            ข้อมูลส่วนตัว
          </button>

          <button
            className={"profile-tab " + (activeTab === "risk" ? "profile-tab--active" : "")}
            onClick={() => setActiveTab("risk")}
          >
            <img src="/pics/history.png" />
            ประวัติประเมิน
          </button>

          <button
            className={"profile-tab " + (activeTab === "favorite" ? "profile-tab--active" : "")}
            onClick={() => setActiveTab("favorite")}
          >
            <img src="/pics/favorite.png" />
            หุ้นโปรด
          </button>

          <button
            className={"profile-tab " + (activeTab === "portfolio" ? "profile-tab--active" : "")}
            onClick={() => setActiveTab("portfolio")}
          >
            <img src="/pics/portfolio.png" />
            พอร์ตการลงทุน
          </button>

        </div>
      </section>

      {/* ===== CONTENT CARD ===== */}
      <section className="profile-content-card">

        {/* TAB 1 : ข้อมูลส่วนตัว */}
        {activeTab === "info" && (
          <div className="tab-section">

            <div className="section-title-wrapper">
                <div className="section-title">
                    <div className="profile-section-left">
                        <img src="/pics/user.png" className="icon-med" />
                        <span className="profile-section-title">ข้อมูลส่วนตัว</span>
                    </div>
                </div>

                <button className="profile-edit-btn">
                    <img src="/pics/edit.png" className="edit-icon" />
                    แก้ไข
                </button>
            </div>

            <div className="info-grid">
              <div className="info-field"><label>ชื่อ</label><input value={user.first_name} readOnly /></div>
              <div className="info-field"><label>นามสกุล</label><input value={user.last_name} readOnly /></div>
              <div className="info-field"><label>อีเมล</label><input value={user.email} readOnly /></div>
              <div className="info-field"><label>เบอร์โทรศัพท์</label><input value={user.phone_num} readOnly /></div>
              <div className="info-field"><label>วันเกิด</label><input value={user.birth_date} readOnly /></div>
              <div className="info-field"><label>เพศ</label><input value={user.gender_name} readOnly /></div>
            </div>

          </div>
        )}

        {/* TAB 2 : ประวัติประเมิน */}
        {activeTab === "risk" && (
          <div className="tab-section">

            <div className="section-title">
              <img src="/pics/history.png" className="icon-med" />
              ประวัติการประเมินความเสี่ยง
            </div>

            {riskHistory.map((item) => (
              <div className="risk-card" key={item.id}>
                <div className="risk-header">
                  <div className="risk-title">การประเมินครั้งที่ {item.id}</div>
                  <span className={`risk-badge risk-${item.levelColor}`}>{item.level}</span>
                </div>

                <div className="risk-row"><span>วันที่:</span> {item.date}</div>
                <div className="risk-row"><span>คะแนน:</span> {item.score}</div>

                <div className="risk-row">
                  <span>หุ้นแนะนำ:</span>
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

        {/* TAB 3 : หุ้นโปรด */}
        {activeTab === "favorite" && (
          <div className="tab-section">

            <div className="section-title">
              <img src="/pics/favorite.png" className="icon-med" />
              หุ้นโปรดทั้งหมด ({favoriteStocks.length})
            </div>

            <div className="favorite-grid">
              {favoriteStocks.map((stock) => (
                <div className="favorite-card" key={stock.symbol}>
                  <div className="fav-header">
                    <div className="fav-left">
                      <img src={stock.logo} className="fav-logo" />
                      <div className="fav-info">
                        <div className="fav-symbol">{stock.symbol}</div>
                        <div className="fav-name">{stock.name}</div>
                      </div>
                    </div>
                    <img src="/pics/heart.png" className="fav-heart" />
                  </div>

                  <div className="fav-price">฿{stock.price}</div>
                  <div className={stock.change >= 0 ? "fav-up" : "fav-down"}>
                    {stock.change >= 0 ? "▲" : "▼"} {stock.change} ({stock.percent})
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4 : พอร์ตลงทุน */}
        {activeTab === "portfolio" && (
          <div className="tab-section">

            <div className="section-title">
              <img src="/pics/portfolio.png" className="icon-med" />
              พอร์ตการลงทุน
            </div>

            <table className="portfolio-table">
              <thead>
                <tr>
                  <th>สัญลักษณ์</th>
                  <th>จำนวนหน่วย</th>
                  <th>ราคาเฉลี่ย</th>
                  <th>มูลค่า</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((p) => (
                  <tr key={p.symbol}>
                    <td>{p.symbol}</td>
                    <td>{p.units}</td>
                    <td>{p.avg}</td>
                    <td>฿{p.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </section>
    </div>
  );
}
