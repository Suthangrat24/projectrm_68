import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";

// ------------------ ช่วงเวลาซื้อขายทั้งวัน (10:00 → 17:00) ------------------
const SESSION_START_HOUR = 10;
const SESSION_END_HOUR = 17;

function getSessionRange(baseDate) {
    const start = new Date(baseDate);
    start.setHours(SESSION_START_HOUR, 0, 0, 0);
    const end = new Date(baseDate);
    end.setHours(SESSION_END_HOUR, 0, 0, 0);
    return [start.getTime(), end.getTime()];
}

// ------------------ Intraday ticks: ทุกชั่วโมง 10:00 → 17:00 เสมอ ------------------
// (เดิมตัด tick ที่เกินข้อมูลจริงทิ้ง ทำให้ช่วงเช้าเห็นแค่ 10:00)
function generateHourlyTicks(baseDate) {
    const ticks = [];
    for (let h = SESSION_START_HOUR; h <= SESSION_END_HOUR; h++) {
        const d = new Date(baseDate);
        d.setHours(h, 0, 0, 0);
        ticks.push(d.getTime());
    }
    return ticks;
}

// ------------------ format X axis ------------------
function formatXAxis(ts, range) {
    const d = new Date(ts);

    switch (range) {
        case "intraday":
            return d.toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit"
            });

        case "1m":
        case "3m":
        case "6m":
        case "ytd":
        case "1y":
            return d.toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "short"
            });

        case "3y":
            return d.toLocaleDateString("th-TH", {
                month: "short",
                year: "numeric"
            });

        case "5y":
            return d.getFullYear() + 543;

        default:
            return d.toLocaleDateString("th-TH");
    }
}

// ------------------ Generate ticks for non-intraday ------------------
function generateDateTicks(data, range) {
    if (!data || data.length === 0) return [];

    const timestamps = data.map(d => d.ts);
    const last = new Date(timestamps[timestamps.length - 1]);
    const result = [];

    const pushClosest = (targetDate) => {
        const target = targetDate.getTime();
        let best = timestamps[0];
        let minDiff = Math.abs(best - target);

        for (let t of timestamps) {
            const diff = Math.abs(t - target);
            if (diff < minDiff) {
                best = t;
                minDiff = diff;
            }
        }
        result.push(best);
    };

    // -------- 1M (weekly) --------
    if (range === "1m") {
        let cursor = new Date(last);
        cursor.setMonth(cursor.getMonth() - 1);

        while (cursor <= last) {
            pushClosest(cursor);
            cursor.setDate(cursor.getDate() + 7);
        }
        return [...new Set(result)];
    }

    // -------- 3M (2 points / month) --------
    if (range === "3m") {
        let cursor = new Date(last);
        cursor.setMonth(cursor.getMonth() - 3);

        while (cursor <= last) {
            pushClosest(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
            pushClosest(new Date(cursor.getFullYear(), cursor.getMonth(), 15));
            cursor.setMonth(cursor.getMonth() + 1);
        }
        return [...new Set(result)];
    }

    // -------- 6M (monthly) --------
    if (range === "6m") {
        let cursor = new Date(last);
        cursor.setMonth(cursor.getMonth() - 6);

        while (cursor <= last) {
            pushClosest(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
            cursor.setMonth(cursor.getMonth() + 1);
        }
        return [...new Set(result)];
    }

    // -------- YTD (adaptive) --------
    if (range === "ytd") {
        const count = timestamps.length;
        if (count <= 6) return timestamps;

        const step = Math.floor(count / 5);
        const ticks = [];

        for (let i = 0; i < count; i += step) {
            ticks.push(timestamps[i]);
        }

        if (ticks[ticks.length - 1] !== timestamps[count - 1]) {
            ticks.push(timestamps[count - 1]);
        }

        return ticks;
    }

    // -------- 1Y (rolling 12 months, every 2 months) --------
    if (range === "1y") {
        let cursor = new Date(last);
        cursor.setFullYear(cursor.getFullYear() - 1);

        while (cursor <= last) {
            pushClosest(cursor);
            cursor.setMonth(cursor.getMonth() + 2);
        }
        return [...new Set(result)];
    }

    // -------- 3Y (Jun / Dec) --------
    if (range === "3y") {
        const ticks = [];
        const firstTS = timestamps[0];
        const lastTS = timestamps[timestamps.length - 1];

        let year = new Date(firstTS).getFullYear();
        const lastYear = new Date(lastTS).getFullYear();

        while (year <= lastYear) {
            const jun = new Date(year, 5, 1).getTime();
            const dec = new Date(year, 11, 1).getTime();

            if (jun >= firstTS && jun <= lastTS) ticks.push(jun);
            if (dec >= firstTS && dec <= lastTS) ticks.push(dec);

            year++;
        }
        return ticks;
    }

    // -------- 5Y (yearly) --------
    if (range === "5y") {
        let cursor = new Date(last);
        cursor.setFullYear(cursor.getFullYear() - 5);

        while (cursor <= last) {
            pushClosest(new Date(cursor.getFullYear(), 0, 1));
            cursor.setFullYear(cursor.getFullYear() + 1);
        }
        return [...new Set(result)];
    }

    return timestamps;
}

// ------------------ Component ------------------
// refPrice (ไม่บังคับ): ราคาปิดวันก่อน ถ้าส่งมาจะขึ้นเส้นประแนวนอนในกราฟ Intraday
export default function StockLineChart({ data = [], range, refPrice }) {
    const isIntraday = range === "intraday";
    const baseDate = data?.[0]?.ts ? new Date(data[0].ts) : new Date();

    const ticks = isIntraday
        ? generateHourlyTicks(baseDate)
        : generateDateTicks(data, range);

    // Intraday: แกนเวลายาวทั้งวัน 10:00–17:00 เส้นราคาจะหยุดตรงเวลาล่าสุดที่มีข้อมูล
    const xDomain = isIntraday ? getSessionRange(baseDate) : ["dataMin", "dataMax"];

    // เผื่อขอบบนล่างให้เส้นไม่ชิดขอบกราฟ (และให้เส้นราคาอ้างอิงอยู่ในกรอบ)
    const yDomain = [
        (min) => Math.floor(Math.min(min, refPrice ?? min) - 1),
        (max) => Math.ceil(Math.max(max, refPrice ?? max) + 1),
    ];

    return (
        <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
                {isIntraday && (
                    <CartesianGrid vertical={false} stroke="#374151" strokeOpacity={0.5} />
                )}

                <XAxis
                    dataKey="ts"
                    type="number"
                    scale="time"
                    domain={xDomain}
                    ticks={ticks}
                    tickFormatter={(ts) => formatXAxis(ts, range)}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dy={10}
                    allowDataOverflow
                />

                <YAxis
                    domain={isIntraday ? yDomain : ["auto", "auto"]}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    tickFormatter={(v) => Number(v).toFixed(2)}
                    width={60}
                />

                {isIntraday && refPrice != null && (
                    <ReferenceLine y={refPrice} stroke="#9ca3af" strokeDasharray="4 4" />
                )}

                <Tooltip
                    formatter={(value) => Number(value).toFixed(2)}
                    labelFormatter={(ts) => {
                        const d = new Date(ts);
                        return isIntraday
                            ? d.toLocaleTimeString("th-TH", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                              })
                            : d.toLocaleDateString("th-TH", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "2-digit"
                              });
                    }}
                />

                <Line
                    type="linear"
                    dataKey="close"
                    stroke="#00d9a3"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}