import { useState } from "react";
import "./EcoTvSection.css";

// 사용자가 실제 제공한 한국환경공단 공식 유튜브 영상 링크.
const VIDEOS = [
  {
    id: "adiAlTBr294",
    title: "한국환경공단 마감할인의 앱서비스",
    url: "https://youtu.be/adiAlTBr294",
  },
  {
    id: "B5C3kVcmw4I",
    title: "K-eco Promotional Video",
    url: "https://youtu.be/B5C3kVcmw4I",
  },
  {
    id: "IXAjJZEwpeo",
    title: "푸루의 사계절 - 물 발자국과 수질오염을 줄이는 생활 속 실천법",
    url: "https://youtu.be/IXAjJZEwpeo",
  },
];

function thumbUrl(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export default function EcoTvSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  function step(dir) {
    setActiveIndex((i) => (i + dir + VIDEOS.length) % VIDEOS.length);
  }

  return (
    <section className="ecotv" id="eco-tv" aria-label="환경공단 영상">
      <div className="ecotv-inner">
        <div className="ecotv-headline">
          <h2>K-eco TV</h2>
          <a className="ecotv-more" href="#" aria-label="영상 전체보기">
            +
          </a>
        </div>

        <div className="ecotv-carousel">
          <button
            type="button"
            className="ecotv-arrow ecotv-arrow--prev"
            onClick={() => step(-1)}
            aria-label="이전 영상"
          >
            ‹
          </button>

          <div className="ecotv-track">
            {VIDEOS.map((video, i) => {
              const isActive = i === activeIndex;
              return (
                <a
                  key={video.id}
                  className={"ecotv-card" + (isActive ? " is-active" : "")}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundImage: `url(${thumbUrl(video.id)})` }}
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                      setActiveIndex(i);
                    }
                  }}
                >
                  <span className="ecotv-card-scrim" aria-hidden="true" />
                  {isActive && (
                    <>
                      <span className="ecotv-play" aria-hidden="true">
                        ▶
                      </span>
                      <span className="ecotv-card-body">
                        <span className="ecotv-card-badge">K-eco TV</span>
                        <span className="ecotv-card-title">{video.title}</span>
                      </span>
                    </>
                  )}
                </a>
              );
            })}
          </div>

          <button
            type="button"
            className="ecotv-arrow ecotv-arrow--next"
            onClick={() => step(1)}
            aria-label="다음 영상"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
