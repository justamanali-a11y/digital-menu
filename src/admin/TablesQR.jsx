import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useShop } from '../store/shopStore'
import { toast } from '../lib/toast'

const TABLES = Array.from({ length: 12 }, (_, i) => i + 1)

// onPreview(table) is optional. In the split demo it switches the phone to that table;
// otherwise the button opens the real customer link in a new tab.
export default function TablesQR({ onPreview }) {
  const { orders } = useShop()
  const [sel, setSel] = useState(5)
  const busy = (t) => orders.some((o) => o.table === t && o.status !== 'served')
  const url = `${window.location.origin}/m?table=${sel}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast('Link copied')
    } catch {
      toast(url)
    }
  }

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold">Tables and QR codes</h2>
        <span className="text-[12.5px] text-mute">
          Print one QR per table. Each code opens the menu with the table number already set.
        </span>
      </div>

      <div className="grid gap-[18px] md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] content-start gap-2.5">
          {TABLES.map((t) => (
            <button
              key={t}
              onClick={() => setSel(t)}
              className={`flex flex-col items-center gap-0.5 rounded-2xl border-[1.5px] px-2 py-3 font-semibold ${
                sel === t ? 'border-brand-600 bg-brand-100' : 'border-transparent bg-sand'
              }`}
            >
              Table {t}
              <small className={busy(t) ? 'font-bold text-warn' : 'font-medium text-mute'}>
                {busy(t) ? 'Active order' : 'Free'}
              </small>
            </button>
          ))}
        </div>

        <div className="card flex flex-col items-center gap-2.5 text-center">
          <b>Table {sel}</b>
          <div className="grid h-[204px] w-[204px] place-items-center rounded-[14px] border border-line bg-white p-3">
            <QRCodeSVG value={url} size={176} bgColor="#ffffff" fgColor="#1a1410" level="M" />
          </div>
          <div className="break-all text-xs text-mute">{url}</div>
          {onPreview ? (
            <button className="btn btn-sm w-full" onClick={() => onPreview(sel)}>
              Preview as customer
            </button>
          ) : (
            <a className="btn btn-sm w-full" href={`/m?table=${sel}`} target="_blank" rel="noreferrer">
              Open customer view
            </a>
          )}
          <button className="btn btn-sm btn-line w-full" onClick={copy}>
            Copy link
          </button>
          <span className="text-[12.5px] text-mute">Print-ready sticker sheets come in the full build.</span>
        </div>
      </div>
    </>
  )
}
