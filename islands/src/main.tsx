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
import { MenuShowcase, MenuConfig, MenuStates } from "./islands/MenuShowcase"
import { SliderShowcase } from "./islands/SliderShowcase"
import { InputShowcase, TextareaShowcase, SelectShowcase } from "./islands/FormShowcases"
import { InputBasic, InputPlaceholder, InputRequired, InputDisabled, InputFocus, InputGrid, InputNumber, InputDate, InputStates, InputFeatures, InputAnatomy } from "./islands/InputPhaseB"
import { TabsShowcase } from "./islands/TabsShowcase"
import { DialogShowcase } from "./islands/DialogShowcase"
import { BadgeShowcase } from "./islands/BadgeShowcase"
import { SkeletonShowcase } from "./islands/SkeletonShowcase"
import { EmptyStateShowcase, EmptyStateAnatomy } from "./islands/EmptyStateShowcase"
import { TableShowcase, TableBasic, TableClickable } from "./islands/TableShowcase"
import { SearchShowcase } from "./islands/SearchShowcase"
import { CardShowcase } from "./islands/CardShowcase"
import { CardElevated, CardFilled, CardOutlined } from "./islands/CardVariantsShowcase"
import { StatCardShowcase, StatCardGrid } from "./islands/StatCardShowcase"
import { AvatarShowcase } from "./islands/AvatarShowcase"
import { TooltipShowcase } from "./islands/TooltipShowcase"
import { SheetShowcase, BottomSheetShowcase, SideSheetShowcase, SheetTimeSlotShowcase, SheetResponsiveShowcase, SheetEditProfileShowcase } from "./islands/SheetShowcase"
import { CarouselShowcase } from "./islands/CarouselShowcase"
import { DatePickerShowcase } from "./islands/DatePickerShowcase"
import { DatePickerFieldShowcase } from "./islands/DatePickerField"
import { SegmentedButtonShowcase } from "./islands/SegmentedButtonShowcase"
import { SegBtnSizeSm, SegBtnSizeMd, SegBtnSizeLg, SegBtnStateDefault, SegBtnStateSelected, SegBtnStateDisabled, SegBtnDoViews, SegBtnDontActions, SegBtnDoPeriod, SegBtnDontTooMany, SegBtnAnatomy, SegBtnIcons, SegBtnIconsOnly, SegBtnSingle, SegBtnMulti, RoleBoardMode, BtCatTabs, BtColorVariants, BtSizeVariants } from "./islands/SegBtnPhaseB"
import { SearchActionsShowcase, SearchDesktopShowcase, SearchBarMobileShowcase, SearchBarShowcase as SearchBarPhaseB, SearchActionsCodeShowcase } from "./islands/SearchPhaseB"
import { SearchConfigBar, SearchConfigTrailing, SearchConfigMulti, SearchConfigAvatar } from "./islands/SearchConfigShowcase"
import { SearchVariantsShowcase, SearchFieldToolbarShowcase, SearchFieldAnatomy, SearchFieldMeasures } from "./islands/SearchFieldShowcase"
import { VacancyCardShowcase } from "./islands/VacancyCardShowcase"
import { PersonCardShowcase } from "./islands/PersonCardShowcase"
import { KanbanShowcase } from "./islands/KanbanShowcase"
import { NavDrawerShowcase } from "./islands/NavDrawerShowcase"
import { NavBarShowcase } from "./islands/NavBarShowcase"
import { TopBarShowcase } from "./islands/TopBarShowcase"
import { ButtonConfigShowcase } from "./islands/ButtonConfigShowcase"
import { MotionCardGridShowcase } from "./islands/MotionCardGridShowcase"
import { ComponentTabsNav } from "./islands/ComponentTabsNav"
import {
  LineChartShowcase,
  BarChartShowcase,
  PieChartShowcase,
  ChartTimeRangeShowcase,
  ChartEmptyState,
  ChartLoadingState,
  ChartErrorState,
} from "./islands/ChartShowcase"
import { ButtonStatesShowcase, ButtonShapeShowcase, ButtonHierarchyFilled, ButtonHierarchyTonal, ButtonHierarchyOutlined, ButtonHierarchyText, ButtonHierarchyIcon, ButtonToggleOff, ButtonToggleOn, ButtonLayoutDo, ButtonLayoutDont, ButtonAdaptiveMobile, ButtonAdaptiveDense, ButtonAdaptiveHero, ButtonIconsDo, ButtonIconsDont, ButtonShapeDo, ButtonShapeDont, ButtonSemanticDo, ButtonSemanticDont, ButtonDoSinglePrimary, ButtonDontMultiPrimary, ButtonDoSpecificLabel, ButtonDontGenericLabel, ButtonDoIconAria, ButtonDontNavLinks, ButtonFocusShowcase, ButtonSemanticPreview, ButtonSizesPreview, ButtonIconPreview, ButtonDisabledPreview, ButtonLoadingPreview, ButtonFormFooterPreview, ButtonDestructivePreview } from "./islands/ButtonPhaseB"
import { TextareaBasic, TextareaDisabled } from "./islands/TextareaPhaseB"
import { SelectSpecBasic, SelectSpecLabeled, SelectSpecDisabled } from "./islands/SelectPhaseB"
import { BadgeStateShowcase, BadgeLabelShowcase, BadgeContextShowcase } from "./islands/BadgePhaseB"
import { TabsOverviewShowcase } from "./islands/TabsPhaseB"
import { DialogDemo } from "./islands/DialogPhaseB"
import { SnackbarMessageDemo, SnackbarActionDemo, SnackbarCloseDemo, SnackbarMultilineDemo } from "./islands/SnackbarPhaseB"
import { SnackbarConfigMessage, SnackbarConfigAction, SnackbarConfigClose, SnackbarConfigMultiline } from "./islands/SnackbarConfigShowcase"
import { SkeletonSpecsVariants } from "./islands/SkeletonPhaseB"
import { KanbanSpecsBoard } from "./islands/KanbanPhaseB"
import { VacancySpecExample } from "./islands/VacancyPhaseB"
import { PersonGridSpecsShowcase } from "./islands/PersonPhaseB"
import { AvatarMainShowcase, AvatarAssigneeShowcase, AvatarPersonShowcase } from "./islands/AvatarPhaseB"
import { ChipVariantsGuidelines, ChipFocusState, ChipCodeVariants, ChipElevatedDisabled } from "./islands/ChipPhaseB"
import {
  ChipAssistAnatomy, ChipAssistColor, ChipAssistStates, ChipAssistMeasures,
  ChipFilterAnatomyUnselected, ChipFilterAnatomySelected, ChipFilterAnatomyLeading,
  ChipFilterColor, ChipFilterStates, ChipFilterMeasures,
  ChipInputAnatomyAvatar, ChipInputAnatomyLeading, ChipInputMeasures,
  ChipSuggestionAnatomy, ChipSuggestionMeasures,
  ChipGuidelinesAnatomy, ChipGuidelinesContainer, ChipGuidelinesUsageScene, ChipGlLeadingIcon,
} from "./islands/ChipSpecs"
import {
  SearchBarAnatomy, SearchViewAnatomy, SearchColor, SearchStates, SearchBarMeasures, SearchViewMeasures,
} from "./islands/SearchSpecs"
import { SnackbarAnatomy, SnackbarColor, SnackbarMeasures, SnackbarAnimation } from "./islands/SnackbarSpecs"
import { SwitchAnatomy, SwitchStates, SwitchMeasures } from "./islands/SwitchSpecs"
import {
  CheckboxAnatomy, CheckboxStates, CheckboxMeasures,
  RadioAnatomy, RadioStates, RadioMeasures,
  SliderAnatomy, SliderStates, SliderMeasures,
  ProgressAnatomy, ProgressStates, ProgressMeasures,
} from "./islands/ControlSpecs"
import { ButtonSizeMatrix, ButtonTouchTarget } from "./islands/ButtonSpecs"
import { ButtonTokens, MenuTokens, InputTokens, SelectTokens, TextareaTokens, CheckboxTokens, RadioTokens, SwitchTokens, SliderTokens, BasicCardTokens, DialogTokens, BottomSheetTokens, SideSheetTokens, TableTokens, TabsTokens, BadgeTokens, ChipTokens, AvatarTokens, StatCardTokens, SkeletonTokens, DividerTokens, SnackbarTokens, TooltipTokens, SearchTokens, CarouselTokens, DatePickerTokens, SegBtnTokens, LoadingTokens, EmptyTokens, KanbanTokens, VacancyTokens, PersonTokens, ListTokens, NavDrawerTokens, NavBarTokens, NavCardTokens, TopbarTokens } from "./islands/TokenPanel"
import { ChipSceneRestaurant, ChipSceneDialog, ChipSceneTaskButton, ChipSceneTaskChip, ChipSceneScroll, ChipSceneSingle, ChipSceneElevHero, ChipSceneElevDoBorder, ChipSceneElevDoImage, ChipSceneElevDontPage, ChipSceneElevDontPressed, ChipSceneLabelShort, ChipSceneLabelLong, ChipSceneTrailingTouch, ChipSceneAssistHero, ChipSceneAssistInfo, ChipSceneAssistModal, ChipSceneAssistActionsA, ChipSceneAssistActionsB, ChipSceneAssistPlacement, ChipSceneFilterHero, ChipSceneFilterShopping, ChipSceneFilterRealEstate, ChipSceneFilterMultiSelected, ChipSceneFilterMultiDynamic, ChipSceneFilterSingle, ChipSceneFilterTrailingClose, ChipSceneFilterTrailingMenu, ChipSceneFilterCaution, ChipSceneFilterIntegration } from "./islands/ChipScenes"

import {
  ToggleShowcase, LabelShowcase, AccordionShowcase, AlertShowcase, BreadcrumbShowcase,
  CollapsibleShowcase, ScrollAreaShowcase, AspectRatioShowcase,
  PaginationShowcase, AlertDialogShowcase,
} from "./islands/NewPrimitivesShowcase"

const registry: Record<string, ComponentType> = {
  "toggle-showcase": ToggleShowcase,
  "label-showcase": LabelShowcase,
  "accordion-showcase": AccordionShowcase,
  "alert-showcase": AlertShowcase,
  "breadcrumb-showcase": BreadcrumbShowcase,
  "collapsible-showcase": CollapsibleShowcase,
  "scroll-area-showcase": ScrollAreaShowcase,
  "aspect-ratio-showcase": AspectRatioShowcase,
  "pagination-showcase": PaginationShowcase,
  "alert-dialog-showcase": AlertDialogShowcase,
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
  "textarea-basic": TextareaBasic,
  "textarea-disabled": TextareaDisabled,
  "select-spec-basic": SelectSpecBasic,
  "select-spec-labeled": SelectSpecLabeled,
  "select-spec-disabled": SelectSpecDisabled,
  "badge-state-showcase": BadgeStateShowcase,
  "badge-label-showcase": BadgeLabelShowcase,
  "badge-context-showcase": BadgeContextShowcase,
  "tabs-overview-showcase": TabsOverviewShowcase,
  "dialog-demo": DialogDemo,
  "snackbar-message-demo": SnackbarMessageDemo,
  "snackbar-action-demo": SnackbarActionDemo,
  "snackbar-close-demo": SnackbarCloseDemo,
  "snackbar-multiline-demo": SnackbarMultilineDemo,
  "snackbar-config-message": SnackbarConfigMessage,
  "snackbar-config-action": SnackbarConfigAction,
  "snackbar-config-close": SnackbarConfigClose,
  "snackbar-config-multiline": SnackbarConfigMultiline,
  "skeleton-specs-variants": SkeletonSpecsVariants,
  "kanban-specs-board": KanbanSpecsBoard,
  "vacancy-spec-example": VacancySpecExample,
  "person-grid-specs-showcase": PersonGridSpecsShowcase,
  "avatar-main-showcase": AvatarMainShowcase,
  "avatar-assignee-showcase": AvatarAssigneeShowcase,
  "avatar-person-showcase": AvatarPersonShowcase,
  "chip-variants-guidelines": ChipVariantsGuidelines,
  "chip-focus-state": ChipFocusState,
  "chip-code-variants": ChipCodeVariants,
  "chip-elevated-disabled": ChipElevatedDisabled,
  "chip-assist-anatomy": ChipAssistAnatomy,
  "chip-assist-color": ChipAssistColor,
  "chip-assist-states": ChipAssistStates,
  "chip-assist-measures": ChipAssistMeasures,
  "chip-filter-anatomy-unselected": ChipFilterAnatomyUnselected,
  "chip-filter-anatomy-selected": ChipFilterAnatomySelected,
  "chip-filter-anatomy-leading": ChipFilterAnatomyLeading,
  "chip-filter-color": ChipFilterColor,
  "chip-filter-states": ChipFilterStates,
  "chip-filter-measures": ChipFilterMeasures,
  "chip-input-anatomy-avatar": ChipInputAnatomyAvatar,
  "chip-input-anatomy-leading": ChipInputAnatomyLeading,
  "chip-input-measures": ChipInputMeasures,
  "chip-suggestion-anatomy": ChipSuggestionAnatomy,
  "chip-suggestion-measures": ChipSuggestionMeasures,
  "chip-guidelines-anatomy": ChipGuidelinesAnatomy,
  "chip-guidelines-container": ChipGuidelinesContainer,
  "chip-guidelines-usage-scene": ChipGuidelinesUsageScene,
  "chip-gl-leading-icon": ChipGlLeadingIcon,
  "search-bar-anatomy": SearchBarAnatomy,
  "search-view-anatomy": SearchViewAnatomy,
  "search-color": SearchColor,
  "search-states": SearchStates,
  "search-bar-measures": SearchBarMeasures,
  "search-view-measures": SearchViewMeasures,
  "search-field-anatomy": SearchFieldAnatomy,
  "search-field-measures": SearchFieldMeasures,
  "snackbar-anatomy": SnackbarAnatomy,
  "snackbar-color": SnackbarColor,
  "snackbar-measures": SnackbarMeasures,
  "snackbar-animation": SnackbarAnimation,
  "button-size-matrix": ButtonSizeMatrix,
  "button-touch-target": ButtonTouchTarget,
  "chip-scene-restaurant": ChipSceneRestaurant,
  "chip-scene-dialog": ChipSceneDialog,
  "chip-scene-task-button": ChipSceneTaskButton,
  "chip-scene-task-chip": ChipSceneTaskChip,
  "chip-scene-scroll": ChipSceneScroll,
  "chip-scene-single": ChipSceneSingle,
  "chip-scene-elev-hero": ChipSceneElevHero,
  "chip-scene-elev-do-border": ChipSceneElevDoBorder,
  "chip-scene-elev-do-image": ChipSceneElevDoImage,
  "chip-scene-elev-dont-page": ChipSceneElevDontPage,
  "chip-scene-elev-dont-pressed": ChipSceneElevDontPressed,
  "chip-scene-label-short": ChipSceneLabelShort,
  "chip-scene-label-long": ChipSceneLabelLong,
  "chip-scene-trailing-touch": ChipSceneTrailingTouch,
  "chip-scene-assist-hero": ChipSceneAssistHero,
  "chip-scene-assist-info": ChipSceneAssistInfo,
  "chip-scene-assist-modal": ChipSceneAssistModal,
  "chip-scene-assist-actions-a": ChipSceneAssistActionsA,
  "chip-scene-assist-actions-b": ChipSceneAssistActionsB,
  "chip-scene-assist-placement": ChipSceneAssistPlacement,
  "chip-scene-filter-hero": ChipSceneFilterHero,
  "chip-scene-filter-shopping": ChipSceneFilterShopping,
  "chip-scene-filter-realestate": ChipSceneFilterRealEstate,
  "chip-scene-filter-multi-selected": ChipSceneFilterMultiSelected,
  "chip-scene-filter-multi-dynamic": ChipSceneFilterMultiDynamic,
  "chip-scene-filter-single": ChipSceneFilterSingle,
  "chip-scene-filter-trailing-close": ChipSceneFilterTrailingClose,
  "chip-scene-filter-trailing-menu": ChipSceneFilterTrailingMenu,
  "chip-scene-filter-caution": ChipSceneFilterCaution,
  "chip-scene-filter-integration": ChipSceneFilterIntegration,
  "snackbar-showcase": SnackbarShowcase,
  "switch-showcase": SwitchShowcase,
  "switch-anatomy": SwitchAnatomy,
  "switch-states": SwitchStates,
  "switch-measures": SwitchMeasures,
  "checkbox-anatomy": CheckboxAnatomy,
  "checkbox-states": CheckboxStates,
  "checkbox-measures": CheckboxMeasures,
  "radio-anatomy": RadioAnatomy,
  "radio-states-grid": RadioStates,
  "radio-measures": RadioMeasures,
  "slider-anatomy": SliderAnatomy,
  "slider-states": SliderStates,
  "slider-measures": SliderMeasures,
  "progress-anatomy": ProgressAnatomy,
  "progress-states": ProgressStates,
  "progress-measures": ProgressMeasures,
  "checkbox-showcase": CheckboxShowcase,
  "radio-group": RadioGroupShowcase,
  "radio-states": RadioStatesShowcase,
  "divider-showcase": DividerShowcase,
  "list-showcase": ListShowcase,
  "progress-circular": ProgressCircularShowcase,
  "progress-linear": ProgressLinearShowcase,
  "menu-showcase": MenuShowcase,
  "menu-config-showcase": MenuConfig,
  "menu-states-showcase": MenuStates,
  "button-tokens": ButtonTokens,
  "menu-tokens": MenuTokens,
  "input-tokens": InputTokens,
  "select-tokens": SelectTokens,
  "textarea-tokens": TextareaTokens,
  "checkbox-tokens": CheckboxTokens,
  "radio-tokens": RadioTokens,
  "switch-tokens": SwitchTokens,
  "slider-tokens": SliderTokens,
  "basic-card-tokens": BasicCardTokens,
  "dialog-tokens": DialogTokens,
  "bottom-sheet-tokens": BottomSheetTokens,
  "side-sheet-tokens": SideSheetTokens,
  "table-tokens": TableTokens,
  "tabs-tokens": TabsTokens,
  "badge-tokens": BadgeTokens,
  "chip-tokens": ChipTokens,
  "avatar-tokens": AvatarTokens,
  "stat-card-tokens": StatCardTokens,
  "skeleton-tokens": SkeletonTokens,
  "divider-tokens": DividerTokens,
  "snackbar-tokens": SnackbarTokens,
  "tooltip-tokens": TooltipTokens,
  "search-tokens": SearchTokens,
  "carousel-tokens": CarouselTokens,
  "date-picker-tokens": DatePickerTokens,
  "seg-btn-tokens": SegBtnTokens,
  "loading-tokens": LoadingTokens,
  "empty-tokens": EmptyTokens,
  "kanban-tokens": KanbanTokens,
  "vacancy-tokens": VacancyTokens,
  "person-tokens": PersonTokens,
  "list-tokens": ListTokens,
  "nav-drawer-tokens": NavDrawerTokens,
  "nav-bar-tokens": NavBarTokens,
  "nav-card-tokens": NavCardTokens,
  "topbar-tokens": TopbarTokens,
  "slider-showcase": SliderShowcase,
  "input-showcase": InputShowcase,
  "input-basic-showcase": InputBasic,
  "input-states-showcase": InputStates,
  "input-features-showcase": InputFeatures,
  "input-anatomy-showcase": InputAnatomy,
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
  "search-config-bar": SearchConfigBar,
  "search-config-trailing": SearchConfigTrailing,
  "search-config-multi": SearchConfigMulti,
  "search-config-avatar": SearchConfigAvatar,
  "search-variants-showcase": SearchVariantsShowcase,
  "search-field-toolbar-showcase": SearchFieldToolbarShowcase,
  "card-showcase": CardShowcase,
  "card-elevated": CardElevated,
  "card-filled": CardFilled,
  "card-outlined": CardOutlined,
  "stat-card-showcase": StatCardShowcase,
  "stat-card-grid": StatCardGrid,
  "avatar-showcase": AvatarShowcase,
  "tooltip-showcase": TooltipShowcase,
  "sheet-showcase": SheetShowcase,
  "bottom-sheet-showcase": BottomSheetShowcase,
  "side-sheet-showcase": SideSheetShowcase,
  "sheet-timeslot-showcase": SheetTimeSlotShowcase,
  "sheet-responsive-showcase": SheetResponsiveShowcase,
  "sheet-editprofile-showcase": SheetEditProfileShowcase,
  "carousel-showcase": CarouselShowcase,
  "date-picker-showcase": DatePickerShowcase,
  "date-picker-field-showcase": DatePickerFieldShowcase,
  "seg-btn-showcase": SegmentedButtonShowcase,
  "seg-btn-size-sm": SegBtnSizeSm,
  "seg-btn-size-md": SegBtnSizeMd,
  "seg-btn-size-lg": SegBtnSizeLg,
  "seg-btn-state-default": SegBtnStateDefault,
  "seg-btn-state-selected": SegBtnStateSelected,
  "seg-btn-state-disabled": SegBtnStateDisabled,
  "seg-btn-anatomy": SegBtnAnatomy,
  "seg-btn-single": SegBtnSingle,
  "seg-btn-multi": SegBtnMulti,
  "seg-btn-icons": SegBtnIcons,
  "seg-btn-icons-only": SegBtnIconsOnly,
  "role-board-mode": RoleBoardMode,
  "bt-cat-tabs": BtCatTabs,
  "bt-color-variants": BtColorVariants,
  "bt-size-variants": BtSizeVariants,
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
  "motion-card-grid-showcase": MotionCardGridShowcase,
  "component-tabs-nav": ComponentTabsNav,
  "line-chart-showcase": LineChartShowcase,
  "bar-chart-showcase": BarChartShowcase,
  "pie-chart-showcase": PieChartShowcase,
  "chart-time-range-showcase": ChartTimeRangeShowcase,
  "chart-empty-state": ChartEmptyState,
  "chart-loading-state": ChartLoadingState,
  "chart-error-state": ChartErrorState,
}

function mountIslands() {
  document.querySelectorAll<HTMLElement>("[data-island]").forEach((el) => {
    const name = el.dataset.island
    if (!name || el.dataset.mounted) return
    const Comp = registry[name]
    if (!Comp) return
    el.dataset.mounted = "1"
    el.style.flex = "1 1 auto"
    try {
      createRoot(el).render(<Comp />)
    } catch (err) {
      // One island's render error must never stop the rest of the page from mounting.
      console.error(`[islands] failed to mount "${name}"`, err)
    }
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountIslands)
} else {
  mountIslands()
}
