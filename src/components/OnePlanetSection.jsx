import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StepIndicator from "./StepIndicator.jsx";
import "./OnePlanetSection.css";

gsap.registerPlugin(ScrollTrigger);

const AWL = [
  {
    key: "air",
    en: "AIR",
    tagline: ["맑은 공기가", "지속되는 세상"],
    image: "/images/air.jpeg",
  },
  {
    key: "water",
    en: "WATER",
    tagline: ["깨끗한 물이", "흐르는 세상"],
    image: "/images/water.jpeg",
  },
  {
    key: "land",
    en: "LAND",
    tagline: ["건강한 땅이", "이어지는 세상"],
    image: "/images/land.jpeg",
  },
];

export default function OnePlanetSection() {
  const awlSectionRef = useRef(null);
  const colRefs = useRef([]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const ctx = gsap.context(() => {
      colRefs.current.forEach((col, i) => {
        if (!col) return;
        gsap.fromTo(
          col.querySelector(".awl-text"),
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: i * 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: awlSectionRef.current, start: "top 65%" },
          }
        );
      });
    }, awlSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="awl"
      id="air-water-land"
      ref={awlSectionRef}
      aria-label="대기, 물, 토양은 연결되어 있습니다"
    >
      <StepIndicator step="01" />
      <div className="awl-grid">
        {AWL.map((item, i) => (
          <div
            key={item.key}
            className="awl-col"
            ref={(el) => (colRefs.current[i] = el)}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="awl-scrim" aria-hidden="true" />
            <div className="awl-text">
              <h3>{item.en}</h3>
              <p>
                {item.tagline.map((line, li) => (
                  <span key={li}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
