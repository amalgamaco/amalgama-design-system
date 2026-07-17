import * as React from "react"

/**
 * Minimal toast stacking queue — no external store library (no zustand,
 * no sonner). A module-level array + pub-sub listener set, matching the
 * "swipe-to-dismiss out of scope, click/timeout dismiss is enough"
 * simplification agreed for the Hard-bucket revert.
 */

export interface ToastOptions {
  action?: { label: string; onClick: () => void }
  duration?: number
  multiline?: boolean
}

export interface ToastItem extends ToastOptions {
  id: number
  message: string
  exiting?: boolean
}

const EXIT_DURATION_MS = 200
const DEFAULT_DURATION_MS = 4000

let toasts: ToastItem[] = []
let idSeq = 0
const listeners = new Set<(toasts: ToastItem[]) => void>()

function emit() {
  listeners.forEach((listener) => listener(toasts))
}

function dismiss(id: number) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, exiting: true } : t))
  emit()
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    emit()
  }, EXIT_DURATION_MS)
}

export function toast(message: string, options: ToastOptions = {}) {
  const id = ++idSeq
  toasts = [...toasts, { id, message, ...options }]
  emit()
  window.setTimeout(() => dismiss(id), options.duration ?? DEFAULT_DURATION_MS)
  return id
}

export function dismissToast(id: number) {
  dismiss(id)
}

export function useToasts() {
  const [state, setState] = React.useState<ToastItem[]>(toasts)
  React.useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])
  return state
}
