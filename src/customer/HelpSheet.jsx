import { actions, useShop } from '../store/shopStore'
import { toast } from '../lib/toast'
import { useT } from '../lib/i18n'

const ACTIONS = [
  { type: 'waiter', key: 'callWaiter' },
  { type: 'bill', key: 'reqBill' },
  { type: 'water', key: 'water' },
]

// Bottom sheet where a guest calls the waiter, asks for the bill or asks for water.
export default function HelpSheet({ table, onClose }) {
  const t = useT()
  const { requests } = useShop()

  const send = (type) => {
    const ok = actions.requestService(table, type)
    toast(ok ? t('requestSent') : t('alreadyAsked'))
    onClose()
  }

  return (
    <>
      <div className="absolute inset-0 z-[5] bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-label={t('helpTitle')}
        className="absolute inset-x-0 bottom-0 z-[6] rounded-t-[26px] bg-cream p-4"
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('helpTitle')}</h2>
          <button onClick={onClose} aria-label="Close" className="h-9 w-9 rounded-xl border border-line bg-white">
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {ACTIONS.map((a) => {
            const pending = requests.some((r) => r.table === table && r.type === a.type && !r.done)
            return (
              <button
                key={a.type}
                onClick={() => send(a.type)}
                className="flex min-h-[52px] items-center justify-between rounded-2xl border border-line bg-white px-4 text-left font-semibold"
              >
                {t(a.key)}
                {pending && <span className="text-xs font-medium text-warn">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
