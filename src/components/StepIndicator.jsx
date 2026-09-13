import "./StepIndicator.css";

// 스토리 섹션(생태공원 전환 → OUR PLANET → AIR/WATER/LAND → WASTE/RESOURCE) 왼쪽에
// 공통으로 붙는 "01 ⋮" 형태의 단계 표시기. 각 섹션에 고정된 번호를 그대로 보여준다.
export default function StepIndicator({ step, dark = true }) {
  return (
    <div className={"step-indicator" + (dark ? " step-indicator--dark" : "")} aria-hidden="true">
      <span className="step-indicator-num">{step}</span>
      <span className="step-indicator-dots">
        <span />
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
