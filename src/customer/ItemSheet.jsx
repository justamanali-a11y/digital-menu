import { useState } from 'react'
import { fmt } from '../lib/format'
import { useT } from '../lib/i18n'
import DishArt from '../components/DishArt'
import VegDot from '../components/VegDot'
import Stepper from '../components/Stepper'
import { TAG_STYLE } from './MenuScreen'

export default function ItemSheet({ item, onClose, onAdd }) {
  const t = useT()
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')

  return (
    <>
      <div className="absolute inset-0 z-[5] bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-label={item.name}
        className="absolute inset-x-0 bottom-0 z-[6] max-h-[92%] overflow-y-auto rounded-t-[26px] bg-cream"
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="h-[190px]">
          <DishArt hue={item.hue} cat={item.cat} />
        </div>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[22px] font-semibold">{item.name}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="h-9 w-9 flex-none rounded-xl border border-line bg-white"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-mute">
            <VegDot veg={item.veg} />
            {item.veg ? t('vegetarian') : t('nonVegetarian')} · {t('cat.' + item.cat)}
            {(item.tags || []).map((tag) => (
              <span key={tag} className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${TAG_STYLE[tag]}`}>
                {t(tag)}
              </span>
            ))}
          </div>
          {item.spice > 0 && (
            <div className="flex items-center gap-2 text-[13px] text-mute">
              {t('spice')}
              <span className="flex gap-1" aria-label={`${item.spice} of 3`}>
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={`h-2.5 w-2.5 rounded-full ${n <= item.spice ? 'bg-bad' : 'bg-line'}`}
                  />
                ))}
              </span>
            </div>
          )}
          <p>{item.desc}</p>
          <label className="flex flex-col gap-1.5 font-semibold">
            {t('note')}
            <textarea
              className="input min-h-[64px] resize-y font-normal"
              placeholder={t('notePh')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <div className="flex items-center gap-3">
            <Stepper big qty={qty} onInc={() => setQty(qty + 1)} onDec={() => setQty(Math.max(1, qty - 1))} />
            <button className="btn flex-1" onClick={() => onAdd(qty, note.trim())}>
              {t('addToCart')} · {fmt(item.price * qty)}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
