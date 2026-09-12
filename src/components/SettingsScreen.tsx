import { useEffect, useState } from 'react'
import { db } from '../db'
import { stiahnutSubor, vydavkyNaCsv } from '../lib/csvExport'
import type { Vydavok } from '../types'

interface Props {
  vydavky: Vydavok[]
  pocetOsob: number
  limitNaOsobu: number
  onZmenPocetOsob: (pocet: number) => void
  onZmenLimit: (limit: number) => void
  onSpat: () => void
}

const MIN_POCET_OSOB = 1
const MAX_POCET_OSOB = 999
const MIN_LIMIT = 1
const MAX_LIMIT = 100000

export default function SettingsScreen({
  vydavky,
  pocetOsob,
  limitNaOsobu,
  onZmenPocetOsob,
  onZmenLimit,
  onSpat,
}: Props) {
  const [text, setText] = useState(String(pocetOsob))
  const [limitText, setLimitText] = useState(limitNaOsobu.toFixed(2).replace('.', ','))

  // Ak sa počet osôb/limit zmenia zvonku (napr. cez tlačidlá +/-), zosynchronizuj textové polia
  useEffect(() => {
    setText(String(pocetOsob))
  }, [pocetOsob])

  useEffect(() => {
    setLimitText(limitNaOsobu.toFixed(2).replace('.', ','))
  }, [limitNaOsobu])

  function potvrdText() {
    const n = Number.parseInt(text, 10)
    if (Number.isInteger(n) && n >= MIN_POCET_OSOB && n <= MAX_POCET_OSOB) {
      onZmenPocetOsob(n)
    } else {
      setText(String(pocetOsob))
    }
  }

  function zmena(o: number) {
    const n = Math.min(MAX_POCET_OSOB, Math.max(MIN_POCET_OSOB, pocetOsob + o))
    onZmenPocetOsob(n)
  }

  function potvrdLimit() {
    const cislo = Number.parseFloat(limitText.replace(',', '.'))
    if (Number.isFinite(cislo) && cislo >= MIN_LIMIT && cislo <= MAX_LIMIT) {
      onZmenLimit(Math.round(cislo * 100) / 100)
    } else {
      setLimitText(limitNaOsobu.toFixed(2).replace('.', ','))
    }
  }

  function handleExport() {
    const obsah = vydavkyNaCsv(vydavky, pocetOsob, limitNaOsobu)
    const dnes = new Date().toISOString().slice(0, 10)
    stiahnutSubor(obsah, `vydavky_${dnes}.csv`, 'text/csv;charset=utf-8;')
  }

  async function handleZmazatVsetko() {
    if (
      window.confirm(
        `Naozaj chceš natrvalo zmazať všetkých ${vydavky.length} výdavkov? Toto sa nedá vrátiť späť.`,
      )
    ) {
      await db.vydavky.clear()
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-300 bg-white px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <button
          type="button"
          onClick={onSpat}
          className="min-h-11 min-w-11 px-2 text-base text-zinc-600"
        >
          Späť
        </button>
        <span className="font-semibold text-zinc-900">Nastavenia</span>
      </div>

      <div className="flex-1 space-y-8 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:mx-auto md:w-full md:max-w-xl">
        <section>
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Počet osôb v skupine
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => zmena(-1)}
              aria-label="Znížiť počet osôb"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-300 text-2xl font-medium text-zinc-700 active:bg-zinc-100"
            >
              −
            </button>
            <input
              type="text"
              inputMode="numeric"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={potvrdText}
              className="min-h-11 w-20 rounded-lg border border-zinc-300 px-3 text-center text-lg font-semibold text-zinc-900"
            />
            <button
              type="button"
              onClick={() => zmena(1)}
              aria-label="Zvýšiť počet osôb"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-300 text-2xl font-medium text-zinc-700 active:bg-zinc-100"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            Ovplyvňuje prepočet nákladov „na osobu" na hlavnej obrazovke.
          </p>
        </section>

        <section>
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Horný limit na osobu
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={limitText}
              onChange={(e) => setLimitText(e.target.value)}
              onBlur={potvrdLimit}
              className="min-h-11 w-32 rounded-lg border border-zinc-300 px-3 text-lg font-semibold text-zinc-900"
            />
            <span className="text-lg font-semibold text-zinc-700">€</span>
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            Farebný pásik na hlavnej obrazovke ukazuje, ako blízko je súčet zaplatených a
            plánovaných výdavkov na osobu k tomuto limitu.
          </p>
        </section>

        <section>
          <span className="mb-2 block text-sm font-medium text-zinc-700">Export dát</span>
          <button
            type="button"
            onClick={handleExport}
            disabled={vydavky.length === 0}
            className="min-h-11 w-full rounded-lg border border-zinc-300 text-base font-medium text-zinc-900 active:bg-zinc-100 disabled:opacity-40"
          >
            Exportovať do CSV
          </button>
          <p className="mt-2 text-xs text-zinc-600">
            Stiahne súbor so všetkými výdavkami, otvorí sa priamo v Exceli.
          </p>
        </section>

        <section>
          <span className="mb-2 block text-sm font-medium text-zinc-700">Nebezpečná zóna</span>
          <button
            type="button"
            onClick={handleZmazatVsetko}
            disabled={vydavky.length === 0}
            className="min-h-11 w-full rounded-lg border border-red-300 text-base font-medium text-red-600 active:bg-red-50 disabled:opacity-40"
          >
            Zmazať všetky dáta
          </button>
          <p className="mt-2 text-xs text-zinc-600">
            Natrvalo zmaže všetky zapísané výdavky. Toto sa nedá vrátiť späť.
          </p>
        </section>
      </div>
    </div>
  )
}
