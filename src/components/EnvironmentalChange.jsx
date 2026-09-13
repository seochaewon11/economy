import { useCallback, useEffect, useRef, useState } from "react";
import "./EnvironmentalChange.css";

const TIMELINE = [
  { key: "landfill", label: "매립지 조성" },
  { key: "restore", label: "복원 사업" },
  { key: "park", label: "생태공원 완성" },
];

// 끊김 없는 marquee를 위해 동일 시퀀스를 3벌 이어붙인다.
const TIMELINE_LOOP = [...TIMELINE, ...TIMELINE, ...TIMELINE];

export default function EnvironmentalChange() {
  const [pos, setPos] = useState(50);
  const sliderRef = useRef(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = sliderRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, ratio)));
  }, []);

  useEffect(() => {
    function onMove(e) {
      if (!draggingRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    }
    function onUp() {
      draggingRef.current = false;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [updateFromClientX]);

  return (
    <section className="env-change" id="data" aria-label="환경지표로 보는 변화">
      <div className="env-change-topbar">
        <p className="env-change-eyebrow">
          환경지표로 보는 변화
          <span className="env-change-eyebrow-rule" aria-hidden="true" />
        </p>
        <p className="env-change-hint">
          <span className="env-change-hint-rule" aria-hidden="true" />
          이미지를 드래그해 비교해보세요 <span aria-hidden="true">→</span>
        </p>
      </div>

      <div className="env-change-inner">
        <div className="env-change-left">
          <h2 className="env-change-title">
            매립지,
            <br />
            <span className="env-change-title-accent">
              생태공원으로 다시 태어나다
            </span>
          </h2>
          <p className="env-change-body">
            오랜 시간 쓰레기로 가득했던 매립지가
            <br />
            지금은 사람과 자연이 함께하는 생태공원으로
            <br />
            새로운 가치를 만들어가고 있습니다.
          </p>
          <a className="env-change-cta" href="#">
            생태공원 조성 과정 보기 <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="env-change-right">
          <div
            className="compare"
            ref={sliderRef}
            onPointerDown={(e) => {
              draggingRef.current = true;
              updateFromClientX(e.clientX);
            }}
          >
            <img className="compare-img compare-img--after" src="/images/after.jpg" alt="생태공원으로 복원된 현재 모습" />
            <img
              className="compare-img compare-img--before"
              src="/images/before.jpg"
              alt="매립지였던 과거 모습"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            />

            <div className="compare-label compare-label--before">
              <span className="compare-tag">과거</span>
              <span className="compare-sub">쓰레기로 가득했던 매립지</span>
            </div>
            <div className="compare-label compare-label--after">
              <span className="compare-tag">현재</span>
              <span className="compare-sub">사람과 자연이 공존하는 생태공원</span>
            </div>

            <div
              className="compare-handle"
              style={{ left: `${pos}%` }}
              onPointerDown={(e) => {
                e.stopPropagation();
                draggingRef.current = true;
              }}
            >
              <span aria-hidden="true">‹›</span>
            </div>
          </div>

          <div className="env-change-doodle">
            <svg className="doodle-arrow" viewBox="0 0 64 60" aria-hidden="true">
              <path
                d="M14 2 C -2 16, 26 14, 16 30 C 9 42, 28 44, 36 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 26 L44 30 L34 38 Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
            </svg>
            <p className="env-change-doodle-text">
              쓰레기가 아닌
              <br />
              생명의 공간으로
            </p>
          </div>
        </div>
      </div>

      <div className="env-change-timeline">
        <div className="timeline-track">
          {TIMELINE_LOOP.map((step, i) => (
            <div className="timeline-node" key={`${step.key}-${i}`}>
              <div className="timeline-item">
                <span className="timeline-dot" aria-hidden="true" />
                <span className="timeline-label">{step.label}</span>
              </div>
              <span className="timeline-connector" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
