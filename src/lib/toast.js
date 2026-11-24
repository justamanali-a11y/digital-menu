import { useSyncExternalStore } from 'react'

// Tiny global toast: call toast('message') from anywhere, <ToastHost /> shows it.
let message = ''
let timer
const listeners = new Set()

export function toast(text) {
  message = text
  listeners.forEach((l) => l())
  clearTimeout(timer)
  timer = setTimeout(() => {
    message = ''
    listeners.forEach((l) => l())
  }, 3500)
}

export function useToast() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => message
  )
}

export function beep() {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)()
    const o = a.createOscillator()
    const g = a.createGain()
    o.connect(g)
    g.connect(a.destination)
    o.frequency.value = 880
    g.gain.setValueAtTime(0.001, a.currentTime)
    g.gain.exponentialRampToValueAtTime(0.2, a.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.4)
    o.start()
    o.stop(a.currentTime + 0.45)
  } catch {
    /* sound can be blocked until the user interacts with the page */
  }
}
