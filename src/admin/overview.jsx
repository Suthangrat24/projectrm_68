import "../css/admin_css/overview.css";

export default function Overview() {
  return (
    <div className="admin-overview-page">

      <h1 className="admin-title">Dashboard Overview</h1>
      <p className="admin-subtitle">ภาพรวมระบบแนะนำหุ้นระยะยาว</p>

      <div className="admin-cards-grid">

        <div className="admin-card">
          <div className="card-icon blue">
            <img src="/pics/marckris.jpg" />
          </div>
          <span className="card-label">จำนวนผู้ใช้งานทั้งหมด</span>
          <span className="card-value">1,247</span>
        </div>

        <div className="admin-card">
          <div className="card-icon green">
            <img src="/pics/marckris.jpg" />
          </div>
          <span className="card-label">จำนวนแบบประเมินที่ทำทั้งหมด</span>
          <span className="card-value">856</span>
        </div>

        <div className="admin-card">
          <div className="card-icon purple">
            <img src="/pics/marckris.jpg" />
          </div>
          <span className="card-label">กลุ่มความเสี่ยงที่พบมากที่สุด</span>
          <span className="card-value">กลาง</span>
        </div>

        <div className="admin-card">
          <div className="card-icon orange">
            <img src="/pics/marckris.jpg" />
          </div>
          <span className="card-label">จำนวนพอร์ตลงทุนที่ถูกเพิ่ม</span>
          <span className="card-value">432</span>
        </div>

      </div>

      <div className="admin-chart-grid">

        <div className="chart-card">
          <span className="chart-title">จำนวนผู้ใช้ใหม่ในแต่ละเดือน</span>
          <div className="chart-placeholder">[ พื้นที่สำหรับกราฟแท่ง ]</div>
        </div>

        <div className="chart-card">
          <span className="chart-title">สัดส่วนกลุ่มความเสี่ยง</span>
          <div className="chart-placeholder">[ พื้นที่สำหรับ Pie Chart ]</div>
        </div>

      </div>
    </div>
  );
}
