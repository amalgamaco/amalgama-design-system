import { Toaster as Sonner, type ToasterProps } from "sonner"

// Sonner toaster themed with Embassy inverse-surface tokens — fills the
// Snackbar gap @material/web never shipped.
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      style={
        {
          "--normal-bg": "var(--color-inverse-surface)",
          "--normal-text": "var(--color-inverse-on-surface)",
          "--normal-border": "transparent",
          "--border-radius": "var(--radius-sm)",
          fontFamily: "var(--font-body)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { toast } from "sonner"
