// แสดงโลโก้หุ้นจากลิงก์ Supabase Storage (stock.logo_path ที่ backend ส่งมา)
// ไม่มีลิงก์ / โหลดไม่ขึ้น → แสดงป้ายตัวอักษรย่อ (สีคงที่ต่อหุ้นแต่ละตัว) แทนรูปแตก
// ใช้:  <StockLogo symbol={stock.symbol} src={stock.logo_path} size={64} className="stock-logo" />
import { useState, useEffect } from "react";

const COLORS = [
  "#2563eb", "#16a34a", "#d97706", "#9333ea", "#dc2626",
  "#0891b2", "#4f46e5", "#ca8a04", "#db2777", "#059669",
];

function colorOf(symbol = "") {
  let h = 0;
  for (const ch of symbol) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[h % COLORS.length];
}

export default function StockLogo({ symbol, src, size = 56, className = "", radius = 12 }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [symbol, src]);

  const box = { width: size, height: size, borderRadius: radius, flexShrink: 0 };
  const hasImage = typeof src === "string" && src.startsWith("http");

  if (!hasImage || failed) {
    const clean = (symbol || "?").replace(/[^A-Z0-9]/gi, "");
    const text = clean.slice(0, clean.length > 4 ? 3 : 4);
    return (
      <div
        className={className}
        title={symbol}
        style={{
          ...box,
          background: colorOf(symbol),
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: size * (text.length >= 4 ? 0.24 : 0.3),
          letterSpacing: 0.5,
        }}
      >
        {text}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={symbol}
      loading="lazy"
      className={className}
      style={{ ...box, objectFit: "contain", background: "#fff" }}
      onError={() => setFailed(true)}
    />
  );
}