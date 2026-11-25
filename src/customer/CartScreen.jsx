import { useState } from 'react'
import { useShop } from '../store/shopStore'
import { fmt } from '../lib/format'
import { useT } from '../lib/i18n'
import Stepper from '../components/Stepper'
import { useCart } from './CartContext'
import PhoneHeader from './PhoneHeader'

const TIPS = [0, 5, 10]

export default function CartScreen({ table, onBack, onPay, onHelp }) {
  const t = useT()
  const cart = useCart()
  const { coupons } = useShop()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const { sub, discount, gst, tip, total } = cart.totals

  const apply = () => {
    const c = coupons.find((x) => x.code === code.trim().toUpperCase() && x.active)
    if (!c) {
      setMsg(t('couponBad'))
      return
    }
    if (sub < c.min) {
      setMsg(t('couponMin', { n: fmt(c.min - sub) }))
      return
    }
    cart.setCoupon(c)
    setCode('')
    setMsg('')
  }

  if (!cart.lines.length) {
    return (
      <div className="flex-1">
        <PhoneHeader title={t('yourOrder')} table={table} onBack={onBack} onHelp={onHelp} />
        <div className="flex flex-col items-center gap-3 px-4 py-12 text-center text-mute">
          <h3 className="text-base text-ink">{t('emptyCart')}</h3>
          <span>{t('pickSomething')}</span>
          <button className="btn" onClick={onBack}>
            {t('browse')}
          </button>
        </div>
      </div>
    )
  }

  const belowMin = cart.coupon && sub < cart.coupon.min

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PhoneHeader title={t('yourOrder')} table={table} onBack={onBack} onHelp={onHelp} />
        <div className="flex flex-col gap-3.5 px-4 pb-5 pt-1">
          <div className="card flex flex-col gap-3">
            {cart.lines.map((l) => (
              <div key={l.id} className="flex items-center gap-2.5">
                <div className="min-w-0 flex-1">
                  <b>{l.name}</b>
                  <small className="block text-mute">
                    {fmt(l.price)} {t('each')}
                    {l.note ? ` · ${l.note}` : ''}
                  </small>
                </div>
                <Stepper qty={l.qty} onInc={() => cart.inc(l.id)} onDec={() => cart.dec(l.id)} />
                <b className="min-w-[56px] text-right tabular-nums">{fmt(l.price * l.qty)}</b>
              </div>
            ))}
          </div>

          <label className="flex flex-col gap-1.5 font-semibold">
            {t('kitchenNote')}
            <textarea
              className="input min-h-[64px] resize-y font-normal"
              placeholder={t('kitchenNotePh')}
              value={cart.note}
              onChange={(e) => cart.setNote(e.target.value)}
            />
          </label>

          <div className="card flex flex-col gap-2">
            <b>{t('coupon')}</b>
            {cart.coupon ? (
              <div className="flex items-center justify-between gap-2 rounded-xl bg-ok-soft px-3 py-2 font-semibold text-ok">
                <span>
                  {cart.coupon.code} {t('couponApplied')}
                </span>
                <button className="text-xs underline" onClick={() => cart.setCoupon(null)}>
                  {t('remove')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  className="input min-h-[40px] uppercase"
                  placeholder="WELCOME10"
                  aria-label={t('coupon')}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button className="btn btn-sm min-h-[40px]" onClick={apply}>
                  {t('apply')}
                </button>
              </div>
            )}
            {msg && <span className="text-[12.5px] font-medium text-bad">{msg}</span>}
            {belowMin && (
              <span className="text-[12.5px] font-medium text-warn">
                {t('couponMin', { n: fmt(cart.coupon.min - sub) })}
              </span>
            )}
          </div>

          <div className="card flex flex-col gap-2">
            <b>{t('tip')}</b>
            <div className="flex gap-2">
              {TIPS.map((p) => (
                <button
                  key={p}
                  onClick={() => cart.setTipPct(p)}
                  className={`min-h-[40px] flex-1 rounded-xl font-semibold ${
                    cart.tipPct === p ? 'bg-ink text-cream' : 'bg-sand text-mute'
                  }`}
                >
                  {p === 0 ? t('none') : `${p}%`}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between py-0.5 text-mute">
              <span>{t('subtotal')}</span>
              <span className="tabular-nums">{fmt(sub)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-0.5 text-ok">
                <span>{t('discount')}</span>
                <span className="tabular-nums">−{fmt(discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-0.5 text-mute">
              <span>{t('gst')}</span>
              <span className="tabular-nums">{fmt(gst)}</span>
            </div>
            {tip > 0 && (
              <div className="flex justify-between py-0.5 text-mute">
                <span>{t('tip')}</span>
                <span className="tabular-nums">{fmt(tip)}</span>
              </div>
            )}
            <div className="mt-1.5 flex justify-between border-t border-dashed border-line pt-2.5 text-base font-bold">
              <span>{t('total')}</span>
              <span className="tabular-nums">{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex-none border-t border-line bg-cream px-4 pt-3"
        style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button className="btn w-full" onClick={onPay}>
          {t('proceed')} · {fmt(total)}
        </button>
      </div>
    </>
  )
}
