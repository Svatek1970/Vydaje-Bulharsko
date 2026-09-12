import { SPOSOBY_PLATBY } from '../lib/sposobPlatby'
import type { SposobPlatby } from '../types'

interface Props {
  vybrany: SposobPlatby
  onVyber: (sposob: SposobPlatby) => void
}

export default function PaymentMethodPicker({ vybrany, onVyber }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {SPOSOBY_PLATBY.map((s) => {
        const jeVybrany = s.hodnota === vybrany
        return (
          <button
            key={s.hodnota}
            type="button"
            onClick={() => onVyber(s.hodnota)}
            aria-pressed={jeVybrany}
            className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-lg border-2 py-2 ${
              jeVybrany
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-300 bg-white text-zinc-700'
            }`}
          >
            <span className="text-base font-bold">{s.skratka}</span>
            <span className="text-center text-[11px] leading-tight">
              {s.kratkyLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}
