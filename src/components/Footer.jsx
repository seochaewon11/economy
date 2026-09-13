import { useState } from "react";
import "./Footer.css";

const ACCORDION_GROUPS = [
  {
    key: "hq",
    label: "한국환경공단 환경본부",
    links: ["수도권본부", "영남권본부", "호남권본부", "충청권본부"],
  },
  {
    key: "site",
    label: "한국환경공단 누리집",
    links: ["국가미세먼지정보센터", "물환경정보시스템", "탄소중립포인트", "환경교육포털"],
  },
  {
    key: "related",
    label: "유관기관 누리집",
    links: ["환경부", "한국환경산업기술원", "국립환경과학원", "수도권매립지관리공사"],
  },
];

const POLICY_LINKS = [
  { key: "privacy", label: "개인정보처리방침", emphasis: true },
  { key: "video", label: "영상정보처리기기 운영관리 방침" },
  { key: "copyright", label: "저작권정책" },
  { key: "email", label: "이메일무단수집거부" },
  { key: "report", label: "누리집오류신고" },
];

const SOCIAL_LINKS = [
  { key: "blog", label: "블로그" },
  { key: "youtube", label: "유튜브" },
  { key: "instagram", label: "인스타그램" },
  { key: "x", label: "X" },
  { key: "facebook", label: "페이스북" },
];

export default function Footer() {
  const [openKey, setOpenKey] = useState(null);

  function toggle(key) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-accordion">
        {ACCORDION_GROUPS.map((group) => (
          <div key={group.key} className="footer-accordion-item">
            <button
              type="button"
              className="footer-accordion-trigger"
              aria-expanded={openKey === group.key}
              onClick={() => toggle(group.key)}
            >
              {group.label}
              <span className="footer-accordion-chevron" aria-hidden="true">
                {openKey === group.key ? "▲" : "▼"}
              </span>
            </button>
            {openKey === group.key && (
              <ul className="footer-accordion-panel">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="footer-policies">
        <ul className="footer-policy-links">
          {POLICY_LINKS.map((link) => (
            <li key={link.key}>
              <a
                href="#"
                className={link.emphasis ? "is-emphasis" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <ul className="footer-social">
          {SOCIAL_LINKS.map((social) => (
            <li key={social.key}>
              <a href="#" aria-label={social.label} className={`footer-social-icon footer-social-icon--${social.key}`}>
                <FooterSocialIcon type={social.key} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-main">
        <div className="footer-brand">
          <span className="footer-logo" aria-hidden="true">
            <svg viewBox="0 0 120 40" fill="none" preserveAspectRatio="none">
              <path
                d="M6,30 C26,10 62,3 112,10 C82,13 48,19 22,29 C15,32 8,32 6,30 Z"
                fill="#6EC04A"
                opacity="0.6"
              />
              <path
                d="M2,24 C24,4 58,-2 108,6 C78,10 42,15 16,25 C9,28 4,27 2,24 Z"
                fill="#1C87C9"
                opacity="0.65"
              />
            </svg>
          </span>
          <span className="footer-brand-name">한국환경공단</span>
        </div>

        <div className="footer-info">
          <p className="footer-address">
            (22689) 인천광역시 서해구 환경로 42(경서동 종합환경연구단지) 대표전화 032-590-4000
          </p>
          <p className="footer-hotlines">
            층간소음 1661-2642 &nbsp;&nbsp; 저공해자동차 1661-0970 &nbsp;&nbsp; 자동차배출가스 1833-7435
            &nbsp;&nbsp; Allbaro 시스템 1644-0007 &nbsp;&nbsp; 음식물쓰레기 1600-0244
          </p>
          <p className="footer-copyright">
            COPYRIGHT © KECO RENEWAL PAGE. ALL RIGHT RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterSocialIcon({ type }) {
  switch (type) {
    case "blog":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
          <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">
            b
          </text>
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2.5" y="6" width="19" height="12" rx="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.3 9.6v4.8l4.2-2.4-4.2-2.4Z" fill="currentColor" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 4.5 19 19.5M19 4.5 5 19.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14.5 8.5h2V5.6c-.35-.05-1.55-.15-2.95-.15-2.92 0-4.92 1.78-4.92 5.05v2.6H5.7v3.3h2.93V21h3.4v-4.6h2.82l.45-3.3h-3.27v-2.26c0-.96.26-1.34 1.47-1.34Z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
}
