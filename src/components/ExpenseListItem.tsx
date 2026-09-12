import { formatDatum, formatSuma } from '../lib/format'
import { infoPreSposobPlatby } from '../lib/sposobPlatby'
import type { Vydavok } from '../types'

interface Props {
  vydavok: Vydavok
  onClick?: () => void
}

export default function ExpenseListItem({ vydavok, onClick }: Props) {
  const info = infoPreSposobPlatby(vydavok.sposobPlatby)
  const jePlanovany = !!vydavok.planovany

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full min-h-[44px] items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 text-left active:bg-zinc-100"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
          jePlanovany ? 'bg-zinc-400' : info.farba
        }`}
        aria-hidden="true"
      >
        {info.skratka}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-medium ${jePlanovany ? 'text-zinc-500' : 'text-zinc-900'}`}
        >
          {vydavok.nazov}
        </span>
        <span className="block text-xs text-zinc-600">
          {formatDatum(vydavok.datum)} · {info.label}
          {jePlanovany && <span className="font-medium text-zinc-500"> · Plánované</span>}
        </span>
      </span>

      <span
        className={`shrink-0 font-semibold tabular-nums ${jePlanovany ? 'text-zinc-500' : 'text-zinc-900'}`}
      >
        {formatSuma(vydavok.suma)}
      </span>
    </button>
  )
}
