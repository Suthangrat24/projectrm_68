import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Search, ChevronRight, TrendingUp, ShieldAlert, Mail, Phone, MapPin } from "lucide-react";

// --- Mock data (replace with real API later) ---
const topFive = [
  { rank: 1, symbol: "PTT", name: "PTT", value: 1761802750, color: "#1e90ff", logo: "🔥" },
  { rank: 2, symbol: "DELTA", name: "DELTA", value: 176180275, color: "#60a5fa", logo: "Δ" },
  { rank: 3, symbol: "BDMS", name: "BDMS", value: 172502250, color: "#34d399", logo: "🏥" },
  { rank: 4, symbol: "ADVANC", name: "ADVANC", value: 166913610, color: "#22c55e", logo: "📶" },
  { rank: 5, symbol: "CRC", name: "CRC", value: 151110400, color: "#f59e0b", logo: "🛍️" },
];

const miniSeries = [
  { t: "09:30", p: 32.9 },
  { t: "10:00", p: 33.1 },
  { t: "10:30", p: 33.0 },
  { t: "11:00", p: 33.2 },
  { t: "11:30", p: 33.1 },
  { t: "12:00", p: 33.15 },
  { t: "13:00", p: 33.05 },
  { t: "14:00", p: 33.25 },
];

function formatNumber(n) {
  return n.toLocaleString("th-TH");
}

function Badge({ children, variant = "default", onClick }) {
  const cls =
    variant === "green"
      ? "bg-emerald-600/90 hover:bg-emerald-600 text-white"
      : variant === "blue"
      ? "bg-blue-600/90 hover:bg-blue-600 text-white"
      : variant === "gray"
      ? "bg-neutral-700/60 hover:bg-neutral-700 text-neutral-100"
      : "bg-neutral-800/80 hover:bg-neutral-800 text-neutral-100";
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl text-sm transition-colors ${cls}`}>
      {children}
    </button>
  );
}

export default function StockHome() {
  const totalValue = useMemo(() => topFive.reduce((s, x) => s + x.value, 0), []);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">📈</span>
            <span>StockAdvisor</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a className="hover:text-white" href="#">หน้าหลัก</a>
            <a className="hover:text-white" href="#">หุ้นทั้งหมด</a>
            <a className="hover:text-white" href="#">ระบบแบบแผนหุ้น</a>
            <a className="hover:text-white" href="#">หุ้นแนะนำ</a>
          </nav>
          <div className="ml-auto flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                className="w-full md:w-72 pl-9 pr-3 py-2 rounded-xl bg-neutral-800/80 border border-white/10 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                placeholder="ค้นหาหุ้น..."
              />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-neutral-800 grid place-items-center">🥝</div>
              <span className="text-sm text-neutral-300">Gojiberry</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(16,185,129,0.12),transparent)] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">แนะนำหุ้นที่เหมาะสมกับคุณ</h1>
            <p className="mt-3 text-neutral-300 leading-relaxed text-sm md:text-base">
              จากข้อมูลที่คุณกรอกในแบบประเมิน ระบบจะวิเคราะห์โปรไฟล์และพฤติกรรมการลงทุนของคุณ แล้วแนะนำหุ้นที่ตรงกับคุณ
              เพื่อเลือกหุ้นที่สอดคล้องกับผลการประเมิน ช่วยให้คุณตัดสินใจลงทุนได้ง่ายและมั่นใจยิ่งขึ้น
            </p>
            <p className="mt-3 text-xs text-neutral-400">
              หมายเหตุ: ระบบนี้เป็นเพียงเครื่องมือแนะนำ ไม่ใช่คำแนะนำการลงทุนโดยตรง ควรศึกษาข้อมูลและตัดสินใจด้วยตนเอง
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-neutral-900 font-semibold hover:bg-neutral-100">
                เริ่มต้นใช้งาน <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="aspect-[16/9] rounded-3xl border border-white/10 bg-[url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center shadow-2xl ring-1 ring-white/10" />
          </div>
        </div>
      </section>

      {/* Top 5 + Chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold">5 อันดับสูงสุด</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge variant="green">มูลค่าการซื้อขาย</Badge>
          <Badge variant="gray">ปริมาณการซื้อขาย</Badge>
          <Badge variant="gray">ราคาเพิ่มขึ้น</Badge>
          <Badge variant="gray">ราคาลดลง</Badge>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Left: Ranking card */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-neutral-900/60 border border-white/10 shadow-lg overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between bg-neutral-800/60 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <span className="font-semibold">มูลค่าการซื้อขายรวม</span>
                </div>
                <span className="text-neutral-300 text-sm">{formatNumber(totalValue)} บาท</span>
              </div>
              <ul className="divide-y divide-white/5">
                {topFive.map((s) => (
                  <li key={s.symbol} className="px-5 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-neutral-800 text-lg">{s.rank}</div>
                    <div className="h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-neutral-800 text-xl" title={s.symbol}>
                      <span aria-hidden>{s.logo}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-neutral-400">{s.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatNumber(s.value)}</div>
                      <div className="text-xs text-neutral-400">มูลค่า (บาท)</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Price panel + mini chart */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl bg-neutral-900/60 border border-white/10 shadow-lg p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-emerald-400">▲ 33.25</div>
                  <div className="text-xs text-emerald-400">+0.25 (+0.76%)</div>
                </div>
                <div className="text-right text-sm text-neutral-300">
                  <div>ปริมาณ (หุ้น) 151,136,551</div>
                  <div>มูลค่า (’000 บาท) 4,996,684.08</div>
                </div>
              </div>
              <div className="mt-3 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeOpacity={0.1} vertical={false} />
                    <XAxis dataKey="t" hide tickMargin={8} stroke="#a3a3a3" />
                    <YAxis domain={[32.7, 33.4]} hide stroke="#a3a3a3" />
                    <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }} />
                    <Line type="monotone" dataKey="p" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-neutral-800/60 p-3 border border-white/10">
                  <div className="text-neutral-400">ราคาสูงสุด</div>
                  <div className="font-semibold">33.50</div>
                </div>
                <div className="rounded-xl bg-neutral-800/60 p-3 border border-white/10">
                  <div className="text-neutral-400">ราคาต่ำสุด</div>
                  <div className="font-semibold">32.75</div>
                </div>
              </div>
              <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-900 font-medium hover:bg-white">
                ดูเพิ่มเติม <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-neutral-400">หมายเหตุ: ข้อมูลการจัดอันดับ 5 อันดับสูงสุดเป็นแบบ Auto Matching เท่านั้น</p>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-white/5 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">📈</span>
              <span>ชื่อเว็บ</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              ระบบช่วยแนะนำหุ้นไทยสำหรับการลงทุน ระยะยาว ด้วย Recommendation System และจุดมุ่งไปในอนาคต
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">เมนูหลัก</h4>
            <ul className="space-y-2 text-neutral-300 text-sm">
              <li><a className="hover:text-white" href="#">หน้าหลัก</a></li>
              <li><a className="hover:text-white" href="#">หุ้นทั้งหมด</a></li>
              <li><a className="hover:text-white" href="#">ระบบแบบแผนหุ้น</a></li>
              <li><a className="hover:text-white" href="#">หุ้นแนะนำ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">ช่วยเหลือ</h4>
            <ul className="space-y-2 text-neutral-300 text-sm">
              <li><a className="hover:text-white" href="#">คำถามที่พบบ่อย</a></li>
              <li><a className="hover:text-white" href="#">คู่มือการใช้งาน</a></li>
              <li><a className="hover:text-white" href="#">ติดต่อเรา</a></li>
              <li><a className="hover:text-white" href="#">รายงานปัญหา</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">ติดต่อเรา</h4>
            <ul className="space-y-2 text-neutral-300 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4"/> example@gmail.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4"/> 098-765-4321</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4"/> มหาวิทยาลัยขอนแก่น</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-neutral-400 space-y-4">
            <div className="flex items-start gap-2 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-xl p-3">
              <ShieldAlert className="h-4 w-4 mt-0.5"/>
              <p>
                ข้อจำกัดความรับผิดชอบ: ข้อมูลและการวิเคราะห์ในระบบนี้เพื่อการศึกษาและอ้างอิงเท่านั้น ไม่ใช่คำแนะนำการลงทุนโดยตรง ผู้ลงทุนควรศึกษาข้อมูลเพิ่มเติมและประเมินความเสี่ยงด้วยตนเอง
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>© 2025 StockAdvisor. สงวนลิขสิทธิ์</span>
              <span>Version 2.1.0 • Made with ♥︎ for Thai investors</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
