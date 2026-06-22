import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@embassy/ui'
import { COMPONENT_SECTIONS, CATEGORY_ORDER, FOUNDATION_SECTIONS, type SectionMeta } from '../lib/sections'

export function Shell() {
  const { theme, toggle } = useTheme()
  const loc = useLocation()
  const current = [...FOUNDATION_SECTIONS, ...COMPONENT_SECTIONS].find((s) => s.path === loc.pathname)

  const byCategory: { cat: string; items: SectionMeta[] }[] = [
    { cat: 'Foundations', items: FOUNDATION_SECTIONS },
    ...CATEGORY_ORDER.map((cat) => ({ cat, items: COMPONENT_SECTIONS.filter((s) => s.category === cat) })),
  ].filter((g) => g.items.length)

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-[var(--color-surface-container-low)] sticky top-0 h-screen overflow-y-auto px-4 py-6">
        <div className="px-2 mb-6 font-[var(--font-heading)] font-extrabold text-lg">Embassy</div>
        <nav className="flex flex-col gap-5">
          {byCategory.map((g) => (
            <div key={g.cat}>
              <div className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{g.cat}</div>
              {g.items.map((s) => (
                <NavLink
                  key={s.id}
                  to={s.path}
                  className={({ isActive }) =>
                    `block rounded-md px-2 py-1.5 text-sm transition-colors ${
                      isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`
                  }
                >
                  {s.title}
                  {s.status === 'todo' && <span className="ml-2 text-[10px] uppercase tracking-wide opacity-50">soon</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/90 backdrop-blur z-10">
          <div className="text-sm text-muted-foreground">
            Embassy <span className="opacity-50">/</span> {current?.title ?? 'Components'}
          </div>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex items-center gap-2 rounded-md border border-input px-3 h-8 text-sm text-foreground hover:bg-accent transition-colors"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </header>
        <main className="flex-1 px-8 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
