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
 * Shared: circular icon-button that sits in a .search-row.
 * There is no React wrapper shipped for `.search-icon-btn`
 * (Search is a CSS-class component family), so the canonical
 * DS class is the real component for this element.
 * ──────────────────────────────────────────────────────────── */

function SearchIconBtn({
  label,
  active = false,
  children,
}: {
  label: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      className={active ? "search-icon-btn active" : "search-icon-btn"}
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
      <div className="search-row">
        <SearchBar placeholder="Buscar vacantes..." aria-label="Buscar vacantes" />
        <SearchIconBtn label="Filtros">
          <FilterIcon />
        </SearchIconBtn>
      </div>

      {/* Search + Filtro + Ordenar */}
      <div className="search-row">
        <SearchBar placeholder="Buscar vacantes..." aria-label="Buscar vacantes" />
        <SearchIconBtn label="Filtros">
          <FilterIcon />
        </SearchIconBtn>
        <SearchIconBtn label="Ordenar">
          <SortIcon />
        </SearchIconBtn>
      </div>

      {/* Full row with active filter + Ordenar + Vista */}
      <div className="search-row">
        <SearchBar placeholder="Buscar vacantes..." aria-label="Buscar vacantes" />
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
    <div className="search-row">
      <SearchBar placeholder="Buscar..." aria-label="Buscar" />
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
    <div className="search-row">
      <SearchBar placeholder="Buscar candidatos" aria-label="Buscar candidatos" />
      <SearchIconBtn label="Filtros" active>
        <FilterIcon />
      </SearchIconBtn>
      <SearchIconBtn label="Ordenar">
        <SortIcon />
      </SearchIconBtn>
    </div>
  )
}
