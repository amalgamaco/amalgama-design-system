// Registry of docs sections. Grows as pages are migrated from index.html.
// `status: 'live'` = has a migrated React page; others are placeholders.
export type SectionMeta = {
  id: string
  title: string
  category: string
  path: string
  status: 'live' | 'todo'
}

export const COMPONENT_SECTIONS: SectionMeta[] = [
  { id: 'button', title: 'Button', category: 'Actions', path: '/components/button', status: 'live' },
  { id: 'switch', title: 'Switch', category: 'Selección', path: '/components/switch', status: 'live' },
  { id: 'select', title: 'Select', category: 'Inputs', path: '/components/select', status: 'live' },
  { id: 'checkbox', title: 'Checkbox', category: 'Selección', path: '/components/checkbox', status: 'live' },
  { id: 'radio', title: 'Radio', category: 'Selección', path: '/components/radio', status: 'live' },
  { id: 'input', title: 'Text field', category: 'Inputs', path: '/components/input', status: 'live' },
  { id: 'badge', title: 'Badge', category: 'Display', path: '/components/badge', status: 'live' },
  { id: 'tabs', title: 'Tabs', category: 'Navigation', path: '/components/tabs', status: 'live' },
  { id: 'dialog', title: 'Dialog', category: 'Overlays', path: '/components/dialog', status: 'live' },
  { id: 'tooltip', title: 'Tooltip', category: 'Overlays', path: '/components/tooltip', status: 'live' },
  { id: 'snackbar', title: 'Snackbar', category: 'Feedback', path: '/components/snackbar', status: 'todo' },
]

export const CATEGORY_ORDER = ['Actions', 'Selección', 'Inputs', 'Display', 'Navigation', 'Overlays', 'Feedback']
