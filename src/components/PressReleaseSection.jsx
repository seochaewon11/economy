import "./PressReleaseSection.css";

// 실제 프로젝트에 존재하는 이미지 파일만 사용한다. 보도자료 원문 데이터가 연결되기 전까지의
// 예시 콘텐츠이며, 추후 실제 보도자료로 교체해야 한다.
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

export default function PressReleaseSection() {
  return (
    <section className="news" id="press-release" aria-label="보도자료">
      <div className="news-inner">
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
            />
            <span className="news-feature-body">
              <span className="news-tag">{FEATURE.tag}</span>
              <span className="news-feature-title">{FEATURE.title}</span>
              <span className="news-date">{FEATURE.date}</span>
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
                  <span className="news-date">{item.date}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
