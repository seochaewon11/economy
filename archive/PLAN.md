# PLAN.md — 한국환경공단 메인 웹사이트 리뉴얼

안티그래비티(Antigravity) 등 에이전트형 IDE가 작업 시작 전 반드시 먼저 읽어야 하는 스펙 문서입니다.

이 문서는 웹 구현 및 코딩 요구사항만 정의합니다. 이미지 및 영상 제작 과정은 다루지 않습니다.

프로젝트 폴더 최상위에 이 파일을 두고 **"PLAN.md를 먼저 읽고 시작해줘."** 라고 요청하여 작업을 시작합니다.

---

# 1. 프로젝트 개요

## 목표

한국환경공단 웹사이트 메인 페이지 리뉴얼 컨셉을 제작한다.

기존 공공기관 홈페이지의 정적인 정보 전달 방식에서 벗어나 **환경복원 → 데이터 → 미래환경**의 흐름을 사용자가 스크롤을 통해 직접 경험할 수 있는 인터랙티브 웹사이트를 구현한다.

## 핵심 컨셉

### "버려진 공간이 다시 살아나는 과정"

메인 Hero는 폐기물 매립지 또는 나대지의 BEFORE 이미지에서 시작한다.

사용자가 스크롤하면 프레임 시퀀스가 진행되면서 해당 공간이 단계적으로 복원되고, 최종적으로 현대적인 도시형 생태공원으로 변화한다.

```text
BEFORE
버려진 공간
    ↓
환경복원
    ↓
공간의 변화
    ↓
생태환경 회복
    ↓
AFTER
다시 살아난 공간
```

이 변화와 동시에 환경 관련 지표 카드가 화면 하단에서 위쪽으로 하나씩 등장한다.

핵심 사용자 경험:

```text
스크롤
  ↓
공간 변화
  ↓
환경 변화
  ↓
데이터 등장
  ↓
완성된 미래환경
```

---

# 2. 기술 스택

## 필수

- 순수 HTML
- CSS
- Vanilla JavaScript
- Canvas API

## 금지

- React
- Vue
- Angular
- Svelte
- Next.js
- Vite
- Webpack
- 별도의 빌드 도구
- npm install
- 프레임워크 기반 컴포넌트

`index.html`을 브라우저에서 직접 열어도 기본적으로 동작해야 한다.

---

# 3. 파일 구성

```text
keco-renewal/
├── PLAN.md
├── assets/
│   ├── before.png
│   ├── after.png
│   └── frames/
│       ├── frame_0001.webp
│       ├── frame_0002.webp
│       ├── frame_0003.webp
│       └── ...
├── index.html
├── style.css
└── script.js
```

---

# 4. 사용 가능한 에셋

| 경로 | 설명 |
|---|---|
| `assets/before.png` | 환경복원 전 나대지 / 폐기물 매립지 기준 이미지 |
| `assets/after.png` | 환경복원 후 현대적인 도시형 생태공원 기준 이미지 |
| `assets/frames/frame_0001.webp ~ frame_0NNN.webp` | 8초 변환 영상을 프레임 단위로 추출한 이미지 시퀀스 |

## 프레임 규칙

- 프레임 총 개수는 코드에 하드코딩하지 않는다.
- 에이전트는 실제 `assets/frames/` 폴더를 확인하여 프레임 개수를 파악한다.
- 파일명 순서대로 정렬한다.
- `frame_0001.webp`가 첫 번째 프레임이다.
- 마지막 번호의 프레임이 마지막 프레임이다.
- 프레임이 추가/삭제되어도 가능한 한 코드 수정 없이 대응한다.
- 브라우저의 로컬 파일 접근 제한으로 폴더 자동 탐색이 불가능한 경우 실제 파일 목록을 기준으로 배열을 구성한다.

---

# 5. 전체 페이지 구조

```text
GNB
 ↓
HERO
 ├─ Canvas Scroll Scrubbing
 ├─ 좌측 메인 카피
 ├─ 환경지표 카드
 └─ Scroll Progress
 ↓
INTRO
 ↓
MAJOR ENVIRONMENTAL PROJECTS
 ↓
ENVIRONMENTAL DATA
 ↓
SERVICE
 ↓
FOOTER
```

실제 한국환경공단 홈페이지의 모든 기능을 복제하지 않는다. 리뉴얼 컨셉과 인터랙션을 보여주는 핵심 섹션만 구현한다.

---

# 6. GNB

화면 상단에 GNB를 구현한다.

## 좌측

실제 기관 로고를 그대로 복제하지 않고 텍스트 기반 가상 표기를 사용한다.

```text
KECO
한국환경공단
```

## 메뉴

```text
공단소개
주요사업
환경정보
ESG경영
국민참여
알림·소통
```

## 우측

```text
검색
EN
```

GNB는 깔끔하고 현대적인 공공기관 디자인을 유지한다.

---

# 7. HERO — 핵심 구현 영역

Hero는 전체 프로젝트에서 가장 중요한 영역이다.

Hero의 스크롤 길이는 약 **500vh**로 구성한다.

```css
.hero {
  height: 500vh;
}
```

Hero 내부의 Canvas는 `sticky`로 화면에 고정한다.

```css
.hero-stage {
  position: sticky;
  top: 0;
  height: 100vh;
}
```

사용자가 Hero 영역을 스크롤하는 동안 Canvas는 화면에 계속 고정되어 있어야 한다.

---

# 8. Hero Canvas

Canvas는 viewport 전체를 사용한다.

```html
<canvas id="heroCanvas"></canvas>
```

원본 프레임은 1920 × 1080 / 16:9이다.

이미지를 왜곡하지 않는다. 화면 비율에 따라 `cover` 방식으로 렌더링한다.

Canvas는 `devicePixelRatio`를 고려하여 선명하게 렌더링한다.

---

# 9. Scroll Scrubbing

스크롤 진행률을 0~1 사이의 값으로 계산한다.

```text
0.0 = Hero 시작
1.0 = Hero 끝
```

프레임 인덱스:

```javascript
frameIndex = Math.floor(
  progress * (frames.length - 1)
);
```

예:

```text
progress 0%
→ frame_0001

progress 50%
→ 중간 프레임

progress 100%
→ 마지막 프레임
```

스크롤을 위로 올리면 프레임도 역방향으로 이동해야 한다.

자동 재생 영상으로 대체하지 않는다.

---

# 10. requestAnimationFrame

스크롤 이벤트마다 Canvas를 직접 렌더링하지 않는다.

스크롤 이벤트에서는 현재 스크롤 위치만 업데이트하고, 실제 Canvas 렌더링은 `requestAnimationFrame()`에서 처리한다.

목표:

- 스크롤 이벤트 과부하 방지
- 부드러운 프레임 전환
- 불필요한 렌더링 방지

동일한 프레임 번호가 반복될 경우 Canvas를 다시 그리지 않는다.

```javascript
if (frameIndex !== currentFrame) {
  renderFrame(frameIndex);
}
```

---

# 11. Device Pixel Ratio

Canvas 선명도를 위해 `devicePixelRatio`를 고려한다.

성능을 위해 DPR은 최대 2 정도로 제한한다.

```javascript
const dpr = Math.min(
  window.devicePixelRatio || 1,
  2
);
```

---

# 12. 이미지 Preload

페이지 로드 시 모든 프레임을 preload한다.

각 프레임은 `new Image()`를 이용한다.

```javascript
const image = new Image();
image.src = framePath;
```

모든 프레임이 로드되기 전에는 Scroll Scrubbing을 활성화하지 않는다.

---

# 13. Loading UI

초기 로딩 화면을 구현한다.

예:

```text
ENVIRONMENT
RESTORATION

LOADING 68%
```

또는:

```text
68 / 120
```

프레임 로딩 수에 따라 Progress Bar가 증가한다.

100% 로딩 완료 후 Loading UI는 fade out한다.

---

# 14. 로딩 중 Hero

프레임 preload가 완료되기 전에는 스크롤에 따른 프레임 변경을 허용하지 않는다.

첫 번째 프레임만 표시한다.

```text
frame_0001.webp
```

100% preload 완료 후 Scroll Scrubbing을 활성화한다.

---

# 15. Hero 좌측 메인 카피

Hero Canvas 위에 HTML 텍스트 레이어를 배치한다.

Canvas에 직접 텍스트를 그리지 않는다.

화면 왼쪽에 다음 메인 카피를 배치한다.

## 메인 카피

```text
자연과 인간을 위한
건강하고 행복한 환경조성
```

2~3줄의 큰 타이포그래피로 구성한다.

## 서브 카피

```text
환경의 가치를 회복하고
지속가능한 미래를 만들어갑니다.
```

메인 카피는 Hero의 핵심 메시지로 유지한다.

---

# 16. Hero 좌측 텍스트 레이아웃

Desktop 기준으로 viewport 왼쪽에 배치한다.

```text
┌─────────────────────────────────────────┐
│                                         │
│  자연과 인간을 위한                      │
│  건강하고 행복한                         │
│  환경조성                                │
│                                         │
│  환경의 가치를 회복하고                  │
│  지속가능한 미래를 만들어갑니다.         │
│                                         │
│                         CANVAS          │
│                                         │
└─────────────────────────────────────────┘
```

권장 기준:

```css
left: 6~8vw;
top: 50%;
transform: translateY(-50%);
```

실제 화면에 맞게 조정한다.

---

# 17. 환경지표 카드

Hero 하단에는 환경 관련 지표 카드를 배치한다.

이 카드는 정적인 UI가 아니다.

**스크롤에 따라 아래에서 위로 등장하는 인터랙션**을 적용한다.

핵심 구조:

```text
화면 하단
    ↓
CARD 01 등장
    ↓
CARD 02 등장
    ↓
CARD 03 등장
    ↓
CARD 04 등장
    ↓
CARD 05 등장
```

최종적으로 여러 카드가 자연스럽게 쌓이는 데이터 스택처럼 보이게 한다.

---

# 18. 환경지표 카드 등장 애니메이션

기본 상태:

```css
opacity: 0;
transform: translateY(80px);
```

등장 상태:

```css
opacity: 1;
transform: translateY(0);
```

카드는 아래쪽에서 시작해서 위로 올라오며 등장한다.

각 카드의 등장 시점은 서로 조금씩 겹치게 구성한다.

카드가 갑자기 나타나는 방식은 금지한다.

---

# 19. 환경지표 카드 스크롤 구간

Hero 진행률을 기준으로 카드를 제어한다.

### CARD 01

```text
0% ~ 25%
```

### CARD 02

```text
20% ~ 45%
```

### CARD 03

```text
40% ~ 65%
```

### CARD 04

```text
60% ~ 85%
```

### CARD 05

```text
80% ~ 100%
```

각 카드의 등장과 퇴장은 `opacity`와 `translateY` 값을 진행률에 따라 보간하여 구현한다.

---

# 20. 환경지표 카드 콘텐츠

실제 공식 통계가 확인되지 않은 수치를 임의로 생성하지 않는다.

컨셉 페이지에서는 카테고리와 메시지를 중심으로 표현한다.

## CARD 01

```text
01
RESOURCE CIRCULATION

자원순환

지속가능한 자원 이용
```

## CARD 02

```text
02
AIR ENVIRONMENT

대기환경

깨끗한 공기를 위한 환경관리
```

## CARD 03

```text
03
WATER ENVIRONMENT

물환경

건강한 물환경을 위한 관리
```

## CARD 04

```text
04
CLIMATE

기후·탄소

탄소중립을 향한 환경전환
```

## CARD 05

```text
05
ECOLOGICAL RESTORATION

환경복원

다시 살아나는 공간
```

필요한 경우 실제 공식 데이터로 교체할 수 있도록 콘텐츠를 JavaScript 데이터 객체 또는 HTML 데이터 구조로 분리한다.

---

# 21. 환경지표 카드 디자인

카드 스타일:

- White 또는 반투명 White
- 얇은 Border
- Subtle Shadow
- 필요 시 Backdrop Blur
- 작은 Category Label
- 큰 핵심 텍스트
- 짧은 설명
- Arrow UI

Border Radius는 약 12~20px 사이의 절제된 형태를 사용한다.

일반적인 SaaS UI처럼 지나치게 둥근 카드 디자인은 피한다.

---

# 22. 카드 배치

카드는 동일한 위치에 정렬하지 않는다.

약간씩 X/Y 위치를 변경하여 하나의 데이터 스택처럼 표현한다.

```text
                  ┌───────────────┐
                  │ CARD 03       │
                  └───────────────┘

          ┌───────────────┐
          │ CARD 02       │
          └───────────────┘

  ┌───────────────┐
  │ CARD 01       │
  └───────────────┘
```

단, 카드가 좌측 메인 카피와 겹쳐 내용을 가리지 않도록 한다.

Desktop에서는 카드가 주로 화면 우측 또는 하단에 위치하도록 한다.

---

# 23. Hero와 카드의 연결

환경지표 카드의 등장과 Canvas의 변화는 하나의 인터랙션처럼 느껴져야 한다.

스크롤 흐름:

```text
BEFORE
버려진 공간
    ↓
환경복원 시작
    ↓
CARD 01
자원순환
    ↓
생태환경 변화
    ↓
CARD 02
대기환경
    ↓
공간 복원 진행
    ↓
CARD 03
물환경
    ↓
생태공원 완성
    ↓
CARD 04
기후·탄소
    ↓
CARD 05
환경복원
    ↓
AFTER
```

사용자는 스크롤을 통해 **공간과 데이터가 함께 변화하는 경험**을 해야 한다.

---

# 24. Hero Scroll Progress

화면 하단에 얇은 Progress Bar를 고정한다.

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

스크롤 진행률에 따라 width 또는 scaleX가 증가한다.

```javascript
progressBar.style.transform =
  `scaleX(${progress})`;
```

Progress Bar는 viewport 하단에 고정한다.

---

# 25. Hero 최종 상태

Hero의 80~100% 구간에서는 최종 상태가 유지되어야 한다.

최종 상태:

- 복원된 생태공원
- 녹지
- 산책로
- 생태습지
- 수변 공간
- 현대적인 공공시설
- 환경지표 카드 전체 등장
- 좌측 메인 카피 유지
- Progress 100%

마지막 프레임은 반드시 프레임 시퀀스의 마지막 프레임을 사용한다.

---

# 26. AFTER 상태

최종 화면은 다음 기준 이미지와 최대한 동일한 상태여야 한다.

```text
assets/after.png
```

Canvas의 마지막 프레임은 `after.png`의 구성과 일치해야 한다.

단, 실제 프레임 시퀀스의 마지막 프레임을 우선 사용한다.

---

# 27. INTRO SECTION

Hero 이후에는 한국환경공단의 역할을 소개한다.

메인 카피:

```text
환경을 바꾸는 일은
삶의 공간을 바꾸는 일입니다.
```

서브 카피:

```text
한국환경공단은 환경의 가치를 회복하고
지속가능한 미래를 만들어갑니다.
```

큰 타이포그래피와 넓은 여백을 사용한다.

---

# 28. 주요 환경사업 SECTION

주요 사업을 카드 또는 Grid 형태로 표현한다.

예:

```text
01
자원순환

02
환경시설

03
기후·대기

04
물환경

05
환경안전

06
환경복원
```

각 카드에는 이미지 Placeholder를 사용할 수 있다.

Hover 시 다음과 같은 간단한 인터랙션을 적용할 수 있다.

- 이미지 Scale
- Arrow 이동
- 카드 이동
- 설명 노출

---

# 29. 환경 데이터 SECTION

Hero에서 등장한 환경지표와 별도로 환경 데이터 영역을 구성할 수 있다.

Hero의 환경지표 카드와 동일한 정보를 단순 반복하지 않는다.

예:

```text
ENVIRONMENTAL DATA

환경을 숫자로 확인합니다.
```

데이터 시각화 또는 숫자 중심의 레이아웃을 사용한다.

실제 공식 통계가 아닌 경우 반드시 컨셉 데이터임을 구분한다.

---

# 30. SERVICE SECTION

사용자가 자주 이용하는 환경 관련 서비스를 배치한다.

예:

```text
환경정보
환경정책
환경시설
자원순환정보
국민참여
민원서비스
```

각 항목은 링크 카드 형태로 구성한다.

---

# 31. FOOTER

Footer는 공공기관 홈페이지의 정보 구조를 참고하여 구현한다.

5개 컬럼:

```text
공단소개
주요사업
환경정보
국민참여
고객지원
```

하단에는:

```text
한국환경공단

주소
대표전화

개인정보처리방침
이용약관
```

실제 기관 주소나 전화번호는 공식 정보 확인 후 적용한다.

확인되지 않은 정보를 임의로 생성하지 않는다.

---

# 32. 디자인 톤

## 핵심 키워드

```text
PUBLIC
TRUST
ENVIRONMENT
DATA
TECHNOLOGY
SUSTAINABILITY
```

## 디자인 방향

- 현대적
- 전문적
- 신뢰감
- 도시적
- 환경친화적
- 데이터 중심
- 넓은 여백
- 큰 타이포그래피
- 명확한 정보 구조
- 절제된 인터랙션

## 지양

- 촌스러운 공공기관 홈페이지
- 지나치게 많은 녹색
- 나뭇잎 아이콘 남발
- 과도한 그라데이션
- 과도하게 둥근 카드
- 복잡한 메뉴
- 장식적인 애니메이션
- 지나치게 귀여운 디자인

---

# 33. 컬러

## Main

```text
#0F4C81
```

## Basic

```text
#FFFFFF
#F5F7F8
#111111
```

## Point

```text
#3FAE72
```

Green은 환경을 표현하는 포인트 컬러로만 제한적으로 사용한다.

전체 화면을 녹색으로 만들지 않는다.

---

# 34. Typography

가능하면 Pretendard를 사용한다.

```css
font-family:
  "Pretendard",
  "Noto Sans KR",
  Arial,
  sans-serif;
```

외부 CDN 사용이 어려운 경우 시스템 폰트를 fallback으로 사용한다.

큰 제목은 충분한 크기와 적절한 자간을 사용하여 공공기관 사이트 특유의 명확한 정보 전달력을 유지한다.

---

# 35. Responsive

다음 환경을 확인한다.

## Desktop

```text
1920 × 1080
1440 × 900
1280 × 720
```

## Tablet

```text
1024px
768px
```

## Mobile

```text
390px
375px
```

Mobile에서는 다음을 조정한다.

- Hero 텍스트 크기
- 환경지표 카드 크기
- 카드 위치
- GNB 메뉴
- Canvas 비율
- 텍스트와 카드 겹침 방지

---

# 36. 성능 최적화

프레임 수가 많을 경우 메모리 사용량이 증가할 수 있다.

필수:

- 모든 프레임 preload
- requestAnimationFrame
- 동일 프레임 중복 렌더링 방지
- devicePixelRatio 제한
- 불필요한 DOM 업데이트 방지
- 스크롤 이벤트에서 무거운 연산 금지
- Canvas 렌더링 최소화

---

# 37. 접근성

Canvas에 의존하지 않고 의미 있는 텍스트는 HTML로 구현한다.

Canvas에는 적절한 `aria-label`을 제공한다.

```html
aria-label="환경복원을 통해 나대지가 생태공원으로 변화하는 과정을 보여주는 화면"
```

Hero의 주요 카피는 실제 HTML 텍스트로 구현한다.

GNB 메뉴와 주요 링크는 키보드로 접근할 수 있어야 한다.

---

# 38. 구현 작업 순서

## STEP 01 — 기본 구조

☐ `index.html` 생성  
☐ `style.css` 생성  
☐ `script.js` 생성  
☐ GNB 기본 구조 구현  
☐ Hero Section 구현  
☐ Canvas 구현  

## STEP 02 — Frame Sequence

☐ `assets/frames/` 실제 파일 확인  
☐ 전체 프레임 개수 확인  
☐ 파일명 순서 정렬  
☐ Image Preload 구현  
☐ Loading Progress 구현  
☐ 첫 번째 프레임 표시  

## STEP 03 — Scroll Scrubbing

☐ Hero 500vh 구현  
☐ Canvas Sticky 구현  
☐ Scroll Progress 계산  
☐ Progress → Frame Index 변환  
☐ Canvas drawImage 구현  
☐ requestAnimationFrame 적용  
☐ 동일 프레임 중복 렌더링 방지  
☐ Device Pixel Ratio 적용  
☐ Cover 방식 렌더링  

## STEP 04 — Hero UI

☐ 좌측 메인 카피 구현  
☐ 서브 카피 구현  
☐ 환경지표 카드 01 구현  
☐ 환경지표 카드 02 구현  
☐ 환경지표 카드 03 구현  
☐ 환경지표 카드 04 구현  
☐ 환경지표 카드 05 구현  
☐ 카드 아래→위 등장 애니메이션 구현  
☐ 카드 순차 등장 타이밍 구현  
☐ 하단 Progress Bar 구현  

## STEP 05 — Main Sections

☐ INTRO 구현  
☐ 주요 환경사업 Grid 구현  
☐ 환경 데이터 Section 구현  
☐ SERVICE Section 구현  
☐ Footer 구현  

## STEP 06 — Responsive

☐ 1920px 테스트  
☐ 1440px 테스트  
☐ 1280px 테스트  
☐ 1024px 테스트  
☐ 768px 테스트  
☐ 390px 테스트  
☐ 375px 테스트  

---

# 39. 반드시 지켜야 할 핵심 원칙

### 원칙 01
Hero는 자동 재생 영상이 아니라 **스크롤 기반 Frame Scrubbing**으로 구현한다.

### 원칙 02
Canvas를 사용한다. 수백 개의 `<img>`를 DOM에 동시에 배치하지 않는다.

### 원칙 03
스크롤 이벤트에서 Canvas를 직접 반복 렌더링하지 않는다. 반드시 `requestAnimationFrame()`을 활용한다.

### 원칙 04
같은 프레임을 반복 렌더링하지 않는다.

### 원칙 05
모든 프레임 preload 완료 전에는 Scrubbing을 비활성화한다.

### 원칙 06
Canvas 이미지는 16:9 비율을 유지한다.

### 원칙 07
Hero 좌측의 다음 카피는 핵심 메시지로 유지한다.

```text
자연과 인간을 위한
건강하고 행복한 환경조성
```

### 원칙 08
환경지표 카드는 정적인 카드가 아니다. **스크롤에 따라 아래에서 위로 올라오며 순차적으로 등장해야 한다.**

### 원칙 09
환경지표 카드와 Canvas의 변화가 서로 연결된 하나의 스토리처럼 느껴져야 한다.

### 원칙 10
실제 기관 로고, 통계, 연락처 등 확인되지 않은 정보를 임의로 생성하지 않는다.

---

# 40. 완료 후 보고

## Frame

```text
총 프레임 수:
프레임 해상도:
전체 프레임 용량:
```

## Loading

```text
Preload 방식:
초기 로딩 시간:
로딩 중 스크롤 처리:
```

## Performance

```text
requestAnimationFrame 적용 여부:
중복 렌더링 방지 여부:
스크롤 프레임 드랍 여부:
메모리 부담 여부:
```

## Responsive

```text
Desktop:
Tablet:
Mobile:
```

## Issues

다음 문제가 있다면 구체적으로 보고한다.

- 프레임 수가 많아서 발생하는 로딩 지연
- 메모리 사용량 증가
- Canvas 성능 문제
- 모바일 레이아웃 문제
- 카드와 Hero 텍스트 충돌
- 브라우저 호환성 문제

---

# 41. 최종 사용자 경험

최종적으로 사용자가 페이지에 진입했을 때 다음과 같은 경험을 제공해야 한다.

```text
GNB

자연과 인간을 위한
건강하고 행복한
환경조성

환경의 가치를 회복하고
지속가능한 미래를 만들어갑니다.

                 BEFORE
                 버려진 공간

                 ↓ SCROLL

                 환경복원

                 ↓

             환경지표 CARD

                 ↓

             생태환경 회복

                 ↓

              AFTER
           다시 살아난 공간
```

스크롤하면:

```text
버려진 공간
    ↓
환경복원
    ↓
자원순환 카드 등장
    ↓
대기환경 카드 등장
    ↓
물환경 카드 등장
    ↓
기후·탄소 카드 등장
    ↓
환경복원 카드 등장
    ↓
생태공원 완성
    ↓
AFTER
```

최종 화면에서는:

```text
자연과 인간을 위한
건강하고 행복한 환경조성

          +

완성된 생태공원

          +

환경지표 카드 STACK
```

가 하나의 화면 안에서 완성되어야 한다.

---

# FINAL GOAL

이 프로젝트는 단순한 한국환경공단 홈페이지의 시각적 리뉴얼이 아니다.

**스크롤 자체를 환경복원의 과정으로 보여주는 인터랙티브 웹사이트**를 목표로 한다.

사용자가 스크롤하는 행위가 곧:

```text
공간의 변화
+
환경의 회복
+
데이터의 축적
+
미래의 완성
```

으로 느껴져야 한다.

프로젝트의 최우선순위:

```text
1. Scroll Scrubbing 성능
2. BEFORE → AFTER 공간 변화
3. 좌측 핵심 메시지
4. 환경지표 카드의 아래→위 등장
5. 전체적인 공공기관 웹사이트 완성도
6. Responsive
7. 세부 장식 및 추가 인터랙션
```

위 우선순위를 기준으로 작업한다.
