import { useState, useEffect } from "react";
import { getRecommendationPerformance } from "../fetchapi/call_api_user";
import "../css/recommendation_performance.css";

export default function RecommendationPerformance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // เก็บ error object จริง ไม่ใช่แค่ true/false

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      try {
        // getRecommendationPerformance() คืน response.data ตรงๆ อยู่แล้ว
        // (ตาม pattern เดียวกับฟังก์ชันอื่นทั้งหมดใน call_api_user.jsx)
        const res = await getRecommendationPerformance(token);
        setData(res);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="recperf-loading">กำลังโหลดผลตอบแทนจากคำแนะนำ...</div>;
  }

  // ── ชั่วคราวเพื่อ debug: โชว์ error ออกมาให้เห็นแทนการซ่อนเงียบๆ ──
  // พอหาสาเหตุเจอแล้ว ค่อยเปลี่ยนกลับเป็น `if (error) return null;`
  if (error) {
    // detail จาก FastAPI 422 เป็น array ของ object {type, loc, msg, input}
    // ไม่ใช่ string — ต้องแปลงเป็น string ก่อน ไม่งั้น React render object ตรงๆ ไม่ได้ (crash ทั้งหน้า)
    let detailText = error?.message || "ไม่ทราบสาเหตุ";
    const rawDetail = error?.response?.data?.detail;
    if (typeof rawDetail === "string") {
      detailText = rawDetail;
    } else if (Array.isArray(rawDetail)) {
      detailText = rawDetail.map((d) => d?.msg || JSON.stringify(d)).join(", ");
    } else if (rawDetail) {
      detailText = JSON.stringify(rawDetail);
    }

    return (
      <div className="recperf-card recperf-empty">
        <h3 className="recperf-title">ผลตอบแทนจากคำแนะนำของระบบ</h3>
        <p className="recperf-empty-text" style={{ color: "#ef4444" }}>
          โหลดข้อมูลไม่สำเร็จ: {error?.response?.status ?? "?"} {detailText}
        </p>
      </div>
    );
  }

  if (!data || !data.items || data.items.length === 0) {
    return (
      <div className="recperf-card recperf-empty">
        <h3 className="recperf-title">ผลตอบแทนจากคำแนะนำของระบบ</h3>
        <p className="recperf-empty-text">
          ยังไม่มีการลงทุนที่มาจากคำแนะนำของระบบ — ลองกด
          "+ เพิ่มเข้าพอร์ต" จากหน้าคำแนะนำหุ้นดูได้
        </p>
      </div>
    );
  }

  const { items, summary } = data;
  const avg = summary?.avg_return_pct;
  const avgUp = avg != null && avg >= 0;

  return (
    <div className="recperf-card">
      <div className="recperf-header">
        <div className="recperf-header-left">
          <h3 className="recperf-title">ผลตอบแทนจากคำแนะนำของระบบ</h3>
          <p className="recperf-sub">
            ติดตามผลจากหุ้น {summary?.total_tracked ?? items.length} รายการที่คุณเพิ่มเข้าพอร์ตตามคำแนะนำ
          </p>
        </div>

        {avg != null && (
          <div className="recperf-avg-plain">
            <p className="recperf-avg-plain-label">ผลตอบแทนเฉลี่ย</p>
            <p className={`recperf-avg-plain-value ${avgUp ? "up" : "down"}`}>
              {avgUp ? "+" : ""}
              {avg}%
            </p>
          </div>
        )}
      </div>

      <div className="recperf-divider" />

      <table className="recperf-table">
        <thead>
          <tr>
            <th>หุ้น</th>
            <th>วันที่ลงทุน</th>
            <th>ราคาที่ซื้อ</th>
            <th>ราคาปัจจุบัน</th>
            <th>ผลตอบแทน</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const up = item.return_pct != null && item.return_pct >= 0;
            // คำนวณเป็นบาทได้เมื่อ backend ส่ง number_of_share มาด้วยเท่านั้น
            const plValue = item.number_of_share != null
              ? (item.current_price - item.price_per_share) * item.number_of_share
              : null;
            return (
              <tr key={item.portfolio_id}>
                <td className="recperf-symbol">{item.symbol}</td>
                <td className="recperf-muted">{new Date(item.invest_date).toLocaleDateString("th-TH")}</td>
                <td className="recperf-muted">{item.price_per_share.toFixed(2)} บาท</td>
                <td className="recperf-muted">{item.current_price.toFixed(2)} บาท</td>
                <td>
                  {item.return_pct != null ? (
                    <div className="pl-cell">
                      <span className={`recperf-return-pill ${up ? "up" : "down"}`}>
                        {up ? "\u25B2" : "\u25BC"} {up ? "+" : ""}
                        {item.return_pct}%
                      </span>
                      {plValue != null && (
                        <span className={`pl-amount ${up ? "up" : "down"}`}>
                          {up ? "+" : ""}{plValue.toFixed(2)} บาท
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="recperf-muted">ไม่มีข้อมูล</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}