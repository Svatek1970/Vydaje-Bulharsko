import { formatSuma } from './format'
import { infoPreSposobPlatby } from './sposobPlatby'
import type { Vydavok } from '../types'

// Jedno pole CSV riadku - ak obsahuje bodkočiarku, úvodzovku alebo nový riadok, obalí ho úvodzovkami
function csvPole(hodnota: string): string {
  if (/[";\n]/.test(hodnota)) {
    return `"${hodnota.replace(/"/g, '""')}"`
  }
  return hodnota
}

function csvRiadok(polia: string[]): string {
  return polia.map(csvPole).join(';')
}

function formatDatumCsv(datum: Date): string {
  const den = String(datum.getDate()).padStart(2, '0')
  const mesiac = String(datum.getMonth() + 1).padStart(2, '0')
  return `${den}.${mesiac}.${datum.getFullYear()}`
}

// Vytvorí obsah CSV súboru zo zoznamu výdavkov (bodkočiarka ako oddeľovač - Excel s SK
// nastaveniami takto správne rozdelí stĺpce a zároveň nekoliduje s desatinnou čiarkou v sume)
export function vydavkyNaCsv(vydavky: Vydavok[], pocetOsob: number): string {
  const riadky: string[] = []
  riadky.push(csvRiadok(['Dátum', 'Názov', 'Suma (€)', 'Spôsob platby', 'Poznámka']))

  for (const v of vydavky) {
    riadky.push(
      csvRiadok([
        formatDatumCsv(v.datum),
        v.nazov,
        v.suma.toFixed(2).replace('.', ','),
        infoPreSposobPlatby(v.sposobPlatby).label,
        v.poznamka ?? '',
      ]),
    )
  }

  const celkom = vydavky.reduce((sucet, v) => sucet + v.suma, 0)
  riadky.push('')
  riadky.push(csvRiadok(['Spolu', formatSuma(celkom)]))
  riadky.push(csvRiadok(['Na osobu', formatSuma(pocetOsob > 0 ? celkom / pocetOsob : 0)]))

  // BOM na začiatku zabezpečí, že Excel správne rozpozná UTF-8 a slovenskú diakritiku
  return '﻿' + riadky.join('\r\n')
}

// Stiahne text ako súbor v prehliadači
export function stiahnutSubor(obsah: string, nazovSuboru: string, typ: string) {
  const blob = new Blob([obsah], { type: typ })
  const url = URL.createObjectURL(blob)
  const odkaz = document.createElement('a')
  odkaz.href = url
  odkaz.download = nazovSuboru
  document.body.appendChild(odkaz)
  odkaz.click()
  document.body.removeChild(odkaz)
  URL.revokeObjectURL(url)
}
