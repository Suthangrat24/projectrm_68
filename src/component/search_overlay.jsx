import { useNavigate } from "react-router-dom";
import "../css/search_overlay.css";

export default function SearchOverlay({ keyword, results, onClose }) {
  const navigate = useNavigate();

  if (!keyword) return null;

  return (
    <div className="search-overlay">
      <div className="search-card">
        <div className="search-card-header">
          <span>ผลการค้นหา “{keyword}”</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="search-card-body">
          {results.length === 0 && (
            <div className="search-empty">ไม่พบข้อมูล</div>
          )}

          {results.map((s) => (
            <div
              key={s.symbol}
              className="search-item"
              onClick={() => navigate(`/${s.symbol}/detail`)}
            >
              <div>
                <div className="search-symbol">{s.symbol}</div>
                <div className="search-name">{s.stock_name}</div>
              </div>

              {s.last_price && (
                <div className="search-price">{s.last_price} ฿</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
