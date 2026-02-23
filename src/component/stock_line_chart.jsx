import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ------------------ Intraday ticks (10:00 → last data hour) ------------------
function generateHourlyTicks(baseDate, lastTs) {
    if (!lastTs) return [];

    const ticks = [];
    const base = new Date(baseDate);
    base.setHours(10, 0, 0, 0);

    for (let h = 10; h <= 17; h++) {
        const d = new Date(base);
        d.setHours(h, 0, 0, 0);

        // ❗ ตัด tick ที่เกินข้อมูลจริง
        if (d.getTime() <= lastTs) {
            ticks.push(d.getTime());
        }
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
export default function StockLineChart({ data = [], range }) {
    const baseDate = data?.[0]?.ts ? new Date(data[0].ts) : new Date();
    const lastTs = data?.[data.length - 1]?.ts;

    const ticks =
        range === "intraday"
            ? generateHourlyTicks(baseDate, lastTs)
            : generateDateTicks(data, range);

    return (
        <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
                <XAxis
                    dataKey="ts"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    ticks={ticks}
                    tickFormatter={(ts) => formatXAxis(ts, range)}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dy={10}
                />

                <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                />

                <Tooltip
                    formatter={(value) => Number(value).toFixed(2)}
                    labelFormatter={(ts) => {
                        const d = new Date(ts);
                        return range === "intraday"
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
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
