# Data Explorer AI

CSV 파일을 업로드하면 **자동 EDA(탐색적 데이터 분석)** 를 수행하고 8개 섹션 분석 보고서를 생성하는 웹 애플리케이션입니다.

[바이브코딩 실습: 데이터 분석 자동화 에이전트](https://nextplatform.net/vibecoding-handson-auto-eda-automated-data-analysis-agent/) 과제 기반 MVP

## 기능

- **CSV / Excel** 업로드 (`.csv`, `.xlsx`, `.xls`, `.xlsm`)
- **다중 파일** 동시 분석 (탭으로 결과 전환)

## 아키텍처

```
CSV 업로드 (React)
      ↓
FastAPI (/api/analyze)
      ↓
Pandas EDA Engine
      ↓
Insight Generator (규칙 + OpenAI)
      ↓
Report Generator (Markdown / PPTX)
```

## 빠른 시작

### 1. 백엔드

```bash
cd backend
python -m pip install -r requirements.txt

# (선택) GPT 보강 인사이트
copy .env.example .env
# OPENAI_API_KEY 설정

python -m uvicorn main:app --reload --port 8000
```

### 2. 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속 후 CSV/Excel 업로드 (다중 선택 가능)

### 4. Vercel 배포

```bash
cd day5-auto-data-srk
npx vercel --prod
```

`REF/benz-train-s.csv` (Mercedes-Benz Greener Manufacturing 샘플) 사용 가능

## API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/health` | 헬스체크 |
| POST | `/api/analyze` | CSV 업로드 → 전체 EDA JSON |
| POST | `/api/report/markdown` | Markdown 보고서 다운로드 |
| POST | `/api/report/pptx` | PowerPoint 보고서 다운로드 |

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `OPENAI_API_KEY` | 아니오 | 설정 시 GPT 인사이트 보강 |
| `OPENAI_MODEL` | 아니오 | 기본값 `gpt-4o-mini` |

## 기술 스택

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: FastAPI, Pandas, NumPy, Matplotlib, Seaborn
- **Report**: python-pptx, Markdown

## 프로젝트 구조

```
day5-auto-data-srk/
├── backend/
│   ├── main.py              # FastAPI 서버
│   ├── eda_engine.py        # Pandas EDA
│   ├── insight_generator.py # 인사이트 & ML 전략
│   └── report_generator.py  # Markdown / PPT
├── frontend/
│   └── src/
│       ├── App.tsx
│       └── components/
└── REF/                     # 참고 데이터 & 노트북
```
