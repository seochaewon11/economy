import "./SocialFollow.css";

const LINKS = [
  { key: "instagram", label: "Instagram", href: "#" },
  { key: "facebook", label: "Facebook", href: "#" },
  { key: "blog", label: "Blog", href: "#" },
  { key: "youtube", label: "YouTube", href: "#" },
];

export default function SocialFollow() {
  return (
    <div className="social-strip">
      <div className="social-strip-mascots" aria-hidden="true">
        <img className="social-strip-mascot" src="/images/puru.png" alt="" />
        <img className="social-strip-mascot" src="/images/guru.jpg" alt="" />
      </div>

      <div className="social-strip-label">
        <span className="social-strip-title">KECO SNS</span>
        <span className="social-strip-sub">푸루 · 구루와 함께해요</span>
      </div>

      <div className="social-strip-icons">
        {LINKS.map((link) => (
          <a
            key={link.key}
            className="social-strip-icon"
            href={link.href}
            aria-label={link.label}
          >
            <SocialIcon type={link.key} />
          </a>
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ type }) {
  switch (type) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
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
    case "blog":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="4" width="17" height="16" rx="2.4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7.5 8.5h9M7.5 12h9M7.5 15.5h5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2.5" y="6" width="19" height="12" rx="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10.3 9.6v4.8l4.2-2.4-4.2-2.4Z" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
