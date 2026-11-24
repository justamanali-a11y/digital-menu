export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-[26px] w-[46px] flex-none rounded-full transition-colors ${checked ? 'bg-ok' : 'bg-line'}`}
    >
      <span
        className={`absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  )
}
