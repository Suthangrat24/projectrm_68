import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = () => {
        if (!form.email || !form.password) return;

        const mockUser = {
            name: "User Demo",
            avatar: "/pics/default-user.png",
        };

        localStorage.setItem("user", JSON.stringify(mockUser));
        navigate("/");
    };

    return (
        <section className="login-page">

            {/* BACKGROUND */}
            <div className="login-bg"></div>

            {/* MAIN LAYOUT */}
            <div className="login-container">

                {/* LEFT */}
                <div className="login-left">
                    <h1 className="login-title">ระบบช่วยแนะนำหุ้นไทย</h1>
                    <p className="login-subtitle">สำหรับการลงทุนระยะยาว</p>
                    <p className="login-desc">
                        พร้อมฟีเจอร์ดูงบการเงินย้อนหลัง กรองหุ้นตามปัจจัยพื้นฐาน 
                        และวิเคราะห์ความเสี่ยงของคุณอัตโนมัติในไม่กี่นาที
                    </p>
                </div>

                {/* RIGHT CARD */}
                <div className="login-card">
                    <h2 className="login-card-title">เข้าสู่ระบบ</h2>

                    <label className="login-label">อีเมล</label>
                    <input
                        name="email"
                        className="login-input"
                        placeholder="อีเมล"
                        onChange={handleChange}
                    />

                    <label className="login-label">รหัสผ่าน</label>
                    <input
                        type="password"
                        name="password"
                        className="login-input"
                        placeholder="รหัสผ่าน"
                        onChange={handleChange}
                    />

                    <button className="login-btn" onClick={handleLogin}>
                        เข้าสู่ระบบ
                    </button>

                    <p className="login-register">
                        ยังไม่มีบัญชี? <a href="/register" className="register">สมัครสมาชิก</a>
                    </p>

                    <hr className="login-divider" />

                    <div className="login-or">หรือ</div>

                    <div className="login-social-row">
                        <div className="login-social-circle">
                            <img src="/pics/facebook_icon.png" className="login-social-icon" />
                        </div>

                        <div className="login-social-circle">
                            <img src="/pics/gmail_icon.png" className="login-social-icon" />
                        </div>
                    </div>
                </div>

            </div>

        </section>
    );
}
