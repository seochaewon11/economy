import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KOREA_REGIONS, KOREA_VIEWBOX } from "../lib/koreaMapPaths.js";
import "./BranchMap.css";

gsap.registerPlugin(ScrollTrigger);

// 실제 한국환경공단 공식 자료 기준 주소/전화번호 (임의 생성 금지).
// 본사: 공단 홈페이지 '찾아오시는 길'. 지역본부/지사: 한국환경공단 환경본부·지사 연락처 공개 자료.
// x, y는 실제 대한민국 지도 SVG(koreaMapPaths.js, viewBox 0 0 524 631)의 좌표계 기준.
const OFFICES = [
  {
    key: "hq",
    name: "본사",
    addr: "인천광역시 서해구 환경로 42 (오류동 종합환경연구단지)",
    tel: "032-590-4000",
    x: 111,
    y: 136,
  },
  {
    key: "seoul-west",
    name: "수도권서부환경본부",
    addr: "서울특별시 강서구 화곡로68길 82 강서IT밸리 8층",
    tel: "02-3153-0570",
    x: 140,
    y: 140,
  },
  {
    key: "seoul-east",
    name: "수도권동부환경본부",
    addr: "경기도 성남시 분당구 장미로 42 리더스빌딩 6층",
    tel: "031-590-0653",
    x: 178,
    y: 152,
  },
  {
    key: "gangwon",
    name: "강원환경본부",
    addr: "강원특별자치도 춘천시 경춘로 2370 8층",
    tel: "033-240-9549",
    x: 232,
    y: 95,
  },
  {
    key: "chungbuk",
    name: "충북지사",
    addr: "충청북도 청주시 청원구 공항로 150번길 73 KT 6층",
    tel: "043-219-6441",
    x: 243,
    y: 239,
  },
  {
    key: "chungcheong",
    name: "충청권환경본부",
    addr: "대전광역시 서구 청사로 156 (둔산동)",
    tel: "042-939-2336",
    x: 192,
    y: 274,
  },
  {
    key: "jeonbuk",
    name: "전북환경본부",
    addr: "전북특별자치도 전주시 완산구 서곡로 100",
    tel: "063-279-0835",
    x: 170,
    y: 343,
  },
  {
    key: "gwangju",
    name: "광주전남제주환경본부",
    addr: "광주광역시 광산구 무진대로 217",
    tel: "062-949-0745",
    x: 140,
    y: 408,
  },
  {
    key: "daegu",
    name: "대구경북환경본부",
    addr: "대구광역시 수성구 무학로 209",
    tel: "053-580-7541",
    x: 300,
    y: 336,
  },
  {
    key: "busan",
    name: "부산울산경남환경본부",
    addr: "부산광역시 북구 낙동북로 681번길 34",
    tel: "051-366-3761",
    x: 345,
    y: 402,
  },
  {
    key: "jeju",
    name: "제주지사",
    addr: "제주특별자치도 제주시 첨단로 213-4 엘리트빌딩 5층",
    tel: "064-723-6542",
    x: 112,
    y: 609,
  },
];

export default function BranchMap() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [activeKey, setActiveKey] = useState("hq");

  const active = OFFICES.find((o) => o.key === activeKey) ?? OFFICES[0];

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const ctx = gsap.context(() => {
      gsap.set(title, { clipPath: "inset(100% 0 0 0)" });
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(title, {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.9,
            ease: "power3.out",
          });
        },
      });
      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="branch-map" id="branch-map" ref={sectionRef} aria-label="전국 환경본부 및 지사 안내">
      <div className="branch-map-inner">
        <div className="branch-map-topbar">
          <p className="branch-map-eyebrow">
            NATIONWIDE NETWORK
            <span className="branch-map-eyebrow-rule" aria-hidden="true" />
          </p>
          <p className="branch-map-hint">
            <span className="branch-map-hint-rule" aria-hidden="true" />
            지점을 선택해 위치를 확인하세요 <span aria-hidden="true">→</span>
          </p>
        </div>

        <header className="branch-map-head">
          <h2 className="branch-map-title" ref={titleRef}>
            전국 어디서나,
            <br />
            <span className="branch-map-title-accent">가까운 곳</span>에서 만나는 환경공단
          </h2>
        </header>

        <div className="branch-map-body">
          <div className="branch-map-svg-wrap">
            <svg className="branch-map-svg" viewBox={KOREA_VIEWBOX} aria-hidden="true">
              {KOREA_REGIONS.map((r) => (
                <path key={r.id} className="branch-map-region" d={r.d} />
              ))}

              {OFFICES.map((o) => (
                <g
                  key={o.key}
                  className={"branch-map-marker" + (o.key === activeKey ? " is-active" : "")}
                  transform={`translate(${o.x}, ${o.y})`}
                  onMouseEnter={() => setActiveKey(o.key)}
                  onClick={() => setActiveKey(o.key)}
                  tabIndex={0}
                  role="button"
                  aria-label={o.name}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setActiveKey(o.key);
                  }}
                >
                  <circle className="branch-map-marker-pulse" r="17" />
                  <circle className="branch-map-marker-dot" r="9" />
                </g>
              ))}
            </svg>

            <p className="branch-map-source">
              DATA SOURCE · 한국환경공단 공식 안내자료 · Map: @svg-maps/south-korea (CC BY 4.0)
            </p>
          </div>

          <div className="branch-map-panel">
            <div className="branch-map-detail">
              <span className="branch-map-detail-name">{active.name}</span>
              <span className="branch-map-detail-addr">{active.addr}</span>
              <span className="branch-map-detail-tel">TEL {active.tel}</span>
            </div>

            <ul className="branch-map-list">
              {OFFICES.map((o) => (
                <li key={o.key}>
                  <button
                    type="button"
                    className={
                      "branch-map-list-btn" + (o.key === activeKey ? " is-active" : "")
                    }
                    onClick={() => setActiveKey(o.key)}
                  >
                    {o.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
