import type { AnalyzeResponse, MultiAnalyzeResponse } from '../types/eda'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

function normalizeResponse(data: MultiAnalyzeResponse): AnalyzeResponse[] {
  if (data.results?.length) return data.results
  if (data.eda && data.analysis && data.report && data.filename) {
    return [{ filename: data.filename, eda: data.eda, analysis: data.analysis, report: data.report }]
  }
  return []
}

export async function analyzeFiles(files: File[]): Promise<{
  results: AnalyzeResponse[]
  errors: string[]
}> {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(typeof err.detail === 'string' ? err.detail : '분석 요청 실패')
  }

  const data: MultiAnalyzeResponse = await res.json()
  return {
    results: normalizeResponse(data),
    errors: data.errors ?? [],
  }
}

export async function downloadReport(
  file: File,
  format: 'markdown' | 'pptx',
): Promise<Blob> {
  const form = new FormData()
  form.append('file', file)
  const endpoint = format === 'markdown' ? '/api/report/markdown' : '/api/report/pptx'

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    throw new Error('보고서 다운로드 실패')
  }

  return res.blob()
}
