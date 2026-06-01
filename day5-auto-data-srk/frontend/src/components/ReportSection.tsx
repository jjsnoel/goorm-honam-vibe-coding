import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface Props {
  id: string
  number: number
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function ReportSection({
  id,
  number,
  title,
  children,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section id={id} className="rounded-2xl border border-slate-700/80 bg-slate-900/60">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <h2 className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/30 text-sm font-bold text-indigo-300">
            {number}
          </span>
          {title}
        </h2>
        {open ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>
      {open && <div className="border-t border-slate-700/60 px-6 py-5">{children}</div>}
    </section>
  )
}
