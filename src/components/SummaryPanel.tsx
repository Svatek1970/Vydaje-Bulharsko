import { formatSuma } from '../lib/format'
import { SPOSOBY_PLATBY } from '../lib/sposobPlatby'
import type { Vydavok } from '../types'

interface Props {
  vydavky: Vydavok[]
  pocetOsob: number
  onNastavenia: () => void
}

export default function SummaryPanel({ vydavky, pocetOsob, onNastavenia }: Props) {
  const celkom = vydavky.reduce((sucet, v) => sucet + v.suma, 0)
  const naOsobu = pocetOsob > 0 ? celkom / pocetOsob : 0

  const rozpad = SPOSOBY_PLATBY.map((s) => ({
    ...s,
    suma: vydavky
      .filter((v) => v.sposobPlatby === s.hodnota)
      .reduce((sucet, v) => sucet + v.suma, 0),
  }))

  return (
    <div className="sticky top-0 z-10 border-b border-zinc-300 bg-white px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 shadow-sm">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNastavenia}
          aria-label="Nastavenia"
          className="-mt-1 -mr-2 flex h-11 w-11 items-center justify-center text-zinc-600 active:text-zinc-900"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <circle cx="12" cy="12" r="3" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Náklady celkom
          </div>
          <div className="text-3xl font-bold text-zinc-900 tabular-nums">
            {formatSuma(celkom)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Na osobu
          </div>
          <div className="text-2xl font-bold text-zinc-900 tabular-nums">
            {formatSuma(naOsobu)}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
        {rozpad.map((s) => (
          <span key={s.hodnota} className="tabular-nums">
            {s.label}: <span className="font-semibold">{formatSuma(s.suma)}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
