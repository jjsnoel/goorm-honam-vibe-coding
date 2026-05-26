# AI Vibe Coding Instructor Landing Page

동준상 강연자 소개 웹페이지 — 바이브코딩 입문 실습용 프로젝트

## 프로젝트 구조

```
├── index.html      # 메인 HTML
├── style.css       # 스타일시트
├── script.js       # 인터랙션 (Vanilla JS)
├── assets/
│   └── profile.svg # 프로필 이미지 (placeholder)
└── README.md
```

## 로컬 실행

브라우저에서 `index.html`을 직접 열거나, 간단한 로컬 서버를 사용하세요.

```bash
# Python 3
python3 -m http.server 8080

# 또는 npx
npx serve .
```

브라우저에서 `http://localhost:8080` 접속

## GitHub Pages 배포

1. GitHub에 새 Repository 생성
2. 프로젝트 파일 업로드
3. Settings → Pages → Source: `main` branch, `/ (root)`
4. 배포 URL 확인

```bash
git init
git add .
git commit -m "Add AI instructor landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 포함 기능

- 6개 섹션: Hero, About, Skills, Projects, Experience, Contact
- Dark Mode + Glassmorphism UI
- 반응형 (Desktop / Tablet / Mobile)
- Smooth scrolling, 타이핑 효과, 스킬 Progress Bar
- 프로젝트 필터, 파티클 배경, 스크롤 애니메이션

## 커스터마이징

- `assets/profile.jpg`로 프로필 사진 교체 시 `index.html`의 `src` 경로 수정
- Contact 섹션의 이메일·SNS 링크를 실제 주소로 변경
- GitHub 링크를 본인 계정 URL로 변경

## 1일차 싱글 파일 버전

모든 CSS/JS를 HTML에 포함하려면 `index.html`에 `<style>` 및 `<script>` 태그로 병합하면 됩니다.
