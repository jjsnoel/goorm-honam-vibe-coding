const carouselTrack = document.querySelector("#carouselTrack");
const carouselDots = document.querySelector("#carouselDots");
const slideCounter = document.querySelector("#slideCounter");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const statusText = document.querySelector("#statusText");
const quotePanel = document.querySelector("#quotePanel");
const quoteToolbar = document.querySelector("#quoteToolbar");
const timerPanel = document.querySelector("#timerPanel");
const appSwitches = document.querySelectorAll(".app-switch");
const categorySelect = document.querySelector("#categorySelect");
const colorModeToggle = document.querySelector("#colorModeToggle");
const shareButton = document.querySelector("#shareButton");
const savePngButton = document.querySelector("#savePngButton");
const timerRing = document.querySelector("#timerRing");
const timerKnob = document.querySelector("#timerKnob");
const timerDisplay = document.querySelector("#timerDisplay");
const timerHint = document.querySelector("#timerHint");
const timerProgressCircle = document.querySelector("#timerProgressCircle");
const timerToggleButton = document.querySelector("#timerToggleButton");
const timerResetButton = document.querySelector("#timerResetButton");
const timerUnitMinute = document.querySelector("#timerUnitMinute");
const timerUnitHour = document.querySelector("#timerUnitHour");

const themes = ["theme-paper", "theme-stack", "theme-sky"];
const AUTO_INTERVAL_MS = 5000;
const TIMER_CIRCUMFERENCE = 326.73;
const COLOR_MODE_KEY = "pocket-wisdom-color-mode";
const CATEGORY_KEY = "pocket-wisdom-category";
const MAX_DOTS = 30;

const TIMER_UNIT_KEY = "pocket-wisdom-timer-unit";
const MIN_MINUTES = 1;
const MAX_MINUTES = 60;
const MIN_HOURS = 1;
const MAX_HOURS = 12;

let allQuotes = [];
let categories = [];
let filteredQuotes = [];
let currentCategory = "all";
let currentIndex = 0;
let autoTimer = null;
let activeView = "quotes";
let colorMode = "light";
let timerUnitMode = "minute";
let timerDuration = 25 * 60;
let timerRemaining = 25 * 60;
let timerInterval = null;
let timerRunning = false;
let timerDragging = false;

function splitIntoLines(text, maxChars = 18) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function themeForIndex(index) {
  return themes[index % themes.length];
}

function buildQuoteHtml(item, theme) {
  const quote = item.quote;

  if (theme === "theme-paper") {
    const lines = splitIntoLines(quote, 16);
    return [
      '<div class="quote-display">',
      '<span class="quote-open">"</span>',
      ...lines.map(
        (line) =>
          `<span class="quote-line"><mark>${escapeHtml(line)}</mark></span>`
      ),
      '<span class="quote-close">"</span>',
      "</div>",
    ].join("");
  }

  if (theme === "theme-stack") {
    const lines = splitIntoLines(quote, 10);
    return [
      '<div class="quote-display">',
      ...lines.map(
        (line) => `<span class="stack-line">${escapeHtml(line)}</span>`
      ),
      "</div>",
    ].join("");
  }

  const lines = splitIntoLines(quote, 14);
  return [
    '<div class="quote-display">',
    ...lines.map((line) => `<span class="sky-line">${escapeHtml(line)}</span>`),
    "</div>",
  ].join("");
}

function buildAttributionHtml(item, theme) {
  const prizeBadge = item.prizeLabel
    ? `<span class="prize-badge">${escapeHtml(item.prizeLabel)}</span>`
    : `<span class="category-badge">${escapeHtml(getCategoryLabel(item.category))}</span>`;

  if (theme === "theme-paper") {
    return `${prizeBadge}<p class="quote-attribution">— ${escapeHtml(item.displayName)} (${escapeHtml(item.years)})</p>`;
  }

  return `${prizeBadge}<p class="quote-attribution">${escapeHtml(item.displayName)} · ${escapeHtml(item.years)}</p>`;
}

function getCategoryLabel(categoryId) {
  const found = categories.find((c) => c.id === categoryId);
  return found ? found.label : categoryId;
}

function applyFilters() {
  filteredQuotes =
    currentCategory === "all"
      ? [...allQuotes]
      : allQuotes.filter((q) => q.category === currentCategory);
}

function buildSlides() {
  if (!filteredQuotes.length) {
    carouselTrack.innerHTML =
      '<article class="carousel-slide theme-paper"><div class="slide-inner"><p class="loading-text">이 카테고리에 표시할 명언이 없습니다.</p></div></article>';
    carouselDots.hidden = true;
    slideCounter.textContent = "";
    return;
  }

  carouselTrack.innerHTML = filteredQuotes
    .map((item, index) => {
      const theme = themeForIndex(index);
      return `
        <article class="carousel-slide ${theme}" data-index="${index}" aria-label="명언 ${index + 1}">
          <div class="slide-inner" data-export="slide">
            ${buildQuoteHtml(item, theme)}
            ${buildAttributionHtml(item, theme)}
          </div>
        </article>
      `;
    })
    .join("");

  if (filteredQuotes.length <= MAX_DOTS) {
    carouselDots.hidden = false;
    carouselDots.innerHTML = filteredQuotes
      .map(
        (_, index) =>
          `<button type="button" class="dot${index === 0 ? " is-active" : ""}" data-index="${index}" aria-label="명언 ${index + 1}로 이동"></button>`
      )
      .join("");
  } else {
    carouselDots.hidden = true;
    carouselDots.innerHTML = "";
  }
}

function getCurrentQuote() {
  return filteredQuotes[currentIndex] || null;
}

function getActiveSlideElement() {
  return carouselTrack.querySelector(
    `.carousel-slide[data-index="${currentIndex}"]`
  );
}

function syncPageTheme(index) {
  if (activeView === "timer") {
    document.body.dataset.theme = "timer";
    return;
  }
  const theme = themeForIndex(index).replace("theme-", "");
  document.body.dataset.theme = theme;
}

function updateCarouselPosition() {
  if (!filteredQuotes.length) {
    setStatus("표시할 명언이 없습니다.");
    return;
  }

  carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  syncPageTheme(currentIndex);

  carouselDots.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("is-active", i === currentIndex);
  });

  const current = getCurrentQuote();
  slideCounter.textContent = `${currentIndex + 1} / ${filteredQuotes.length}`;

  if (current) {
    const prizeText = current.prizeLabel || getCategoryLabel(current.category);
    setStatus(`${prizeText} · ${current.displayName}`);
  }
}

function goToSlide(index) {
  if (!filteredQuotes.length) return;
  currentIndex =
    ((index % filteredQuotes.length) + filteredQuotes.length) %
    filteredQuotes.length;
  updateCarouselPosition();
}

function goNext() {
  goToSlide(currentIndex + 1);
}

function goPrev() {
  goToSlide(currentIndex - 1);
}

function resetAutoPlay() {
  if (autoTimer) clearInterval(autoTimer);
  if (activeView !== "quotes" || filteredQuotes.length <= 1) return;
  autoTimer = setInterval(goNext, AUTO_INTERVAL_MS);
}

function setStatus(message) {
  statusText.textContent = message;
}

function populateCategorySelect() {
  categorySelect.innerHTML = categories
    .map(
      (cat) =>
        `<option value="${cat.id}"${cat.id === currentCategory ? " selected" : ""}>${escapeHtml(cat.label)}</option>`
    )
    .join("");
}

function setCategory(categoryId) {
  currentCategory = categoryId;
  localStorage.setItem(CATEGORY_KEY, categoryId);
  applyFilters();
  buildSlides();
  currentIndex = 0;
  updateCarouselPosition();
  resetAutoPlay();
}

function setColorMode(mode) {
  colorMode = mode === "dark" ? "dark" : "light";
  document.documentElement.dataset.colorMode = colorMode;
  localStorage.setItem(COLOR_MODE_KEY, colorMode);

  const isDark = colorMode === "dark";
  colorModeToggle.classList.toggle("is-dark", isDark);
  colorModeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  colorModeToggle.setAttribute(
    "aria-label",
    isDark ? "라이트 모드로 전환" : "다크 모드로 전환"
  );
  colorModeToggle.title = isDark ? "라이트 모드" : "다크 모드";

  const moon = colorModeToggle.querySelector(".icon-moon");
  const sun = colorModeToggle.querySelector(".icon-sun");
  if (moon) moon.hidden = isDark;
  if (sun) sun.hidden = !isDark;
}

function buildShareText(item) {
  const lines = [
    `"${item.quote}"`,
    `— ${item.displayName} (${item.years})`,
  ];
  if (item.prizeLabel) lines.push(item.prizeLabel);
  lines.push("", "Pocket Wisdom");
  return lines.join("\n");
}

async function shareCurrentQuote() {
  const item = getCurrentQuote();
  if (!item) return;

  const text = buildShareText(item);
  const shareData = {
    title: "Pocket Wisdom",
    text,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      setStatus("명언을 공유했습니다.");
      return;
    }
  } catch (error) {
    if (error.name === "AbortError") return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus("클립보드에 복사했습니다. SNS에 붙여넣기 하세요.");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
    setStatus("클립보드에 복사했습니다.");
  }
}

async function saveCurrentQuotePng() {
  const slide = getActiveSlideElement();
  if (!slide) return;

  if (typeof html2canvas !== "function") {
    setStatus("PNG 저장 라이브러리를 불러오지 못했습니다.");
    return;
  }

  savePngButton.disabled = true;
  setStatus("PNG 이미지를 생성하는 중...");

  try {
    const canvas = await html2canvas(slide, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const link = document.createElement("a");
    const item = getCurrentQuote();
    const fileIndex = item ? item.id : currentIndex + 1;
    link.download = `pocket-wisdom-${fileIndex}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatus("PNG 파일을 저장했습니다.");
  } catch (error) {
    console.error(error);
    setStatus("PNG 저장에 실패했습니다. 다시 시도해 주세요.");
  } finally {
    savePngButton.disabled = false;
  }
}

function getTimerLimits() {
  if (timerUnitMode === "hour") {
    return {
      min: MIN_HOURS * 3600,
      max: MAX_HOURS * 3600,
      step: 3600,
    };
  }
  return {
    min: MIN_MINUTES * 60,
    max: MAX_MINUTES * 60,
    step: 60,
  };
}

function clampTimerDuration(seconds) {
  const { min, max, step } = getTimerLimits();
  const snapped = Math.round(seconds / step) * step;
  return Math.min(max, Math.max(min, snapped));
}

function formatTimerDisplay(seconds) {
  if (timerUnitMode === "hour") {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (minutes === 0) return `${hours}시간`;
    return `${hours}시간 ${minutes}분`;
  }
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
}

function getTimerAriaValue() {
  if (timerUnitMode === "hour") return Math.floor(timerDuration / 3600);
  return Math.floor(timerDuration / 60);
}

function secondsFromAngle(angleDeg) {
  const { min, max } = getTimerLimits();
  const ratio = angleDeg / 360;
  return clampTimerDuration(min + ratio * (max - min));
}

function angleFromDuration(seconds) {
  const { min, max } = getTimerLimits();
  const ratio = (seconds - min) / (max - min);
  return ratio * 360;
}

function angleFromPointer(clientX, clientY) {
  const rect = timerRing.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  angle = (angle + 90 + 360) % 360;
  return angle;
}

function positionTimerKnob(angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const radiusPercent = 39;
  timerKnob.style.left = `${50 + Math.cos(rad) * radiusPercent}%`;
  timerKnob.style.top = `${50 + Math.sin(rad) * radiusPercent}%`;
}

function getTimerArcRatio() {
  const { min, max } = getTimerLimits();

  if (timerRunning && timerDuration > 0) {
    return Math.min(Math.max(timerRemaining / timerDuration, 0), 1);
  }

  if (max <= min) return 0;
  return Math.min(Math.max((timerDuration - min) / (max - min), 0), 1);
}

function getTimerKnobAngle() {
  if (timerRunning && timerDuration > 0) {
    return getTimerArcRatio() * 360;
  }
  return angleFromDuration(timerDuration);
}

function setTimerDuration(seconds, resetRemaining = true) {
  timerDuration = clampTimerDuration(seconds);
  if (resetRemaining || timerRemaining > timerDuration) {
    timerRemaining = timerDuration;
  }
  updateTimerUi();
}

function updateTimerUi() {
  const arcRatio = getTimerArcRatio();
  const knobAngle = getTimerKnobAngle();

  timerDisplay.textContent = formatTimerDisplay(
    timerRunning ? timerRemaining : timerDuration
  );
  timerHint.textContent = timerRunning
    ? "집중 중..."
    : "원을 드래그해 시간 설정";

  timerProgressCircle.style.strokeDashoffset =
    TIMER_CIRCUMFERENCE * (1 - arcRatio);
  positionTimerKnob(knobAngle);

  timerToggleButton.textContent = timerRunning ? "일시정지" : "시작";
  timerRing.classList.toggle("is-running", timerRunning);
  timerRing.classList.toggle("is-dragging", timerDragging);

  const limits = getTimerLimits();
  timerRing.setAttribute("aria-valuemin", String(limits.min / limits.step));
  timerRing.setAttribute("aria-valuemax", String(limits.max / limits.step));
  timerRing.setAttribute("aria-valuenow", String(getTimerAriaValue()));

  timerUnitMinute.classList.toggle("is-active", timerUnitMode === "minute");
  timerUnitHour.classList.toggle("is-active", timerUnitMode === "hour");
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  updateTimerUi();
}

function tickTimer() {
  timerRemaining -= 1;
  if (timerRemaining <= 0) {
    timerRemaining = 0;
    stopTimer();
    timerHint.textContent = "완료! 다시 설정해 주세요";
    return;
  }
  updateTimerUi();
}

function toggleTimer() {
  if (timerRunning) {
    stopTimer();
    return;
  }
  timerRemaining = timerDuration;
  timerRunning = true;
  updateTimerUi();
  timerInterval = setInterval(tickTimer, 1000);
}

function resetTimer() {
  stopTimer();
  timerRemaining = timerDuration;
  updateTimerUi();
}

function setTimerUnitMode(mode) {
  timerUnitMode = mode === "hour" ? "hour" : "minute";
  localStorage.setItem(TIMER_UNIT_KEY, timerUnitMode);

  const defaultDuration = timerUnitMode === "hour" ? 3600 : 25 * 60;
  setTimerDuration(defaultDuration, true);
  stopTimer();
}

function onTimerDragStart(event) {
  if (timerRunning) return;
  timerDragging = true;
  timerRing.setPointerCapture(event.pointerId);
  onTimerDragMove(event);
}

function onTimerDragMove(event) {
  if (!timerDragging || timerRunning) return;
  event.preventDefault();
  const angle = angleFromPointer(event.clientX, event.clientY);
  const seconds = secondsFromAngle(angle);

  timerDuration = seconds;
  timerRemaining = seconds;

  timerDisplay.textContent = formatTimerDisplay(timerDuration);
  const arcRatio = getTimerArcRatio();
  timerProgressCircle.style.strokeDashoffset =
    TIMER_CIRCUMFERENCE * (1 - arcRatio);
  positionTimerKnob(angle);
}

function onTimerDragEnd(event) {
  if (!timerDragging) return;
  timerDragging = false;
  if (timerRing.hasPointerCapture(event.pointerId)) {
    timerRing.releasePointerCapture(event.pointerId);
  }
  updateTimerUi();
}

function switchView(view) {
  activeView = view;
  quotePanel.hidden = view !== "quotes";
  timerPanel.hidden = view !== "timer";
  quoteToolbar.hidden = view !== "quotes";

  appSwitches.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });

  if (view === "timer") {
    if (autoTimer) clearInterval(autoTimer);
    document.body.dataset.theme = "timer";
    requestAnimationFrame(() => updateTimerUi());
    return;
  }

  updateCarouselPosition();
  resetAutoPlay();
}

async function loadQuotes() {
  try {
    setStatus("명언 데이터를 불러오는 중...");
    const response = await fetch("./quotes.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    categories = data.categories || [];
    allQuotes = (data.quotes || []).map((q) => ({
      ...q,
      displayName:
        q.displayName ||
        (q.profession ? `${q.person} ${q.profession}` : q.person),
    }));

    if (allQuotes.length < 365) {
      console.warn(`명언 수: ${allQuotes.length} (365개 미만)`);
    }

    const savedCategory = localStorage.getItem(CATEGORY_KEY);
    if (savedCategory && categories.some((c) => c.id === savedCategory)) {
      currentCategory = savedCategory;
    }

    populateCategorySelect();
    applyFilters();
    buildSlides();
    currentIndex = 0;
    updateCarouselPosition();
    resetAutoPlay();
    setStatus(`총 ${allQuotes.length}개 명언 · 카테고리 ${categories.length}종`);
  } catch (error) {
    carouselTrack.innerHTML =
      '<article class="carousel-slide theme-paper"><div class="slide-inner"><p class="loading-text">명언을 불러오지 못했습니다.</p></div></article>';
    setStatus("로컬 서버(http://localhost:5171)로 실행해 주세요.");
    prevButton.disabled = true;
    nextButton.disabled = true;
    console.error(error);
  }
}

prevButton.addEventListener("click", () => {
  goPrev();
  resetAutoPlay();
});

nextButton.addEventListener("click", () => {
  goNext();
  resetAutoPlay();
});

carouselDots.addEventListener("click", (event) => {
  const dot = event.target.closest(".dot");
  if (!dot) return;
  goToSlide(Number(dot.dataset.index));
  resetAutoPlay();
});

quotePanel.addEventListener("mouseenter", () => {
  if (autoTimer) clearInterval(autoTimer);
});
quotePanel.addEventListener("mouseleave", resetAutoPlay);

categorySelect.addEventListener("change", () => {
  setCategory(categorySelect.value);
});

colorModeToggle.addEventListener("click", () => {
  setColorMode(colorMode === "dark" ? "light" : "dark");
});

shareButton.addEventListener("click", shareCurrentQuote);
savePngButton.addEventListener("click", saveCurrentQuotePng);

appSwitches.forEach((button) => {
  button.addEventListener("click", () => {
    switchView(button.dataset.view);
  });
});

timerToggleButton.addEventListener("click", toggleTimer);
timerResetButton.addEventListener("click", resetTimer);
timerUnitMinute.addEventListener("click", () => setTimerUnitMode("minute"));
timerUnitHour.addEventListener("click", () => setTimerUnitMode("hour"));

timerRing.addEventListener("pointerdown", onTimerDragStart);
timerRing.addEventListener("pointermove", onTimerDragMove);
timerRing.addEventListener("pointerup", onTimerDragEnd);
timerRing.addEventListener("pointercancel", onTimerDragEnd);

timerRing.addEventListener("keydown", (event) => {
  if (timerRunning) return;
  const step = getTimerLimits().step;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    setTimerDuration(timerDuration + step, true);
    event.preventDefault();
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    setTimerDuration(timerDuration - step, true);
    event.preventDefault();
  }
});

const savedColorMode = localStorage.getItem(COLOR_MODE_KEY);
setColorMode(savedColorMode === "dark" ? "dark" : "light");

const savedTimerUnit = localStorage.getItem(TIMER_UNIT_KEY);
setTimerUnitMode(savedTimerUnit === "hour" ? "hour" : "minute");
loadQuotes();
