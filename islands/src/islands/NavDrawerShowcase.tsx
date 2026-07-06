import { useState } from "react"

/**
 * Navigation Drawer — the ONE canonical drawer used across Overview, Specs and
 * Guidelines. Icons + labels + optional count badge + section titles, styled with
 * the shared Embassy navigation tokens (--color-nav-*): blue hover, secondary-
 * container selected, focus ring, disabled at 40%. Clicking an item selects it.
 */
type SvgProps = React.SVGProps<SVGSVGElement>
const IconDashboard = (p: SvgProps) => (<svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>)
const IconVacancies = (p: SvgProps) => (<svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>)
const IconCandidates = (p: SvgProps) => (<svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>)
const IconPeople = (p: SvgProps) => (<svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>)
const IconTeams = (p: SvgProps) => (<svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>)
const IconReports = (p: SvgProps) => (<svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...p}><path d="M3 3v18h18" /><path d="M18 17V9M13 17V5M8 17v-3" /></svg>)

type Item = { label: string; Icon: (p: SvgProps) => JSX.Element; count?: number; disabled?: boolean }
const SECTIONS: { title: string; items: Item[] }[] = [
  { title: "Reclutamiento", items: [
    { label: "Dashboard", Icon: IconDashboard },
    { label: "Vacantes", Icon: IconVacancies, count: 12 },
    { label: "Candidatos", Icon: IconCandidates },
  ] },
  { title: "Organización", items: [
    { label: "People", Icon: IconPeople },
    { label: "Equipos", Icon: IconTeams },
    { label: "Reportes", Icon: IconReports, disabled: true },
  ] },
]

export function NavDrawerShowcase() {
  const [active, setActive] = useState("Dashboard")
  return (
    <div className="w-[220px] overflow-hidden rounded-lg border border-outline-variant bg-surface-container py-1 font-body">
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            {section.title}
          </div>
          <div className="flex flex-col gap-0.5 px-2 pb-2">
            {section.items.map(({ label, Icon, count, disabled }) => {
              const isActive = active === label
              const cls =
                "group flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-[13px] outline-none transition-colors [&_svg]:size-3.5 [&_svg]:shrink-0 focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus-ring)] disabled:pointer-events-none disabled:opacity-40 " +
                (isActive
                  ? "bg-[var(--color-nav-selected)] font-semibold text-[var(--color-nav-selected-content)]"
                  : "text-on-surface-variant hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-hover-content)]")
              return (
                <button
                  key={label}
                  type="button"
                  disabled={disabled}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActive(label)}
                  className={cls}
                >
                  <Icon aria-hidden="true" />
                  <span className="truncate">{label}</span>
                  {count != null && (
                    <span className="ml-auto rounded-full bg-[var(--color-secondary-container)] px-1.5 text-[11px] font-semibold text-[var(--color-on-secondary-container)]">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
