import type { Vydavok } from '../types'
import ExpenseListItem from './ExpenseListItem'

interface Props {
  vydavky: Vydavok[]
  onVyber?: (vydavok: Vydavok) => void
}

export default function ExpenseList({ vydavky, onVyber }: Props) {
  if (vydavky.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-zinc-600">
        Zatiaľ žiadne výdavky.
        <br />
        Pridaj prvý ťuknutím na tlačidlo „+".
      </div>
    )
  }

  return (
    <div>
      {vydavky.map((v) => (
        <ExpenseListItem key={v.id} vydavok={v} onClick={() => onVyber?.(v)} />
      ))}
    </div>
  )
}
