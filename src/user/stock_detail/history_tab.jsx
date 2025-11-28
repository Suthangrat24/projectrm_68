// src/user/stock_detail/HistoryTab.jsx
import { useMemo, useState } from "react";
import "../../css/stock_detail/history_tab.css";

export default function HistoryTab({ historyRows, lastUpdate }) {
    const [field, setField] = useState("date");
    const [dir, setDir] = useState("desc");

    const sorted = useMemo(() => {
        const rows = [...historyRows];
        rows.sort((a, b) => {
            const av = a[field];
            const bv = b[field];
            if (typeof av === "number") {
                return dir === "asc" ? av - bv : bv - av;
            }
            return dir === "asc"
                ? String(av).localeCompare(String(bv))
                : String(bv).localeCompare(String(av));
        });
        return rows;
    }, [field, dir]);

    const sort = (f) => {
        if (f === field) setDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setField(f);
            setDir("asc");
        }
    };

    return (
        <section className="detail-history-section">
            <article className="detail-card history-card">
                <header className="history-header">
                    <div className="history-title">ราคาย้อนหลัง</div>
                    <div className="history-latest">ข้อมูลล่าสุด : {lastUpdate}</div>
                </header>

                <div className="history-table-scroll">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th onClick={() => sort("date")}>วันที่</th>
                                <th onClick={() => sort("close")}>ราคาปิด</th>
                                <th onClick={() => sort("high")}>สูงสุด</th>
                                <th onClick={() => sort("low")}>ต่ำสุด</th>
                                <th onClick={() => sort("open")}>เปิด</th>
                                <th onClick={() => sort("change")}>เปลี่ยนแปลง</th>
                                <th onClick={() => sort("changePct")}>% เปลี่ยนแปลง</th>
                                <th onClick={() => sort("volume")}>ปริมาณ</th>
                                <th onClick={() => sort("value")}>มูลค่า</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sorted.map((row, i) => (
                                <tr key={i}>
                                    <td>{row.date}</td>
                                    <td>{row.close.toFixed(2)}</td>
                                    <td>{row.high.toFixed(2)}</td>
                                    <td>{row.low.toFixed(2)}</td>
                                    <td>{row.open.toFixed(2)}</td>
                                    <td className={row.change >= 0 ? "text-up" : "text-down"}>
                                        {row.change > 0 ? "+" : ""}
                                        {row.change.toFixed(2)}
                                    </td>
                                    <td className={row.changePct >= 0 ? "text-up" : "text-down"}>
                                        {row.changePct > 0 ? "+" : ""}
                                        {row.changePct.toFixed(2)}
                                    </td>
                                    <td>{row.volume.toLocaleString("th-TH")}</td>
                                    <td>{row.value.toLocaleString("th-TH")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <footer className="history-footer">
                    <span>ข้อมูลราคาย้อนหลัง 6 เดือน</span>

                    <div className="history-footer-right">
                        <div className="history-rows-control">
                            แสดง
                            <select className="history-rows-select">
                                <option>20</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                            รายการ
                        </div>
                    </div>
                </footer>
            </article>
        </section>
    );
}
