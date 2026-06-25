import { type ComponentType } from "react"
import { createRoot } from "react-dom/client"
import "./styles.css"
import { ChipShowcase } from "./islands/ChipShowcase"
import { ButtonShowcase } from "./islands/ButtonShowcase"
import { SnackbarShowcase } from "./islands/SnackbarShowcase"
import { SwitchShowcase } from "./islands/SwitchShowcase"
import { CheckboxShowcase } from "./islands/CheckboxShowcase"
import { RadioGroupShowcase, RadioStatesShowcase } from "./islands/RadioShowcase"
import { DividerShowcase } from "./islands/DividerShowcase"
import { ListShowcase } from "./islands/ListShowcase"
import { ProgressCircularShowcase, ProgressLinearShowcase } from "./islands/ProgressShowcase"
import { MenuShowcase } from "./islands/MenuShowcase"
import { SliderShowcase } from "./islands/SliderShowcase"
import { InputShowcase, TextareaShowcase, SelectShowcase } from "./islands/FormShowcases"
import { InputBasic, InputPlaceholder, InputRequired, InputDisabled, InputFocus, InputGrid, InputNumber, InputDate } from "./islands/InputPhaseB"
import { TabsShowcase } from "./islands/TabsShowcase"
import { DialogShowcase } from "./islands/DialogShowcase"
import { BadgeShowcase } from "./islands/BadgeShowcase"
import { SkeletonShowcase } from "./islands/SkeletonShowcase"
import { EmptyStateShowcase, EmptyStateAnatomy } from "./islands/EmptyStateShowcase"
import { TableShowcase, TableBasic, TableClickable } from "./islands/TableShowcase"
import { SearchShowcase } from "./islands/SearchShowcase"
import { CardShowcase } from "./islands/CardShowcase"
import { StatCardShowcase, StatCardGrid } from "./islands/StatCardShowcase"
import { AvatarShowcase } from "./islands/AvatarShowcase"
import { TooltipShowcase } from "./islands/TooltipShowcase"
import { SheetShowcase } from "./islands/SheetShowcase"
import { CarouselShowcase } from "./islands/CarouselShowcase"
import { DatePickerShowcase } from "./islands/DatePickerShowcase"
import { SegmentedButtonShowcase } from "./islands/SegmentedButtonShowcase"
import { SegBtnSizeSm, SegBtnSizeMd, SegBtnSizeLg, SegBtnStateDefault, SegBtnStateSelected, SegBtnStateDisabled, SegBtnDoViews, SegBtnDontActions, SegBtnDoPeriod, SegBtnDontTooMany } from "./islands/SegBtnPhaseB"
import { SearchActionsShowcase, SearchDesktopShowcase, SearchBarMobileShowcase, SearchBarShowcase as SearchBarPhaseB, SearchActionsCodeShowcase } from "./islands/SearchPhaseB"
import { VacancyCardShowcase } from "./islands/VacancyCardShowcase"
import { PersonCardShowcase } from "./islands/PersonCardShowcase"
import { KanbanShowcase } from "./islands/KanbanShowcase"
import { NavDrawerShowcase } from "./islands/NavDrawerShowcase"
import { NavBarShowcase } from "./islands/NavBarShowcase"
import { TopBarShowcase } from "./islands/TopBarShowcase"
import { ButtonConfigShowcase } from "./islands/ButtonConfigShowcase"
import { ButtonStatesShowcase, ButtonShapeShowcase, ButtonHierarchyFilled, ButtonHierarchyTonal, ButtonHierarchyOutlined, ButtonHierarchyText, ButtonHierarchyIcon, ButtonToggleOff, ButtonToggleOn, ButtonLayoutDo, ButtonLayoutDont, ButtonAdaptiveMobile, ButtonAdaptiveDense, ButtonAdaptiveHero, ButtonIconsDo, ButtonIconsDont, ButtonShapeDo, ButtonShapeDont, ButtonSemanticDo, ButtonSemanticDont, ButtonDoSinglePrimary, ButtonDontMultiPrimary, ButtonDoSpecificLabel, ButtonDontGenericLabel, ButtonDoIconAria, ButtonDontNavLinks, ButtonFocusShowcase, ButtonSemanticPreview, ButtonSizesPreview, ButtonIconPreview, ButtonDisabledPreview, ButtonLoadingPreview, ButtonFormFooterPreview, ButtonDestructivePreview } from "./islands/ButtonPhaseB"

const registry: Record<string, ComponentType> = {
  "chip-showcase": ChipShowcase,
  "button-showcase": ButtonShowcase,
  "button-states-showcase": ButtonStatesShowcase,
  "button-shape-showcase": ButtonShapeShowcase,
  "button-hierarchy-filled": ButtonHierarchyFilled,
  "button-hierarchy-tonal": ButtonHierarchyTonal,
  "button-hierarchy-outlined": ButtonHierarchyOutlined,
  "button-hierarchy-text": ButtonHierarchyText,
  "button-hierarchy-icon": ButtonHierarchyIcon,
  "button-toggle-off": ButtonToggleOff,
  "button-toggle-on": ButtonToggleOn,
  "button-layout-do": ButtonLayoutDo,
  "button-layout-dont": ButtonLayoutDont,
  "button-adaptive-mobile": ButtonAdaptiveMobile,
  "button-adaptive-dense": ButtonAdaptiveDense,
  "button-adaptive-hero": ButtonAdaptiveHero,
  "button-icons-do": ButtonIconsDo,
  "button-icons-dont": ButtonIconsDont,
  "button-shape-do": ButtonShapeDo,
  "button-shape-dont": ButtonShapeDont,
  "button-semantic-do": ButtonSemanticDo,
  "button-semantic-dont": ButtonSemanticDont,
  "button-do-single-primary": ButtonDoSinglePrimary,
  "button-dont-multi-primary": ButtonDontMultiPrimary,
  "button-do-specific-label": ButtonDoSpecificLabel,
  "button-dont-generic-label": ButtonDontGenericLabel,
  "button-do-icon-aria": ButtonDoIconAria,
  "button-dont-nav-links": ButtonDontNavLinks,
  "button-focus-showcase": ButtonFocusShowcase,
  "button-semantic-preview": ButtonSemanticPreview,
  "button-sizes-preview": ButtonSizesPreview,
  "button-icon-preview": ButtonIconPreview,
  "button-disabled-preview": ButtonDisabledPreview,
  "button-loading-preview": ButtonLoadingPreview,
  "button-form-footer-preview": ButtonFormFooterPreview,
  "button-destructive-preview": ButtonDestructivePreview,
  "snackbar-showcase": SnackbarShowcase,
  "switch-showcase": SwitchShowcase,
  "checkbox-showcase": CheckboxShowcase,
  "radio-group": RadioGroupShowcase,
  "radio-states": RadioStatesShowcase,
  "divider-showcase": DividerShowcase,
  "list-showcase": ListShowcase,
  "progress-circular": ProgressCircularShowcase,
  "progress-linear": ProgressLinearShowcase,
  "menu-showcase": MenuShowcase,
  "slider-showcase": SliderShowcase,
  "input-showcase": InputShowcase,
  "input-basic-showcase": InputBasic,
  "input-placeholder-showcase": InputPlaceholder,
  "input-required-showcase": InputRequired,
  "input-disabled-showcase": InputDisabled,
  "input-focus-showcase": InputFocus,
  "input-grid-showcase": InputGrid,
  "input-number-showcase": InputNumber,
  "input-date-showcase": InputDate,
  "textarea-showcase": TextareaShowcase,
  "select-showcase": SelectShowcase,
  "tabs-showcase": TabsShowcase,
  "dialog-showcase": DialogShowcase,
  "badge-showcase": BadgeShowcase,
  "skeleton-showcase": SkeletonShowcase,
  "empty-state-showcase": EmptyStateShowcase,
  "empty-state-anatomy": EmptyStateAnatomy,
  "table-showcase": TableShowcase,
  "table-basic": TableBasic,
  "table-clickable": TableClickable,
  "search-showcase": SearchShowcase,
  "search-actions-showcase": SearchActionsShowcase,
  "search-desktop-showcase": SearchDesktopShowcase,
  "search-bar-mobile-showcase": SearchBarMobileShowcase,
  "search-bar-showcase": SearchBarPhaseB,
  "search-actions-code-showcase": SearchActionsCodeShowcase,
  "card-showcase": CardShowcase,
  "stat-card-showcase": StatCardShowcase,
  "stat-card-grid": StatCardGrid,
  "avatar-showcase": AvatarShowcase,
  "tooltip-showcase": TooltipShowcase,
  "sheet-showcase": SheetShowcase,
  "carousel-showcase": CarouselShowcase,
  "date-picker-showcase": DatePickerShowcase,
  "seg-btn-showcase": SegmentedButtonShowcase,
  "seg-btn-size-sm": SegBtnSizeSm,
  "seg-btn-size-md": SegBtnSizeMd,
  "seg-btn-size-lg": SegBtnSizeLg,
  "seg-btn-state-default": SegBtnStateDefault,
  "seg-btn-state-selected": SegBtnStateSelected,
  "seg-btn-state-disabled": SegBtnStateDisabled,
  "seg-btn-do-views": SegBtnDoViews,
  "seg-btn-dont-actions": SegBtnDontActions,
  "seg-btn-do-period": SegBtnDoPeriod,
  "seg-btn-dont-toomany": SegBtnDontTooMany,
  "vacancy-card-showcase": VacancyCardShowcase,
  "person-card-showcase": PersonCardShowcase,
  "kanban-showcase": KanbanShowcase,
  "nav-drawer-showcase": NavDrawerShowcase,
  "nav-bar-showcase": NavBarShowcase,
  "topbar-showcase": TopBarShowcase,
  "button-config-showcase": ButtonConfigShowcase,
}

function mountIslands() {
  document.querySelectorAll<HTMLElement>("[data-island]").forEach((el) => {
    const name = el.dataset.island
    if (!name || el.dataset.mounted) return
    const Comp = registry[name]
    if (!Comp) return
    el.dataset.mounted = "1"
    el.style.flex = "1 1 auto"
    createRoot(el).render(<Comp />)
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountIslands)
} else {
  mountIslands()
}
