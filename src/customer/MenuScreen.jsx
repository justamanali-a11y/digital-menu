import { useMemo, useState } from 'react'
import { CATS } from '../data/menu'
import { useShop } from '../store/shopStore'
import { fmt } from '../lib/format'
import DishArt from '../components/DishArt'
import VegDot from '../components/VegDot'
import Stepper from '../components/Stepper'
import { useCart } from './CartContext'

export default function MenuScreen({ table, onOpen, onGoCart }) {
  const { items } = useShop()
  const cart = useCart()
  const [cat, setCat] = useState('All')
  const [diet, setDiet] = useState('all')
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return items.filter(
      (i) =>
        (cat === 'All' || i.cat === cat) &&
        (diet === 'all' || (diet === 'veg') === !!i.veg) &&
        (!s || i.name.toLowerCase().includes(s))
    )
  }, [items, cat, diet, q])

  let last = ''

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex items-center gap-2.5 px-4 pb-2 pt-3.5">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-brand-600 font-head text-[13px] font-bold text-white">
            SR
          </span>
          <div className="flex-1 font-head text-base font-semibold">Spice Route</div>
          <span className="whitespace-nowrap rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-600">
            Table {table}
          </span>
        </div>

        <div className="flex flex-col gap-3.5 px-4 pb-5 pt-1">
          <h1 className="text-2xl font-semibold leading-tight">What are you craving?</h1>
          <input
            type="search"
            className="input"
            placeholder="Search dishes"
            aria-label="Search dishes"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
            {['All', ...CATS].map((c) => (
              <button key={c} className={`chip ${cat === c ? 'chip-on' : ''}`} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {[
              ['all', 'All'],
              ['veg', 'Veg'],
              ['nonveg', 'Non-veg'],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setDiet(k)}
                className={`min-h-[40px] flex-1 rounded-xl font-medium ${
                  diet === k ? 'bg-ink text-cream' : 'bg-sand text-mute'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {rows.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-mute">
              <h3 className="text-base text-ink">No dishes found</h3>
              <span>Try another search or filter.</span>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {rows.map((i) => {
              const header = cat === 'All' && i.cat !== last
              last = i.cat
              const n = cart.qtyOf(i.id)
              return (
                <div key={i.id} className="contents">
                  {header && (
                    <div className="mt-2 font-head text-[13px] uppercase tracking-[0.08em] text-mute">{i.cat}</div>
                  )}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => i.stock && onOpen(i)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && i.stock) {
                        e.preventDefault()
                        onOpen(i)
                      }
                    }}
                    className={`flex w-full gap-3 rounded-[18px] border border-line bg-white p-2.5 text-left ${
                      i.stock ? 'cursor-pointer' : 'cursor-default opacity-55'
                    }`}
                  >
                    <div className="h-[84px] w-[84px] flex-none overflow-hidden rounded-[14px]">
                      <DishArt hue={i.hue} cat={i.cat} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <VegDot veg={i.veg} />
                        {i.name}
                      </div>
                      <p className="line-clamp-2 text-[12.5px] text-mute">{i.desc}</p>
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <span className="font-bold tabular-nums">{fmt(i.price)}</span>
                        {!i.stock ? (
                          <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-mute">
                            Sold out
                          </span>
                        ) : n ? (
                          <span onClick={(e) => e.stopPropagation()}>
                            <Stepper qty={n} onInc={() => cart.inc(i.id)} onDec={() => cart.dec(i.id)} />
                          </span>
                        ) : (
                          <button
                            className="min-h-[36px] rounded-xl border border-brand-600 bg-brand-100 px-4 font-bold text-brand-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              cart.add(i)
                            }}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {cart.count > 0 && (
        <button
          onClick={onGoCart}
          className="mx-3 mt-2 flex min-h-[52px] flex-none items-center justify-between rounded-2xl bg-brand-600 px-[18px] font-bold text-white shadow-card"
          style={{ marginBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
        >
          <span>
            View cart · {cart.count} item{cart.count > 1 ? 's' : ''}
          </span>
          <span className="tabular-nums">{fmt(cart.totals.sub)}</span>
        </button>
      )}
    </>
  )
}
