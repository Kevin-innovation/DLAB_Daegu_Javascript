# 뽀모도로 타이머 (Pomodoro Timer) 프로젝트


이 프로젝트는 생산성 향상을 위한 뽀모도로 기법을 구현한 웹 애플리케이션입니다. 작업 세션과 휴식 시간을 관리하여 집중력과 생산성을 높이는 데 도움을 줍니다.

## 프로젝트 구조

```
├── index.html    # 메인 HTML 파일
├── style.css     # 스타일시트
├── script.js     # 자바스크립트 로직
└── preview.jpg   # 프리뷰 이미지
```

## 주요 기능

- 세 가지 타이머 모드: 뽀모도로(25분), 짧은 휴식(5분), 긴 휴식(10분)
- **사용자 정의 타이머 설정**: 각 모드의 시간을 직접 설정 가능
- 시각적인 원형 프로그레스 바로 남은 시간 표시
- 타이머 완료 시 알림음 재생
- 시작 및 정지 기능
- 반응형 디자인

## 파일별 상세 설명

### 1. HTML (index.html)

메인 구조를 정의하는 HTML 파일입니다.

#### 주요 컴포넌트:
- 타이머 메시지 디스플레이
- 타이머 모드 선택 버튼 (뽀모도로, 짧은 휴식, 긴 휴식)
- **사용자 정의 시간 설정 영역**: 가로 레이아웃의 분 단위 시간 설정 입력 필드
- 원형 타이머 디스플레이와 프로그레스 바
- 제어 버튼 (시작, 정지)

#### 핵심 코드 설명:
```html
<!-- 사용자 정의 타이머 설정 영역 (가로 배치) -->
<div class="timer-settings">
    <div class="setting-group">
        <label for="pomodoro-time">뽀모도로:</label>
        <input type="number" id="pomodoro-time" min="1" max="60" value="25">
    </div>
    <div class="setting-group">
        <label for="short-break-time">짧은 휴식:</label>
        <input type="number" id="short-break-time" min="1" max="30" value="5">
    </div>
    <div class="setting-group">
        <label for="long-break-time">긴 휴식:</label>
        <input type="number" id="long-break-time" min="1" max="60" value="10">
    </div>
    <button id="save-settings">저장</button>
</div>

<!-- 타이머 진행률 표시를 위한 원형 프로그레스 바 -->
<div class="timer-progress-container">
    <div id="timer-progress" class="timer-progress"></div>
</div>

<!-- 타이머 디스플레이 - data-duration 속성으로 시간 설정 -->
<div id="pomodoro-timer" class="timer-display" data-duration="25.00">
    <h1 class="time">25:00</h1>
</div>
```

- 타이머 시간은 `data-duration` 속성으로 정의됩니다.
- 각 타이머 모드는 별도의 디스플레이 요소를 가지며, JavaScript로 전환됩니다.
- 원형 프로그레스 바는 타이머 진행 상황을 시각적으로 표시합니다.
- 사용자 설정 영역은 가로 배치로 구성되어 직관적인 사용성을 제공합니다.

### 2. JavaScript (script.js)

타이머의 동작을 제어하는 JavaScript 파일입니다.

#### 주요 기능 및 코드 구조:
1. **DOM 요소 선택 및 초기화**
   ```javascript
   // 각 타이머 요소 선택
   const pomodoro = document.getElementById("pomodoro-timer");
   const short = document.getElementById("short-timer");
   const long = document.getElementById("long-timer");
   ```

2. **타이머 모드 전환 기능**
   ```javascript
   // 뽀모도로 세션 버튼 클릭 이벤트
   session.addEventListener("click", () => {
       hideAll();
       // 뽀모도로 타이머 표시
       pomodoro.style.display = "block";
       
       // 버튼 활성화 상태 변경
       session.classList.add("active");
       shortBreak.classList.remove("active");
       longBreak.classList.remove("active");
       
       // 현재 타이머 설정
       currentTimer = pomodoro;
       resetProgressBar();
       resetTimer();
   });
   ```

3. **타이머 실행 및 시간 관리**
   ```javascript
   // 타이머 시작 함수
   function startTimer(timerDisplay) {
       // 이미 실행 중인 타이머가 있다면 중지
       if (myInterval) {
           clearInterval(myInterval);
       }
       
       // 타이머 실행 상태 변경
       timerRunning = true;
   
       // 타이머 시간 가져오기 (data-duration 속성에서)
       let timerDuration = timerDisplay.getAttribute("data-duration");
       
       // 초 단위로 변환 (정확한 값을 얻기 위해 parseFloat 사용)
       totalSeconds = Math.round(parseFloat(timerDuration) * 60);
       remainingSeconds = totalSeconds;
       
       // 타이머 시작 시간 기록
       startTime = Date.now();
       
       // SVG 애니메이션으로 프로그레스 바 생성 - 정확한 타이머 시간과 동기화
       createProgressBar(totalSeconds);
       
       // 1초마다 타이머 업데이트
       myInterval = setInterval(function() {
           // 경과 시간 계산 (밀리초) - Date.now()로 정확한 경과 시간 측정
           const elapsedTime = Date.now() - startTime;
           // 남은 시간 계산 (초)
           remainingSeconds = Math.max(0, totalSeconds - Math.floor(elapsedTime / 1000));
           
           // 화면에 시간 표시
           const minutes = Math.floor(remainingSeconds / 60);
           const seconds = remainingSeconds % 60;
           const displayTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
           timerDisplay.querySelector('.time').textContent = displayTime;
           
           // 타이머 완료됐을 때
           if (remainingSeconds === 0) {
               clearInterval(myInterval);
               timerRunning = false;
               
               // 종료 알림음 재생
               const alarm = new Audio("https://www.freespecialeffects.co.uk/soundfx/scifi/electronic.wav");
               alarm.play();
               
               // 타이머 완료 시 프로그레스 바 초기화
               setTimeout(resetProgressBar, 1000);
           }
       }, 1000);
   }
   ```

4. **SVG 애니메이션을 활용한 프로그레스 바**
   ```javascript
   /**
    * 프로그레스 바 생성 함수 (SVG 애니메이션 사용)
    * 정확한 시간 동안 진행되는 애니메이션 프로그레스 바를 생성합니다.
    */
   function createProgressBar(durationInSeconds) {
       // 기존 프로그레스 바 내용 제거
       progressBar.innerHTML = '';
       
       // SVG 네임스페이스
       const svgNS = "http://www.w3.org/2000/svg";
       
       // SVG 요소 생성
       const svg = document.createElementNS(svgNS, "svg");
       svg.setAttribute("width", "100%");
       svg.setAttribute("height", "100%");
       svg.setAttribute("viewBox", "0 0 100 100");
       
       // 원의 둘레 계산 (2*π*r)
       const circumference = 2 * Math.PI * 45;
       
       // 배경 원 (회색 배경)
       const bgCircle = document.createElementNS(svgNS, "circle");
       bgCircle.setAttribute("cx", "50");
       bgCircle.setAttribute("cy", "50");
       bgCircle.setAttribute("r", "45");
       bgCircle.setAttribute("fill", "none");
       bgCircle.setAttribute("stroke", "rgba(33, 154, 82, 0.2)");
       bgCircle.setAttribute("stroke-width", "10");
       
       // 메인 원 (프로그레스 표시)
       const circle = document.createElementNS(svgNS, "circle");
       circle.setAttribute("cx", "50");
       circle.setAttribute("cy", "50");
       circle.setAttribute("r", "45");
       circle.setAttribute("fill", "none");
       circle.setAttribute("stroke", "#219a52");
       circle.setAttribute("stroke-width", "10");
       circle.setAttribute("stroke-dasharray", circumference);
       circle.setAttribute("stroke-dashoffset", "0");
       circle.setAttribute("transform", "rotate(-90, 50, 50)");
       
       // SMIL 애니메이션 요소 추가
       const animate = document.createElementNS(svgNS, "animate");
       animate.setAttribute("attributeName", "stroke-dashoffset");
       animate.setAttribute("from", "0");
       animate.setAttribute("to", circumference);
       animate.setAttribute("dur", `${durationInSeconds}s`);
       animate.setAttribute("fill", "freeze");
       animate.setAttribute("begin", "0s");
       animate.setAttribute("calcMode", "linear");
       
       // 원에 애니메이션 추가 및 시작
       circle.appendChild(animate);
       svg.appendChild(bgCircle);
       svg.appendChild(circle);
       progressBar.appendChild(svg);
       animate.beginElement();
   }
   ```

5. **사용자 정의 타이머 설정 기능**
   ```javascript
   // 타이머 시간 업데이트 함수
   function updateTimerDuration(timerElement, minutes) {
       // data-duration 속성 업데이트
       timerElement.setAttribute("data-duration", minutes.toString());
       
       // 정수 분과 초로 변환 (소수점 처리)
       const wholeMinutes = Math.floor(minutes);
       const seconds = Math.round((minutes - wholeMinutes) * 60);
       
       // 타이머 표시 텍스트 업데이트
       const displayText = `${wholeMinutes}:${seconds.toString().padStart(2, '0')}`;
       timerElement.querySelector('.time').textContent = displayText;
   }
   
   // 타이머 설정 저장 함수
   function saveTimerSettings() {
       // 입력 값 가져오기 및 유효성 검사
       const pomodoroMinutes = Math.max(1, Math.min(60, parseFloat(pomodoroTimeInput.value) || 25));
       // ... 다른 타이머 설정 값 ...
       
       // 타이머 요소 업데이트
       updateTimerDuration(pomodoro, pomodoroMinutes);
       // ... 다른 타이머 업데이트 ...
   }
   ```

### 3. CSS (style.css)

사용자 인터페이스 스타일을 정의하는 CSS 파일입니다.

#### 주요 스타일링:

1. **타이머 컨테이너 및 원형 디자인**
   ```css
   /* 타이머 원형 컨테이너 스타일 */
   main {
       width: 25rem;
       height: 25rem;
       border-radius: 50%;
       text-align: center;
       margin: 0 auto;
       margin-bottom: 2rem;
   }

   /* 타이머 디스플레이 영역 스타일 */
   .pomodoro {
       display: flex;
       flex-direction: column;
       justify-content: center;
       align-items: center;
       width: 100%;
       height: 100%;
       position: relative;
       margin: 2.5rem 0;
       text-align: center;
       border-radius: 50%;
       background: #151932;
       /* 네온 효과를 주는 그림자 */
       box-shadow: 20px 20px 42px #0e1021, -20px -20px 42px #1c2244;
   }
   ```

2. **프로그레스 바 스타일**
   ```css
   /* 타이머 진행률 컨테이너 */
   .timer-progress-container {
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       border-radius: 50%;
       overflow: hidden;
   }

   /* 타이머 진행률 표시 (원형 테두리) */
   .timer-progress {
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       background: transparent;
       border: 15px solid royalblue;
       border-radius: 50%;
       box-sizing: border-box;
   }
   ```

3. **가로 배치 설정 영역 스타일**
   ```css
   /* 타이머 설정 컨테이너 */
   .timer-settings {
       background-color: #2e325a;
       border-radius: 10px;
       padding: 15px;
       margin: 20px auto;
       max-width: 600px; /* 가로 배치를 위해 너비 증가 */
       box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
       display: flex; /* 가로 배치를 위한 flex 설정 */
       flex-wrap: wrap; /* 좁은 화면에서 줄바꿈 허용 */
       justify-content: space-between; /* 요소들 사이에 공간 분배 */
       align-items: center;
   }

   /* 설정 그룹 (라벨 + 입력 필드) */
   .setting-group {
       display: flex;
       justify-content: center;
       align-items: center;
       margin: 5px 10px;
       padding: 5px 0;
       flex: 1; /* 동일한 너비로 공간 분배 */
       min-width: 130px; /* 최소 너비 설정 */
   }
   
   /* 단위 표시 */
   .setting-group::after {
       content: "분";
       color: #d7e0ff;
       margin-left: 5px;
       font-size: 0.85rem;
   }
   ```

4. **반응형 디자인**
   ```css
   /* 작은 화면 (모바일) 대응 */
   @media screen and (min-width: 320px) and (max-width: 600px) {
       /* 모바일 화면에서 타이머 설정 영역 조정 */
       .timer-settings {
           flex-direction: column;
           max-width: 100%;
           padding: 10px;
       }
       
       .setting-group {
           width: 100%;
           margin: 5px 0;
           justify-content: space-between;
       }
   }
   ```

## 핵심 기술 및 구현 원리

### 1. 타이머 구현 원리
- `setInterval`을 사용하여 1초마다 시간 업데이트
- 정확한 시간 계산을 위해 `Date.now()`로 실제 경과 시간 측정
- 타이머 모드 전환 시 상태 초기화 및 UI 업데이트

### 2. 원형 프로그레스 바 구현
- SVG 요소와 SMIL 애니메이션 사용
- `stroke-dasharray`와 `stroke-dashoffset`을 사용하여 원형 애니메이션 구현
- 타이머 지속 시간과 동일한 애니메이션 시간 설정으로 정확한 시각적 피드백

### 3. 시각적 피드백
- 배경색 변경으로 활성 모드 표시
- 원형 프로그레스 바로 진행 상황 시각화
- 호버 효과로 상호작용 강화

### 4. 사용자 정의 타이머 설정 (가로 배치)
- Flexbox를 활용한 가로 방향 입력 필드 배치
- 사용자 입력 값의 유효성 검사 및 범위 제한
- CSS ::after 가상 요소를 사용한 단위 표시 ("분")
- 반응형 디자인: 화면 크기에 따라 가로/세로 배치 자동 전환

### 5. 반응형 디자인 구현
- 모바일 화면 대응을 위한 미디어 쿼리 설정
- 작은 화면에서 컨테이너 및 요소 크기 자동 조정
- 모바일 환경에서 설정 영역이 세로로 전환되는 레이아웃 적용

## 학습 포인트

1. **HTML**
   - 시맨틱 마크업 구조
   - 데이터 속성 활용 (`data-duration`)
   - 컴포넌트 기반 구조화

2. **JavaScript**
   - DOM 조작 및 이벤트 처리
   - 타이머 로직 구현 및 시간 계산
   - SVG 동적 생성 및 애니메이션 제어
   - 모듈화된 함수 설계

3. **CSS**
   - Flexbox 레이아웃 (가로 배치 설정 영역)
   - 복잡한 원형 디자인 구현
   - 가상 요소(::after)를 활용한 단위 표시
   - 반응형 디자인 및 미디어 쿼리
   - 그림자 효과와 시각적 계층 관리

## 고급 학습 내용

### SVG 애니메이션 (SMIL)
SVG 애니메이션을 사용한 원형 프로그레스 바는 이 프로젝트의 핵심 기능입니다. 

#### SMIL이란?
**SMIL**은 **"Synchronized Multimedia Integration Language"**(동기화된 멀티미디어 통합 언어)의 약자로, 시간 기반 애니메이션과 상호작용을 위한 XML 기반 마크업 언어입니다. W3C에서 개발한 웹 표준으로, SVG에 통합되어 벡터 그래픽의 애니메이션을 구현하는 데 사용됩니다.

#### SVG와 SMIL의 조합
SVG(Scalable Vector Graphics)는 벡터 기반 그래픽을 위한 XML 포맷입니다. SMIL을 SVG와 함께 사용하면 CSS나 JavaScript 없이도 선언적 방식으로 애니메이션을 구현할 수 있습니다.

#### 기본 코드 예시
```javascript
// SMIL 애니메이션 요소 추가
const animate = document.createElementNS(svgNS, "animate");
animate.setAttribute("attributeName", "stroke-dashoffset");
animate.setAttribute("from", "0");
animate.setAttribute("to", circumference);
animate.setAttribute("dur", `${durationInSeconds}s`);
animate.setAttribute("fill", "freeze");
animate.setAttribute("begin", "0s");
animate.setAttribute("calcMode", "linear");
```

#### 주요 애니메이션 요소 유형
- **`<animate>`**: 단일 속성값 변경 (예: 색상, 크기, 위치)
- **`<animateTransform>`**: 요소 변형 (회전, 크기 조절, 이동)
- **`<animateMotion>`**: 경로를 따라 요소 이동
- **`<set>`**: 특정 시점에 속성값 설정 (비-애니메이션 변화)

#### 핵심 속성 설명
- **`attributeName`**: 애니메이션을 적용할 대상 속성 (예: stroke-dashoffset)
- **`from`**, **`to`**: 시작값과 종료값 (애니메이션 범위)
- **`dur`**: 애니메이션 지속 시간 (초, 분 단위로 지정)
- **`fill="freeze"`**: 애니메이션 완료 후 상태 유지 (마지막 프레임 유지)
- **`begin`**: 시작 시점 (시간 값, 이벤트 등)
- **`calcMode`**: 애니메이션 진행 방식 (linear: 균일 속도, spline: 가속/감속 등)

#### 프로젝트에서의 원형 프로그레스 바 원리
프로젝트의 원형 프로그레스 바 구현 방식을 단계별로 설명합니다:

1. **원형 경로 생성**: SVG circle 요소로 원을 생성
2. **테두리 속성 활용**:
   - `stroke-dasharray`: 전체 원의 둘레 길이(circumference) 지정
   - `stroke-dashoffset`: 원의 시작점부터 "잘라내기" 시작할 길이
3. **애니메이션 메커니즘**:
   - dashoffset이 0일 때: 완전한 원이 표시됨
   - dashoffset이 원의 둘레와 같아질 때: 원이 완전히 사라짐
   - 타이머 시간이 지남에 따라 dashoffset이 0에서 원의 둘레까지 선형적으로 증가

#### HTML 예시 (직접 마크업 작성 시)
```html
<svg width="100" height="100" viewBox="0 0 100 100">
  <!-- 배경 원 -->
  <circle cx="50" cy="50" r="45" fill="none" 
          stroke="rgba(33, 154, 82, 0.2)" stroke-width="10" />
  
  <!-- 애니메이션 원 -->
  <circle cx="50" cy="50" r="45" fill="none" 
          stroke="#219a52" stroke-width="10"
          stroke-dasharray="283" stroke-dashoffset="0"
          transform="rotate(-90, 50, 50)">
    <!-- 애니메이션 정의 -->
    <animate attributeName="stroke-dashoffset"
             from="0" to="283"
             dur="25s"
             fill="freeze"
             begin="0s"
             calcMode="linear" />
  </circle>
</svg>
```

#### SMIL 애니메이션의 장점
- **선언적 구문**: 간결하고 이해하기 쉬운 마크업 기반 구문
- **시간 정밀도**: 정확한 타이밍 제어 가능
- **브라우저 최적화**: 브라우저의 내장 엔진으로 처리되어 성능 효율적
- **복잡한 애니메이션**: 다양한 속성의 복합적 애니메이션 지원
- **파일 크기**: 추가 JavaScript 라이브러리 없이 구현 가능하여 경량화

#### 브라우저 호환성 및 대안
- Internet Explorer는 SMIL을 지원하지 않음
- 크로스 브라우저 호환성을 위한 대안:
  - Web Animations API
  - CSS 애니메이션 + JavaScript
  - GreenSock(GSAP)와 같은 애니메이션 라이브러리

#### 더 깊은 학습을 위한 자료
- [MDN Web Docs: SVG 애니메이션](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL)
- [CSS-Tricks: SMIL 가이드](https://css-tricks.com/guide-svg-animations-smil/)
- [W3C SMIL 명세](https://www.w3.org/TR/SVG11/animate.html)

### 정확한 타이머 구현
정확한 타이머를 구현하기 위해 `setInterval`만 사용하는 것은 한계가 있습니다. 이 프로젝트에서는:
- 타이머 시작 시점의 타임스탬프 저장
- 각 간격마다 경과 시간을 계산하여 실제 남은 시간 계산
- 이를 통해 JavaScript 실행 지연 등으로 인한 오차 최소화

```javascript
// 타이머 시작 시간 기록
startTime = Date.now();

// 1초마다 타이머 업데이트
myInterval = setInterval(function() {
    // 경과 시간 계산 (밀리초)
    const elapsedTime = Date.now() - startTime;
    // 남은 시간 계산 (초)
    remainingSeconds = Math.max(0, totalSeconds - Math.floor(elapsedTime / 1000));
    // ...
}, 1000);
```

### Flexbox를 활용한 가로 배치 레이아웃
사용자 정의 시간 설정 영역에서 Flexbox를 활용한 가로 배치 방법:
```css
/* 가로 배치를 위한 컨테이너 설정 */
.timer-settings {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

/* 각 설정 그룹 */
.setting-group {
    flex: 1;
    min-width: 130px;
}

/* 반응형 대응 */
@media (max-width: 600px) {
    .timer-settings {
        flex-direction: column;
    }
}
```

이러한 Flexbox 기반 레이아웃은 다음과 같은 장점이 있습니다:
- 화면 크기에 따라 유연하게 적응
- 간결한 코드로 복잡한 레이아웃 구현
- 반응형 디자인 구현의 용이성
- 브라우저 호환성 우수

## 추가 학습 제안

1. **로컬 스토리지 활용**
   - 타이머 설정 저장 및 세션 간 유지
   - 사용자 맞춤 타이머 시간 설정

2. **추가 기능 구현**
   - 작업 기록 및 통계 기능
   - 소리/알림 설정 옵션
   - 자동 모드 전환 (뽀모도로 → 휴식 → 뽀모도로...)

3. **UI/UX 개선**
   - 다크/라이트 모드 전환
   - 드래그로 타이머 시간 조정
   - 모바일 환경 최적화

4. **성능 최적화**
   - 애니메이션 성능 개선
   - 브라우저 API 활용 (Web Notifications, Page Visibility API 등)

5. **테스트 및 배포**
   - 자동화된 테스트 작성
   - PWA(Progressive Web App)로 변환
