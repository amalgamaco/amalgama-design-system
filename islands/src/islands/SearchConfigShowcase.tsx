import { SearchBar, SearchBarTrailing, SearchBarAvatar } from "@ds/search"
import { Mic, Search, MoreVertical } from "lucide-react"

// Specs › Configuraciones — the four search-bar configurations, rendered with the
// REAL @amalgama/ds SearchBar (was static SVG mockups).

export function SearchConfigBar() {
  return <SearchBar placeholder="Buscar vacantes..." />
}

export function SearchConfigTrailing() {
  return (
    <SearchBar
      placeholder="Buscar vacantes..."
      trailing={<SearchBarTrailing aria-label="Búsqueda por voz"><Mic /></SearchBarTrailing>}
    />
  )
}

export function SearchConfigMulti() {
  return (
    <SearchBar
      placeholder="Buscar vacantes..."
      trailing={
        <>
          <SearchBarTrailing aria-label="Buscar"><Search /></SearchBarTrailing>
          <SearchBarTrailing aria-label="Más opciones"><MoreVertical /></SearchBarTrailing>
        </>
      }
    />
  )
}

export function SearchConfigAvatar() {
  return (
    <SearchBar
      placeholder="Buscar vacantes..."
      trailing={<SearchBarAvatar>AV</SearchBarAvatar>}
    />
  )
}
