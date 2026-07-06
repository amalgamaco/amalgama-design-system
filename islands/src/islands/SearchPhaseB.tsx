import { SearchBar, SearchBarTrailing, SearchBarAvatar } from "@ds/search"

/* ────────────────────────────────────────────────────────────
 * Icons (lucide-style, stroke = currentColor)
 * ──────────────────────────────────────────────────────────── */

function FilterIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 6h18M6 12h12M9 18h6" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────
 * Layout + circular icon-button for a search row.
 * The buildless `.search-row` / `.search-icon-btn` CSS was deleted
 * (2026-06), so the row layout and button styling are expressed
 * with Tailwind utilities resolving to Embassy tokens. In this
 * context the search bar is 40dp tall — the same height as the
 * icon buttons — so they share one horizontal row.
 * ──────────────────────────────────────────────────────────── */

/** Flex row: search bar (grows) + circular action buttons (right). */
const SEARCH_ROW = "flex items-center gap-2 w-full"
/** Search bar sized to the 40dp in-row context. */
const SEARCH_ROW_BAR = "h-10 flex-1 min-w-0"

function SearchIconBtn({
  label,
  active = false,
  children,
}: {
  label: string
  active?: boolean
  children: React.ReactNode
}) {
  const base =
    "inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-full border cursor-pointer transition-[background,color,border-color] duration-fast ease-in-out focus-visible:focus-ring [&_svg]:w-5 [&_svg]:h-5"
  const tone = active
    ? "bg-surface-container-high border-transparent text-on-surface"
    : "bg-surface-container border-border text-on-surface-variant hover:bg-surface-variant hover:text-on-surface active:bg-surface-container-high"
  return (
    <button
      type="button"
      className={`${base} ${tone}`}
      aria-label={label}
      {...(active ? { "aria-pressed": true } : {})}
    >
      {children}
    </button>
  )
}

/* ════════════════════════════════════════════════════════════
 * SPECS · "Search + acciones"  (3 examples → one island)
 * registryKey: search-actions-showcase
 * ════════════════════════════════════════════════════════════ */

export function SearchActionsShowcase() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Search + Filtro */}
      <div className={SEARCH_ROW}>
        <SearchBar placeholder="Buscar vacantes..." aria-label="Buscar vacantes" containerClassName={SEARCH_ROW_BAR} />
        <SearchIconBtn label="Filtros">
          <FilterIcon />
        </SearchIconBtn>
      </div>

      {/* Search + Filtro + Ordenar */}
      <div className={SEARCH_ROW}>
        <SearchBar placeholder="Buscar vacantes..." aria-label="Buscar vacantes" containerClassName={SEARCH_ROW_BAR} />
        <SearchIconBtn label="Filtros">
          <FilterIcon />
        </SearchIconBtn>
        <SearchIconBtn label="Ordenar">
          <SortIcon />
        </SearchIconBtn>
      </div>

      {/* Full row with active filter + Ordenar + Vista */}
      <div className={SEARCH_ROW}>
        <SearchBar placeholder="Buscar vacantes..." aria-label="Buscar vacantes" containerClassName={SEARCH_ROW_BAR} />
        <SearchIconBtn label="Filtros" active>
          <FilterIcon />
        </SearchIconBtn>
        <SearchIconBtn label="Ordenar">
          <SortIcon />
        </SearchIconBtn>
        <SearchIconBtn label="Vista en grilla">
          <GridIcon />
        </SearchIconBtn>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
 * GUIDELINES · Desktop  (search bar + Filtros + Ordenar)
 * registryKey: search-desktop-showcase
 * ════════════════════════════════════════════════════════════ */

export function SearchDesktopShowcase() {
  return (
    <div className={SEARCH_ROW}>
      <SearchBar placeholder="Buscar..." aria-label="Buscar" containerClassName={SEARCH_ROW_BAR} />
      <SearchIconBtn label="Filtros">
        <FilterIcon />
      </SearchIconBtn>
      <SearchIconBtn label="Ordenar">
        <SortIcon />
      </SearchIconBtn>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
 * GUIDELINES · Mobile  (standalone 56px search bar, full width)
 * registryKey: search-bar-mobile-showcase
 * ════════════════════════════════════════════════════════════ */

export function SearchBarMobileShowcase() {
  return (
    <SearchBar
      placeholder="Buscar vacantes..."
      aria-label="Buscar vacantes"
      containerClassName="max-w-full"
    />
  )
}

/* ════════════════════════════════════════════════════════════
 * CODE · live preview — search bar with avatar
 * registryKey: search-bar-showcase
 * ════════════════════════════════════════════════════════════ */

export function SearchBarShowcase() {
  return (
    <SearchBar
      placeholder="Buscar candidatos"
      aria-label="Buscar candidatos"
      trailing={<SearchBarAvatar>AB</SearchBarAvatar>}
    />
  )
}

/* ════════════════════════════════════════════════════════════
 * CODE · live preview — search-row with active filter + Ordenar
 * registryKey: search-actions-code-showcase
 * ════════════════════════════════════════════════════════════ */

export function SearchActionsCodeShowcase() {
  return (
    <div className={SEARCH_ROW}>
      <SearchBar placeholder="Buscar candidatos" aria-label="Buscar candidatos" containerClassName={SEARCH_ROW_BAR} />
      <SearchIconBtn label="Filtros" active>
        <FilterIcon />
      </SearchIconBtn>
      <SearchIconBtn label="Ordenar">
        <SortIcon />
      </SearchIconBtn>
    </div>
  )
}
