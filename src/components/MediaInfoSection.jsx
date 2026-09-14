import { useState } from "react";
import "./MediaInfoSection.css";

// 실제 프로젝트에 존재하는 이미지 파일만 사용한다. 소식지·알림판 콘텐츠는 실제 데이터
// 연동 전까지의 예시이며, 유튜브 링크는 사용자가 제공한 실제 한국환경공단 채널 영상이다.
const NEWSLETTER = {
  image: "/images/change.jpeg",
  title: "2026년 K-eco 소식지 가을호",
  desc: "한국환경공단의 다양한 소식과 환경 정보를 한눈에 담았습니다.",
};

const NOTICES = [
  {
    image: "/images/water.jpeg",
    text: "미세먼지, 오늘도 확인하셨나요?",
  },
  {
    image: "/images/land.jpeg",
    text: "탄소중립 실천, 작은 습관부터",
  },
  {
    image: "/images/air.jpeg",
    text: "우리 동네 환경지표 확인하기",
  },
];

const VIDEOS = [
  {
    id: "adiAlTBr294",
    title: "한국환경공단 마감할인의 앱서비스",
    url: "https://youtu.be/adiAlTBr294",
  },
  {
    id: "IXAjJZEwpeo",
    title: "푸루의 사계절 - 물 발자국과 수질오염을 줄이는 생활 속 실천법",
    url: "https://youtu.be/IXAjJZEwpeo",
  },
  {
    id: "B5C3kVcmw4I",
    title: "K-eco Promotional Video",
    url: "https://youtu.be/B5C3kVcmw4I",
  },
];

function thumbUrl(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export default function MediaInfoSection() {
  const [noticeIndex, setNoticeIndex] = useState(0);
  const [videoStart, setVideoStart] = useState(0);

  const notice = NOTICES[noticeIndex];
  const visibleVideos = [VIDEOS[videoStart % 3], VIDEOS[(videoStart + 1) % 3]];

  return (
    <section className="media" id="media-info" aria-label="미디어 및 정보">
      <div className="media-inner">
        <div className="media-head">
          <p className="media-eyebrow">MEDIA &amp; INFO</p>
          <h2 className="media-title">
            다양한 채널로 만나는
            <br />
            유용한 <span className="media-title-accent">환경 정보</span>
          </h2>
        </div>

        <div className="media-grid">
          <div className="media-col">
            <div className="media-col-head">
              <h3>소식지</h3>
            </div>
            <a className="media-newsletter" href="#">
              <span
                className="media-newsletter-cover"
                style={{ backgroundImage: `url(${NEWSLETTER.image})` }}
                aria-hidden="true"
              />
              <span className="media-newsletter-body">
                <span className="media-newsletter-title">{NEWSLETTER.title}</span>
                <span className="media-newsletter-desc">{NEWSLETTER.desc}</span>
                <span className="media-newsletter-link">
                  자세히 보기 <span aria-hidden="true">+</span>
                </span>
              </span>
            </a>
          </div>

          <div className="media-col">
            <div className="media-col-head">
              <h3>알림판</h3>
              <div className="media-col-controls">
                <span className="media-col-count">
                  {noticeIndex + 1}/{NOTICES.length}
                </span>
                <button
                  type="button"
                  aria-label="이전 알림"
                  onClick={() => setNoticeIndex((i) => (i - 1 + NOTICES.length) % NOTICES.length)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="다음 알림"
                  onClick={() => setNoticeIndex((i) => (i + 1) % NOTICES.length)}
                >
                  ›
                </button>
              </div>
            </div>
            <a
              className="media-banner"
              href="#"
              style={{ backgroundImage: `url(${notice.image})` }}
            >
              <span className="media-banner-scrim" aria-hidden="true" />
              <span className="media-banner-text">{notice.text}</span>
            </a>
          </div>

          <div className="media-col">
            <div className="media-col-head">
              <h3>K-eco TV</h3>
              <div className="media-col-controls">
                <button
                  type="button"
                  aria-label="이전 영상"
                  onClick={() => setVideoStart((i) => (i - 1 + 3) % 3)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="다음 영상"
                  onClick={() => setVideoStart((i) => (i + 1) % 3)}
                >
                  ›
                </button>
              </div>
            </div>
            <div className="media-tv-grid">
              {visibleVideos.map((video) => (
                <a
                  key={video.id}
                  className="media-tv-card"
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundImage: `url(${thumbUrl(video.id)})` }}
                >
                  <span className="media-tv-scrim" aria-hidden="true" />
                  <span className="media-tv-play" aria-hidden="true">
                    ▶
                  </span>
                  <span className="media-tv-title">{video.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
