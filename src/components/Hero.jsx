import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EnvIndicatorCard from "./EnvIndicatorCard.jsx";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_TOTAL = 192;
const FRAME_PATH = (i) => `/frames/frame_${String(i).padStart(4, "0")}.webp`;

const STAGES = [
  { num: "01", kr: "매립지", threshold: 0 },
  { num: "02", kr: "토양 복원", threshold: 0.2 },
  { num: "03", kr: "습지", threshold: 0.4 },
  { num: "04", kr: "생태숲", threshold: 0.6 },
  { num: "05", kr: "생태공원", threshold: 0.8 },
];

function getStageIndex(progress) {
  let idx = 0;
  for (let i = 0; i < STAGES.length; i++) {
    if (progress >= STAGES[i].threshold) idx = i;
  }
  return idx;
}

export default function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRailFillRef = useRef(null);
  const ctxRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(-1);
  const cssSizeRef = useRef({ width: 0, height: 0 });
  const dprRef = useRef(1);

  const [loadedCount, setLoadedCount] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // prefers-reduced-motion 감지
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Canvas 사이즈 계산 (DPR 대응)
  function resizeCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    cssSizeRef.current = { width: rect.width, height: rect.height };
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(rect.width * dprRef.current);
    canvas.height = Math.round(rect.height * dprRef.current);
    ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
  }

  // cover 방식으로 이미지를 canvas에 그린다 (왜곡 없이 화면을 꽉 채움)
  function drawCover(img) {
    const ctx = ctxRef.current;
    if (!ctx || !img || !img.naturalWidth) return;

    const { width: cw, height: ch } = cssSizeRef.current;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;

    let sx, sy, sw, sh;
    if (imgRatio > canvasRatio) {
      sh = ih;
      sw = ih * canvasRatio;
      sx = (iw - sw) / 2;
      sy = 0;
    } else {
      sw = iw;
      sh = iw / canvasRatio;
      sx = 0;
      sy = (ih - sh) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }

  function renderFrame(index) {
    const img = imagesRef.current[index];
    if (!img) return;
    drawCover(img);
    currentFrameRef.current = index;
  }

  // 프레임 preload
  useEffect(() => {
    resizeCanvas();

    let settledCount = 0;
    const images = new Array(FRAME_TOTAL);

    for (let i = 1; i <= FRAME_TOTAL; i++) {
      const img = new Image();
      const index = i - 1;
      img.onload = img.onerror = () => {
        settledCount++;
        setLoadedCount(settledCount);
        if (index === 0 && currentFrameRef.current === -1) {
          renderFrame(0);
        }
        if (settledCount === FRAME_TOTAL) {
          setImagesReady(true);
        }
      };
      img.src = FRAME_PATH(i);
      images[index] = img;
    }
    imagesRef.current = images;

    function handleResize() {
      resizeCanvas();
      if (currentFrameRef.current >= 0) {
        renderFrame(currentFrameRef.current);
      }
      ScrollTrigger.refresh();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 캔버스 컨텍스트 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d");
    resizeCanvas();
  }, []);

  // GSAP ScrollTrigger 기반 프레임 스크러빙 (모든 프레임 preload 완료 후에만 활성화)
  useEffect(() => {
    if (reducedMotion || !imagesReady) return;

    const hero = heroRef.current;
    if (!hero) return;

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const frameIndex = Math.floor(progress * (FRAME_TOTAL - 1));
        if (frameIndex !== currentFrameRef.current) {
          renderFrame(frameIndex);
        }
        setStageIndex(getStageIndex(progress));
        if (progressRailFillRef.current) {
          progressRailFillRef.current.style.transform = `scaleY(${progress})`;
        }
      },
    });

    return () => trigger.kill();
  }, [imagesReady, reducedMotion]);

  const loadingPercent = Math.round((loadedCount / FRAME_TOTAL) * 100);

  return (
    <section
      className={"hero" + (reducedMotion ? " hero--static" : "")}
      ref={heroRef}
      aria-label="스크롤에 따라 매립지가 생태공원으로 변화하는 과정을 보여주는 화면"
    >
      <div className="hero-sticky">
        <canvas ref={canvasRef} className="hero-canvas" />

        {!imagesReady && !reducedMotion && (
          <div className="hero-loading" role="status" aria-live="polite">
            <span className="hero-loading-percent">LOADING {loadingPercent}%</span>
            <div className="hero-loading-track">
              <div
                className="hero-loading-fill"
                style={{ transform: `scaleX(${loadedCount / FRAME_TOTAL})` }}
              />
            </div>
          </div>
        )}

        <div className="hero-tint" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-bottom">
          <div className="hero-content">
            <p className="hero-eyebrow">다시, 자연이 숨 쉬는 공간으로</p>
            <h1 className="hero-title">
              <span className="hero-title-line1">매립지에서</span>
              <span className="hero-title-line2">생태공원으로</span>
            </h1>
            <p className="hero-sub">
              한국환경공단은 매립지를 안전하게 관리하고
              <br />
              지속가능한 친환경 공간으로 되돌리고 있습니다.
            </p>
          </div>

          <EnvIndicatorCard />
        </div>

        <nav className="hero-progress" aria-label="공간 변화 단계">
          <div className="hero-progress-rail" aria-hidden="true">
            <div className="hero-progress-rail-fill" ref={progressRailFillRef} />
          </div>
          <ol>
            {STAGES.map((stage, i) => (
              <li key={stage.num} className={i === stageIndex ? "is-active" : ""}>
                <span className="stage-num">{stage.num}</span>
                <span className="stage-label">{stage.kr}</span>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
