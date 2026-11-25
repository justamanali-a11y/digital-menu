import { useState } from 'react'
import { actions, useShop } from '../store/shopStore'
import { toast } from '../lib/toast'
import { fmt } from '../lib/format'
import Switch from '../components/Switch'

export default function Offers() {
  const { coupons } = useShop()
  const [f, setF] = useState({ code: '', type: 'percent', value: '', min: '' })

  const save = () => {
    const value = Math.round(Number(f.value))
    const min = Math.round(Number(f.min)) || 0
    if (!f.code.trim() || !(value > 0) || (f.type === 'percent' && value > 100)) {
      toast('Enter a code and a valid discount')
      return
    }
    if (!actions.addCoupon({ code: f.code, type: f.type, value, min })) {
      toast('That code already exists')
      return
    }
    toast(`${f.code.trim().toUpperCase()} created`)
    setF({ code: '', type: 'percent', value: '', min: '' })
  }

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold">Offers and coupons</h2>
        <span className="text-[12.5px] text-mute">Guests type the code in their cart. Turn a coupon off to stop it working.</span>
      </div>

      <div className="card grid items-end gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1 text-[12.5px] font-medium">
          Code
          <input className="input min-h-[40px] uppercase" placeholder="DIWALI20" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1 text-[12.5px] font-medium">
          Type
          <select className="input min-h-[40px]" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
            <option value="percent">Percent off</option>
            <option value="flat">Flat amount off</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[12.5px] font-medium">
          {f.type === 'percent' ? 'Percent' : 'Amount (₹)'}
          <input className="input min-h-[40px]" type="number" min="1" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1 text-[12.5px] font-medium">
          Minimum order (₹)
          <input className="input min-h-[40px]" type="number" min="0" placeholder="0" value={f.min} onChange={(e) => setF({ ...f, min: e.target.value })} />
        </label>
        <button className="btn" onClick={save}>
          Create coupon
        </button>
      </div>

      <div>
        {coupons.length === 0 && <p className="text-mute">No coupons yet.</p>}
        {coupons.map((c) => (
          <div key={c.code} className="flex flex-wrap items-center gap-3 border-b border-line py-3">
            <div className="min-w-[160px] flex-1">
              <b className="font-head text-base tracking-wide">{c.code}</b>
              <small className="block text-mute">
                {c.type === 'percent' ? `${c.value}% off` : `${fmt(c.value)} off`}
                {c.min > 0 ? ` on orders above ${fmt(c.min)}` : ''}
              </small>
            </div>
            <span className="w-14 text-xs text-mute">{c.active ? 'Active' : 'Off'}</span>
            <Switch checked={c.active} label={`Coupon ${c.code} active`} onChange={() => actions.toggleCoupon(c.code)} />
            <button className="rounded-[11px] border border-line px-3 py-2 font-semibold" onClick={() => actions.deleteCoupon(c.code)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
