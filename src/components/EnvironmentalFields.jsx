import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EnvironmentalFieldCard from "./EnvironmentalFieldCard.jsx";
import "./EnvironmentalFields.css";

gsap.registerPlugin(ScrollTrigger);

// 실제 프로젝트에 존재하는 파일명을 그대로 사용한다 (임의 생성/외부 URL 금지).
const FIELDS = [
  {
    key: "climate",
    num: "01",
    en: "CLIMATE & AIR",
    kr: "기후·대기",
    desc: "깨끗한 대기와 지속가능한 기후환경을 위한 관리",
    icon: "/images/climate-icon.png",
    image: "/images/air.jpeg",
    size: "lg",
  },
  {
    key: "water",
    num: "02",
    en: "WATER & SOIL",
    kr: "물·토양",
    desc: "건강한 물환경과 토양환경을 위한 관리",
    icon: "/images/water-icon.png",
    image: "/images/land.jpeg",
    size: "lg",
  },
  {
    key: "resource",
    num: "03",
    en: "CIRCULAR RESOURCE",
    kr: "자원순환",
    desc: "폐기물을 다시 자원으로 연결하는 순환경제",
    icon: "/images/circulation-icon.png",
    image: "/images/circulation.png",
    size: "sm",
  },
  {
    key: "facility",
    num: "04",
    en: "ENVIRONMENTAL FACILITY",
    kr: "환경시설",
    desc: "환경을 안전하게 관리하는 시설과 인프라",
    icon: "/images/facility-icon.png",
    image: "/images/facility.png",
    size: "sm",
  },
  {
    key: "health",
    num: "05",
    en: "PUBLIC HEALTH",
    kr: "국민건강",
    desc: "환경으로부터 국민의 건강을 지키는 관리",
    icon: "/images/health-icon.png",
    image: "/images/health.png",
    size: "sm",
  },
];

export default function EnvironmentalFields() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mql.matches);
    const onChange = (e) => setCanHover(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;
    if (!section || !title || !grid) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const cards = grid.querySelectorAll(".field-card");

    const ctx = gsap.context(() => {
      gsap.set(title, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(cards, { opacity: 0 });

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
          gsap.to(cards, {
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.15,
          });
        },
      });

      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  // 카드 줄이 마우스 움직임을 따라 살짝 떠다니는 패럴랙스
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverMql = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (mql.matches || !hoverMql.matches) return;

    const gridX = gsap.quickTo(grid, "x", { duration: 0.9, ease: "power3.out" });
    const gridY = gsap.quickTo(grid, "y", { duration: 0.9, ease: "power3.out" });

    function handleMouseMove(e) {
      const rect = section.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      gridX(relX * 14);
      gridY(relY * 8);
    }

    function handleMouseLeave() {
      gridX(0);
      gridY(0);
    }

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      className="env-fields"
      id="environmental-fields"
      ref={sectionRef}
      aria-label="환경을 지키는 다섯 가지 시선"
    >
      <div className="env-fields-inner">
        <div className="env-fields-topbar">
          <p className="env-fields-eyebrow">
            ENVIRONMENTAL FIELDS
            <span className="env-fields-eyebrow-rule" aria-hidden="true" />
          </p>
          <p className="env-fields-hint">
            <span className="env-fields-hint-rule" aria-hidden="true" />
            카드에 마우스를 올려 살펴보세요 <span aria-hidden="true">→</span>
          </p>
        </div>

        <header className="env-fields-head">
          <h2 className="env-fields-title" ref={titleRef}>
            환경을 지키는
            <br />
            <span className="env-fields-title-accent">다섯 가지</span> 시선
          </h2>
          <p className="env-fields-sub">
            기후와 대기부터 물과 토양,
            <br />
            자원순환과 환경시설, 국민건강까지
            <br />
            한국환경공단은 우리의 일상과 연결된 환경을 관리합니다.
          </p>
        </header>

        <div className="env-fields-grid" ref={gridRef}>
          {FIELDS.map((field) => (
            <EnvironmentalFieldCard key={field.key} field={field} canHover={canHover} />
          ))}
        </div>
      </div>
    </section>
  );
}
