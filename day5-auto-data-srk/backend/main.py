"""Data Explorer AI — FastAPI backend."""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from report_generator import build_markdown_report, build_pptx_bytes
from services import analyze_upload, validate_filename
from eda_engine import run_eda
from insight_generator import generate_analysis

app = FastAPI(title="Data Explorer AI", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "Data Explorer AI"}


@app.post("/api/analyze")
async def analyze(
    files: list[UploadFile] = File(...),
) -> dict[str, Any]:
    if not files:
        raise HTTPException(status_code=400, detail="업로드할 파일을 선택하세요.")

    results: list[dict[str, Any]] = []
    errors: list[str] = []

    for upload in files:
        try:
            result = await analyze_upload(upload)
            results.append(result)
        except HTTPException as exc:
            errors.append(str(exc.detail))

    if not results and errors:
        raise HTTPException(status_code=400, detail="; ".join(errors))

    response: dict[str, Any] = {
        "count": len(results),
        "results": results,
    }

    # Backward compatibility: single file keeps top-level keys
    if len(results) == 1:
        response.update(results[0])

    if errors:
        response["errors"] = errors

    return response


@app.post("/api/report/pptx")
async def download_pptx(file: UploadFile = File(...)) -> Response:
    filename = validate_filename(file.filename)
    content = await file.read()
    eda = run_eda(content, filename)
    analysis = await generate_analysis(eda)
    pptx_bytes = build_pptx_bytes(eda, analysis)

    name = filename.rsplit(".", 1)[0]
    return Response(
        content=pptx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={"Content-Disposition": f'attachment; filename="{name}_report.pptx"'},
    )


@app.post("/api/report/markdown")
async def download_markdown(file: UploadFile = File(...)) -> Response:
    filename = validate_filename(file.filename)
    content = await file.read()
    eda = run_eda(content, filename)
    analysis = await generate_analysis(eda)
    md = build_markdown_report(eda, analysis)

    name = filename.rsplit(".", 1)[0]
    return Response(
        content=md.encode("utf-8"),
        media_type="text/markdown; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{name}_report.md"'},
    )
