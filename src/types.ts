// Spôsob platby za výdavok
export type SposobPlatby = 'hotovost' | 'karta_peter' | 'karta_rado' | 'ine'

// Jeden záznam o výdavku
export interface Vydavok {
  id: string
  nazov: string
  suma: number
  sposobPlatby: SposobPlatby
  poznamka?: string
  foto?: Blob // fotka účtenky - zatiaľ sa nepoužíva, doplníme neskôr
  datum: Date
  vytvorene: Date
}

// Nastavenia appky (jeden záznam v databáze)
export interface Nastavenia {
  id: string
  pocetOsob: number
}
