"""Shared file validation and analysis helpers."""

from __future__ import annotations

from typing import Any

from fastapi import HTTPException, UploadFile

from eda_engine import run_eda
from insight_generator import generate_analysis
from report_generator import build_markdown_report, build_ppt_outline

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".xlsm"}


def validate_filename(filename: str | None) -> str:
    if not filename:
        raise HTTPException(status_code=400, detail="파일명이 없습니다.")

    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"지원 형식: CSV, Excel ({', '.join(sorted(ALLOWED_EXTENSIONS))})",
        )
    return filename


async def analyze_upload(file: UploadFile) -> dict[str, Any]:
    filename = validate_filename(file.filename)
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail=f"빈 파일입니다: {filename}")

    try:
        eda = run_eda(content, filename)
        analysis = await generate_analysis(eda)
        markdown = build_markdown_report(eda, analysis)
        ppt_outline = build_ppt_outline(eda, analysis)
        return {
            "filename": filename,
            "eda": eda,
            "analysis": analysis,
            "report": {
                "markdown": markdown,
                "ppt_outline": ppt_outline,
            },
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"{filename}: {exc}") from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"{filename} 분석 중 오류: {exc}"
        ) from exc
