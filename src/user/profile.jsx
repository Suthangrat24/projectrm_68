import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { getUserById, getFavorites, getStockLatest, deleteFavorite, getAssessmentHistory } from "../fetchapi/call_api_user";
import "../css/profile.css";

export default function Profile() {
    const navigate = useNavigate();
    const { user_id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [user, setUser] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getUserById(user_id);
                setUser(data);
            } catch (err) {
                console.error("โหลดข้อมูลผู้ใช้ล้มเหลว", err);
            }
        }
        load();
    }, [user_id]);

    const handleTab = (newTab) => {
        setSearchParams({ tab: newTab });
    };

    // อ่าน tab จาก URL
    const tabFromURL = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {
        if (tabFromURL) setActiveTab(tabFromURL);
    }, [tabFromURL]);

    const getRiskClass = (level_id) => {
        if (level_id <= 2) return "low";
        if (level_id === 3) return "mid";
        return "high";
    };

    const [riskHistory, setRiskHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

        async function fetchHistory() {
        try {
            setHistoryLoading(true);
            const token = localStorage.getItem("token");
            const data = await getAssessmentHistory(token);
            setRiskHistory(data);
        } catch (err) {
            console.error("โหลดประวัติการประเมินไม่สำเร็จ", err);
        } finally {
            setHistoryLoading(false);
        }
    }
 
    useEffect(() => {
        fetchHistory();
    }, []);

    const levelMap = {
        1: { label: "มือใหม่", cls: "low" },
        2: { label: "ระมัดระวัง", cls: "low" },
        3: { label: "สมดุล", cls: "mid" },
        4: { label: "เติบโต", cls: "high" },
        5: { label: "เชี่ยวชาญ", cls: "high" },
    };

    const handleViewDetail = (item) => {
        navigate("/risk-result", {
            state: {
                assessment: {
                    budget: item.budget,
                    invest_years: item.invest_years,
                    expected_return: item.expected_return,
                },
                recommend: {
                    attempt_id: item.attempt_id,
                    user_type: item.user_type,
                    goal_type: item.goal_type,
                    risk_index: item.risk_index,
                    level_id: item.level_id,
                    stocks: item.stocks,
                },
            },
        });
    };

    const [favoriteStocks, setFavoriteStocks] = useState([]);

    useEffect(() => {
        async function fetchFavorites() {
            try {
                const token = localStorage.getItem("token");
                const data = await getFavorites(token);
 
                const withPrice = await Promise.all(
                    data.map(async (stock) => {
                        try {
                            const latest = await getStockLatest(`${stock.symbol}.BK`);
                            return { ...stock, price: latest.price, change: latest.change, percent: latest.change_pct };
                        } catch (err) {
                            return stock;
                        }
                    })
                );
                setFavoriteStocks(withPrice);
            } catch (err) {
                console.error("โหลด favorite ไม่สำเร็จ", err);
            }
        }
 
        fetchFavorites();
    }, []);

    const handleRemoveFavorite = async (favorite_id) => {
        try {
            const token = localStorage.getItem("token");

            await deleteFavorite(token, favorite_id);

            setFavoriteStocks((prev) =>
                prev.filter((item) => item.favorite_id !== favorite_id)
            );

        } catch (err) {
            console.error("ลบ favorite ไม่สำเร็จ", err);
        }
    };

    if (!user) return <div className="loading">กำลังโหลด...</div>;

    console.log("risk level:", user.level_name);
    console.log("class:", getRiskClass(user.level_name));

    return (
        <>
            <section className="profile-page">

                {/* ===== BACK HEADER ===== */}
                <div className="back-header">
                    <h1 className="page-main-title">โปรไฟล์ผู้ใช้</h1>
                </div>

                {/* ===== Card: Header โปรไฟล์ ===== */}
                <section className="profile-header-card">
                    <div className="profile-top">
                        <div className="profile-avatar">
                            <img src={user.photo_path || "/pics/default.png"} alt="profile-picture" className="profile-picture" />
                        </div>

                        <div className="profile-info">
                            <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
                            <p className="profile-username">{user.email}</p>

                            <div className="profile-badges">
                                <span className={`badge badge-${getRiskClass(user.level_name)}`}>ระดับ{user.level_name}</span>
                                <span className="badge badge-small">
                                    <img src="/pics/history.png" alt="history" className="history-icon" />
                                    {riskHistory.length} ครั้งที่ประเมิน
                                </span>
                                <span className="badge badge-small">
                                    <img src="/pics/favorite.png" alt="favorite" className="favorite-icon" />
                                    {favoriteStocks.length} หุ้นรายการโปรด
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

                                <button className="profile-user-edit-btn" onClick={() => navigate(`/profile/edit/${user_id}`)}>
                                    <img src="/pics/edit.png" className="edit-icon" />
                                    แก้ไข
                                </button>
                            </div>

                            {/* ช่องกรอกข้อมูล */}
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

                    {/* ประวัติประเมิน */}
                    {activeTab === "risk" && (
                        <div className="tab-section">
                            <div className="profile-section-header">
                                <div className="profile-section-left">
                                    <img src="/pics/history.png" className="history-icon" />
                                    <span className="profile-section-title">ประวัติการประเมินความเสี่ยง</span>
                                </div>
                            </div>

                            {historyLoading ? (
                                <div className="loading">กำลังโหลด...</div>
                            ) : riskHistory.length === 0 ? (
                                <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>
                                    ยังไม่มีประวัติการประเมิน
                                </p>
                            ) : (
                                riskHistory.map((item, index) => {
                                    const levelInfo = levelMap[item.level_id] || { label: item.user_type || "-", cls: "mid" };
                                    const riskPercent = item.risk_index ? Math.round(item.risk_index * 100) : "-";

                                    return (
                                        <div key={item.attempt_id} className="risk-card">

                                            <div className="risk-card-header">
                                                <div className="risk-title-row">
                                                    <div className="risk-title">
                                                        การประเมินครั้งที่ {riskHistory.length - index}
                                                    </div>
                                                    <span className={`risk-history-badge risk-history-${levelInfo.cls}`}>
                                                        {levelInfo.label}
                                                    </span>
                                                </div>
                                                <button
                                                    className="risk-detail-btn"
                                                    onClick={() => handleViewDetail(item)}
                                                >
                                                    ดูรายละเอียด
                                                </button>
                                            </div>

                                            <div className="risk-row">
                                                <span className="risk-label">วันที่ประเมิน :</span>
                                                <span className="risk-text">
                                                    {new Date(item.done_date).toLocaleString("th-TH", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    })}
                                                </span>
                                            </div>

                                            <div className="risk-row">
                                                <span className="risk-label">ระดับความเสี่ยง :</span>
                                                <span className="risk-score">{riskPercent}%</span>
                                            </div>

                                            <div className="risk-row">
                                                <span className="risk-label">หุ้นแนะนำ :</span>
                                                <div className="risk-stock-list">
                                                    {item.stocks?.map((s) => (
                                                        <span key={s.symbol} className="risk-stock">{s.symbol}</span>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })
                            )}
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

                                {favoriteStocks.map((stock) => {
                                    const isUp = stock.change > 0;
                                    const isDown = stock.change < 0;
                                    const isZero = stock.change === 0;

                                    const priceClass = isZero
                                        ? "neutral"
                                        : isUp
                                            ? "up"
                                            : "down";

                                    return (
                                        <div key={stock.stock_id} className="favorite-card">

                                            <div className="fav-header">
                                                <div className="fav-left">
                                                    <img
                                                        src={stock.logo_path || "/pics/default.png"}
                                                        className="fav-logo"
                                                    />
                                                    <div className="fav-info">
                                                        <div className="fav-symbol">{stock.symbol}</div>
                                                        <div className="fav-name">{stock.stock_name}</div>
                                                    </div>
                                                </div>
                                                {/* F13434 */}
                                                <img
                                                    src="/pics/heart.png"
                                                    className="fav-heart"
                                                    onClick={() => handleRemoveFavorite(stock.favorite_id)}
                                                />
                                            </div>

                                            {/* ราคา */}
                                            <div className="fav-price-block">
                                                <div className="fav-price-row">
                                                    {!isZero && (
                                                        <span className={priceClass}>
                                                            {isUp ? "▲" : "▼"}
                                                        </span>
                                                    )}

                                                    <span className="fav-price">
                                                        {stock.price ? stock.price.toFixed(2) : "-"}
                                                    </span>
                                                </div>

                                                <div className={`fav-change ${priceClass}`}>
                                                    {isZero
                                                        ? "0.00 (0.00%)"
                                                        : `${isUp ? "+" : ""}${stock.change?.toFixed(2)} (${isUp ? "+" : ""}${stock.percent?.toFixed(2)}%)`}
                                                </div>
                                            </div>

                                            {/* ปุ่ม */}
                                            <button
                                                className="fav-detail-btn"
                                                onClick={() => navigate(`/detail/${stock.symbol}`)}
                                            >
                                                ดูรายละเอียด
                                            </button>

                                        </div>
                                    );
                                })}

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
                                            <img src="/pics/dark_mode.png" alt="dark" className="toggle-icon" />
                                        </div>
                                    </button>
                                </div>

                                {/* === การ์ดย่อย: ออกจากระบบ === */}
                                <div className="settings-card logout-card">
                                    <div className="logout-left">
                                        <span className="settings-title">ออกจากระบบ</span>
                                        <p className="settings-desc">ออกจากระบบในอุปกรณ์นี้</p>
                                    </div>

                                    <button className="logout-user-btn">
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
