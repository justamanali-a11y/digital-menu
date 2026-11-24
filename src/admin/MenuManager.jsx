import { useState } from 'react'
import { CATS } from '../data/menu'
import { actions, useShop } from '../store/shopStore'
import { toast } from '../lib/toast'
import DishArt from '../components/DishArt'
import VegDot from '../components/VegDot'
import Switch from '../components/Switch'

export default function MenuManager() {
  const { items } = useShop()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', cat: CATS[0], veg: true })

  const save = () => {
    const price = Math.round(Number(form.price))
    if (!form.name.trim() || !(price > 0)) {
      toast('Add a dish name and a price')
      return
    }
    actions.addItem({ name: form.name.trim(), price, cat: form.cat, veg: form.veg })
    toast(`${form.name.trim()} added to the menu`)
    setForm({ name: '', price: '', cat: CATS[0], veg: true })
    setOpen(false)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Menu</h2>
          <span className="text-[12.5px] text-mute">
            Turn off a dish and customers see "Sold out" right away.
          </span>
        </div>
        <button className="btn btn-sm" onClick={() => setOpen(!open)}>
          {open ? 'Cancel' : 'Add dish'}
        </button>
      </div>

      {open && (
        <div className="card grid items-end gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1 text-[12.5px] font-medium">
            Name
            <input
              className="input min-h-[40px]"
              placeholder="Dish name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1 text-[12.5px] font-medium">
            Price (₹)
            <input
              className="input min-h-[40px]"
              type="number"
              min="1"
              placeholder="250"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1 text-[12.5px] font-medium">
            Category
            <select
              className="input min-h-[40px]"
              value={form.cat}
              onChange={(e) => setForm({ ...form, cat: e.target.value })}
            >
              {CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[12.5px] font-medium">
            <input type="checkbox" checked={form.veg} onChange={(e) => setForm({ ...form, veg: e.target.checked })} />
            Vegetarian
          </label>
          <button className="btn" onClick={save}>
            Save dish
          </button>
        </div>
      )}

      <div>
        {items.map((i) => (
          <div key={i.id} className="flex flex-wrap items-center gap-3 border-b border-line py-2.5">
            <div className="h-[52px] w-[52px] flex-none overflow-hidden rounded-xl">
              <DishArt hue={i.hue} cat={i.cat} />
            </div>
            <div className="min-w-[140px] flex-1">
              <span className="flex items-center gap-1.5 font-semibold">
                <VegDot veg={i.veg} />
                {i.name}
              </span>
              <small className="text-mute">{i.cat}</small>
            </div>
            <label className="flex items-center gap-1.5">
              ₹
              <input
                type="number"
                min="0"
                aria-label={`Price of ${i.name}`}
                defaultValue={i.price}
                key={i.id + ':' + i.price}
                onBlur={(e) => actions.setPrice(i.id, Math.max(0, Math.round(Number(e.target.value)) || 0))}
                className="min-h-[38px] w-[92px] rounded-[10px] border border-line bg-cream px-2.5 py-1.5 tabular-nums"
              />
            </label>
            <span className="w-[70px] text-xs text-mute">{i.stock ? 'In stock' : 'Sold out'}</span>
            <Switch checked={i.stock} label={`In stock: ${i.name}`} onChange={() => actions.toggleStock(i.id)} />
            <button
              className="rounded-[11px] border border-line px-3 py-2 font-semibold"
              aria-label={`Delete ${i.name}`}
              onClick={() => actions.deleteItem(i.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
