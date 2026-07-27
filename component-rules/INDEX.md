# Component Rules — coverage index

Status of the operational rules (`component-rules/<id>.md`) for every component.
See `README.md` for the schema and how skills consume these files.

- ✅ **authored** — full structured rules present.
- 🟡 **pending** — not yet ported; guidance currently lives in the component's
  `css/components/<id>.css` header (`Cuándo usar / Cuándo no / Reemplaza a`) and
  its `index.html` Guidelines/Accessibility tabs. Port those into this schema.

Porting a component = lift its CSS-header decision rule + Guidelines/Accessibility
tab content into the frontmatter schema, then enrich states/keyboard/heuristics/
relationships and add correct/incorrect examples (see `button.md` as the reference).

| Component (id) | Status | Doc anchor | CSS source |
|---|---|---|---|
| button | ✅ authored | c-button | button.css |
| chip | ✅ authored | c-chip | chip.css |
| dialog | ✅ authored | c-dialog | modal.css |
| segmented-button (seg-btn) | ✅ authored | c-seg-btn | segmented-button.css |
| button-group | ✅ authored | c-button-group | button-group.css |
| toggle | ✅ authored | c-toggle | toggle.css |
| toggle-group | ✅ authored | c-toggle-group | toggle-group.css |
| badge | ✅ authored | c-badge | badge.css |
| input | ✅ authored | c-input | form.css |
| select | ✅ authored | c-select | select.css |
| textarea | ✅ authored | c-textarea | form.css |
| input-group | ✅ authored | c-input-group | input-group.css |
| input-otp | ✅ authored | c-input-otp | input-otp.css |
| form | ✅ authored | c-form | form.css |
| label | ✅ authored | c-label | label.css |
| checkbox | ✅ authored | c-checkbox | checkbox.css |
| radio | ✅ authored | c-radio | radio-group.css |
| switch | ✅ authored | c-switch | switch.css |
| slider | ✅ authored | c-slider | slider.css |
| search | ✅ authored | c-search | search.css |
| card (Full Card) | ✅ authored | c-basic-card | card.css |
| item (Basic Card) | ✅ authored | c-item | item.css |
| stat-card | ✅ authored | c-stat-card | stat-card.css |
| table | ✅ authored | c-table | table.css |
| data-table | ✅ authored | c-data-table | data-table.css |
| tabs | ✅ authored | c-tabs | tabs.css |
| accordion | ✅ authored | c-accordion | accordion.css |
| collapsible | ✅ authored | c-collapsible | collapsible.css |
| list | ✅ authored | c-list | list.css |
| pagination | ✅ authored | c-pagination | pagination.css |
| breadcrumb | ✅ authored | c-breadcrumb | breadcrumb.css |
| avatar | ✅ authored | c-avatar | avatar.css |
| divider | ✅ authored | c-divider | divider.css |
| scroll-area | ✅ authored | c-scroll-area | scroll-area.css |
| aspect-ratio | ✅ authored | c-aspect-ratio | (layout primitive) |
| calendar | ✅ authored | c-calendar | calendar.css |
| carousel | ✅ authored | c-carousel | carousel.css |
| charts | ✅ authored | c-charts | chart.css |
| snackbar (toast) | ✅ authored | c-snackbar | toast.css |
| alert | ✅ authored | c-alert | alert.css |
| tooltip | ✅ authored | c-tooltip | tooltip.css / rich-tooltip.css |
| skeleton | ✅ authored | c-skeleton | skeleton.css |
| loading (progress + spinner) | ✅ authored | c-loading | progress.css / spinner.css |
| empty-state | ✅ authored | c-empty | empty-state.css |
| attachment | ✅ authored | c-attachment | attachment.css |
| menu (dropdown/popover) | ✅ authored | c-menu | dropdown-menu.css / popover.css |
| context-menu | ✅ authored | c-context-menu | context-menu.css |
| menubar | ✅ authored | c-menubar | menubar.css |
| navigation-menu | ✅ authored | c-navigation-menu | navigation-menu.css |
| command | ✅ authored | c-command | command.css |
| combobox | 🟡 pending | c-combobox | combobox.css |
| sheet-bottom | 🟡 pending | c-bottom-sheet | sheet.css |
| sheet-side | 🟡 pending | c-side-sheet | sheet.css |
| nav-drawer | 🟡 pending | c-nav-drawer | layout.css |
| nav-bar | 🟡 pending | c-nav-bar | (inline / layout.css) |
| topbar | 🟡 pending | c-topbar | layout.css |
| toolbar | 🟡 pending | c-toolbar | toolbar.css |
| nav-card | 🟡 pending | c-nav-card | (docs-internal) |
| vacancy-card | 🟡 pending | c-vacancy | vacancy-card.css |
| kanban-card | 🟡 pending | c-kanban | kanban.css |
| person-card | 🟡 pending | c-person | person-card.css |

**Coverage: 50 / 61 authored.** The remaining 11 are the primary #5 work item
(tracked as a phased backlog in the audit report).
