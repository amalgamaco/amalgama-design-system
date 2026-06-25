import { Skeleton } from "@ds/skeleton"

// Specs tab — "Variantes": all three skeleton variants rendered via the real
// @ds Skeleton component (title, three text lines at 100%/85%/70%, two cards).
export function SkeletonSpecsVariants() {
  return (
    <div className="max-w-[400px]">
      <Skeleton variant="title" />
      <Skeleton variant="text" style={{ width: "100%" }} />
      <Skeleton variant="text" style={{ width: "85%" }} />
      <Skeleton variant="text" style={{ width: "70%" }} />
      <div className="mt-4" />
      <Skeleton variant="card" />
      <Skeleton variant="card" />
    </div>
  )
}
