export default function VegDot({ veg }) {
  return (
    <span
      title={veg ? 'Veg' : 'Non-veg'}
      className={`inline-grid h-3.5 w-3.5 flex-none place-items-center rounded-[3px] border-[1.5px] border-current ${
        veg ? 'text-ok' : 'text-bad'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  )
}
