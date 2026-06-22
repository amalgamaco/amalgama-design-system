import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@embassy/ui'

// Canonical Overview structure (badge → title → subtitle → tabs → bullets →
// single-mode variant showcase → numbered references) shared by every page.

export function ComponentPage(props: {
  category: string
  title: string
  subtitle: string
  overview: React.ReactNode
  guidelines?: React.ReactNode
  accessibility?: React.ReactNode
  code?: React.ReactNode
}) {
  return (
    <article style={{ maxWidth: 820 }}>
      <p className="font-[var(--font-body)] text-xs font-semibold tracking-[0.1em] uppercase text-secondary mb-3">
        Components · {props.category}
      </p>
      <h1 className="font-[var(--font-heading)] text-4xl font-extrabold text-foreground leading-tight m-0">{props.title}</h1>
      <p className="mt-4 mb-8 text-base leading-relaxed text-muted-foreground max-w-[60ch]">{props.subtitle}</p>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {props.guidelines && <TabsTrigger value="guidelines">Guidelines</TabsTrigger>}
          {props.accessibility && <TabsTrigger value="accessibility">Accessibility</TabsTrigger>}
          {props.code && <TabsTrigger value="code">Code</TabsTrigger>}
        </TabsList>
        <TabsContent value="overview">{props.overview}</TabsContent>
        {props.guidelines && <TabsContent value="guidelines">{props.guidelines}</TabsContent>}
        {props.accessibility && <TabsContent value="accessibility">{props.accessibility}</TabsContent>}
        {props.code && <TabsContent value="code">{props.code}</TabsContent>}
      </Tabs>
    </article>
  )
}

// ── Shared Overview building blocks ──────────────────────────────

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="my-0 mb-8 pl-5 text-sm leading-loose text-muted-foreground [&_b]:text-foreground [&_b]:font-semibold list-disc">
      {items.map((it, i) => <li key={i} className="pl-1">{it}</li>)}
    </ul>
  )
}

export function Showcase({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-border bg-[var(--color-surface-container-low)] p-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
      {children}
    </div>
  )
}

export function References({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-5 list-none p-0 flex flex-col gap-2.5 [counter-reset:ref]">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground [&_b]:text-foreground [&_b]:font-semibold">
          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-muted-foreground text-[11px] font-semibold text-muted-foreground">{i + 1}</span>
          {it}
        </li>
      ))}
    </ol>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-foreground mt-0 mb-4">{children}</h2>
}

export function DoDont({ doItems, dontItems }: { doItems: React.ReactNode[]; dontItems: React.ReactNode[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-[12px] border border-border overflow-hidden">
        <div className="px-4 py-2.5 text-sm font-semibold text-[var(--color-on-success-container)] bg-[var(--color-success-container)]">✓ Usar</div>
        <ul className="m-0 p-4 pl-8 list-disc text-sm leading-loose text-muted-foreground [&_b]:text-foreground">{doItems.map((d, i) => <li key={i}>{d}</li>)}</ul>
      </div>
      <div className="rounded-[12px] border border-border overflow-hidden">
        <div className="px-4 py-2.5 text-sm font-semibold text-[var(--color-on-error-container)] bg-[var(--color-error-container)]">✕ No usar</div>
        <ul className="m-0 p-4 pl-8 list-disc text-sm leading-loose text-muted-foreground [&_b]:text-foreground">{dontItems.map((d, i) => <li key={i}>{d}</li>)}</ul>
      </div>
    </div>
  )
}

export function A11yList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="m-0 p-0 list-none flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground [&_code]:text-foreground">
      {items.map((it, i) => <li key={i} className="flex gap-2.5"><span aria-hidden>♿</span><span>{it}</span></li>)}
    </ul>
  )
}

export function Code({ children }: { children: string }) {
  return (
    <pre className="rounded-[12px] border border-border bg-[var(--color-surface-container-low)] p-5 overflow-x-auto text-[13px] leading-relaxed text-foreground font-[var(--font-mono)]">
      <code>{children}</code>
    </pre>
  )
}
