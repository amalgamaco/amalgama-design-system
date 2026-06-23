import { SearchBar, SearchBarTrailing } from "../components/ui/search"

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="9" y1="22" x2="15" y2="22" />
    </svg>
  )
}

export function SearchShowcase() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SearchBar
        placeholder="Buscar vacantes, personas, empresas…"
        trailing={
          <SearchBarTrailing aria-label="Búsqueda por voz">
            <MicIcon />
          </SearchBarTrailing>
        }
      />
      <SearchBar placeholder="Sin ícono trailing" />
    </div>
  )
}
