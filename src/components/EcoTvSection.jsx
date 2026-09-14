import "./EcoTvSection.css";

// 사용자가 실제 제공한 한국환경공단 공식 유튜브 영상 링크.
const FEATURE = {
  id: "B5C3kVcmw4I",
  title: "K-eco Promotional Video",
  url: "https://youtu.be/B5C3kVcmw4I",
};

const LIST = [
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
];

function thumbUrl(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export default function EcoTvSection() {
  return (
    <section className="ecotv" id="eco-tv" aria-label="환경공단 영상">
      <div className="ecotv-inner">
        <div className="ecotv-headline">
          <h2>환경공단 영상</h2>
          <a className="ecotv-more" href="#" aria-label="영상 전체보기">
            +
          </a>
        </div>

        <div className="ecotv-grid">
          <a
            className="ecotv-feature"
            href={FEATURE.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className="ecotv-feature-thumb"
              style={{ backgroundImage: `url(${thumbUrl(FEATURE.id)})` }}
              aria-hidden="true"
            >
              <span className="ecotv-play" aria-hidden="true">
                ▶
              </span>
            </span>
            <span className="ecotv-feature-title">{FEATURE.title}</span>
          </a>

          <div className="ecotv-list">
            {LIST.map((item) => (
              <a
                className="ecotv-list-item"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                key={item.id}
              >
                <span
                  className="ecotv-list-thumb"
                  style={{ backgroundImage: `url(${thumbUrl(item.id)})` }}
                  aria-hidden="true"
                >
                  <span className="ecotv-play ecotv-play--sm" aria-hidden="true">
                    ▶
                  </span>
                </span>
                <span className="ecotv-list-title">{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
