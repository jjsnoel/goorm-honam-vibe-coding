# Goorm Honam Vibe Coding

구름 호남 바이브코딩 실습 프로젝트 모음 (GitHub-friendly English paths)

## Folder structure

```
goorm-honam-vibe-coding/
├── day1-intro-website/           # Day 1 intro website workspace
│   ├── index.html                # Instructor landing page
│   ├── style.css
│   ├── script.js
│   ├── assets/
│   ├── book-landing-page/        # Book intro landing (Vibe Coding Log)
│   └── day1-intro-website.code-workspace
└── README.md
```

## Projects

| Folder | Description |
|--------|-------------|
| [day1-intro-website](day1-intro-website/) | Day 1 — instructor profile landing page |
| [book-landing-page](day1-intro-website/book-landing-page/) | Book landing — *바이브코딩 항해일지* (5-step page) |

## Local preview (book landing)

```powershell
cd day1-intro-website\book-landing-page
python -m http.server 5151
```

Open http://localhost:5151

## GitHub Pages (book site only)

Deploy the contents of `day1-intro-website/book-landing-page/` to your repository root.

## Path rename note

Projects were copied from Korean folder names to English for GitHub compatibility:

| Before (Korean) | After (English) |
|-----------------|-----------------|
| `구름_호남_바이브코딩` | `goorm-honam-vibe-coding` |
| `1일차 소개 웹사이트` | `day1-intro-website` |
| `책소개 웹페이지` | `book-landing-page` |

You may delete the old Korean-named folder on Desktop after closing Cursor/terminals that lock those paths.
