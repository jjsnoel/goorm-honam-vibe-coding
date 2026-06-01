interface Props {
  label: string
  value: string | number
  sub?: string
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose'
}

const accents = {
  indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30',
  emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
  amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
  rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/30',
}

export function SummaryCard({ label, value, sub, accent = 'indigo' }: Props) {
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-4 ${accents[accent]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}
