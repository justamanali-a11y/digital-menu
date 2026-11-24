export default function Stepper({ qty, onInc, onDec, big = false }) {
  const btn = big ? 'h-11 w-11' : 'h-9 w-[34px]'
  return (
    <span className="inline-flex items-center overflow-hidden rounded-xl bg-brand-600 text-white">
      <button type="button" className={`${btn} text-lg font-bold`} onClick={onDec} aria-label="Remove one">
        −
      </button>
      <span className="min-w-[22px] text-center font-bold tabular-nums">{qty}</span>
      <button type="button" className={`${btn} text-lg font-bold`} onClick={onInc} aria-label="Add one">
        +
      </button>
    </span>
  )
}
