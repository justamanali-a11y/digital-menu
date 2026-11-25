import { useState } from 'react'
import { actions, useShop } from '../store/shopStore'
import { fmt } from '../lib/format'
import { useT } from '../lib/i18n'
import PhoneHeader from './PhoneHeader'

const STEP = { new: 0, preparing: 1, ready: 2, served: 2 }
const ETA = { new: '15 to 20 min', preparing: '8 to 12 min', ready: 'Ready now', served: 'Done' }
const NAMES = ['received', 'preparing', 'ready']

function Feedback({ order }) {
  const t = useT()
  const { feedback } = useShop()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const done = feedback.some((f) => f.orderId === order.id)

  if (done) {
    return (
      <div className="card text-center font-semibold text-ok">{t('thanksFb')}</div>
    )
  }
  return (
    <div className="card flex flex-col gap-2.5">
      <b>{t('rate')}</b>
      <div className="flex gap-1.5" role="radiogroup" aria-label={t('rate')}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} / 5`}
            onClick={() => setRating(n)}
            className={`h-11 flex-1 rounded-xl text-xl ${n <= rating ? 'bg-brand-100 text-brand-600' : 'bg-sand text-mute'}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="input min-h-[64px] resize-y"
        placeholder={t('comment')}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        className="btn btn-sm"
        disabled={!rating}
        onClick={() => actions.addFeedback({ orderId: order.id, table: order.table, rating, comment })}
      >
        {t('submit')}
      </button>
    </div>
  )
}

export default function StatusScreen({ orderId, onMore, onHelp }) {
  const t = useT()
  const { orders } = useShop()
  const o = orders.find((x) => x.id === orderId)
  if (!o) return null
  const rejected = o.status === 'rejected'
  const idx = STEP[o.status]

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PhoneHeader title={`${t('order')} #${o.id}`} table={o.table} onHelp={onHelp} />

      <div className="flex flex-col gap-3.5 px-4 pb-5 pt-1">
        <div className="flex flex-col items-center gap-1.5 px-2 pt-3 text-center">
          <div
            className={`grid h-14 w-14 place-items-center rounded-full text-3xl font-bold ${
              rejected ? 'bg-warn-soft text-bad' : 'bg-ok-soft text-ok'
            }`}
          >
            {rejected ? '!' : '✓'}
          </div>
          <h1 className="text-2xl font-semibold leading-tight">{rejected ? t('declined') : t('thanks')}</h1>
          <span className="text-[12.5px] text-mute">{t('msg.' + o.status)}</span>
        </div>

        {rejected ? (
          <div className="card flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-mute">{t('reason')}</span>
              <b>{o.rejectReason}</b>
            </div>
            {o.pay === 'upi' && <p className="text-[12.5px] font-medium text-ok">{t('refundNote')}</p>}
          </div>
        ) : (
          <div className="card">
            <div className="my-2 flex items-start">
              {NAMES.map((n, i) => {
                const active = i <= idx
                return (
                  <div
                    key={n}
                    className={`relative flex flex-1 flex-col items-center gap-1.5 text-center text-xs ${
                      active ? 'font-bold text-ink' : 'font-medium text-mute'
                    }`}
                  >
                    {i > 0 && (
                      <span
                        className={`absolute right-1/2 top-[15px] h-[3px] w-full ${i <= idx ? 'bg-brand-600' : 'bg-line'}`}
                      />
                    )}
                    <span
                      className={`relative z-[1] grid h-8 w-8 place-items-center rounded-full border-2 font-bold ${
                        active ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-sand'
                      }`}
                    >
                      {active ? '✓' : ''}
                    </span>
                    {t(n)}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between py-0.5 text-mute">
              <span>{t('eta')}</span>
              <b className="tabular-nums text-ink">{ETA[o.status]}</b>
            </div>
            <div className="flex justify-between py-0.5 text-mute">
              <span>{t('payment2')}</span>
              <b className="text-ink">{o.pay === 'upi' ? t('paidUpi') : t('payCounter')}</b>
            </div>
          </div>
        )}

        <div className="card">
          <b>{t('summary')}</b>
          <div className="mt-2">
            {o.lines.map((l) => (
              <div key={l.id} className="flex justify-between py-0.5">
                <span>
                  {l.qty} × {l.name}
                </span>
                <span className="tabular-nums">{fmt(l.qty * l.price)}</span>
              </div>
            ))}
            {o.discount > 0 && (
              <div className="flex justify-between py-0.5 text-ok">
                <span>
                  {t('discount')} {o.couponCode && `(${o.couponCode})`}
                </span>
                <span className="tabular-nums">−{fmt(o.discount)}</span>
              </div>
            )}
            {o.tip > 0 && (
              <div className="flex justify-between py-0.5 text-mute">
                <span>{t('tip')}</span>
                <span className="tabular-nums">{fmt(o.tip)}</span>
              </div>
            )}
            <div className="mt-1.5 flex justify-between border-t border-dashed border-line pt-2.5 text-base font-bold">
              <span>{t('total')}</span>
              <span className="tabular-nums">{fmt(o.total)}</span>
            </div>
          </div>
        </div>

        {o.status === 'served' && <Feedback order={o} />}

        <button className="btn btn-line w-full" onClick={onMore}>
          {rejected ? t('orderAgain') : t('orderMore')}
        </button>
      </div>
    </div>
  )
}
