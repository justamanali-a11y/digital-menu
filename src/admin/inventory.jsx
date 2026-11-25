import { actions, useShop } from '../store/shopStore'

export default function Inventory() {
  const { inventory } = useShop()
  const low = inventory.filter((i) => i.qty <= i.min)

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold">Inventory</h2>
        <span className="text-[12.5px] text-mute">Basic ingredient stock. Update the count after each delivery or stock check.</span>
      </div>

      {low.length > 0 && (
        <div className="rounded-2xl bg-warn-soft px-4 py-3 font-medium text-warn">
          Low stock: {low.map((i) => i.name).join(', ')}
        </div>
      )}

      <div>
        {inventory.map((i) => {
          const isLow = i.qty <= i.min
          return (
            <div key={i.id} className="flex flex-wrap items-center gap-3 border-b border-line py-3">
              <div className="min-w-[160px] flex-1">
                <b>{i.name}</b>
                <small className="block text-mute">
                  Alert at {i.min} {i.unit}
                </small>
              </div>
              {isLow && <span className="rounded-full bg-warn-soft px-2.5 py-1 text-xs font-bold text-warn">Low</span>}
              <span className="inline-flex items-center overflow-hidden rounded-xl border border-line">
                <button className="h-10 w-10 text-lg font-bold" aria-label={`Reduce ${i.name}`} onClick={() => actions.adjustStock(i.id, -1)}>
                  −
                </button>
                <span className="min-w-[72px] text-center font-semibold tabular-nums">
                  {i.qty} {i.unit}
                </span>
                <button className="h-10 w-10 text-lg font-bold" aria-label={`Add ${i.name}`} onClick={() => actions.adjustStock(i.id, 1)}>
                  +
                </button>
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}
