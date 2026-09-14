import "./PressReleaseSection.css";

// 실제 프로젝트에 존재하는 이미지 파일만 사용한다. 보도자료·매거진 원문 데이터가 연결되기
// 전까지의 예시 콘텐츠이며, 추후 실제 콘텐츠로 교체해야 한다.
const FEATURE = {
  tag: "보도자료",
  title: "한국환경공단, 탄소중립 실현을 위한 자원순환 정책 발표",
  date: "2026.09.01",
  image: "/images/change.jpeg",
};

const LIST = [
  {
    tag: "보도자료",
    title: "한국환경공단, 지자체와 미세먼지 저감 업무협약 체결",
    date: "2026.08.24",
    image: "/images/data.jpeg",
  },
  {
    tag: "공지사항",
    title: "2026년 하반기 환경분야 우수사례 공모전 안내",
    date: "2026.08.15",
    image: "/images/eco-hands.jpg",
  },
];

const MAGAZINE = [
  {
    badge: "TIP",
    title: "환경시설, 안전하고 효율적으로 운영하는 법",
    image: "/images/facility.png",
  },
  {
    badge: "STORY",
    title: "우리 곁의 변화, 국민 건강을 지키는 환경 이야기",
    image: "/images/health.png",
  },
];

function ClockIcon() {
  return (
    <svg className="news-date-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 4.6V8l2.6 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PressReleaseSection() {
  return (
    <section className="news" id="press-release" aria-label="보도자료 및 매거진">
      <div className="news-inner">
        <div className="news-mag-grid">
          <div className="news-col">
            <div className="news-headline">
              <h2>보도자료</h2>
              <a className="news-more" href="#" aria-label="보도자료 전체보기">
                +
              </a>
            </div>

            <div className="news-grid">
              <a className="news-feature" href="#">
                <span
                  className="news-feature-img"
                  style={{ backgroundImage: `url(${FEATURE.image})` }}
                  aria-hidden="true"
                >
                  <span className="news-tag">{FEATURE.tag}</span>
                </span>
                <span className="news-feature-body">
                  <span className="news-feature-title">{FEATURE.title}</span>
                  <span className="news-date">
                    <ClockIcon />
                    {FEATURE.date}
                  </span>
                </span>
              </a>

              <div className="news-list">
                {LIST.map((item) => (
                  <a className="news-list-item" href="#" key={item.title}>
                    <span
                      className="news-list-thumb"
                      style={{ backgroundImage: `url(${item.image})` }}
                      aria-hidden="true"
                    />
                    <span className="news-list-body">
                      <span className="news-tag">{item.tag}</span>
                      <span className="news-list-title">{item.title}</span>
                      <span className="news-date">
                        <ClockIcon />
                        {item.date}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mag-col">
            <div className="news-headline">
              <h2>환경공단 매거진</h2>
              <a className="news-more" href="#" aria-label="매거진 전체보기">
                +
              </a>
            </div>

            <div className="mag-grid">
              {MAGAZINE.map((item) => (
                <a className="mag-card" href="#" key={item.title}>
                  <span
                    className="mag-card-img"
                    style={{ backgroundImage: `url(${item.image})` }}
                    aria-hidden="true"
                  >
                    <span className="mag-card-badge">{item.badge}</span>
                  </span>
                  <span className="mag-card-scrim" aria-hidden="true" />
                  <span className="mag-card-title">{item.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
