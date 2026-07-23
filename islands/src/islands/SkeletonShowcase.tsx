import { Skeleton } from "@ds/skeleton"

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
      <div className="flex items-center gap-3 mt-4">
        <Skeleton variant="circle" />
        <div className="flex-1">
          <Skeleton variant="text" style={{ width: "50%" }} />
          <Skeleton variant="text" style={{ width: "80%", marginTop: 6 }} />
        </div>
      </div>
    </div>
  )
}
