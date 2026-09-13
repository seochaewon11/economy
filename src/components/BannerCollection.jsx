import { useEffect, useRef, useState } from "react";
import "./BannerCollection.css";

// 실제 로고 이미지는 없어서, 프로젝트에 이미 있는 환경 관련 이미지를 썸네일로 사용하고
// 그 위에 이니셜 배지를 작게 겹쳐 어떤 배너인지 구분한다.
const BANNERS = [
  { key: "rfid", label: "RFID 음식물쓰레기관리시스템", initial: "RF", color: "#1f6546", image: "/images/circulation.png" },
  { key: "airkorea", label: "AIR KOREA", initial: "AK", color: "#1c87c9", image: "/images/airkorea.png" },
  { key: "ev", label: "저공해차 통합정보 누리집", initial: "EV", color: "#4f8f62", image: "/images/climate.png" },
  { key: "soosiro", label: "SOOSIRO", initial: "SS", color: "#8a806d", image: "/images/water.png" },
  { key: "sme", label: "중소기업정보센터", initial: "중", color: "#1f6546", image: "/images/facility.png" },
  { key: "soc", label: "SOC 기술마켓", initial: "SC", color: "#1c87c9", image: "/images/land.jpeg" },
];

const BANNERS_LOOP = [...BANNERS, ...BANNERS];

export default function BannerCollection() {
  const [playing, setPlaying] = useState(true);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const playingRef = useRef(true);
  const hoverSpeedRef = useRef(1);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    function step() {
      if (playingRef.current) {
        const halfWidth = track.scrollWidth / 2;
        track.scrollLeft += 0.6 * hoverSpeedRef.current;
        if (track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function nudge(dir) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 220, behavior: "smooth" });
  }

  return (
    <section className="banners" aria-label="배너모음">
      <div className="banners-inner">
        <div className="banners-label">
          <span>배너모음</span>
        </div>

        <div
          className="banners-track-wrap"
          ref={trackRef}
          onMouseEnter={() => (hoverSpeedRef.current = 0.15)}
          onMouseLeave={() => (hoverSpeedRef.current = 1)}
        >
          <div className="banners-track">
            {BANNERS_LOOP.map((b, i) => (
              <a key={`${b.key}-${i}`} href="#" className="banners-item">
                <span className="banners-thumb" style={{ backgroundImage: `url(${b.image})` }}>
                  <span
                    className="banners-icon"
                    style={{ background: b.color }}
                    aria-hidden="true"
                  >
                    {b.initial}
                  </span>
                </span>
                <span className="banners-item-label">{b.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="banners-controls">
          <button
            type="button"
            className="banners-control-btn"
            onClick={() => nudge(-1)}
            aria-label="이전 배너"
          >
            ‹
          </button>
          <button
            type="button"
            className="banners-control-btn"
            onClick={() => setPlaying((v) => !v)}
            aria-pressed={playing}
            aria-label={playing ? "배너 자동재생 정지" : "배너 자동재생 시작"}
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <button
            type="button"
            className="banners-control-btn"
            onClick={() => nudge(1)}
            aria-label="다음 배너"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
