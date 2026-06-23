import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

const people = [
  { initials: "MG", name: "María González" },
  { initials: "CL", name: "Carlos López" },
  { initials: "AM", name: "Ana Martínez" },
  { initials: "JP", name: "Juan Pérez" },
]

export function AvatarShowcase() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p className="text-label text-fg-subtle mb-3">Tamaños</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Avatar size="sm"><AvatarFallback>MG</AvatarFallback></Avatar>
          <Avatar size="md"><AvatarFallback>CL</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback>AM</AvatarFallback></Avatar>
          <Avatar size="xl"><AvatarFallback>JP</AvatarFallback></Avatar>
        </div>
      </div>
      <div>
        <p className="text-label text-fg-subtle mb-3">Con imagen</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Avatar size="lg">
            <AvatarImage src="https://i.pravatar.cc/150?u=mg" alt="María González" />
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>CL</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div>
        <p className="text-label text-fg-subtle mb-3">Grupo</p>
        <div className="flex items-center">
          {people.map((p, i) => (
            <Avatar
              key={p.initials}
              size="md"
              style={{ marginLeft: i === 0 ? 0 : -8, zIndex: people.length - i }}
              className="ring-2 ring-surface"
              title={p.name}
            >
              <AvatarFallback>{p.initials}</AvatarFallback>
            </Avatar>
          ))}
          <span className="ml-2 text-label text-fg-subtle">+4 más</span>
        </div>
      </div>
    </div>
  )
}
