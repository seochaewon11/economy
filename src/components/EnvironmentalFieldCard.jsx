import { useState } from "react";

export default function EnvironmentalFieldCard({ field, canHover }) {
  const [revealed, setRevealed] = useState(false);

  function handleMouseEnter() {
    if (!canHover) return;
    setRevealed(true);
  }

  function handleMouseLeave() {
    if (!canHover) return;
    setRevealed(false);
  }

  function handleCtaClick(e) {
    if (!canHover && !revealed) {
      e.preventDefault();
      setRevealed(true);
    }
  }

  function handleCardClick() {
    if (!canHover) setRevealed((r) => !r);
  }

  return (
    <div
      className={
        "field-card field-card--" + field.size + (revealed ? " is-revealed" : "")
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <span className="field-card-media" aria-hidden="true">
        <span
          className="field-card-image"
          style={{ backgroundImage: `url(${field.image})` }}
        />
        <span className="field-card-overlay" />
      </span>

      <span className="field-card-num">{field.num}</span>

      <span className="field-card-icon" aria-hidden="true">
        <img src={field.icon} alt="" draggable={false} />
      </span>

      <span className="field-card-default">
        <span className="field-card-en">{field.en}</span>
        <span className="field-card-kr">{field.kr}</span>
      </span>

      <span className="field-card-hover-content">
        <span className="field-card-en field-card-en--hover">{field.en}</span>
        <span className="field-card-kr field-card-kr--hover">{field.kr}</span>
        <span className="field-card-desc">{field.desc}</span>
        <a className="field-card-cta" href="#" onClick={handleCtaClick}>
          VIEW FIELD <span aria-hidden="true">→</span>
        </a>
      </span>
    </div>
  );
}
