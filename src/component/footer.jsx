import React from 'react';
import '../css/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Row 1 */}
        <div className="footer-row footer-row-1">
          {/* Column 1: Web name and description */}
          <div className="footer-column">
            <div className="footer-logo">
                <img src="/pics/logo_test.png" className="footer-logo-img" />
                <h3>Stockii</h3>
            </div>
            <p>ระบบช่วยแนะนำหุ้นไทยสำหรับการลงทุน<br/>ระยะยาวด้วย Recommendation System<br/>และดูแนวโน้มหุ้นในอนาคต</p>
          </div>

          {/* Column 2: Menu */}
          <div className="footer-column">
            <h4>เมนูหลัก</h4>
            <ul>
              <li><a href="/">หน้าหลัก</a></li>
              <li><a href="/stocks">หุ้นทั้งหมด</a></li>
              <li><a href="/risk">ระบบแนะนำหุ้น</a></li>
              <li><a href="/portfolio">พอร์ตการลงทุน</a></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="footer-column">
            <h4>ช่วยเหลือ</h4>
            <ul>
              <li><a href="#">คำถามที่พบบ่อย</a></li>
              <li><a href="#">คู่มือการใช้งาน</a></li>
              <li><a href="#">ติดต่อเรา</a></li>
              <li><a href="#">รายงานปัญหา</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-column">
            <h4>ติดต่อเรา</h4>
            <ul>
              <li>Email: example@gmail.com</li>
              <li>โทร: 098-765-4321</li>
              <li>ที่อยู่: มหาวิทยาลัยขอนแก่น</li>
            </ul>
          </div>
        </div>

        {/* Horizontal line separating rows */}
        <div className="footer-line"></div>

        {/* Row 2: Disclaimer Card */}
        <section className="future-warning">
            <img src="/pics/warning.png" alt="warning" className="warning-icon" />
            <div className="future-warning-text">
                <div className="future-warning-title">ข้อจำกัดความรับผิดชอบ</div>
                <div className="future-warning-des">
                ข้อมูลและการวิเคราะห์ในระบบนี้มีไว้เพื่อการศึกษาและอ้างอิงเท่านั้น ไม่ใช่คำแนะนำการลงทุนโดยตรง ผู้ลงทุนควรศึกษาข้อมูลเพิ่มเติม และปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจลงทุน การลงทุนมีความเสี่ยง ผู้ลงทุนอาจได้รับกำไรหรือขาดทุนจากการลงทุน
                </div>
            </div>
        </section>

        {/* Row 3: Copyright and Version Info */}
        <div className="footer-row footer-row-3">
          <div className="footer-info">
            <p>© 2025 StockAdvisor. สงวนลิขสิทธิ์ทุกประการ | ระบบแนะนำหุ้นไทยอัจฉริยะ | Version 2.1.0</p>
            <p>Made with ❤️ for Thai investors</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
