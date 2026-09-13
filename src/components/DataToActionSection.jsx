import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stageVisibility, plateau, remap, clamp } from "../lib/scrollStage.js";
import "./DataToActionSection.css";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  { key: "data", title: "DATA", desc: "" },
  {
    key: "measure",
    title: "MEASURE",
    desc: "환경의 상태를 측정하고\n변화를 지속적으로 관찰합니다.",
  },
  {
    key: "analyze",
    title: "ANALYZE",
    desc: "수집된 환경 데이터를 분석해\n변화의 흐름을 읽습니다.",
  },
  {
    key: "action",
    title: "ACTION",
    desc: "데이터를 바탕으로\n환경을 위한 실제 행동으로 연결합니다.",
  },
  { key: "change", title: "CHANGE", desc: "" },
];

const POINTS = [
  { x: 60, y: 260 },
  { x: 190, y: 230 },
  { x: 320, y: 245 },
  { x: 450, y: 170 },
  { x: 580, y: 130 },
  { x: 720, y: 70 },
];

const LINE_D = "M" + POINTS.map((p) => `${p.x},${p.y}`).join(" L");
const AREA_D =
  LINE_D + ` L${POINTS[POINTS.length - 1].x},300 L${POINTS[0].x},300 Z`;

export default function DataToActionSection() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const areaRef = useRef(null);
  const markerRef = useRef(null);
  const dotRefs = useRef([]);
  const titleRefs = useRef([]);
  const descRefs = useRef([]);
  const dataVisualRef = useRef(null);
  const changeBgRef = useRef(null);
  const changeTextRef = useRef(null);
  const introTextRef = useRef(null);
  const lineLenRef = useRef(0);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    lineLenRef.current = line.getTotalLength();
    gsap.set(line, {
      strokeDasharray: lineLenRef.current,
      strokeDashoffset: lineLenRef.current,
    });

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=400%",
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const len = lineLenRef.current;

          // DATA: 카피 + 중앙 비주얼 + 점 등장
          const introV = plateau(p, 0, 0.08, 0.08, 0.16);
          if (introTextRef.current) {
            gsap.set(introTextRef.current, { opacity: introV, y: (1 - introV) * 20 });
          }

          const dataVisualV = plateau(p, 0, 0.1, 0.14, 0.22);
          if (dataVisualRef.current) {
            gsap.set(dataVisualRef.current, {
              opacity: dataVisualV,
              scale: 1.05 - 0.05 * dataVisualV,
            });
          }

          const dotsFade = 1 - remap(p, 0.8, 0.9, 0, 1);
          dotRefs.current.forEach((dot, i) => {
            if (!dot) return;
            const appear = clamp(remap(p, 0.02 + i * 0.01, 0.08 + i * 0.01, 0, 1));
            gsap.set(dot, {
              opacity: appear * dotsFade,
              scale: 0.5 + 0.5 * appear,
            });
          });

          // MEASURE → ANALYZE: 선이 그려지고 영역이 채워진다
          const drawV = remap(p, 0.18, 0.44, 0, 1);
          if (lineRef.current) {
            gsap.set(lineRef.current, {
              strokeDashoffset: len * (1 - drawV),
              opacity: plateau(p, 0.18, 0.22, 0.8, 0.9),
            });
          }

          const areaV = plateau(p, 0.4, 0.5, 0.8, 0.9);
          if (areaRef.current) {
            gsap.set(areaRef.current, { opacity: areaV * 0.4 });
          }

          // ACTION: 마커가 선을 따라 이동한다
          const markerT = clamp(remap(p, 0.56, 0.76, 0, 1));
          const markerV = plateau(p, 0.54, 0.6, 0.78, 0.88);
          if (markerRef.current && line) {
            const pt = line.getPointAtLength(markerT * len);
            gsap.set(markerRef.current, {
              x: pt.x,
              y: pt.y,
              opacity: markerV,
              scale: 0.7 + 0.5 * markerV,
            });
          }

          // 단계 타이포그래피 + 설명
          STAGES.forEach((_, i) => {
            const v = stageVisibility(p, i, STAGES.length, 0.62);
            const el = titleRefs.current[i];
            if (el) gsap.set(el, { opacity: v, y: (1 - v) * 24 });
            const descEl = descRefs.current[i];
            if (descEl) gsap.set(descEl, { opacity: v, y: (1 - v) * 16 });
          });

          // CHANGE: 배경 사진 + 마무리 문구
          const changeV = remap(p, 0.8, 0.96, 0, 1);
          if (changeBgRef.current) {
            gsap.set(changeBgRef.current, {
              opacity: changeV,
              scale: 1.05 - 0.05 * changeV,
            });
          }
          if (changeTextRef.current) {
            gsap.set(changeTextRef.current, {
              opacity: remap(p, 0.86, 1, 0, 1),
              y: (1 - remap(p, 0.86, 1, 0, 1)) * 24,
            });
          }
        },
      });

      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="d2a"
      id="data-to-action"
      ref={sectionRef}
      aria-label="환경 데이터가 변화로 이어지는 과정"
    >
      <div className="d2a-pin">
        <div className="d2a-intro" ref={introTextRef}>
          <p className="d2a-eyebrow">FROM DATA TO ACTION</p>
          <p className="d2a-flow">DATA → MEASURE → ANALYZE → ACTION → CHANGE</p>
          <p className="d2a-lead">
            환경의 변화는 관찰에서 시작되고,
            <br />
            데이터는 변화의 방향을 만드는 근거가 됩니다.
          </p>
        </div>

        <div className="d2a-data-visual" ref={dataVisualRef} aria-hidden="true">
          <img className="d2a-data-visual-img" src="/images/data.jpeg" alt="" />
          {!videoFailed && (
            <video
              className="d2a-data-visual-video"
              src="/videos/data.mp4"
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoFailed(true)}
            />
          )}
        </div>

        <div className="d2a-title-stack">
          {STAGES.map((s, i) => (
            <div className="d2a-stage" key={s.key}>
              <h2
                className="d2a-title"
                ref={(el) => (titleRefs.current[i] = el)}
              >
                {s.title}
              </h2>
              {s.desc && (
                <p
                  className="d2a-stage-desc"
                  ref={(el) => (descRefs.current[i] = el)}
                >
                  {s.desc.split("\n").map((line, li) => (
                    <span key={li}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>

        <svg
          className="d2a-graph"
          viewBox="0 0 780 320"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path ref={areaRef} className="d2a-area" d={AREA_D} />
          <path ref={lineRef} className="d2a-line" d={LINE_D} />
          {POINTS.map((pt, i) => (
            <circle
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              className="d2a-dot"
              cx={pt.x}
              cy={pt.y}
              r="6"
            />
          ))}
          <circle ref={markerRef} className="d2a-marker" r="8" />
        </svg>

        <div className="d2a-change-bg" ref={changeBgRef}>
          <img src="/images/change.jpeg" alt="" aria-hidden="true" />
        </div>

        <div className="d2a-change-text" ref={changeTextRef} aria-hidden="true">
          <p className="d2a-change-line">CHANGE</p>
          <p className="d2a-change-sub">데이터는 변화의 시작점이 됩니다.</p>
        </div>
      </div>
    </section>
  );
}
