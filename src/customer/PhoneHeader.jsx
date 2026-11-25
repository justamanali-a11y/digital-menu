import { toggleLang, useLang, useT } from '../lib/i18n'

// Header used on every customer screen: back or logo, title, language switch, help, table badge.
export default function PhoneHeader({ title, table, onBack, onHelp }) {
  const t = useT()
  const lang = useLang()
  return (
    <div className="flex items-center gap-2 px-4 pb-2 pt-3.5">
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Back"
          className="h-9 w-9 flex-none rounded-xl border border-line bg-white"
        >
          ←
        </button>
      ) : (
        <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-brand-600 font-head text-[13px] font-bold text-white">
          SR
        </span>
      )}
      <div className="min-w-0 flex-1 truncate font-head text-base font-semibold">{title}</div>
      <button
        onClick={toggleLang}
        aria-label="Change language"
        className="h-9 min-w-9 flex-none rounded-xl border border-line bg-white px-2 text-xs font-bold"
      >
        {lang === 'en' ? 'हि' : 'EN'}
      </button>
      {onHelp && (
        <button
          onClick={onHelp}
          className="h-9 flex-none rounded-xl border border-line bg-white px-2.5 text-xs font-bold"
        >
          {t('help')}
        </button>
      )}
      <span className="whitespace-nowrap rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-600">
        {t('table')} {table}
      </span>
    </div>
  )
}
