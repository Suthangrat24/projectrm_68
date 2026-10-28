import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyRegisterOtp, setRegisterPassword } from "../fetchapi/call_api_user";
import Swal from "sweetalert2";
import "../css/register.css";

export default function Register() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        email: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        phone: "",
        gender: "",
        password: "",
    });

    const [otp, setOtp] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            if (
                !form.firstname ||
                !form.lastname ||
                !form.email ||
                !form.phone ||
                !form.birthdate ||
                !form.gender
            ) {
                Swal.fire("กรอกข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบถ้วน", "warning");
                return;
            }

            const payload = {
                first_name: form.firstname.trim(),
                last_name: form.lastname.trim(),
                email: form.email.trim(),
                phone_num: form.phone.trim(),
                birth_date: form.birthdate,
                gender_id: parseInt(form.gender),
            };

            await registerUser(payload);

            await Swal.fire({
                icon: "success",
                title: "ส่ง OTP สำเร็จ",
                text: "กรุณาตรวจสอบอีเมลของคุณ",
                confirmButtonColor: "#00C853",
            });

            setStep(2);
        } catch (err) {
            console.error(err);
            Swal.fire(
                "สมัครสมาชิกไม่สำเร็จ",
                err?.response?.data?.detail || "เกิดข้อผิดพลาด",
                "error"
            );
        }
    };

    const handleVerifyOtp = async () => {
        try {
            if (!otp) {
                Swal.fire("กรุณากรอก OTP", "", "warning");
                return;
            }

            const payload = {
                email: form.email,
                user_otp: otp,
            };

            await verifyRegisterOtp(payload);

            await Swal.fire({
                icon: "success",
                title: "ยืนยัน OTP สำเร็จ",
                text: "กรุณาตั้งรหัสผ่าน",
                confirmButtonColor: "#00C853",
            });

            setStep(3);
        } catch (err) {
            console.error(err);
            Swal.fire(
                "OTP ไม่ถูกต้อง",
                err?.response?.data?.detail || "เกิดข้อผิดพลาด",
                "error"
            );
        }
    };

    const handleSetPassword = async () => {
        try {
            if (!form.password || !confirmPassword) {
                Swal.fire("กรุณากรอกรหัสผ่าน", "", "warning");
                return;
            }

            if (form.password.length < 8) {
                Swal.fire("รหัสผ่านสั้นเกินไป", "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร", "warning");
                return;
            }

            if (form.password !== confirmPassword) {
                Swal.fire("รหัสผ่านไม่ตรงกัน", "กรุณาตรวจสอบอีกครั้ง", "warning");
                return;
            }

            const payload = {
                otp_email: form.email,
                otp: otp,
                password: form.password,
            };

            await setRegisterPassword(payload);

            await Swal.fire({
                icon: "success",
                title: "สมัครสมาชิกสำเร็จ",
                text: "สามารถเข้าสู่ระบบได้แล้ว",
                confirmButtonColor: "#00C853",
            });

            navigate("/login");
        } catch (err) {
            console.error(err);
            Swal.fire(
                "ตั้งรหัสผ่านไม่สำเร็จ",
                err?.response?.data?.detail || "เกิดข้อผิดพลาด",
                "error"
            );
        }
    };

    return (
        <section className="register-page">

            {/* BG */}
            <div className="register-bg"></div>

            <div className="register-container">


                {/* CARD */}
                <div className="register-card">



                    <h2 className="register-title">สมัครสมาชิก</h2>

                    {step === 1 && (
                        <>
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
                                            <option value="2">ชาย</option>
                                            <option value="1">หญิง</option>
                                            <option value="3">อื่น ๆ</option>
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


                            <div className="register-actions">
                                <button className="register-btn" onClick={handleRegister}>
                                    สมัครสมาชิก
                                </button>

                                {/* เส้นคั่น ── หรือ ── */}
                                <div className="register-or-line">
                                    <span>หรือ</span>
                                </div>

                                {/* ปุ่มสมัครด้วย Google (ยังไม่เชื่อมต่อจริง) */}
                                <button
                                    type="button"
                                    className="register-google-btn"
                                    onClick={() =>
                                        Swal.fire("ยังไม่รองรับ", "ยังไม่รองรับการสมัครสมาชิกด้วย Google", "info")
                                    }
                                >
                                    <img src="/pics/gmail_icon.png" alt="" className="register-google-icon" />
                                    <span>Sign up with Google</span>
                                </button>

                                <p className="register-login-link">
                                    มีบัญชีอยู่แล้ว?{" "}
                                    <a onClick={() => navigate("/login")}>เข้าสู่ระบบ</a>
                                </p>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="input-group">
                                <label>กรอก OTP ที่ส่งไปยังอีเมล</label>
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="กรอก OTP 6 หลัก"
                                />
                            </div>

                            <button className="register-btn" onClick={handleVerifyOtp}>
                                ยืนยัน OTP
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="input-group">
                                <label>รหัสผ่าน</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร"
                                />
                            </div>

                            <div className="input-group">
                                <label>ยืนยันรหัสผ่าน</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="ยืนยันรหัสผ่าน"
                                />
                            </div>

                            <button className="register-btn" onClick={handleSetPassword}>
                                ตั้งรหัสผ่าน
                            </button>
                        </>
                    )}
                </div>

            </div>

        </section>
    );
}