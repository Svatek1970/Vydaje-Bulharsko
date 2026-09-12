import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { db, NASTAVENIA_ID } from './db'
import SummaryPanel from './components/SummaryPanel'
import ExpenseList from './components/ExpenseList'
import ExpenseForm, { type VydavokFormData } from './components/ExpenseForm'
import SettingsScreen from './components/SettingsScreen'

// null = zoznam bez otvoreného formulára, 'novy' = pridávanie, id = úprava existujúceho
type StavFormulara = 'novy' | string | null

function App() {
  const vydavky = useLiveQuery(
    () => db.vydavky.orderBy('datum').reverse().toArray(),
    [],
    [],
  )
  const nastavenia = useLiveQuery(() => db.nastavenia.get(NASTAVENIA_ID), [])
  const [stavFormulara, setStavFormulara] = useState<StavFormulara>(null)
  const [zobrazitNastavenia, setZobrazitNastavenia] = useState(false)

  // Kým sa dáta z databázy načítajú, nič nezobrazujeme (načítanie je takmer okamžité)
  if (vydavky === undefined || nastavenia === undefined) {
    return null
  }

  const upravovanyVydavok =
    stavFormulara && stavFormulara !== 'novy'
      ? vydavky.find((v) => v.id === stavFormulara)
      : undefined

  async function handleUlozit(data: VydavokFormData) {
    if (upravovanyVydavok) {
      await db.vydavky.update(upravovanyVydavok.id, data)
    } else {
      await db.vydavky.add({
        ...data,
        id: crypto.randomUUID(),
        vytvorene: new Date(),
      })
    }
    setStavFormulara(null)
  }

  async function handleZmazat() {
    if (upravovanyVydavok) {
      await db.vydavky.delete(upravovanyVydavok.id)
    }
    setStavFormulara(null)
  }

  async function handleZmenPocetOsob(pocet: number) {
    await db.nastavenia.update(NASTAVENIA_ID, { pocetOsob: pocet })
  }

  async function handleZmenLimit(limit: number) {
    await db.nastavenia.update(NASTAVENIA_ID, { limitNaOsobu: limit })
  }

  if (zobrazitNastavenia) {
    return (
      <SettingsScreen
        vydavky={vydavky}
        pocetOsob={nastavenia.pocetOsob}
        limitNaOsobu={nastavenia.limitNaOsobu}
        onZmenPocetOsob={handleZmenPocetOsob}
        onZmenLimit={handleZmenLimit}
        onSpat={() => setZobrazitNastavenia(false)}
      />
    )
  }

  const formularJeOtvoreny = stavFormulara !== null

  return (
    <div className="min-h-screen bg-zinc-100 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] md:flex">
      <div
        className={`${formularJeOtvoreny ? 'hidden md:block' : 'block'} pb-24 md:w-[380px] md:shrink-0 md:border-r md:border-zinc-300 md:pb-0`}
      >
        <SummaryPanel
          vydavky={vydavky}
          pocetOsob={nastavenia.pocetOsob}
          limitNaOsobu={nastavenia.limitNaOsobu}
          onNastavenia={() => setZobrazitNastavenia(true)}
        />
        <ExpenseList vydavky={vydavky} onVyber={(v) => setStavFormulara(v.id)} />
      </div>

      {formularJeOtvoreny && (
        <div className="md:flex-1">
          <ExpenseForm
            existujuci={upravovanyVydavok}
            onUlozit={handleUlozit}
            onZrusit={() => setStavFormulara(null)}
            onZmazat={upravovanyVydavok ? handleZmazat : undefined}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setStavFormulara('novy')}
        className={`${formularJeOtvoreny ? 'hidden md:flex' : 'flex'} fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-3xl leading-none text-white shadow-lg active:bg-zinc-700`}
        aria-label="Pridať výdavok"
      >
        +
      </button>
    </div>
  )
}

export default App
