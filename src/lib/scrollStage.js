// 전체 스크롤 진행도(0~1)에서 특정 단계(index)가 얼마나 "보여야 하는지"를
// 0~1 사이 값으로 계산하는 삼각함수형 헬퍼. 여러 pin+scrub 섹션에서 공유한다.
export function stageVisibility(progress, index, count, spread = 0.75) {
  const segment = 1 / count;
  const center = index * segment + segment / 2;
  const halfWidth = segment * spread;
  const dist = Math.abs(progress - center);
  const v = 1 - dist / halfWidth;
  return Math.min(1, Math.max(0, v));
}

export function clamp(v, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

export function remap(p, inStart, inEnd, outStart = 0, outEnd = 1) {
  const t = clamp((p - inStart) / (inEnd - inStart));
  return outStart + (outEnd - outStart) * t;
}

// inStart~inEnd 구간에서 0→1로 올라갔다가 outStart~outEnd 구간에서 1→0으로
// 내려가는 "고원(plateau)" 형태의 값을 계산한다.
export function plateau(p, inStart, inEnd, outStart, outEnd) {
  const rise = remap(p, inStart, inEnd, 0, 1);
  const fall = 1 - remap(p, outStart, outEnd, 0, 1);
  return Math.min(rise, fall);
}
