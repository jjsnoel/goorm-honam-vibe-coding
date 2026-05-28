# Goorm Honam Vibe Coding

구름 호남 바이브코딩 실습 프로젝트 모음입니다.

## 프로젝트 구성

| 일차 | 이 저장소 | 설명 |
|------|-----------|------|
| **Day 1** | `day1-intro-website/` | 강사 소개 랜딩 + 바이브코딩 항해일지 북 랜딩 |
| **Day 2** | [**goorm-honam-pocket-wisdom**](https://github.com/jjsnoel/goorm-honam-pocket-wisdom) | Pocket Wisdom 명언수첩 웹앱 (별도 저장소) |

> Day 2 소스는 이 레포에 포함하지 않습니다. 로컬에서 작업 시 `day2-poket_wisdom/` 폴더는 `.gitignore` 처리되어 있습니다.

## 폴더 구조

```text
goorm-honam-vibe-coding/
├── day1-intro-website/           # Day 1
│   ├── index.html                # 강사 소개 랜딩
│   ├── style.css
│   ├── script.js
│   ├── assets/
│   └── book-landing-page/        # 바이브코딩 항해일지 북 랜딩 (5단계)
└── README.md
```

## Day 1 — 로컬 미리보기

```powershell
cd day1-intro-website\book-landing-page
python -m http.server 5151
```

[http://localhost:5151](http://localhost:5151)

## Day 2 — Pocket Wisdom

- 저장소: [github.com/jjsnoel/goorm-honam-pocket-wisdom](https://github.com/jjsnoel/goorm-honam-pocket-wisdom)
- 519개 명언, 캐러셀, 카테고리, 다크모드, 공유/PNG 저장, 드래그 뽀모도로 타이머
- 실행: 해당 저장소 클론 후 `python -m http.server 5171` → [http://localhost:5171](http://localhost:5171)

## GitHub Pages (Day 1 북 랜딩)

`day1-intro-website/book-landing-page/` 내용을 Pages 루트에 배포하면 됩니다.

## 작업 이력

- **2026-05-26** — Day 1: 강사 소개 랜딩, 북 랜딩 페이지
- **2026-05-28** — Day 2: Pocket Wisdom (전용 저장소)
