import * as React from "react"
import { cn } from "../lib/utils"
import { useToasts, dismissToast } from "../lib/use-toast"

/**
 * Renders the active toast() queue as a stack of .snackbar inside
 * .snackbar-viewport (column-reverse — newest at the bottom, older ones
 * stack above with no per-index offset math needed).
 */
export function Toaster() {
  const items = useToasts()
  if (items.length === 0) return null
  return (
    <div className="snackbar-viewport">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn("snackbar", t.multiline && "snackbar--multiline", t.exiting && "snackbar--exit")}
          role="status"
          aria-live="polite"
        >
          <span className="snackbar-message">{t.message}</span>
          {t.action && (
            <button className="snackbar-action" onClick={t.action.onClick}>
              {t.action.label}
            </button>
          )}
          <button className="snackbar-close" aria-label="Cerrar" onClick={() => dismissToast(t.id)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
