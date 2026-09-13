(function () {
  "use strict";

  /* ================================================================
     FRAME LIST
     assets/frames 폴더를 ffmpeg로 생성할 당시 실제 파일 개수(192개,
     frame_0001.webp ~ frame_0192.webp)를 확인하여 구성한 목록이다.
     file:// 환경에서는 디렉터리 자동 탐색이 불가능하므로, PLAN.md의
     안내대로 실제 파일 목록을 기준으로 배열을 만든다. frames 폴더의
     파일이 추가/삭제되면 이 총 개수만 실제 파일 수에 맞게 갱신한다.
     ================================================================ */
  var FRAME_TOTAL = 192;
  var FRAME_PATH = function (i) {
    return "assets/frames/frame_" + String(i).padStart(4, "0") + ".webp";
  };

  var frameSrcs = [];
  for (var i = 1; i <= FRAME_TOTAL; i++) {
    frameSrcs.push(FRAME_PATH(i));
  }

  /* ================================================================
     STATE
     ================================================================ */
  var images = new Array(frameSrcs.length);
  var loadedCount = 0;
  var imagesReady = false;

  var canvas = document.getElementById("heroCanvas");
  var ctx = canvas.getContext("2d");

  var heroEl = document.getElementById("hero");
  var progressTrack = document.querySelector(".hero-progress-track");
  var progressFill = document.getElementById("heroProgressFill");

  /* 환경지표 Counter 데이터 - 실제 공식 수치가 확인되면 이 배열만 교체한다 */
  var METRICS = [
    { value: 24.8, labelEn: "ENVIRONMENT RECOVERY", labelKr: "환경회복지수" },
    { value: 18.2, labelEn: "GREEN AREA", labelKr: "녹지면적" },
    { value: 32.6, labelEn: "ECOLOGICAL RESTORATION", labelKr: "생태복원" },
    { value: -41.3, labelEn: "CARBON EMISSION", labelKr: "탄소배출" },
    { value: 27.5, labelEn: "WATER QUALITY", labelKr: "수질개선" }
  ];

  var TREE_METRICS = [
    { value: 56.2, labelEn: "FOREST COVER", labelKr: "산림 회복률" },
    { value: 38.9, labelEn: "SOIL RECOVERY", labelKr: "토양 복원율" },
    { value: 21.4, labelEn: "BIODIVERSITY", labelKr: "생물다양성 증가" }
  ];

  var treeShowcaseEl = document.getElementById("treeShowcase");
  var treeStageEl = document.getElementById("treeStage");
  var treeImgEl = document.getElementById("treeImg");
  var treeLandBg = document.getElementById("treeLandBg");
  var treeScrim = document.getElementById("treeScrim");

  var treeStart = 0;
  var treeScrollLength = 1;

  var loadingOverlay = document.getElementById("loadingOverlay");
  var loadingBarFill = document.getElementById("loadingBarFill");
  var loadingPercent = document.getElementById("loadingPercent");

  var gnb = document.getElementById("gnb");

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var canvasCssWidth = 0;
  var canvasCssHeight = 0;

  var heroStart = 0;
  var heroScrollLength = 1;

  var currentFrameIndex = -1;
  var lastScrollY = -1;
  var ticking = false;

  /* ================================================================
     PRELOAD
     ================================================================ */
  function onImageSettled(index) {
    loadedCount++;
    var percent = Math.round((loadedCount / frameSrcs.length) * 100);
    loadingBarFill.style.width = percent + "%";
    loadingPercent.textContent = "LOADING " + percent + "%";

    if (index === 0 && currentFrameIndex === -1) {
      renderFrame(0);
    }

    if (loadedCount === frameSrcs.length) {
      finishLoading();
    }
  }

  function finishLoading() {
    imagesReady = true;

    var loadingFrame = document.getElementById("loadingFrame");
    if (loadingFrame) loadingFrame.classList.add("is-open");

    window.setTimeout(function () {
      loadingOverlay.classList.add("is-hidden");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      requestTick();
    }, 350);

    window.setTimeout(function () {
      loadingOverlay.style.display = "none";
    }, 350 + 700);
  }

  function preloadFrames() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    frameSrcs.forEach(function (src, index) {
      var img = new Image();
      img.onload = function () { onImageSettled(index); };
      img.onerror = function () { onImageSettled(index); };
      img.src = src;
      images[index] = img;
    });
  }

  /* ================================================================
     CANVAS SIZING (DPR + cover fit)
     ================================================================ */
  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    canvasCssWidth = rect.width;
    canvasCssHeight = rect.height;

    canvas.width = Math.round(canvasCssWidth * dpr);
    canvas.height = Math.round(canvasCssHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawCover(img) {
    if (!img || !img.naturalWidth) return;

    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    var cw = canvasCssWidth;
    var ch = canvasCssHeight;

    var imgRatio = iw / ih;
    var canvasRatio = cw / ch;

    var sx, sy, sw, sh;

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
    var img = images[index];
    if (!img) return;
    drawCover(img);
    currentFrameIndex = index;
  }

  /* ================================================================
     SCROLL PROGRESS
     ================================================================ */
  function measureHero() {
    heroStart = heroEl.offsetTop;
    heroScrollLength = Math.max(heroEl.offsetHeight - window.innerHeight, 1);
  }

  function measureTree() {
    treeStart = treeShowcaseEl.offsetTop;
    treeScrollLength = Math.max(treeShowcaseEl.offsetHeight - window.innerHeight, 1);
  }

  function getSectionProgress(scrollY, start, length) {
    var p = (scrollY - start) / length;
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    return p;
  }

  function getProgress(scrollY) {
    return getSectionProgress(scrollY, heroStart, heroScrollLength);
  }

  /* ================================================================
     ENV COUNTER FACTORY (단일 지표 카운터 - 스크롤 구간마다 교체)
     동일한 마크업 구조(.env-counter-slot 2개)를 가진 컨테이너라면
     Hero, Tree Showcase 등 어느 섹션에서도 재사용할 수 있다.
     ================================================================ */
  function createCounter(containerEl, metrics) {
    var slots = Array.prototype.slice.call(
      containerEl.querySelectorAll(".env-counter-slot")
    );
    var activeSlotPos = 0;
    var currentIndex = -1;

    function fillSlot(slot, metric) {
      var sign = metric.value >= 0 ? "+" : "-";
      slot.querySelector(".env-counter-sign").textContent = sign;
      slot.querySelector(".env-counter-number").textContent = "0";
      slot.querySelector(".env-counter-label-en").textContent = metric.labelEn;
      slot.querySelector(".env-counter-label-kr").textContent = metric.labelKr;
    }

    function animateCount(slot, target, duration) {
      var numEl = slot.querySelector(".env-counter-number");
      if (slot._countRAF) {
        window.cancelAnimationFrame(slot._countRAF);
      }

      var startTime = null;

      function step(ts) {
        if (startTime === null) startTime = ts;
        var elapsed = ts - startTime;
        var t = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        numEl.textContent = (target * eased).toFixed(1);

        if (t < 1) {
          slot._countRAF = window.requestAnimationFrame(step);
        } else {
          slot._countRAF = null;
        }
      }

      slot._countRAF = window.requestAnimationFrame(step);
    }

    function init() {
      fillSlot(slots[0], metrics[0]);
      currentIndex = 0;
      activeSlotPos = 0;
      animateCount(slots[0], Math.abs(metrics[0].value), 900);
    }

    function switchTo(newIndex) {
      if (newIndex === currentIndex) return;
      currentIndex = newIndex;

      var metric = metrics[newIndex];
      var outgoing = slots[activeSlotPos];
      var incomingPos = 1 - activeSlotPos;
      var incoming = slots[incomingPos];

      fillSlot(incoming, metric);

      outgoing.classList.remove("is-active");
      outgoing.classList.add("is-leaving");
      outgoing.setAttribute("aria-hidden", "true");

      incoming.classList.add("is-active");
      incoming.removeAttribute("aria-hidden");

      animateCount(incoming, Math.abs(metric.value), 900);

      window.setTimeout(function () {
        outgoing.classList.remove("is-leaving");
        outgoing.style.transition = "none";
        void outgoing.offsetWidth;
        outgoing.style.transition = "";
      }, 620);

      activeSlotPos = incomingPos;
    }

    function update(progress) {
      var idx = Math.floor(progress * metrics.length);
      if (idx >= metrics.length) idx = metrics.length - 1;
      if (idx < 0) idx = 0;
      switchTo(idx);
    }

    return { init: init, update: update };
  }

  var heroCounter = createCounter(document.getElementById("envCounter"), METRICS);
  var treeCounter = createCounter(document.getElementById("treeCounter"), TREE_METRICS);

  /* ================================================================
     TREE SHOWCASE VISUAL (회전하는 나무 → 대지 등장)
     ================================================================ */
  function updateTreeVisual(progress) {
    var rotatePhase = Math.min(progress / 0.5, 1);
    var deg = rotatePhase * 360;
    treeImgEl.style.transform = "rotateY(" + deg + "deg)";

    var landOpacity = (progress - 0.25) / 0.45;
    if (landOpacity < 0) landOpacity = 0;
    if (landOpacity > 1) landOpacity = 1;

    treeLandBg.style.opacity = landOpacity;
    treeScrim.style.opacity = landOpacity * 0.55;
    treeStageEl.classList.toggle("is-dark", landOpacity > 0.5);
  }

  var HERO_CARD_RANGES = [
    { start: 0.00, end: 0.25 },
    { start: 0.20, end: 0.45 },
    { start: 0.40, end: 0.65 },
    { start: 0.60, end: 0.85 },
    { start: 0.80, end: 1.00 }
  ];

  var heroCardElements = Array.prototype.slice.call(
    document.querySelectorAll(".hero-card")
  );

  function updateHeroCards(progress) {
    heroCardElements.forEach(function (card, idx) {
      var range = HERO_CARD_RANGES[idx];
      if (!range) return;

      if (progress < range.start) {
        card.style.opacity = "0";
        card.style.transform = "translateY(60px)";
        card.style.pointerEvents = "none";
      } else {
        var localP = (progress - range.start) / 0.10;
        if (localP < 0) localP = 0;
        if (localP > 1) localP = 1;
        var easedP = 1 - Math.pow(1 - localP, 3);
        
        card.style.opacity = String(easedP);
        card.style.transform = "translateY(" + (60 * (1 - easedP)) + "px)";
        card.style.pointerEvents = easedP > 0.5 ? "auto" : "none";
      }
    });
  }

  function updateProgressBar(progress, scrollY) {
    progressFill.style.transform = "scaleX(" + progress + ")";

    var withinHero = scrollY >= heroStart - 1 && scrollY <= heroStart + heroScrollLength + 1;
    progressTrack.classList.toggle("is-visible", withinHero);
  }

  function updateGnb(scrollY) {
    gnb.classList.toggle("is-solid", scrollY > heroStart + heroScrollLength * 0.15);
  }

  function update() {
    ticking = false;

    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY === lastScrollY && currentFrameIndex !== -1) {
      return;
    }
    lastScrollY = scrollY;

    var progress = getProgress(scrollY);

    if (imagesReady) {
      var frameIndex = Math.floor(progress * (images.length - 1));
      if (frameIndex !== currentFrameIndex) {
        renderFrame(frameIndex);
      }
    }

    heroCounter.update(progress);
    updateHeroCards(progress);
    updateProgressBar(progress, scrollY);
    updateGnb(scrollY);

    var treeProgress = getSectionProgress(scrollY, treeStart, treeScrollLength);
    updateTreeVisual(treeProgress);
    treeCounter.update(treeProgress);
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  function onScroll() {
    requestTick();
  }

  function onResize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    resizeCanvas();
    measureHero();
    measureTree();
    currentFrameIndex = -1;
    requestTick();

    if (window.innerWidth > 1024) {
      var nav = document.getElementById("gnbNav");
      var menuBtn = document.getElementById("gnbMenuBtn");
      nav.removeAttribute("style");
      var ul = nav.querySelector("ul");
      if (ul) ul.removeAttribute("style");
      nav.querySelectorAll("a").forEach(function (a) { a.removeAttribute("style"); });
      menuBtn.setAttribute("aria-expanded", "false");
    }
  }

  /* ================================================================
     GNB INTERACTIONS
     ================================================================ */
  function setupGnb() {
    var searchBtn = document.getElementById("gnbSearchBtn");
    var searchPanel = document.getElementById("gnbSearchPanel");
    var menuBtn = document.getElementById("gnbMenuBtn");
    var nav = document.getElementById("gnbNav");

    searchBtn.addEventListener("click", function () {
      var isOpen = searchPanel.classList.toggle("is-open");
      searchBtn.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        var input = searchPanel.querySelector("input");
        if (input) input.focus();
      }
    });

    menuBtn.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open-mobile");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        nav.style.display = "block";
        nav.style.position = "fixed";
        nav.style.top = "var(--gnb-height)";
        nav.style.left = "0";
        nav.style.right = "0";
        nav.style.background = "#ffffff";
        nav.style.padding = "24px 6vw";
        nav.querySelector("ul").style.flexDirection = "column";
        nav.querySelector("ul").style.gap = "20px";
        nav.querySelectorAll("a").forEach(function (a) {
          a.style.color = "#111111";
          a.style.fontSize = "17px";
        });
      } else {
        nav.removeAttribute("style");
      }
    });
  }

  /* ================================================================
     REVEAL ON SCROLL (INTRO / PROJECTS / DATA / SERVICE)
     ================================================================ */
  function setupReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ================================================================
     INIT
     ================================================================ */
  function init() {
    resizeCanvas();
    measureHero();
    measureTree();
    setupGnb();
    setupReveal();
    heroCounter.init();
    treeCounter.init();
    updateTreeVisual(0);
    preloadFrames();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    renderFrame(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
