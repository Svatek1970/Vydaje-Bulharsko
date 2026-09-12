import { useState } from 'react'
import { datumNaInputHodnotu, inputHodnotaNaDatum } from '../lib/datum'
import type { SposobPlatby, Vydavok } from '../types'
import PaymentMethodPicker from './PaymentMethodPicker'

export interface VydavokFormData {
  nazov: string
  suma: number
  sposobPlatby: SposobPlatby
  poznamka?: string
  datum: Date
}

interface Props {
  existujuci?: Vydavok
  onUlozit: (data: VydavokFormData) => void
  onZrusit: () => void
  onZmazat?: () => void
}

export default function ExpenseForm({ existujuci, onUlozit, onZrusit, onZmazat }: Props) {
  const [nazov, setNazov] = useState(existujuci?.nazov ?? '')
  const [suma, setSuma] = useState(
    existujuci ? existujuci.suma.toFixed(2).replace('.', ',') : '',
  )
  const [sposobPlatby, setSposobPlatby] = useState<SposobPlatby>(
    existujuci?.sposobPlatby ?? 'hotovost',
  )
  const [poznamka, setPoznamka] = useState(existujuci?.poznamka ?? '')
  const [datum, setDatum] = useState(datumNaInputHodnotu(existujuci?.datum ?? new Date()))
  const [chyba, setChyba] = useState<string | null>(null)

  function handleUlozit() {
    const orezanyNazov = nazov.trim()
    if (!orezanyNazov) {
      setChyba('Zadaj názov výdavku.')
      return
    }

    const sumaCislo = parseFloat(suma.replace(',', '.'))
    if (!Number.isFinite(sumaCislo) || sumaCislo <= 0) {
      setChyba('Zadaj platnú sumu väčšiu ako 0.')
      return
    }

    if (!datum) {
      setChyba('Zadaj dátum.')
      return
    }

    onUlozit({
      nazov: orezanyNazov,
      suma: Math.round(sumaCislo * 100) / 100,
      sposobPlatby,
      poznamka: poznamka.trim() || undefined,
      datum: inputHodnotaNaDatum(datum),
    })
  }

  function handleZmazat() {
    if (onZmazat && window.confirm('Naozaj chceš zmazať tento výdavok?')) {
      onZmazat()
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] md:min-h-0">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-300 bg-white px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <button
          type="button"
          onClick={onZrusit}
          className="min-h-11 min-w-11 px-2 text-base text-zinc-600"
        >
          Zrušiť
        </button>
        <span className="font-semibold text-zinc-900">
          {existujuci ? 'Upraviť výdavok' : 'Nový výdavok'}
        </span>
        <button
          type="button"
          onClick={handleUlozit}
          className="min-h-11 rounded-lg bg-zinc-900 px-4 text-base font-semibold text-white active:bg-zinc-700"
        >
          Uložiť
        </button>
      </div>

      <div className="flex-1 space-y-5 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:mx-auto md:w-full md:max-w-xl">
        {chyba && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {chyba}
          </p>
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Názov</span>
          <input
            type="text"
            value={nazov}
            onChange={(e) => setNazov(e.target.value)}
            placeholder="napr. Transfer z letiska"
            className="min-h-11 w-full rounded-lg border border-zinc-300 px-3 text-base text-zinc-900"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Suma (€)</span>
          <input
            type="text"
            inputMode="decimal"
            value={suma}
            onChange={(e) => setSuma(e.target.value)}
            placeholder="0,00"
            className="min-h-11 w-full rounded-lg border border-zinc-300 px-3 text-base text-zinc-900"
          />
        </label>

        <div>
          <span className="mb-1 block text-sm font-medium text-zinc-700">Spôsob platby</span>
          <PaymentMethodPicker vybrany={sposobPlatby} onVyber={setSposobPlatby} />
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">
            Poznámka (nepovinné)
          </span>
          <textarea
            value={poznamka}
            onChange={(e) => setPoznamka(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-base text-zinc-900"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Dátum</span>
          <input
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-zinc-300 px-3 text-base text-zinc-900"
          />
        </label>

        {existujuci && onZmazat && (
          <button
            type="button"
            onClick={handleZmazat}
            className="min-h-11 w-full rounded-lg border border-red-300 text-base font-medium text-red-600 active:bg-red-50"
          >
            Zmazať výdavok
          </button>
        )}
      </div>
    </div>
  )
}
