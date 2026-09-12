import type { SposobPlatby } from '../types'

// Popis a farba pre každý spôsob platby - používa sa v zozname aj vo formulári
export const SPOSOBY_PLATBY: {
  hodnota: SposobPlatby
  label: string
  kratkyLabel: string
  skratka: string
  farba: string
}[] = [
  { hodnota: 'hotovost', label: 'Hotovosť', kratkyLabel: 'Hotovosť', skratka: 'H', farba: 'bg-emerald-600' },
  { hodnota: 'karta_peter', label: 'Karta Peter', kratkyLabel: 'Peter', skratka: 'P', farba: 'bg-blue-600' },
  { hodnota: 'karta_rado', label: 'Karta Rado', kratkyLabel: 'Rado', skratka: 'R', farba: 'bg-orange-600' },
  { hodnota: 'ine', label: 'Iné', kratkyLabel: 'Iné', skratka: 'I', farba: 'bg-zinc-700' },
]

export function infoPreSposobPlatby(sposob: SposobPlatby) {
  return SPOSOBY_PLATBY.find((s) => s.hodnota === sposob) ?? SPOSOBY_PLATBY[3]
}
