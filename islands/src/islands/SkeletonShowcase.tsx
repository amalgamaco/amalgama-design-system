import { Skeleton } from "../components/ui/skeleton"

export function SkeletonShowcase() {
  return (
    <div className="max-w-[360px] p-4 bg-card border border-border rounded-lg">
      <Skeleton variant="title" />
      <Skeleton variant="text" style={{ width: "100%" }} />
      <Skeleton variant="text" style={{ width: "85%" }} />
      <Skeleton variant="text" style={{ width: "70%" }} />
      <div className="mt-4">
        <Skeleton variant="card" style={{ width: "100%" }} />
      </div>
    </div>
  )
}
