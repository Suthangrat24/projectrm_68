import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        username: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        phone: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!form.email || !form.password) return;

        // mock register
        const user = {
            name: form.firstname,
            avatar: "/pics/default-user.png"
        };

        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
    };

    return (
        <section className="register-page">

            {/* BG */}
            <div className="register-bg"></div>

            <div className="register-container">
                

                {/* CARD */}
                <div className="register-card">



                    <h2 className="register-title">สมัครสมาชิก</h2>

                    {/* FORM GRID */}
                    <div className="register-grid">

                        {/* ชื่อ */}
                        <div className="input-group">
                            <label>ชื่อ</label>
                            <input
                                name="firstname"
                                onChange={handleChange}
                                placeholder="ชื่อ"
                            />
                        </div>

                        {/* นามสกุล */}
                        <div className="input-group">
                            <label>นามสกุล</label>
                            <input
                                name="lastname"
                                onChange={handleChange}
                                placeholder="นามสกุล"
                            />
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label>อีเมล</label>
                            <input
                                name="email"
                                onChange={handleChange}
                                placeholder="อีเมล"
                            />
                        </div>

                        {/* Phone */}
                        <div className="input-group">
                            <label>เบอร์โทรศัพท์</label>
                            <input
                                name="phone"
                                onChange={handleChange}
                                placeholder="เบอร์โทรศัพท์"
                            />
                        </div>

                        {/* เพศ */}
                        <div className="input-group">
                            <label>เพศ</label>
                            <div className="select-wrapper">
                                <select name="gender" onChange={handleChange}>
                                    <option value="">เลือกเพศ</option>
                                    <option value="male">ชาย</option>
                                    <option value="female">หญิง</option>
                                    <option value="other">อื่น ๆ</option>
                                </select>

                                {/* ไอคอน dropdown */}
                                <img src="/pics/drop-down.png" className="select-icon" />
                            </div>
                        </div>

                        {/* Birthdate */}
                        <div className="input-group">
                            <label>วัน/เดือน/ปี เกิด</label>
                            <input
                                name="birthdate"
                                type="date"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* BUTTON */}
                    <button className="register-btn" onClick={handleSubmit}>
                        สมัครสมาชิก
                    </button>

                    {/* Divider */}
                    <hr className="register-divider" />

                    <div className="register-or">หรือ</div>

                    {/* Social Icons */}
                    <div className="register-social-row">
                        <div className="social-circle">
                            <img src="/pics/facebook_icon.png" />
                        </div>
                        <div className="social-circle">
                            <img src="/pics/gmail_icon.png" />
                        </div>
                    </div>
                </div>

            </div>

        </section>
    );
}
