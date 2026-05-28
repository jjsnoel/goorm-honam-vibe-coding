# Goorm Honam Pocket Wisdom

Goorm Honam vibe coding 2일차 프로젝트로 만든 명언 수첩 웹사이트입니다. 노벨상 수상자와 지성인들의 문장을 카드형 캐러셀로 보여주며, 각 인물의 수상 분야와 직업 정보를 함께 확인할 수 있습니다.

## 주요 기능

- 명언 카드 자동 슬라이드
- 이전/다음 버튼과 페이지 점 네비게이션
- 명언별 분위기가 다른 3가지 비주얼 테마
- 노벨 평화상, 문학상, 화학상, 물리학상, 경제학상 등 수상 분야 표시
- 뽀모도로 타이머: 집중, 짧은 휴식, 긴 휴식 모드
- 원형 링과 진행 막대로 타이머 진행 상황 표시
- 하단 배너에서 명언칸과 타이머칸 전환
- `poket-wisdom-quotes.md` 파일 기반 명언 데이터 로드
- HTML, CSS, JavaScript만 사용하는 정적 웹사이트

## 실행 방법

별도 빌드 과정은 필요하지 않습니다.

로컬 서버로 실행하려면 프로젝트 폴더에서 다음 명령을 사용할 수 있습니다.

```bash
npx serve .
```

또는 VS Code의 Live Server 같은 정적 서버 도구로 `index.html`을 열어도 됩니다.

## 파일 구성

```text
.
├── index.html
├── style.css
├── app.js
├── poket-wisdom-quotes.md
├── 147aeb0281f640370e699d7b007ce9ca.jpg
├── 567c7dce27ccd37eac32d41182598305.jpg
└── c74d474758b8dff38396de82b6afe586.jpg
```

## 데이터 구조

명언 데이터는 `poket-wisdom-quotes.md`의 마크다운 표에서 읽어옵니다. JavaScript는 각 행의 각주 링크를 분석해 수상 분야를 자동으로 분류합니다.

예시:

- `/prizes/peace/` -> 노벨 평화상
- `/prizes/literature/` -> 노벨 문학상
- `/prizes/chemistry/` -> 노벨 화학상

## 사용 기술

- HTML
- CSS
- Vanilla JavaScript

## 만든 사람

Developer: jjs
