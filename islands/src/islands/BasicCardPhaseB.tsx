// BasicCardPhaseB — Phase B islandization for the "s-c-basic-card" doc page.
//
// Outcome: NO conversions.
//
// The Basic Card page documents the INLINE `.nav-card` / `.nav-card--compact`
// CSS system (defined inline in index.html). That pattern has no dedicated
// @amalgama/ds package component — the package's generic `Card`
// (bg-card / border / rounded-lg) does NOT reproduce the nav-card anatomy
// (tag + arrow-btn + title + desc), so substituting it would change what the
// page teaches. Per the workflow rule, when a page has no real package
// component for its documented pattern, return empty islands rather than
// invent one.
//
// The page's Overview live example already renders through the existing
// `card-showcase` island (data-island="card-showcase"), wired by the
// orchestrator — not this file.
//
// The single audit-flagged CSS-class block (the Specs "Anatomía" figure,
// a `.nav-card--compact` render paired with the numbered props table) is a
// labeled anatomy/teaching diagram and is explicitly out of scope for
// islandization. It is intentionally left untouched.
//
// No exports: there are no example blocks to mount on this page.

export {}
