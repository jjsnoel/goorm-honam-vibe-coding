"""Generate insights, ML strategy, and optional GPT-enhanced analysis."""

from __future__ import annotations

import json
import os
from typing import Any

from dotenv import load_dotenv

load_dotenv()


def _rule_based_insights(eda: dict[str, Any]) -> list[str]:
    insights: list[str] = []
    s = eda["structure"]
    m = eda["missing"]
    o = eda["outliers"]
    d = eda["distributions"]
    c = eda["correlation"]

    insights.append(
        f"데이터셋은 {s['rows']:,}행 × {s['columns']}열로 구성되어 있으며, "
        f"메모리 사용량은 약 {s['memory_mb']}MB입니다."
    )

    if s["duplicate_rows"] > 0:
        insights.append(
            f"중복 행이 {s['duplicate_rows']:,}개({s['duplicate_rows']/max(s['rows'],1)*100:.1f}%) "
            "발견되어 전처리 시 제거를 검토해야 합니다."
        )
    else:
        insights.append("중복 행은 발견되지 않아 행 수준 데이터 품질이 양호합니다.")

    if m["overall_missing_rate"] > 20:
        insights.append(
            f"전체 결측률이 {m['overall_missing_rate']}%로 높아 "
            "결측치 대체(imputation) 또는 컬럼 제거 전략이 필요합니다."
        )
    elif m["columns_with_missing"] > 0:
        top_missing = m["by_column"][0]
        insights.append(
            f"결측치가 있는 컬럼 {m['columns_with_missing']}개 중 "
            f"'{top_missing['column']}'이(가) {top_missing['missing_rate']}%로 가장 높습니다."
        )
    else:
        insights.append("결측치가 없어 즉시 모델링에 활용 가능한 깨끗한 데이터입니다.")

    if o["high_outlier_columns"]:
        cols = ", ".join(o["high_outlier_columns"][:3])
        insights.append(
            f"IQR 기준 이상치 비율 5%를 초과하는 변수: {cols}. "
            "로그 변환, Winsorizing, 또는 이상치 별도 분석을 권장합니다."
        )
    elif o["numeric_column_count"] > 0:
        insights.append(
            f"수치형 변수 {o['numeric_column_count']}개를 분석했으며, "
            "심각한 이상치 패턴은 제한적입니다."
        )

    if d["numeric_summary"]:
        skewed = [
            x for x in d["numeric_summary"]
            if x.get("skewness") is not None and abs(x["skewness"]) > 1
        ]
        if skewed:
            insights.append(
                f"왜도(|skew|>1)가 큰 변수: {', '.join(x['column'] for x in skewed[:3])}. "
                "정규화 또는 변환을 고려하세요."
            )

    if d["categorical_summary"]:
        high_card = [x for x in d["categorical_summary"] if x["unique"] > 50]
        if high_card:
            insights.append(
                f"고카디널리티 범주형 변수 {len(high_card)}개 발견 — "
                "Target Encoding, Frequency Encoding, 또는 차원 축소가 필요할 수 있습니다."
            )

    if c.get("available") and c.get("strong_correlations"):
        pair = c["strong_correlations"][0]
        insights.append(
            f"'{pair['x']}'와 '{pair['y']}' 간 강한 상관({pair['correlation']:.2f})이 "
            "관찰됩니다. 다중공선성 점검이 필요합니다."
        )
    elif c.get("available"):
        insights.append(
            "수치형 변수 간 강한 선형 상관은 제한적이며, "
            "비선형 관계 탐색(트리 모델, SHAP)을 권장합니다."
        )

    if s["rows"] < 1000:
        insights.append(
            f"샘플 수({s['rows']})가 상대적으로 적어 과적합 위험이 있으므로 "
            "교차 검증과 정규화가 중요합니다."
        )

    while len(insights) < 10:
        insights.append(
            "추가 분석: 타겟 변수 정의 후 Feature Importance 및 "
            "세그먼트별 성능 비교를 수행하세요."
        )

    return insights[:10]


def _ml_strategy(eda: dict[str, Any]) -> dict[str, Any]:
    s = eda["structure"]
    m = eda["missing"]
    d = eda["distributions"]
    c = eda["correlation"]

    numeric = d["numeric_count"]
    categorical = d["categorical_count"]
    has_missing = m["columns_with_missing"] > 0
    has_outliers = len(eda["outliers"]["high_outlier_columns"]) > 0
    has_corr = bool(c.get("strong_correlations"))

    preprocessing = []
    if has_missing:
        preprocessing.append("수치형: median/mean imputation, 범주형: mode 또는 'Unknown' 대체")
    if has_outliers:
        preprocessing.append("이상치: IQR clipping, RobustScaler, 또는 log1p 변환")
    if numeric > 0:
        preprocessing.append("스케일링: StandardScaler 또는 RobustScaler 적용")
    if categorical > 0:
        preprocessing.append("인코딩: One-Hot(저카디널리티) / Target Encoding(고카디널리티)")
    if has_corr:
        preprocessing.append("다중공선성: VIF 분석 후 상관 0.9+ 변수 제거 또는 PCA")

    if numeric > 20 and s["rows"] > 500:
        models = [
            "LightGBM / XGBoost — 고차원 tabular에 강력",
            "Random Forest — 해석 가능성과 안정성",
            "ElasticNet — 선형 관계 + L1/L2 정규화",
        ]
        task_hint = "타겟이 연속형이면 회귀, 범주형이면 분류로 접근"
    elif s["rows"] < 500:
        models = [
            "Logistic/Linear Regression — 소규모 데이터에 적합",
            "SVM + RBF kernel — 비선형 경계",
            "k-NN — baseline 비교용",
        ]
        task_hint = "Leave-One-Out 또는 Stratified K-Fold(5) 교차 검증 권장"
    else:
        models = [
            "Gradient Boosting (XGBoost/LightGBM)",
            "Random Forest",
            "Neural Network (TabNet 또는 MLP) — 충분한 데이터 시",
        ]
        task_hint = "Train/Validation/Test = 70/15/15 분할 + Stratified sampling"

    evaluation = [
        "회귀: RMSE, MAE, R² / 분류: F1, ROC-AUC, Confusion Matrix",
        "SHAP 또는 Permutation Importance로 변수 기여도 해석",
        "Learning curve로 데이터 추가 수집 필요성 판단",
    ]

    return {
        "recommended_preprocessing": preprocessing or ["기본 StandardScaler + Label Encoding"],
        "recommended_models": models,
        "validation_strategy": task_hint,
        "evaluation_metrics": evaluation,
        "feature_engineering": [
            "파생 변수: 비율, 로그, 상호작용항",
            "시간 변수: 연/월/요일 분해 (해당 시)",
            "범주형 그룹핑: 빈도 낮은 카테고리 통합",
        ],
        "next_steps": [
            "타겟 변수(y) 명시 및 EDA 재실행",
            "베이스라인 모델 1개 학습 후 성능 기록",
            "하이퍼파라미터 튜닝 (Optuna/Hyperopt)",
            "최종 모델 배포 전 데이터 drift 모니터링 설계",
        ],
    }


async def _gpt_enhance(eda: dict[str, Any], insights: list[str]) -> dict[str, Any] | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=api_key)
        summary = {
            "structure": eda["structure"],
            "missing_summary": {
                "overall_rate": eda["missing"]["overall_missing_rate"],
                "columns_with_missing": eda["missing"]["columns_with_missing"],
            },
            "outlier_high": eda["outliers"]["high_outlier_columns"][:5],
            "strong_corr": eda["correlation"].get("strong_correlations", [])[:5],
            "rule_insights": insights,
        }

        response = await client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {
                    "role": "system",
                    "content": (
                        "당신은 Senior Data Analyst입니다. "
                        "EDA 결과를 바탕으로 한국어로 비즈니스 인사이트 3개와 "
                        "머신러닝 전략 요약 1문단을 JSON으로 작성하세요. "
                        '형식: {"extra_insights": ["...", "..."], "ml_summary": "..."}'
                    ),
                },
                {"role": "user", "content": json.dumps(summary, ensure_ascii=False)},
            ],
            response_format={"type": "json_object"},
            temperature=0.4,
        )
        content = response.choices[0].message.content
        return json.loads(content) if content else None
    except Exception:
        return None


async def generate_analysis(eda: dict[str, Any]) -> dict[str, Any]:
    insights = _rule_based_insights(eda)
    ml_strategy = _ml_strategy(eda)

    gpt = await _gpt_enhance(eda, insights)
    if gpt:
        extra = gpt.get("extra_insights", [])
        for item in extra[:3]:
            if item and len(insights) < 10:
                insights.append(str(item))
        if gpt.get("ml_summary"):
            ml_strategy["ai_summary"] = gpt["ml_summary"]

    return {
        "insights": insights[:10],
        "ml_strategy": ml_strategy,
        "ai_enhanced": gpt is not None,
    }
