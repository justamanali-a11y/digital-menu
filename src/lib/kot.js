const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// Opens a small print window with the kitchen order ticket. Returns false if the browser blocked the window.
export function printKOT(o) {
  const w = window.open('', '_blank', 'width=380,height=600')
  if (!w) return false
  const time = new Date(o.t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const lines = o.lines
    .map((l) => `<li><b>${l.qty} x</b> ${esc(l.name)}${l.note ? `<br><i>${esc(l.note)}</i>` : ''}</li>`)
    .join('')
  w.document.write(
    `<!doctype html><html><head><title>KOT #${o.id}</title><style>
      body{font:15px monospace;padding:14px;max-width:320px}
      h1{font-size:20px;margin:0 0 4px}
      hr{border:0;border-top:1px dashed #000;margin:10px 0}
      ul{list-style:none;padding:0;margin:0}li{margin:7px 0}
    </style></head><body>
      <h1>KOT #${o.id}</h1>
      <div>Table ${o.table} &nbsp; ${time}</div><hr>
      <ul>${lines}</ul>
      ${o.note ? `<hr><div><b>Note:</b> ${esc(o.note)}</div>` : ''}
    </body></html>`
  )
  w.document.close()
  w.focus()
  w.print()
  return true
}
