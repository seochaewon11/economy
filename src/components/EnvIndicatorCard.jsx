import "./EnvIndicatorCard.css";

const INDICATORS = [
  {
    key: "restore",
    label: "매립지 복원 면적",
    value: "3,482",
    unit: "ha",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 17l5-7 3.5 4.5L15 9l6 8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "carbon",
    label: "온실가스 감축량",
    value: "1,286,000",
    unit: "tCO₂",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">
          CO₂
        </text>
      </svg>
    ),
  },
  {
    key: "park",
    label: "생태공원 조성 면적",
    value: "1,120",
    unit: "ha",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20V11"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 12c0-3.5-2.5-6-6-6 0 3.5 2.5 6 6 6z"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 9c0-3 2-5 5-5.5C17.3 6.5 15.3 9 12 9z"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function EnvIndicatorCard() {
  return (
    <div className="env-card" aria-label="환경지표 한눈에 보기">
      <div className="env-card-head">
        <p className="env-card-title">환경지표 한눈에 보기</p>
        <p className="env-card-sub">숫자로 보는 더 깨끗한 내일</p>
      </div>

      <ul className="env-card-list">
        {INDICATORS.map((item) => (
          <li key={item.key}>
            <span className="env-card-icon">{item.icon}</span>
            <span className="env-card-text">
              <span className="env-card-label">{item.label}</span>
              <span className="env-card-value">
                {item.value}
                <span className="env-card-unit">{item.unit}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>

      <a className="env-card-link" href="#data">
        자세히 보기 <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
