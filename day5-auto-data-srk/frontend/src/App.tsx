import { useCallback, useState } from 'react'
import {
  BarChart3,
  Brain,
  Database,
  Download,
  FileText,
  Sparkles,
} from 'lucide-react'
import { analyzeFiles, downloadReport } from './api/analyze'
import type { AnalyzeResponse } from './types/eda'
import { AnalysisReport } from './components/AnalysisReport'
import { FileUploader } from './components/FileUploader'

function App() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [results, setResults] = useState<AnalyzeResponse[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const handleAnalyze = useCallback(async (selected: File[]) => {
    if (!selected.length) return

    setFiles(selected)
    setLoading(true)
    setError(null)
    setWarnings([])
    setResults([])
    setActiveIndex(0)

    try {
      const { results: data, errors } = await analyzeFiles(selected)
      setResults(data)
      if (errors.length) setWarnings(errors)
      if (!data.length) setError('분석에 성공한 파일이 없습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
    } finally {
      setLoading(false)
    }
  }, [])

  const activeResult = results[activeIndex]
  const activeFile = files.find((f) => f.name === activeResult?.filename) ?? files[activeIndex]

  const handleDownload = async (format: 'markdown' | 'pptx') => {
    if (!activeFile) return
    try {
      const blob = await downloadReport(activeFile, format)
      const ext = format === 'markdown' ? 'md' : 'pptx'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${activeFile.name.replace(/\.[^.]+$/, '')}_report.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('보고서 다운로드에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Data Explorer AI</h1>
              <p className="text-xs text-slate-400">
                CSV / Excel 업로드 → 자동 EDA → 분석 보고서
              </p>
            </div>
          </div>
          {activeResult && activeFile && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDownload('markdown')}
                className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                <FileText className="h-4 w-4" />
                Markdown
              </button>
              <button
                type="button"
                onClick={() => handleDownload('pptx')}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                <Download className="h-4 w-4" />
                PPT 다운로드
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <FileUploader
          onFilesSelect={handleAnalyze}
          loading={loading}
          selectedFiles={files}
          onClear={() => {
            setFiles([])
            setResults([])
            setError(null)
            setWarnings([])
          }}
        />

        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
            <p className="font-medium">일부 파일 분석 실패</p>
            <ul className="mt-1 list-inside list-disc">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {!results.length && !loading && (
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: Database, title: '구조 분석', desc: 'shape, dtypes, preview' },
              { icon: Sparkles, title: '품질 분석', desc: '결측치, 이상치, 중복' },
              { icon: BarChart3, title: '분포 & 상관', desc: '히스토그램, 히트맵' },
              { icon: Brain, title: 'AI 인사이트', desc: '10개 인사이트 + ML 전략' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4"
              >
                <Icon className="mb-2 h-5 w-5 text-indigo-400" />
                <p className="font-medium text-white">{title}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <>
            {results.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {results.map((r, i) => (
                  <button
                    key={r.filename}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                      i === activeIndex
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {r.filename}
                  </button>
                ))}
              </div>
            )}

            {activeResult && <AnalysisReport result={activeResult} />}
          </>
        )}
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Data Explorer AI · CSV & Excel · 다중 파일 분석 지원
      </footer>
    </div>
  )
}

export default App
