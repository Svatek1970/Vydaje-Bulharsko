// Prevody medzi Date a formátom "yyyy-mm-dd", ktorý potrebuje <input type="date">.
// Robíme to ručne (nie cez toISOString), aby sa dátum neposunul kvôli časovému pásmu.

export function datumNaInputHodnotu(datum: Date): string {
  const rok = datum.getFullYear()
  const mesiac = String(datum.getMonth() + 1).padStart(2, '0')
  const den = String(datum.getDate()).padStart(2, '0')
  return `${rok}-${mesiac}-${den}`
}

export function inputHodnotaNaDatum(hodnota: string): Date {
  const [rok, mesiac, den] = hodnota.split('-').map(Number)
  return new Date(rok, mesiac - 1, den)
}
