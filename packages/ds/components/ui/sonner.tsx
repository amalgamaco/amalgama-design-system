import { Toaster as SonnerToaster, toast } from "sonner"

// shadcn's Sonner wrapper, themed to the Embassy Snackbar spec: inverse-surface
// background + inverse-on-surface text (auto-flips per [data-theme]), the action
// rendered as inverse-primary text (matching the "DESHACER" pattern), radius-sm.
export function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: "var(--color-inverse-surface)",
          color: "var(--color-inverse-on-surface)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-body)",
          fontSize: "13.5px",
          boxShadow: "var(--shadow-lg, 0 4px 16px rgba(0,0,0,.24))",
        },
      }}
      {...props}
    />
  )
}

export { toast }
