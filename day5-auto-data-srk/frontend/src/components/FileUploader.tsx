import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react'

const ACCEPT = '.csv,.xlsx,.xls,.xlsm'

interface Props {
  onFilesSelect: (files: File[]) => void
  loading: boolean
  selectedFiles: File[]
  onClear: () => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploader({ onFilesSelect, loading, selectedFiles, onClear }: Props) {
  const handleChange = (fileList: FileList | null) => {
    if (!fileList?.length) return
    onFilesSelect(Array.from(fileList))
  }

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-8 backdrop-blur">
      <label
        htmlFor="data-upload"
        className={`flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
          loading
            ? 'border-indigo-500/50 bg-indigo-950/20'
            : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50'
        }`}
      >
        {loading ? (
          <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
        ) : (
          <Upload className="h-12 w-12 text-indigo-400" />
        )}
        <div className="text-center">
          <p className="text-lg font-semibold text-white">
            {loading ? 'EDA 분석 중...' : 'CSV / Excel 파일 업로드 (1개 또는 여러 개)'}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            .csv · .xlsx · .xls · .xlsm — Ctrl/Shift로 다중 선택 가능
          </p>
        </div>
        <input
          id="data-upload"
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          disabled={loading}
          onChange={(e) => handleChange(e.target.files)}
        />
      </label>

      {selectedFiles.length > 0 && !loading && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{selectedFiles.length}개 파일 선택됨</p>
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              초기화
            </button>
          </div>
          <ul className="max-h-40 space-y-2 overflow-y-auto">
            {selectedFiles.map((file) => (
              <li
                key={`${file.name}-${file.size}`}
                className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-4 py-2 text-sm"
              >
                <FileSpreadsheet className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="truncate text-slate-300">{file.name}</span>
                <span className="ml-auto shrink-0 text-slate-500">{formatSize(file.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
