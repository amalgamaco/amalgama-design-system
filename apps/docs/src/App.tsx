import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { TooltipProvider, Toaster } from '@embassy/ui'
import { Shell } from './components/Shell'
import { ButtonPage } from './pages/ButtonPage'
import { SwitchPage } from './pages/SwitchPage'
import { SelectPage } from './pages/SelectPage'
import { CheckboxPage } from './pages/CheckboxPage'
import { RadioPage } from './pages/RadioPage'
import { InputPage } from './pages/InputPage'
import { BadgePage } from './pages/BadgePage'
import { TabsPage } from './pages/TabsPage'
import { DialogPage } from './pages/DialogPage'
import { TooltipPage } from './pages/TooltipPage'
import { ChipPage } from './pages/ChipPage'
import { SegmentedButtonPage } from './pages/SegmentedButtonPage'
import { CardPage } from './pages/CardPage'
import { SnackbarPage } from './pages/SnackbarPage'
import { SkeletonPage } from './pages/SkeletonPage'
import { EmptyStatePage } from './pages/EmptyStatePage'
import { ColorPage } from './pages/ColorPage'
import { TypographyPage } from './pages/TypographyPage'
import { COMPONENT_SECTIONS, FOUNDATION_SECTIONS } from './lib/sections'

function Placeholder() {
  const loc = useLocation()
  const s = [...FOUNDATION_SECTIONS, ...COMPONENT_SECTIONS].find((x) => x.path === loc.pathname)
  return (
    <div style={{ maxWidth: 820 }}>
      <p className="text-xs font-semibold tracking-[0.1em] uppercase text-secondary mb-3">Components · {s?.category}</p>
      <h1 className="font-[var(--font-heading)] text-4xl font-extrabold text-foreground m-0">{s?.title ?? 'Component'}</h1>
      <p className="mt-4 text-base text-muted-foreground">Migración pendiente — esta página todavía se sirve desde <code>index.html</code>. El componente ya existe en <code>@embassy/ui</code>.</p>
    </div>
  )
}

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Navigate to="/foundations/color" replace />} />
            <Route path="/foundations/color" element={<ColorPage />} />
            <Route path="/foundations/typography" element={<TypographyPage />} />
            <Route path="/components/button" element={<ButtonPage />} />
            <Route path="/components/switch" element={<SwitchPage />} />
            <Route path="/components/select" element={<SelectPage />} />
            <Route path="/components/checkbox" element={<CheckboxPage />} />
            <Route path="/components/radio" element={<RadioPage />} />
            <Route path="/components/input" element={<InputPage />} />
            <Route path="/components/badge" element={<BadgePage />} />
            <Route path="/components/tabs" element={<TabsPage />} />
            <Route path="/components/dialog" element={<DialogPage />} />
            <Route path="/components/tooltip" element={<TooltipPage />} />
            <Route path="/components/chip" element={<ChipPage />} />
            <Route path="/components/segmented-button" element={<SegmentedButtonPage />} />
            <Route path="/components/card" element={<CardPage />} />
            <Route path="/components/snackbar" element={<SnackbarPage />} />
            <Route path="/components/skeleton" element={<SkeletonPage />} />
            <Route path="/components/empty-state" element={<EmptyStatePage />} />
            <Route path="*" element={<Placeholder />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  )
}
