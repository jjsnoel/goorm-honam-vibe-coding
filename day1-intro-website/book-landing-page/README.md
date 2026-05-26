# 바이브코딩 항해일지 — 책 소개 랜딩페이지

『**바이브코딩 항해일지 – AI와 함께한 30일간의 프로젝트**』(에이콘출판 / 동준상 저)를 소개하는 **5단계 랜딩페이지** 프로젝트입니다.  
바이브코딩 입문자가 책의 가치·30일 항로·구매 링크를 한 페이지에서 파악할 수 있도록 구성했습니다.

**참고 자료:** [넥스트플랫폼 공식 책 소개](https://nextplatform.net/book-the-vibe-coding-log-a-30-day-voyage/)

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **대상 독자** | 바이브코딩 입문자 (중·고등학생, 대학 비전공자, 실무자·교사) |
| **페이지 구조** | Step 1~5 (Hero → 독자 → 가치 → 30일 항로 → 구매 CTA) |
| **디자인 테마** | 항해(Nautical) · 딥 네이비 · 표지 톤과 통일 |
| **기술 스택** | HTML5, CSS3, Vanilla JavaScript (프레임워크 없음) |
| **작업 흐름** | `landing-5steps.md`(원고) → `index.html` + `style.css` + `script.js`(웹 구현) |

---

## 폴더 구조

```
book-landing-page/
├── index.html                                          # 메인 웹페이지 (진입점)
├── style.css                                           # 전역·섹션·컴포넌트 스타일
├── script.js                                           # 네비·스크롤·애니메이션
├── landing-5steps.md                                   # 5단계 랜딩 원고 (Markdown)
├── Book-Vibe-Coding-Log-postcover-by-NextPlatform.jpeg   # 책 표지·배너 이미지
└── README.md                                           # 이 문서
```

---

## 파일별 상세 설명

### 1. `index.html` (메인 HTML, 약 418줄)

웹사이트의 **유일한 HTML 파일**이며, 브라우저에서 직접 열거나 GitHub Pages 루트로 배포합니다.

| 구역 | 설명 |
|------|------|
| `<head>` | UTF-8, viewport, SEO `description`, 페이지 `title`, `style.css` 연결 |
| `.wave-bg` | 고정 배경 그라데이션 (바다·항해 분위기) |
| `.site-header` | 스티키 헤더, 로고, 5개 섹션 앵커 네비, 모바일 햄버거 버튼 |
| `.step-indicator` | 데스크톱(1024px+) 우측 고정 단계 점 네비 |
| `<main>` | 5개 `<section>` (아래 표 참고) |
| `.site-footer` | 저작권·넥스트플랫폼 링크 |
| `<script>` | `script.js` 로드 (페이지 하단) |

#### 섹션 ID와 내용

| Step | `id` | 제목 | 주요 콘텐츠 |
|------|------|------|-------------|
| 1 | `hero` | 항해를 시작합니다 | 표지 이미지, 책 소개, 핵심 3포인트, 예스24·항로 미리보기 버튼 |
| 2 | `audience` | 이런 분께 추천해요 | 독자 3유형 표, AI 협업 인용 블록 |
| 3 | `value` | 왜 ‘항해일지’인가요 | 특징 4카드, 10-10-10 학습 리듬 표 |
| 4 | `voyage` | 30일 항로 | 책 5부 카드(일차·난이도·AI 비중·대표 프로젝트), 5부 요약 표 |
| 5 | `cta` | 오늘부터 항해를 시작해요 | 책 정보(dl), 구매·GitHub·공식 소개 버튼 4개, 마무리 문구 |

#### 외부 링크 (페이지 내)

| 용도 | URL |
|------|-----|
| 예스24 구매 | https://www.yes24.com/product/goods/186936120 |
| 교보문고 구매 | https://product.kyobobook.co.kr/detail/S000219726261 |
| 공식 책 소개 | https://nextplatform.net/book-the-vibe-coding-log-a-30-day-voyage/ |
| 깃허브 예제 모음 | https://nextplatform.net/book-the-vibe-coding-log-a-30-day-voyage-github-repos/ |

---

### 2. `style.css` (스타일시트, 약 800줄+)

표지의 **딥 블루·시안·골드** 톤을 CSS 변수로 정의하고, 전 섹션에 일관되게 적용합니다.

#### 주요 CSS 변수 (`:root`)

| 변수 | 색상/값 | 용도 |
|------|---------|------|
| `--navy-deep` | `#0a1628` | 페이지 최하단 배경 |
| `--navy`, `--navy-mid` | `#0f2744`, `#1a3a5c` | 그라데이션 중간톤 |
| `--wave`, `--cyan` | `#2d8bc9`, `#5ec8e8` | 링크, 강조, 버튼 |
| `--gold` | `#c9a227` | 난이도·구매(예스24) 버튼 |
| `--purple` | `#9b6dd7` | AI 비중 뱃지 |
| `--max-width` | `1120px` | 콘텐츠 최대 너비 |
| `--section-pad` | `clamp(64px, 10vw, 96px)` | 섹션 상하 여백 |

#### 주요 클래스 그룹

| 클래스 | 역할 |
|--------|------|
| `.hero`, `.hero-grid`, `.hero-cover` | 1단: 표지+텍스트 2열 레이아웃 (900px+ ) |
| `.section`, `.section-alt`, `.section-label` | 공통 섹션·Step 라벨·교차 배경 |
| `.card`, `.grid-3`, `.voyage-card` | 카드 UI, 3열 그리드, 5부 항해 카드 |
| `.audience-table`, `.rhythm-table`, `.summary-table` | 표 스타일 (가로 스크롤 대응) |
| `.btn`, `.btn-primary`, `.btn-outline`, `.btn-gold` | CTA 버튼 변형 |
| `.reveal` / `.reveal.visible` | 스크롤 시 fade-in (JS와 연동) |
| `.site-nav.is-open` | 모바일 메뉴 열림 상태 |
| `.step-indicator` | 데스크톱 우측 단계 점 (1024px+) |

#### 반응형 브레이크포인트

| 너비 | 동작 |
|------|------|
| `< 768px` | 햄버거 메뉴, 1열 카드·그리드 |
| `≥ 768px` | 가로 네비, 2~3열 그리드 |
| `≥ 900px` | Hero 2열 (표지 \| 텍스트) |
| `≥ 1024px` | 우측 `.step-indicator` 표시 |

---

### 3. `script.js` (Vanilla JS, 약 50줄)

IIFE로 감싸 전역 스코프 오염을 막았습니다. **빌드 도구·npm 의존성 없음.**

| 기능 | 구현 방식 |
|------|-----------|
| **모바일 메뉴** | `.nav-toggle` 클릭 → `aria-expanded` 토글, `.site-nav.is-open` |
| **메뉴 닫기** | 네비·단계 링크 클릭 시 메뉴 자동 닫힘 |
| **스크롤 등장** | `IntersectionObserver` → `.reveal`에 `.visible` 추가 |
| **현재 섹션 표시** | 섹션 관찰 → 해당 `#id` 링크에 `.active` 클래스 |

---

### 4. `landing-5steps.md` (랜딩 원고)

HTML 구현 **이전 단계**에서 작성한 **콘텐츠 원고**입니다. 웹에 그대로 렌더링되지는 않으며, 카피·구조·링크의 **단일 출처(Single Source)** 로 사용합니다.

| 포함 내용 | 설명 |
|-----------|------|
| YAML front matter | `title`, `description`, `cover_image`, `theme`, `author` 등 (HTML 변환 시 참고) |
| Step 1~5 | 헤드라인, 본문, 표, CTA 문구 |
| 5부 항해 상세 | 각 부별 일차·난이도·AI 비중·대표 프로젝트 |
| 외부 링크 표 | 예스24, 교보, 넥스트플랫폼, GitHub |

**수정 팁:** 문구를 바꿀 때는 `landing-5steps.md`를 먼저 고친 뒤, 동일 내용을 `index.html`에 반영하는 것을 권장합니다.

---

### 5. `Book-Vibe-Coding-Log-postcover-by-NextPlatform.jpeg` (이미지 자산)

| 항목 | 내용 |
|------|------|
| **용도** | Hero 섹션 책 표지·넥스트플랫폼 프로모 배너 |
| **HTML 참조** | `./Book-Vibe-Coding-Log-postcover-by-NextPlatform.jpeg` |
| **alt 텍스트** | "바이브코딩 항해일지 표지 — AI와 함께 완성하는 30일간의 코딩 프로젝트" |
| **주의** | 파일명·경로 변경 시 `index.html`의 `<img src>`와 `landing-5steps.md`의 이미지 경로를 함께 수정 |

---

## 로컬에서 실행하기

### 방법 1: 파일 직접 열기

`index.html`을 더블클릭하거나 브라우저로 드래그합니다.  
대부분의 기능은 동작하지만, 일부 브라우저에서 `file://` 경로 제한이 있을 수 있습니다.

### 방법 2: 로컬 서버 (권장)

프로젝트 폴더에서 터미널을 연 뒤:

```powershell
cd "c:\Users\User\Desktop\goorm-honam-vibe-coding\day1-intro-website\book-landing-page"
python -m http.server 8080
```

브라우저에서 **http://localhost:8080** 접속

```bash
# Node.js가 있는 경우
npx serve .
```

---

## GitHub Pages 배포

1. GitHub에 새 Repository 생성 (또는 기존 repo의 하위 폴더 사용)
2. `book-landing-page` 폴더 **안의 모든 파일**을 repo 루트에 업로드  
   (`index.html`이 저장소 루트에 있어야 기본 URL로 열립니다)
3. **Settings → Pages → Build and deployment**  
   - Source: `Deploy from a branch`  
   - Branch: `main` / `/ (root)`
4. 몇 분 후 `https://<username>.github.io/<repo>/` 에서 확인

```bash
git init
git add .
git commit -m "Add Vibe Coding Log book landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## 커스터마이징 가이드

| 바꾸고 싶은 것 | 수정 위치 |
|----------------|-----------|
| 페이지 제목·SEO 설명 | `index.html` `<title>`, `<meta name="description">` |
| 섹션 문구 | `index.html` 해당 `<section>` 또는 `landing-5steps.md` |
| 색상·여백·폰트 | `style.css` `:root` 변수 |
| 표지 이미지 | JPEG 교체 후 `index.html` `<img src>` 경로 확인 |
| 구매·외부 링크 | `index.html` Hero·CTA의 `<a href>` |
| 5부 항해 내용 | `index.html` `#voyage` 내 `.voyage-card` 블록 |
| 애니메이션 민감도 | `script.js` `threshold`, `rootMargin` 값 |

---

## 접근성·브라우저

- 시맨틱 HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- 햄버거 버튼: `aria-label`, `aria-expanded`, `aria-controls`
- 표: `<caption class="visually-hidden">` (스크린 리더용)
- 외부 링크: `target="_blank"` + `rel="noopener noreferrer"`
- **권장 브라우저:** Chrome, Edge, Firefox, Safari 최신 버전

---

## 상위 프로젝트와의 관계

이 폴더는 **`day1-intro-website`** 워크스페이스 안에 있으며, 상위 폴더의 [`index.html`](../index.html)은 **강사 소개 랜딩**용입니다.

| 구분 | 상위 `day1-intro-website` | 이 폴더 `book-landing-page` |
|------|---------------------------|---------------------------|
| 목적 | 동준상 강사·수업 소개 | 『바이브코딩 항해일지』 책 소개 |
| 섹션 수 | 6개 (Hero, About, Skills…) | 5개 (Hero, Audience, Value, Voyage, CTA) |
| 테마 | 라이트 · 블루 UI | 다크 · 네이비 항해 UI |
| 코드 공유 | 없음 (독립 프로젝트) | 스타일·구조만 참고 가능 |

---

## 책 정보 (요약)

| 항목 | 내용 |
|------|------|
| **제목** | 『바이브코딩 항해일지 – AI와 함께한 30일간의 프로젝트』 |
| **저자** | 동준상 (넥스트플랫폼) |
| **출판사** | 에이콘출판 |
| **출간** | 2026년 4월 |
| **영문 부제** | The Vibe Coding Log: A 30-Day Voyage |

---

## 라이선스·저작권

- 책 표지 이미지·책 내용 저작권은 **저자·출판사·넥스트플랫폼**에 있습니다.
- 이 웹페이지 소스는 **바이브코딩 입문 실습·포트폴리오** 목적으로 제작되었습니다.  
  상업적 재배포 시 출판사·저자 가이드라인을 확인하세요.

---

## 문의·참고 링크

- **공식 책 소개:** https://nextplatform.net/book-the-vibe-coding-log-a-30-day-voyage/
- **깃허브 예제:** https://nextplatform.net/book-the-vibe-coding-log-a-30-day-voyage-github-repos/
- **저자 연락 (공식 페이지 기재):** naebon@naver.com
