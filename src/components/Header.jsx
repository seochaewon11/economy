import { useState } from "react";
import "./Header.css";

const NAV_ITEMS = [
  { label: "공단소개", href: "#top" },
  { label: "주요사업", href: "#projects" },
  { label: "환경정보", href: "#data" },
  { label: "ESG경영", href: "#service" },
  { label: "국민참여", href: "#service" },
  { label: "알림·소통", href: "#footer" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="gnb">
      <div className="gnb-inner">
        <a href="#top" className="gnb-logo">
          <img className="gnb-logo-icon" src="/favicon.ico" alt="" aria-hidden="true" />
          <span className="gnb-logo-text-wrap">
            <svg
              className="gnb-logo-swoosh"
              viewBox="0 0 120 40"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path
                d="M6,30 C26,10 62,3 112,10 C82,13 48,19 22,29 C15,32 8,32 6,30 Z"
                fill="#6EC04A"
                opacity="0.5"
              />
              <path
                d="M2,24 C24,4 58,-2 108,6 C78,10 42,15 16,25 C9,28 4,27 2,24 Z"
                fill="#1C87C9"
                opacity="0.55"
              />
            </svg>
            <span className="gnb-logo-kr">한국환경공단</span>
          </span>
        </a>

        <nav className={"gnb-nav" + (isMenuOpen ? " is-open" : "")} aria-label="주요 메뉴">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a href={item.href} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="gnb-right">
          <button type="button" className="gnb-search-btn" aria-label="검색 열기">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="7" strokeWidth="1.8" />
              <line x1="15.2" y1="15.2" x2="18.3" y2="18.3" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            className="gnb-menu-btn"
            aria-label="메뉴 열기"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
