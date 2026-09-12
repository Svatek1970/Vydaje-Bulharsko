import Dexie, { type Table } from 'dexie'
import type { Nastavenia, Vydavok } from './types'

// ID jediného záznamu nastavení v databáze
export const NASTAVENIA_ID = 'nastavenia'

// Predvolený počet osôb v skupine
const PREDVOLENY_POCET_OSOB = 12

class VydajeDB extends Dexie {
  vydavky!: Table<Vydavok, string>
  nastavenia!: Table<Nastavenia, string>

  constructor() {
    super('vydaje_bulharsko')
    this.version(1).stores({
      // "id" je primárny kľúč, "datum" a "sposobPlatby" sú indexy na rýchle triedenie/filtrovanie
      vydavky: 'id, datum, sposobPlatby',
      nastavenia: 'id',
    })

    // Predvolené nastavenia sa vytvoria len raz, pri úplne prvom vzniku databázy
    // (nesmie sa robiť priamo v "live" dotaze, ten musí byť len na čítanie)
    this.on('populate', () => {
      this.nastavenia.add({ id: NASTAVENIA_ID, pocetOsob: PREDVOLENY_POCET_OSOB })
    })
  }
}

export const db = new VydajeDB()
