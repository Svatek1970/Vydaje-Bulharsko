import { formatSuma } from '../lib/format'
import { SPOSOBY_PLATBY } from '../lib/sposobPlatby'
import type { Vydavok } from '../types'

interface Props {
  vydavky: Vydavok[]
  pocetOsob: number
  limitNaOsobu: number
  onNastavenia: () => void
}

export default function SummaryPanel({ vydavky, pocetOsob, limitNaOsobu, onNastavenia }: Props) {
  const zaplatene = vydavky.filter((v) => !v.planovany)
  const planovane = vydavky.filter((v) => v.planovany)

  const celkomZaplatene = zaplatene.reduce((sucet, v) => sucet + v.suma, 0)
  const celkomPlanovane = planovane.reduce((sucet, v) => sucet + v.suma, 0)

  const naOsobuZaplatene = pocetOsob > 0 ? celkomZaplatene / pocetOsob : 0
  const naOsobuSpolu = pocetOsob > 0 ? (celkomZaplatene + celkomPlanovane) / pocetOsob : 0
  const percentoLimitu = limitNaOsobu > 0 ? (naOsobuSpolu / limitNaOsobu) * 100 : 0

  // Farby ukazovateľa limitu: zelená v pohode, oranžová sa blíži, červená prekročené
  const farbaPruh =
    percentoLimitu >= 100 ? 'bg-red-600' : percentoLimitu >= 80 ? 'bg-amber-500' : 'bg-emerald-600'
  const farbaText =
    percentoLimitu >= 100
      ? 'text-red-700'
      : percentoLimitu >= 80
        ? 'text-amber-700'
        : 'text-emerald-700'

  // Rozpad podľa spôsobu platby sa počíta len zo skutočne zaplatených výdavkov
  const rozpad = SPOSOBY_PLATBY.map((s) => ({
    ...s,
    suma: zaplatene
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
            {formatSuma(celkomZaplatene)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Na osobu
          </div>
          <div className="text-2xl font-bold text-zinc-900 tabular-nums">
            {formatSuma(naOsobuZaplatene)}
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

      {celkomPlanovane > 0 && (
        <div className="mt-1 text-xs text-zinc-600">
          Plánované (nezaplatené):{' '}
          <span className="font-semibold">{formatSuma(celkomPlanovane)}</span>
        </div>
      )}

      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-zinc-600">
          <span>Limit {formatSuma(limitNaOsobu)} / osobu</span>
          <span className={`font-semibold tabular-nums ${farbaText}`}>
            {Math.round(percentoLimitu)} %
          </span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className={`h-full ${farbaPruh}`}
            style={{ width: `${Math.min(percentoLimitu, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
