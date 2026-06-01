import type { ChartItem } from '../types/eda'

interface Props {
  charts: ChartItem[]
}

export function ChartGallery({ charts }: Props) {
  if (!charts.length) {
    return (
      <p className="text-sm text-slate-400">생성된 차트가 없습니다.</p>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {charts.map((chart) => (
        <figure
          key={chart.id}
          className="overflow-hidden rounded-xl border border-slate-700/60 bg-white"
        >
          <figcaption className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            {chart.title}
          </figcaption>
          <img
            src={`data:image/png;base64,${chart.image}`}
            alt={chart.title}
            className="w-full"
          />
        </figure>
      ))}
    </div>
  )
}
