import { Avatar, AvatarFallback } from "@ds/avatar";

/**
 * Phase-B islands for the Avatar documentation page (s-c-avatar).
 * Each export replaces a static CSS-class / inline-hex preview in the Specs tab
 * with the real @amalgama/ds Avatar composite. The brand-gradient fallback comes
 * from the component's own `bg-primary text-on-primary` tokens — no raw hex.
 */

// Specs > Avatar principal (32px) — topbar / app shell context.
// 32px maps to the component's `md` size (36px), the documented default.
export function AvatarMainShowcase() {
  return (
    <Avatar size="md">
      <AvatarFallback>MG</AvatarFallback>
    </Avatar>
  );
}

// Specs > Avatares de asignado (22px) — assignees in vacancy cards.
// 22px maps to the component's `sm` size (28px), the smallest documented step.
// The four legacy color variants collapse to the single tokenized brand
// gradient: per the DS, the .blue/.green/.purple hardcoded steps are a known gap,
// so the real component renders all assignees with the brand fallback.
export function AvatarAssigneeShowcase() {
  const initials = ["CL", "MG", "AP", "JR"];
  return (
    <div className="flex items-center gap-2">
      {initials.map((i) => (
        <Avatar key={i} size="sm">
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}

// Specs > Avatar de persona (44px) — person cards and profiles.
// 44px maps exactly to the component's `lg` size. Replaces the inline-hex
// gradient divs (#4F80FF/#00c164/#8b5cf6 …) with the tokenized fallback.
export function AvatarPersonShowcase() {
  const initials = ["MG", "CL", "AM"];
  return (
    <div className="flex items-center gap-3">
      {initials.map((i) => (
        <Avatar key={i} size="lg">
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
