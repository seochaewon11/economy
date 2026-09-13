import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./WasteToResourceSection.css";

gsap.registerPlugin(ScrollTrigger);

const WASTE_IMAGE = "/images/before.jpg";
const RESOURCE_IMAGE = "/images/after.jpg";

export default function WasteToResourceSection() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const wasteRef = useRef(null);
  const resourceRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    const ctx = gsap.context(() => {
      if (!mql.matches && headRef.current) {
        gsap.fromTo(
          headRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 70%" },
          }
        );
      }

      if (!mql.matches) {
        // 화면을 지나는 동안 WASTE·RESOURCE 글자 속 이미지가 서로 다른 방향으로 아주 느리게 흐른다
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            if (wasteRef.current) {
              gsap.set(wasteRef.current, { backgroundPositionX: `${20 + p * 40}%` });
            }
            if (resourceRef.current) {
              gsap.set(resourceRef.current, { backgroundPositionX: `${80 - p * 40}%` });
            }
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="w2r"
      id="waste-to-resource"
      ref={sectionRef}
      aria-label="자원순환: 폐기물이 다시 자원이 되는 과정"
    >
      <div className="w2r-inner">
        <div className="w2r-head" ref={headRef}>
          <div className="w2r-head-left">
            <p className="w2r-eyebrow">FROM WASTE</p>
            <h2 className="w2r-head-title">폐기물은 자원이 됩니다.</h2>
          </div>
          <p className="w2r-head-right">
            오늘의 폐기물이
            <br />
            내일의 자원이 되는 순환,
            <br />
            우리는 지속가능한 미래를 만들어갑니다.
          </p>
        </div>

        <div className="w2r-flow-hero">
          <span
            className="w2r-flow-word w2r-mask-text"
            ref={wasteRef}
            style={{ backgroundImage: `url(${WASTE_IMAGE})` }}
          >
            WASTE
          </span>
          <span className="w2r-flow-arrow" aria-hidden="true">→</span>
          <span
            className="w2r-flow-word w2r-mask-text"
            ref={resourceRef}
            style={{ backgroundImage: `url(${RESOURCE_IMAGE})` }}
          >
            RESOURCE
          </span>
        </div>
      </div>
    </section>
  );
}
