// Naformátuje sumu ako "1 234,56 €" (medzera medzi tisícami, čiarka pred desatinami)
export function formatSuma(suma: number): string {
  const zaokruhlene = Math.round((suma + Number.EPSILON) * 100) / 100
  const zaporne = zaokruhlene < 0
  const [celaCast, desatinnaCast] = Math.abs(zaokruhlene).toFixed(2).split('.')
  const sMedzerami = celaCast.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${zaporne ? '-' : ''}${sMedzerami},${desatinnaCast} €`
}

// Naformátuje dátum ako "12. 9. 2026"
export function formatDatum(datum: Date): string {
  return new Intl.DateTimeFormat('sk-SK', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(datum)
}
