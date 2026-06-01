import { Lightbulb, Sparkles } from 'lucide-react'

interface Props {
  insights: string[]
  aiEnhanced: boolean
}

export function InsightPanel({ insights, aiEnhanced }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          주요 인사이트 10개
        </h3>
        {aiEnhanced && (
          <span className="flex items-center gap-1 rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">
            <Sparkles className="h-3 w-3" />
            GPT 보강
          </span>
        )}
      </div>
      <ol className="space-y-3">
        {insights.map((insight, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-lg bg-slate-800/50 px-4 py-3 text-sm leading-relaxed text-slate-300"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-bold text-indigo-300">
              {i + 1}
            </span>
            {insight}
          </li>
        ))}
      </ol>
    </div>
  )
}
