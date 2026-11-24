const KIND = {
  Starters: 'plate',
  'Main Course': 'bowl',
  'Breads & Rice': 'plate',
  Drinks: 'glass',
  Desserts: 'balls',
}

// Placeholder dish illustration. Replace with <img src={item.photoUrl} /> once real photos exist.
export default function DishArt({ hue, cat }) {
  const k = KIND[cat] || 'plate'
  const h = hue
  return (
    <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
      <rect width="80" height="80" fill={`hsl(${h} 65% 88%)`} />
      {k === 'bowl' && (
        <>
          <ellipse cx="40" cy="47" rx="31" ry="22" fill={`hsl(${h} 30% 97%)`} />
          <ellipse cx="40" cy="45" rx="25" ry="16" fill={`hsl(${h} 75% 46%)`} />
          <ellipse cx="40" cy="42" rx="15" ry="7" fill={`hsl(${h} 80% 60%)`} />
          <circle cx="33" cy="41" r="3.2" fill={`hsl(${h} 60% 34%)`} />
          <circle cx="47" cy="44" r="3.6" fill={`hsl(${h} 60% 34%)`} />
        </>
      )}
      {k === 'glass' && (
        <>
          <path d="M26 18h28l-4 44a4 4 0 0 1-4 3H34a4 4 0 0 1-4-3z" fill={`hsl(${h} 30% 97%)`} />
          <path d="M29.5 34h21l-2.4 28H32z" fill={`hsl(${h} 75% 54%)`} />
          <rect x="44" y="8" width="3" height="26" rx="1.5" fill={`hsl(${h} 50% 40%)`} transform="rotate(12 44 8)" />
        </>
      )}
      {k === 'balls' && (
        <>
          <ellipse cx="40" cy="48" rx="30" ry="20" fill={`hsl(${h} 30% 97%)`} />
          <circle cx="31" cy="44" r="10" fill={`hsl(${h} 70% 42%)`} />
          <circle cx="48" cy="46" r="10" fill={`hsl(${h} 70% 46%)`} />
          <circle cx="29" cy="41" r="3" fill={`hsl(${h} 80% 62%)`} />
        </>
      )}
      {k === 'plate' && (
        <>
          <ellipse cx="40" cy="46" rx="31" ry="22" fill={`hsl(${h} 30% 97%)`} />
          <rect x="20" y="36" width="15" height="15" rx="4" fill={`hsl(${h} 75% 50%)`} />
          <rect x="38" y="33" width="15" height="15" rx="4" fill={`hsl(${h} 75% 44%)`} />
          <rect x="45" y="48" width="15" height="12" rx="4" fill={`hsl(${h} 75% 54%)`} />
          <circle cx="28" cy="43" r="2.5" fill={`hsl(${h} 60% 30%)`} />
        </>
      )}
    </svg>
  )
}
