"""Pandas-based EDA engine for Data Explorer AI."""

from __future__ import annotations

import base64
import io
from typing import Any

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns


def _fig_to_base64(fig: plt.Figure) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", dpi=100, facecolor="white")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


def load_dataframe(content: bytes, filename: str) -> pd.DataFrame:
    name = filename.lower()
    if name.endswith(".csv"):
        return pd.read_csv(io.BytesIO(content))
    if name.endswith(".xlsx") or name.endswith(".xlsm"):
        return pd.read_excel(io.BytesIO(content), engine="openpyxl")
    if name.endswith(".xls"):
        return pd.read_excel(io.BytesIO(content), engine="xlrd")
    raise ValueError("지원 형식: CSV (.csv), Excel (.xlsx, .xls, .xlsm)")


def analyze_structure(df: pd.DataFrame) -> dict[str, Any]:
    columns = []
    for col in df.columns:
        series = df[col]
        columns.append(
            {
                "name": str(col),
                "dtype": str(series.dtype),
                "non_null": int(series.notna().sum()),
                "unique": int(series.nunique(dropna=True)),
                "sample_values": [
                    str(v) for v in series.dropna().head(3).tolist()
                ],
            }
        )

    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "memory_mb": round(float(df.memory_usage(deep=True).sum()) / 1024**2, 2),
        "duplicate_rows": int(df.duplicated().sum()),
        "column_details": columns,
        "preview": df.head(5).fillna("").astype(str).to_dict(orient="records"),
    }


def analyze_missing(df: pd.DataFrame) -> dict[str, Any]:
    total_cells = df.shape[0] * df.shape[1]
    missing_by_col = []
    for col in df.columns:
        count = int(df[col].isna().sum())
        rate = round(count / len(df) * 100, 2) if len(df) else 0.0
        missing_by_col.append(
            {"column": str(col), "missing_count": count, "missing_rate": rate}
        )

    missing_by_col.sort(key=lambda x: x["missing_count"], reverse=True)
    total_missing = int(df.isna().sum().sum())

    return {
        "total_missing_cells": total_missing,
        "total_cells": int(total_cells),
        "overall_missing_rate": round(total_missing / total_cells * 100, 2)
        if total_cells
        else 0.0,
        "columns_with_missing": sum(1 for c in missing_by_col if c["missing_count"] > 0),
        "complete_rows": int(df.dropna().shape[0]),
        "by_column": missing_by_col,
    }


def _iqr_outliers(series: pd.Series) -> dict[str, Any]:
    clean = series.dropna()
    if len(clean) < 4:
        return {"count": 0, "rate": 0.0, "lower": None, "upper": None}

    q1, q3 = clean.quantile(0.25), clean.quantile(0.75)
    iqr = q3 - q1
    lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    mask = (clean < lower) | (clean > upper)
    count = int(mask.sum())
    return {
        "count": count,
        "rate": round(count / len(clean) * 100, 2),
        "lower": round(float(lower), 4),
        "upper": round(float(upper), 4),
    }


def _zscore_outliers(series: pd.Series, threshold: float = 3.0) -> dict[str, Any]:
    clean = series.dropna()
    if len(clean) < 4 or clean.std() == 0:
        return {"count": 0, "rate": 0.0}

    z = np.abs((clean - clean.mean()) / clean.std())
    count = int((z > threshold).sum())
    return {"count": count, "rate": round(count / len(clean) * 100, 2)}


def analyze_outliers(df: pd.DataFrame) -> dict[str, Any]:
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    results = []
    total_outliers_iqr = 0

    for col in numeric_cols:
        iqr = _iqr_outliers(df[col])
        zscore = _zscore_outliers(df[col])
        total_outliers_iqr += iqr["count"]
        results.append(
            {
                "column": str(col),
                "iqr": iqr,
                "zscore": zscore,
            }
        )

    results.sort(key=lambda x: x["iqr"]["count"], reverse=True)

    return {
        "numeric_column_count": len(numeric_cols),
        "columns_analyzed": results[:20],
        "total_iqr_outliers": total_outliers_iqr,
        "high_outlier_columns": [
            r["column"] for r in results if r["iqr"]["rate"] > 5
        ][:10],
    }


def analyze_distributions(df: pd.DataFrame) -> dict[str, Any]:
    numeric = df.select_dtypes(include=[np.number])
    categorical = df.select_dtypes(exclude=[np.number])

    numeric_stats = []
    if not numeric.empty:
        desc = numeric.describe().round(4)
        for col in numeric.columns[:30]:
            row = desc[col]
            numeric_stats.append(
                {
                    "column": str(col),
                    "count": float(row.get("count", 0)),
                    "mean": float(row.get("mean", 0)) if "mean" in row else None,
                    "std": float(row.get("std", 0)) if "std" in row else None,
                    "min": float(row.get("min", 0)) if "min" in row else None,
                    "25%": float(row.get("25%", 0)) if "25%" in row else None,
                    "50%": float(row.get("50%", 0)) if "50%" in row else None,
                    "75%": float(row.get("75%", 0)) if "75%" in row else None,
                    "max": float(row.get("max", 0)) if "max" in row else None,
                    "skewness": round(float(numeric[col].skew()), 4)
                    if numeric[col].notna().sum() > 2
                    else None,
                }
            )

    categorical_stats = []
    for col in list(categorical.columns)[:15]:
        vc = df[col].value_counts(dropna=False).head(10)
        categorical_stats.append(
            {
                "column": str(col),
                "unique": int(df[col].nunique(dropna=True)),
                "top_values": [
                    {"value": str(k), "count": int(v)} for k, v in vc.items()
                ],
            }
        )

    return {
        "numeric_summary": numeric_stats,
        "categorical_summary": categorical_stats,
        "numeric_count": len(numeric.columns),
        "categorical_count": len(categorical.columns),
    }


def analyze_correlation(df: pd.DataFrame) -> dict[str, Any]:
    numeric = df.select_dtypes(include=[np.number])
    if numeric.shape[1] < 2:
        return {
            "available": False,
            "message": "상관관계 분석을 위해 수치형 변수가 2개 이상 필요합니다.",
            "pairs": [],
            "matrix": {},
        }

    corr = numeric.corr(numeric_only=True).round(4)
    pairs = []
    cols = corr.columns.tolist()
    for i, c1 in enumerate(cols):
        for c2 in cols[i + 1 :]:
            val = corr.loc[c1, c2]
            if pd.notna(val):
                pairs.append({"x": str(c1), "y": str(c2), "correlation": float(val)})

    pairs.sort(key=lambda p: abs(p["correlation"]), reverse=True)

    strong = [p for p in pairs if abs(p["correlation"]) >= 0.7][:10]
    moderate = [p for p in pairs if 0.4 <= abs(p["correlation"]) < 0.7][:10]

    matrix = {
        str(c): {str(r): float(corr.loc[r, c]) for r in cols if pd.notna(corr.loc[r, c])}
        for c in cols
    }

    return {
        "available": True,
        "column_count": len(cols),
        "top_pairs": pairs[:15],
        "strong_correlations": strong,
        "moderate_correlations": moderate,
        "matrix": matrix,
    }


def generate_charts(df: pd.DataFrame, missing: dict, correlation: dict) -> list[dict]:
    charts: list[dict] = []
    sns.set_theme(style="whitegrid", font_scale=0.9)

    missing_cols = [c for c in missing["by_column"] if c["missing_count"] > 0][:15]
    if missing_cols:
        fig, ax = plt.subplots(figsize=(10, max(4, len(missing_cols) * 0.35)))
        names = [c["column"] for c in missing_cols]
        rates = [c["missing_rate"] for c in missing_cols]
        ax.barh(names, rates, color="#6366f1")
        ax.set_xlabel("결측률 (%)")
        ax.set_title("컬럼별 결측치 비율")
        ax.invert_yaxis()
        charts.append({"id": "missing", "title": "결측치 분석", "image": _fig_to_base64(fig)})

    numeric = df.select_dtypes(include=[np.number]).columns.tolist()
    for col in numeric[:6]:
        series = df[col].dropna()
        if len(series) < 2:
            continue
        fig, axes = plt.subplots(1, 2, figsize=(10, 3.5))
        sns.histplot(series, kde=True, ax=axes[0], color="#3b82f6")
        axes[0].set_title(f"{col} 분포")
        sns.boxplot(y=series, ax=axes[1], color="#8b5cf6")
        axes[1].set_title(f"{col} 박스플롯")
        charts.append(
            {
                "id": f"dist_{col}",
                "title": f"{col} 변수 분포",
                "image": _fig_to_base64(fig),
            }
        )

    if correlation.get("available") and len(numeric) >= 2:
        cols = numeric[:20]
        corr = df[cols].corr()
        fig, ax = plt.subplots(figsize=(max(6, len(cols) * 0.5), max(5, len(cols) * 0.45)))
        sns.heatmap(corr, annot=len(cols) <= 12, fmt=".2f", cmap="coolwarm", ax=ax, center=0)
        ax.set_title("상관관계 히트맵")
        charts.append(
            {"id": "correlation", "title": "상관관계 히트맵", "image": _fig_to_base64(fig)}
        )

        if len(cols) >= 2:
            x, y = cols[0], cols[1]
            fig, ax = plt.subplots(figsize=(6, 4))
            sns.scatterplot(data=df, x=x, y=y, alpha=0.6, ax=ax, color="#10b981")
            ax.set_title(f"{x} vs {y}")
            charts.append(
                {
                    "id": "scatter",
                    "title": f"산점도: {x} vs {y}",
                    "image": _fig_to_base64(fig),
                }
            )

    return charts


def run_eda(content: bytes, filename: str) -> dict[str, Any]:
    df = load_dataframe(content, filename)

    structure = analyze_structure(df)
    missing = analyze_missing(df)
    outliers = analyze_outliers(df)
    distributions = analyze_distributions(df)
    correlation = analyze_correlation(df)
    charts = generate_charts(df, missing, correlation)

    return {
        "filename": filename,
        "structure": structure,
        "missing": missing,
        "outliers": outliers,
        "distributions": distributions,
        "correlation": correlation,
        "charts": charts,
    }
