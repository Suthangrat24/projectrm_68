import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import { GetLogin } from "../fetchapi/call_api_user";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(""); // สำหรับเก็บข้อความข้อผิดพลาด
    const [isLoading, setIsLoading] = useState(false); // สำหรับการแสดงสถานะการโหลด

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            navigate("/"); // หรือหน้าโปรไฟล์ เช่น /profile
        }
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            setError("กรุณากรอกอีเมลและรหัสผ่าน");
            return;
        }

        setIsLoading(true); // ตั้งค่าสถานะเป็นกำลังโหลด

        try {
            // เรียกใช้ GetLogin เพื่อส่งข้อมูลไปยัง API
            const response = await GetLogin(form.email, form.password);

            // ตรวจสอบว่าได้รับข้อมูล token หรือไม่
            if (response && response.token) {
                // เก็บ token ใน localStorage
                localStorage.setItem("access_token", response.token);

                console.log(response.redirect_to);
                // ตรวจสอบค่า redirect_to ก่อน
                if (response.redirect_to) {
                    navigate(response.redirect_to); // ไปยัง / หรือ /admin ตามที่ API ตอบ
                }
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ"); // แสดงข้อความข้อผิดพลาดหากมี
        } finally {
            setIsLoading(false); // เปลี่ยนสถานะเป็นไม่กำลังโหลด
        }
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

                    {error && <p className="login-error">{error}</p>} {/* แสดงข้อความข้อผิดพลาด */}

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

                    <button className="login-btn" onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </button>

                    <p className="login-register">
                        ยังไม่มีบัญชี? <a href="/register" className="register">สมัครสมาชิก</a>
                    </p>

                    <hr className="login-divider" />

                    <div className="login-or">หรือ</div>

                    <div className="login-social-row">
                        <div className="login-social-circle">
                            <img src="/pics/facebook_icon.png" className="login-social-icon" onClick={() => navigate("/admin")} />
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
