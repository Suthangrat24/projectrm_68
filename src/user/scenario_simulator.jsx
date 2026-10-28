import { useState, useMemo } from "react";
import "../css/scenario_simulator.css";

// ─────────────────────────────────────────────────────────────
// จำลองการลงทุน (ตามคอมเมนต์อาจารย์รอบ 2 ข้อ 2–3)
//   - ผู้ใช้กรอกเงินก้อนแรก + เงินเติมต่อเดือน (0 = ลงก้อนเดียว / มากกว่า 0 = DCA)
//   - แสดงเงินที่ใส่ไปสะสม เทียบ มูลค่าพอร์ต ที่ 1, 2, 3, 5, 10 ปี และปีที่ผู้ใช้กรอก
//
// อัตราผลตอบแทนต่อปีที่ใช้จำลอง
//   หลัก   = เป้าที่ผู้ใช้กรอก (ข้อ 20) แต่ไม่เกินค่าเฉลี่ยผลตอบแทนย้อนหลังของหุ้นที่แนะนำ
//   แย่/ดี = หลัก ∓ (ความผันผวนเฉลี่ยของหุ้นที่แนะนำ ÷ √จำนวนปี)  ใช้เป็นช่วงประกอบ
// ─────────────────────────────────────────────────────────────

const BASE_HORIZONS = [1, 2, 3, 5, 10];
const MONTHLY_PRESETS = [0, 1000, 5000, 10000];

const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

export function pickRates({ targetPct, stocks, years }) {
  const target = Number(targetPct) / 100;

  // ผลตอบแทนย้อนหลังของแต่ละตัว: ใช้ 5 ปีถ้ามี (ช่วงยาวกว่า) ไม่งั้นใช้ 3 ปี
  const hist = mean(
    stocks.map((s) => s.ann_return_5y ?? s.ann_return_3y).filter((x) => x != null && !Number.isNaN(x))
  );
  const vol = mean(stocks.map((s) => s.ann_vol).filter((x) => x != null && !Number.isNaN(x)));

  const rate = hist != null ? Math.min(target, hist) : target;
  const band = vol != null ? vol / Math.sqrt(Math.max(years, 1)) : 0;

  return {
    rate,
    low: Math.max(rate - band, -0.95),
    high: rate + band,
    hist,
    vol,
    capped: hist != null && hist < target,
  };
}

// มูลค่าพอร์ตทุกสิ้นปี: ลงก้อนแรกวันแรก แล้วเติมทุกสิ้นเดือน ทบต้นรายเดือน
export function simulate({ initial, monthly, years, rate }) {
  const i = Math.pow(1 + rate, 1 / 12) - 1;
  const points = [{ year: 0, invested: initial, value: initial }];
  let value = initial;
  for (let m = 1; m <= years * 12; m++) {
    value = value * (1 + i) + monthly;
    if (m % 12 === 0) {
      points.push({ year: m / 12, invested: initial + monthly * m, value });
    }
  }
  return points;
}

const baht = (n) => Math.round(n).toLocaleString("th-TH");
const pct = (r) => `${r >= 0 ? "+" : ""}${(r * 100).toFixed(1)}%`;
const toNum = (s) => Number(String(s).replace(/,/g, "")) || 0;
const withComma = (s) => {
  const digits = String(s).replace(/[^0-9]/g, "").slice(0, 10);
  return digits ? Number(digits).toLocaleString("en-US") : "";
};

// ── กราฟเส้น SVG (ไม่ต้องติดตั้งไลบรารีเพิ่ม) ─────────────────
function GrowthChart({ points, years }) {
  const W = 640, H = 260;
  const pad = { l: 64, r: 16, t: 16, b: 32 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const maxY = Math.max(1, ...points.flatMap((p) => [p.value, p.invested])) * 1.08;
  const x = (yr) => pad.l + (yr / years) * iw;
  const y = (v) => pad.t + ih - (Math.max(v, 0) / maxY) * ih;
  const path = (key) =>
    points.map((p, k) => `${k ? "L" : "M"}${x(p.year).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxY);
  const step = years <= 10 ? 1 : years <= 20 ? 2 : 5;
  const xTicks = [];
  for (let t = 0; t <= years; t += step) xTicks.push(t);
  if (xTicks[xTicks.length - 1] !== years) xTicks.push(years);

  const short = (v) =>
    v >= 1e6 ? `${(v / 1e6).toFixed(1)} ล้าน` : v >= 1e3 ? `${Math.round(v / 1e3)}k` : Math.round(v);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="scn-chart" role="img"
         aria-label="กราฟมูลค่าพอร์ตเทียบเงินที่ใส่ไปรายปี">
      {yTicks.map((v, k) => (
        <g key={k}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="scn-grid" />
          <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" className="scn-axis">{short(v)}</text>
        </g>
      ))}
      {xTicks.map((t) => (
        <text key={t} x={x(t)} y={H - 10} textAnchor="middle" className="scn-axis">
          {t === 0 ? "เริ่ม" : `ปี ${t}`}
        </text>
      ))}
      <path d={path("invested")} className="scn-line invested" />
      <path d={path("value")} className="scn-line value" />
    </svg>
  );
}

export default function ScenarioSimulator({ budget, years, targetPct, stocks }) {
  const N = Math.max(parseInt(years, 10) || 0, 1);
  const [initialStr, setInitialStr] = useState(withComma(Math.round(Number(budget) || 0)));
  const [monthlyStr, setMonthlyStr] = useState("0");

  const initial = toNum(initialStr);
  const monthly = toNum(monthlyStr);

  const r = useMemo(
    () => pickRates({ targetPct, stocks: stocks || [], years: N }),
    [targetPct, stocks, N]
  );

  // ระยะเวลาที่แสดงในตาราง: 1, 2, 3, 5, 10 ปี + ปีที่ผู้ใช้กรอก
  const horizons = useMemo(
    () => [...new Set([...BASE_HORIZONS, N])].sort((a, b) => a - b),
    [N]
  );
  const maxYears = horizons[horizons.length - 1];

  const points = useMemo(
    () => simulate({ initial, monthly, years: maxYears, rate: r.rate }),
    [initial, monthly, maxYears, r.rate]
  );
  const lowEnd  = useMemo(() => simulate({ initial, monthly, years: N, rate: r.low }).at(-1),  [initial, monthly, N, r.low]);
  const highEnd = useMemo(() => simulate({ initial, monthly, years: N, rate: r.high }).at(-1), [initial, monthly, N, r.high]);

  const atYear = (yr) => points[yr];
  const userEnd = atYear(N);
  const isDCA = monthly > 0;

  return (
    <section className="scn-card">
      <h2 className="scn-title">จำลองการลงทุนของคุณ</h2>
      <p className="scn-sub">
        ลองใส่เงินก้อนแรกและเงินที่จะเติมทุกเดือน แล้วดูว่าพอร์ตจะโตเป็นเท่าไหร่
        เมื่อถือไว้ระยะยาว ใส่เงินเติมเป็น 0 ถ้าต้องการลงก้อนเดียว
      </p>

      {/* ── ช่องกรอก ── */}
      <div className="scn-inputs">
        <label className="scn-field">
          <span className="scn-field-label">เงินก้อนแรก</span>
          <span className="scn-input-wrap">
            <input
              type="text"
              inputMode="numeric"
              value={initialStr}
              onChange={(e) => setInitialStr(withComma(e.target.value))}
            />
            <span className="scn-unit">บาท</span>
          </span>
        </label>

        <label className="scn-field">
          <span className="scn-field-label">เติมเงินทุกเดือน</span>
          <span className="scn-input-wrap">
            <input
              type="text"
              inputMode="numeric"
              value={monthlyStr}
              onChange={(e) => setMonthlyStr(withComma(e.target.value) || "0")}
            />
            <span className="scn-unit">บาท</span>
          </span>
          <span className="scn-presets">
            {MONTHLY_PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                className={`scn-preset ${monthly === v ? "active" : ""}`}
                onClick={() => setMonthlyStr(withComma(v) || "0")}
              >
                {v === 0 ? "ไม่เติม" : withComma(v)}
              </button>
            ))}
          </span>
        </label>
      </div>

      <p className="scn-mode">
        {isDCA
          ? `แบบทยอยลงทุน: ลงก้อนแรก ${baht(initial)} บาท แล้วเติมเดือนละ ${baht(monthly)} บาท`
          : `แบบลงก้อนเดียว: ลง ${baht(initial)} บาท ครั้งเดียวแล้วถือไว้`}
        {" "}คิดผลตอบแทน {pct(r.rate)} ต่อปี
      </p>

      {/* ── ผลลัพธ์ที่ระยะเวลาที่ผู้ใช้กรอก ── */}
      <div className="scn-headline">
        <p className="scn-headline-label">ถือไว้ {N} ปี ตามที่คุณตั้งใจ</p>
        <p className="scn-headline-value">{baht(userEnd.value)} บาท</p>
        <p className="scn-headline-note">
          จากเงินที่ใส่ไปทั้งหมด {baht(userEnd.invested)} บาท
          {" "}({userEnd.value >= userEnd.invested ? "กำไร" : "ขาดทุน"} {baht(Math.abs(userEnd.value - userEnd.invested))} บาท)
        </p>
      </div>

      <div className="scn-legend">
        <span className="scn-legend-item value">มูลค่าพอร์ต</span>
        <span className="scn-legend-item invested">เงินที่ใส่ไปสะสม</span>
      </div>
      <div className="scn-chart-wrap">
        <GrowthChart points={points.slice(0, N + 1)} years={N} />
      </div>

      {/* ── ตารางหลายระยะเวลา ── */}
      <div className="scn-table-wrap">
        <table className="scn-table">
          <thead>
            <tr>
              <th>ถือไว้</th>
              <th>เงินที่ใส่ไป</th>
              <th>มูลค่าพอร์ต</th>
              <th>กำไร / ขาดทุน</th>
            </tr>
          </thead>
          <tbody>
            {horizons.map((h) => {
              const p = atYear(h);
              const gain = p.value - p.invested;
              return (
                <tr key={h} className={h === N ? "mine" : ""}>
                  <td>
                    {h} ปี
                    {h === N && <span className="scn-mine-tag">ที่คุณตั้งใจ</span>}
                  </td>
                  <td>{baht(p.invested)}</td>
                  <td>{baht(p.value)}</td>
                  <td className={gain >= 0 ? "gain" : "loss"}>
                    {gain >= 0 ? "+" : "−"}{baht(Math.abs(gain))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── ช่วงที่อาจเกิดขึ้นจริง ── */}
      <p className="scn-range">
        ผลตอบแทนจริงขึ้นลงได้: ถ้าตลาดไม่ดี ({pct(r.low)} ต่อปี) อีก {N} ปีอาจเหลือประมาณ{" "}
        <strong>{baht(lowEnd.value)}</strong> บาท ถ้าตลาดดี ({pct(r.high)} ต่อปี)
        อาจได้ถึง <strong>{baht(highEnd.value)}</strong> บาท
      </p>

      <details className="scn-assume">
        <summary>ตัวเลขเหล่านี้คิดอย่างไร</summary>
        <ul>
          <li>
            ใช้ผลตอบแทนที่คุณคาดหวัง ({Number(targetPct)}% ต่อปี)
            {r.capped && r.hist != null
              ? ` แต่หุ้นที่แนะนำเคยทำได้เฉลี่ย ${(r.hist * 100).toFixed(1)}% ต่อปี จึงใช้ค่านี้แทนเพื่อไม่ให้สูงเกินจริง`
              : " ซึ่งหุ้นที่แนะนำเคยทำได้ถึงในอดีต"}
          </li>
          <li>สมมติว่าแบ่งเงินลงหุ้นที่แนะนำเท่าๆ กัน ลงก้อนแรกวันแรก และเติมเงินทุกสิ้นเดือน</li>
          <li>
            ช่วงตลาดไม่ดี/ดี บวกลบตามความผันผวนของหุ้นที่แนะนำ
            {r.vol != null && ` (เฉลี่ย ${(r.vol * 100).toFixed(0)}% ต่อปี)`} หารด้วยรากที่สองของจำนวนปี
            หุ้นยิ่งผันผวนช่วงยิ่งกว้าง และยิ่งถือนานช่วงยิ่งแคบลง
          </li>
          <li>คิดแบบทบต้น ยังไม่หักค่าธรรมเนียมและภาษี</li>
        </ul>
      </details>

      <p className="scn-disclaimer">เป็นการจำลองจากสมมติฐาน ไม่ใช่การรับประกันผลตอบแทนในอนาคต</p>
    </section>
  );
}