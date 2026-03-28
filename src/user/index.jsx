import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getFavorites, getStockLatest, getPortfolio, getStockHistory, deleteFavorite, getStocks } from "../fetchapi/call_api_user";
import StockLineChart from "../component/stock_line_chart";
import "../css/index.css";

export default function Navbar() {

    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState([]);
    const [latestPrices, setLatestPrices] = useState({});
    const [chartData, setChartData] = useState([]);
    const [range, setRange] = useState("intraday");
    const [lastUpdate, setLastUpdate] = useState("-");
    const [selectedSymbol, setSelectedSymbol] = useState("");
    const [allStocksLatest, setAllStocksLatest] = useState([]);
    const [topTab, setTopTab] = useState("value");
    const [selectedTop, setSelectedTop] = useState(0);
    const [topChartData, setTopChartData] = useState([]);
    const [topChartLoading, setTopChartLoading] = useState(false);
    const [topChartHighLow, setTopChartHighLow] = useState({ high: null, low: null });
    const token = localStorage.getItem("token");

    // ดึงข้อมูล portfolio
    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const data = await getPortfolio(token);
                setPortfolio(data);

                const symbols = data.map(item => item.symbol + '.BK');
                const latestData = await Promise.all(
                    symbols.map(async (symbol) => {
                        try {
                            const stockData = await getStockLatest(symbol);
                            if (stockData && stockData.price) { // ตรวจสอบให้มั่นใจว่า stockData มีข้อมูล
                                return {
                                    symbol,
                                    ...stockData
                                };
                            } else {
                                console.error(`No stock data for ${symbol}`);
                                return null;
                            }
                        } catch (err) {
                            console.error(`Error fetching stock data for ${symbol}: `, err);
                            return null;
                        }
                    })
                );

                const priceMap = {};
                latestData.forEach(item => {
                    if (item) {
                        priceMap[item.symbol] = item;
                    }
                });
                setLatestPrices(priceMap);
                console.log("setLatestPrices: ", priceMap);

                if (data.length > 0) {
                    const firstSymbol = data[0].symbol;
                    setSelectedSymbol(firstSymbol);
                    await fetchChart(firstSymbol); // โหลดกราฟของหุ้นตัวแรกเลย
                }
            } catch (error) {
                console.error("Error fetching portfolio:", error);
            }
        };
        fetchPortfolio();
    }, [token]);

    useEffect(() => {
        const fetchAllStocks = async () => {
            try {
                const res = await getStocks();
                const stockList = res.data;

                const results = await Promise.all(
                    stockList.map(async (s) => {
                        try {
                            const latest = await getStockLatest(`${s.symbol}.BK`);
                            return {
                                symbol: s.symbol,
                                name: s.stock_name,
                                price: latest.price ?? 0,
                                change: latest.change ?? 0,
                                change_pct: latest.change_pct ?? 0,
                                volume: latest.volume ?? 0,
                                value: latest.value ?? 0,
                                updated_at: latest.updated_at ?? "",
                            };
                        } catch {
                            return null;
                        }
                    })
                );

                const filtered = results.filter(Boolean);
                setAllStocksLatest(filtered);

                // sort value แล้ว fetch chart อันดับ 1 เลย
                const sorted = [...filtered].sort((a, b) => b.value - a.value);
                if (sorted.length > 0) {
                    await fetchTopChart(sorted[0].symbol);
                }

            } catch (err) {
                console.error("โหลด allStocksLatest ไม่ได้", err);
            }
        };

        fetchAllStocks();
    }, []);

    const fetchChart = async (symbol) => {
        try {
            const history = await getStockHistory({
                symbol: `${symbol}.BK`,
                period: "1d",
                interval: "5m",
            });

            if (history.length === 0) {
                console.warn("ไม่มีข้อมูลใหม่ ใช้กราฟเดิมแทน");
                setChartData((prev) => prev);
                return;
            }

            const cleanedHistory = history.filter(
                (d) => d.close != null && !isNaN(d.close)
            );

            if (cleanedHistory.length < 2) {
                console.warn("ข้อมูลไม่พอวาดกราฟ → คงข้อมูลเดิมไว้");
                setChartData((prev) => prev);
                return;
            }

            const formatted = cleanedHistory.map((d) => {
                const date = new Date(d.time);
                return {
                    time: date.toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    ts: date.getTime(),
                    close: d.close,
                };
            });

            setChartData(formatted);

            if (formatted.length > 0) {
                const last = formatted[formatted.length - 1];
                setLastUpdate(new Date(cleanedHistory[cleanedHistory.length - 1].time).toLocaleString("th-TH"));
            }
        } catch (err) {
            console.error("โหลดกราฟไม่สำเร็จ", err);
        }
    };

    const handleSelectStock = async (symbol) => {
        setSelectedSymbol(symbol);  // อัปเดต selectedSymbol เมื่อผู้ใช้เลือกหุ้น
        await fetchChart(symbol);
    };

    const fetchTopChart = async (symbol) => {
        setTopChartLoading(true);
        setTopChartData([]);
        setTopChartHighLow({ high: null, low: null }); // reset
        try {
            const history = await getStockHistory({
                symbol: `${symbol}.BK`,
                period: "1d",
                interval: "5m",
            });

            const cleaned = history.filter(d => d.close != null && !isNaN(d.close));
            if (cleaned.length < 2) { setTopChartLoading(false); return; }

            const formatted = cleaned.map((d) => {
                const date = new Date(d.time);
                return {
                    time: date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
                    ts: date.getTime(),
                    close: d.close,
                };
            });

            // คำนวณ high/low จาก close ทั้งวัน
            const closes = cleaned.map(d => d.close);
            const high = Math.max(...closes);
            const low = Math.min(...closes);
            setTopChartHighLow({ high, low });

            setTopChartData(formatted);
        } catch (err) {
            console.error("โหลด top chart ไม่สำเร็จ", err);
        }
        setTopChartLoading(false);
    };

    // สร้าง function กลางไว้ใช้ร่วมกัน (วางหลัง fetchTopChart)
    const handleTabChange = async (newTab) => {
        setTopTab(newTab);
        setSelectedTop(0);
        setTopChartData([]);
        setTopChartHighLow({ high: null, low: null });

        // sort ตาม tab ใหม่แล้วเอาอันดับ 1
        let sorted;
        if (newTab === "value") {
            sorted = [...allStocksLatest].sort((a, b) => b.value - a.value);
        } else if (newTab === "volume") {
            sorted = [...allStocksLatest].sort((a, b) => b.volume - a.volume);
        } else if (newTab === "up") {
            sorted = [...allStocksLatest].filter(s => s.change_pct > 0).sort((a, b) => b.change_pct - a.change_pct);
        } else if (newTab === "down") {
            sorted = [...allStocksLatest].filter(s => s.change_pct < 0).sort((a, b) => a.change_pct - b.change_pct);
        }

        if (sorted && sorted.length > 0) {
            await fetchTopChart(sorted[0].symbol);
        }
    };

    const top_five = useMemo(() => {
        if (allStocksLatest.length === 0) return [];

        let sorted;
        if (topTab === "value") {
            sorted = [...allStocksLatest].sort((a, b) => b.value - a.value);
        } else if (topTab === "volume") {
            sorted = [...allStocksLatest].sort((a, b) => b.volume - a.volume);
        } else if (topTab === "up") {
            sorted = [...allStocksLatest]
                .filter(s => s.change_pct > 0)
                .sort((a, b) => b.change_pct - a.change_pct);
        } else if (topTab === "down") {
            sorted = [...allStocksLatest]
                .filter(s => s.change_pct < 0)
                .sort((a, b) => a.change_pct - b.change_pct);
        } else {
            sorted = allStocksLatest;
        }

        return sorted.slice(0, 5).map((s, i) => ({ ...s, rank: i + 1 }));
    }, [allStocksLatest, topTab]);

    const [favorites, setFavorites] = useState([]);
    const [latestMap, setLatestMap] = useState({});

    useEffect(() => {
        async function fetchFavorites() {
            try {

                const data = await getFavorites(token);
                setFavorites(data);

                const symbols = (data || []).map(f => f.symbol);

                const results = await Promise.all(
                    symbols.map(async (symbol) => {
                        try {
                            const data = await getStockLatest(`${symbol}.BK`);

                            return {
                                symbol,
                                ...data
                            };
                        } catch (err) {
                            return null;
                        }
                    })
                );

                const map = {};
                results.forEach(item => {
                    if (item) {
                        map[item.symbol] = item;
                    }
                });

                setLatestMap(map);

                console.log("favorites: ", data);
                console.log("latestMap: ", map);

            } catch (err) {
                console.error("โหลด favorites ไม่ได้", err);
            }
        }

        fetchFavorites();
    }, []);

    const favUI = (favorites || []).map(f => {
        const latest = latestMap[f.symbol] || {};

        return {
            favorite_id: f.favorite_id,
            symbol: f.symbol,
            name: f.stock_name,
            price: latest.price ?? 0,
            pct: latest.change_pct ?? 0,
            change: latest.change ?? 0,
        };
    });

    const handleRemoveFavorite = async (favorite_id) => {
        try {
            const token = localStorage.getItem("token");
            await deleteFavorite(token, favorite_id);

            setFavorites((prev) =>
                prev.filter((item) => item.favorite_id !== favorite_id)
            );
        } catch (err) {
            console.error("ลบ favorite ไม่สำเร็จ", err);
        }
    };

    return (
        <>
            {/*Recommend*/}
            <section className="rec">
                <div className="rec_container">
                    <div className="rec_text">
                        <h1 className="rec_title">แนะนำหุ้นที่เหมาะสมกับคุณ</h1>
                        <h1 className="rec_title t2">ในการลงทุนระยะยาว</h1>
                        <p className="rec_des">
                            จากข้อมูลที่คุณกรอกในแบบประเมิน ระบบจะวิเคราะห์โปรไฟล์การลงทุนและพฤติกรรมการลงทุนของคุณ<br />
                            โดยการนำข้อมูลเหล่านี้มาประมวลผลเพื่อแนะนำหุ้นที่ตรงกับความต้องการและเป้าหมายการลงทุนของคุณ<br />
                            เพื่อให้คุณสามารถเลือกหุ้นที่เหมาะสมกับผลการประเมิน ช่วยเพิ่มความมั่นใจในการตัดสินใจลงทุนชองคุณ
                        </p>
                        <p className="rec_note">
                            หมายเหตุ:
                            ระบบนี้เป็นเพียงเครื่องมือช่วยแนะนำ ไม่ใช่คำแนะนำการลงทุนโดยตรง<br />
                            การลงทุนมีความเสี่ยง กรุณาศึกษาข้อมูลให้รอบคอบ และตัดสินใจลงทุนตามความเหมาะสมของตนเอง
                        </p>
                    </div>
                    <div className="rec_button">
                        <button className="rec_cta" onClick={() => navigate("/risk")}>
                            เริ่มต้นใช้งาน
                            <img src="/pics/next.png" alt="next" className="next-icon" />
                        </button>
                    </div>
                </div>
            </section>

            {/*ติดตามพอร์ต*/}
            <section className="invest">
                {/*หัวข้อ*/}
                <div className="invest_top">
                    <div className="invest_title">
                        <div>
                            <h3>ติดตามสถานะหุ้นที่ลงทุน</h3>
                            <p>เปรียบเทียบราคาปัจจุบัน ณ เวลาที่ล็อกอิน และการคาดการณ์</p>
                        </div>
                    </div>
                    <a className="invest_manage" href="/portfolio">
                        จัดการพอร์ต →
                    </a>
                </div>

                <div className="invest_grid">
                    {/* ซ้าย: รายการหุ้นในพอร์ต */}
                    <aside className="invest_list">
                        {portfolio.map((item) => {
                            const stockSymbol = item.symbol + ".BK";
                            const stock_latest = latestPrices[stockSymbol] || {};
                            console.log("Latest Prices: ", latestPrices);
                            console.log("stock_latest: ", stock_latest);

                            return (
                                <div
                                    key={item.symbol}
                                    className={`stockcard ${selectedSymbol === item.symbol ? "stockcard--active" : ""}`}
                                    onClick={() => handleSelectStock(item.symbol)}
                                >
                                    <div className="stockcard_left">
                                        <h4>{item.symbol}</h4>
                                        <span className="label">ราคาตลาด</span>

                                    </div>
                                    <div className="stockcard_right">
                                        <div className="price">฿ {stock_latest.price || "0.00"}</div>
                                        <div className="chg">
                                            {stock_latest.change >= 0 ? "+" : ""}
                                            {stock_latest.change || 0}{" "}
                                            ({stock_latest.change_pct >= 0 ? "+" : ""}
                                            {stock_latest.change_pct || 0}%)
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <Link to="/add-investment">
                            <button className="invest_add">+ เพิ่มหุ้นใหม่</button>
                        </Link>
                    </aside>

                    <div className="invest_panel">
                        <div className="panel_head">
                            <div>
                                <div className="panel_title">{selectedSymbol}</div>
                                <div className="panel_sub">{portfolio.find(item => item.symbol === selectedSymbol)?.stock_name}</div>
                                <div className="panel_line">
                                    <span className="muted">ราคาปัจจุบัน: </span>
                                    <span className="panel_price">฿ {latestPrices[selectedSymbol + ".BK"]?.price || "0.00"}</span>
                                    <span className="panel_pct">
                                        {latestPrices[selectedSymbol + ".BK"]?.change > 0 ? "+" : ""}
                                        {latestPrices[selectedSymbol + ".BK"]?.change || 0}
                                        ({latestPrices[selectedSymbol + ".BK"]?.change_pct || 0}%)
                                    </span>
                                </div>
                            </div>
                            <Link to={`/${selectedSymbol}/detail`}>
                                <button className="btn--pill">ดูรายละเอียด</button>
                            </Link>
                        </div>

                        <div className="panel_chart">
                            {chartData.length > 0 ? (
                                <StockLineChart data={chartData} range="intraday" />
                            ) : (
                                <div>กราฟไม่สามารถโหลดได้</div>
                            )}
                        </div>

                        <div className="panel_foot">
                            อัปเดตล่าสุด: {lastUpdate}
                        </div>
                    </div>
                </div>
            </section>

            <div className="section-divider"></div>

            {/* ===== Top Five ===== */}
            <section className="top_five">
                <div className="top_container">

                {/* หัวข้อ + แท็บ */}
                <div className="top_header">
                    <h3>TOP 5</h3>
                    <div className="top_tabs">
                        <button className={`tab_btn ${tab === "value" ? "is-active" : ""}`} onClick={() => setTab("value")}>
                            {/* icon มูลค่า (ตัวอย่าง path) */}
                            <img className="btn_icon" src={ tab === "value" ? "../public/pics/value_active.png" : "../public/pics/value_norm.png"} alt="" />
                            มูลค่าการซื้อขาย
                        </button>
                        <button className={`tab_btn ${tab === "volume" ? "is-active" : ""}`} onClick={() => setTab("volume")}>
                            {/* icon ปริมาณ (ตัวอย่าง path) */}
                            <img className="btn_icon" src={ tab === "volume" ? "../public/pics/volume_active.png" : "../public/pics/volume_norm.png"} alt="" />
                            ปริมาณการซื้อขาย
                        </button>
                        <button className={`tab_btn ${tab === "up" ? "is-active" : ""}`} onClick={() => setTab("up")}>
                            {/* icon ราคาเพิ่มขึ้น */}
                            <img className="btn_icon" src={ tab === "up" ? "../public/pics/up_active.png" : "../public/pics/up_norm.png"} alt="" />
                            ราคาเพิ่มขึ้น
                        </button>
                        <button className={`tab_btn ${tab === "down" ? "is-active" : ""}`} onClick={() => setTab("down")}>
                            {/* icon ราคาลดลง */}
                            <img className="btn_icon" src={ tab === "down" ? "../public/pics/down_active.png" : "../public/pics/down_norm.png"} alt="" />
                            ราคาลดลง
                        </button>
                    </div>
                </div>

                    {top_five.length === 0 ? (
                        <div className="top_loading">กำลังโหลดข้อมูล...</div>
                    ) : (
                        <div className="top_content">
                            {/* ซ้าย: รายการ 5 อันดับ */}
                            <aside className="top_list">
                                {top_five.map((it, idx) => (
                                    <button
                                        key={it.symbol}
                                        className={`top_item ${idx === selectedTop ? "active" : ""}`}
                                        onClick={() => {
                                            setSelectedTop(idx);
                                            fetchTopChart(it.symbol);
                                        }}
                                    >
                                        <div className="left">
                                            <span className="top_rank">{it.rank}</span>
                                            <div
                                                className="top_logo"
                                                style={{ backgroundImage: `url(/logos/${it.symbol}.png)` }}
                                                aria-hidden
                                            />
                                            <div className="top_symbolwrap">
                                                <div className="top_symbol">{it.symbol}</div>
                                                <div className="top_name">{it.name}</div>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className="top_amount">
                                                {topTab === "volume"
                                                    ? it.volume.toLocaleString("th-TH")
                                                    : topTab === "up" || topTab === "down"
                                                        ? `${it.change_pct >= 0 ? "+" : ""}${it.change_pct.toFixed(2)}%`
                                                        : `฿ ${it.value.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`
                                                }
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </aside>

                            {/* ขวา: panel รายละเอียด */}
                            {(() => {
                                const s = top_five[selectedTop];
                                if (!s) return null;
                                return (
                                    <div className="top_panel" style={{ "--sel": selectedTop }}>
                                        <div className="top_panel_in">
                                            <div className="top_panel_head">
                                                <div className="price_block">
                                                    <div className="price_now_row">
                                                        <span className={`arrow_icon ${s.change >= 0 ? "up" : "down"}`}>
                                                            {s.change >= 0 ? "▲" : "▼"}
                                                        </span>
                                                        <span className="price_now">฿ {s.price.toFixed(2)}</span>
                                                    </div>
                                                    <div className={`price_chg ${s.change >= 0 ? "up" : "down"}`}>
                                                        {(s.change >= 0 ? "+" : "") + s.change.toFixed(2)}{" "}
                                                        ({(s.change_pct >= 0 ? "+" : "") + s.change_pct.toFixed(2)}%)
                                                    </div>
                                                </div>

                                                <div className="meta_wrap">
                                                    <div className="latest_text">
                                                        ข้อมูลล่าสุด : {s.updated_at
                                                            ? new Date(s.updated_at).toLocaleString("th-TH")
                                                            : "-"}
                                                    </div>
                                                    <div className="meta_block right">
                                                        <div className="meta_col">
                                                            <div className="meta_val">{s.volume.toLocaleString("th-TH")}</div>
                                                            <div className="meta_lbl">ปริมาณ (หุ้น)</div>
                                                        </div>
                                                        <div className="meta_col">
                                                            <div className="meta_val">฿ {s.value.toLocaleString("th-TH")}</div>
                                                            <div className="meta_lbl">มูลค่า ('000 บาท)</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chart จริง */}
                                            <div className="top_chartbox">
                                                {topChartLoading ? (
                                                    <div>กำลังโหลดกราฟ...</div>
                                                ) : topChartData.length > 0 ? (
                                                    <StockLineChart data={topChartData} range="intraday" />
                                                ) : (
                                                    <div className="top_chart_hint">คลิกหุ้นเพื่อดูกราฟ</div>
                                                )}
                                            </div>

                                            <div className="top_panel_foot">
                                                <div className="foot_left">
                                                    <span className="foot_label">ราคาสูงสุด</span>
                                                    <span className="foot_val">
                                                        {topChartHighLow.high != null ? topChartHighLow.high.toFixed(2) : "-"}
                                                    </span>
                                                    <span className="foot_divider" />
                                                    <span className="foot_label">ราคาต่ำสุด</span>
                                                    <span className="foot_val">
                                                        {topChartHighLow.low != null ? topChartHighLow.low.toFixed(2) : "-"}
                                                    </span>
                                                </div>
                                                <Link to={`/${s.symbol}/detail`}>
                                                    <button className="btn-soft">ดูรายละเอียด →</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </section>

            <div className="section-divider"></div>

            <section className="favorite">
                <div className="fav_container">
                    <div className="fav_head">
                        <div className="fav_titlewrap">
                            <div>
                                <h3>หุ้นที่ติดตาม</h3>
                                <p>หุ้นที่คุณสนใจและติดตาม</p>
                            </div>
                        </div>
                        <Link to="/profile?tab=favorite">
                            <button className="fav_all">ดูทั้งหมด →</button>
                        </Link>
                    </div>

                    {/* การ์ดแบบเลื่อนแนวนอน */}
                    <div className="fav_scroller">
                        {favUI.map((f) => {
                            const isUp = f.pct > 0;
                            const isDown = f.pct < 0;
                            const isZero = f.pct === 0;

                            const colorClass = isZero ? "neutral" : isUp ? "up" : "down";
                            return (
                                <article
                                    key={f.symbol}
                                    className="fav_card"
                                    onClick={() => navigate(`/${f.symbol}/detail`)}
                                >
                                    <header className="fav_card_head">
                                        <div className="fav_symbol_block">
                                            <div className="fav_symbol">{f.symbol}</div>
                                            <div className="fav_name">{f.name}</div>
                                        </div>

                                        <img
                                            src="/pics/heart.png"
                                            className="fav_heart"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFavorite(f.favorite_id);
                                            }}
                                        />
                                    </header>

                                    <div className="fav_price">
                                        ฿ {Number(f.price || 0).toFixed(2)}
                                    </div>

                                    <div className={`fav_change ${colorClass}`}>
                                        {isZero
                                            ? "0.00 (0.00%)"
                                            : `${isUp ? "+" : ""}${f.change.toFixed(2)} (${isUp ? "+" : ""}${f.pct.toFixed(2)}%)`}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}