---
id: attachment
display_name: Attachment
aliases: [file row, file chip, uploaded file, adjunto]
category: Data Display
status: stable
summary: A compact file row showing an icon/thumbnail, name and metadata, with an optional remove action, upload progress, or error state.
when_to_use:
  - "List files already uploaded or queued to upload (candidate CVs, message attachments)."
  - "Show per-file upload progress or an error state."
  - "Give the user a way to remove a file from a set before submitting."
when_not_to_use:
  - "The actual file-picking / upload control → use a native <input type=\"file\"> (see Input)."
  - "A gallery of images to browse → use Carousel."
  - "Selectable/removable non-file tokens (emails, tags) → use input Chips."
use_cases:
  - "'CV_Ana_Torres.pdf · 240 KB · PDF' row with a remove button in a candidate application."
  - "A queued image attachment showing an upload progress bar."
  - "A failed upload rendered in the error state with a retry affordance."
variants:
  - {name: default,   class: attachment,             purpose: "Standard file row with icon + body + optional trailing action."}
  - {name: image,     class: attachment-icon-image,  purpose: "Thumbnail preview instead of a type icon."}
  - {name: uploading, class: attachment-progress,    purpose: "Upload-in-progress bar under the name (.attachment-progress-bar)."}
  - {name: error,     class: attachment-error,       purpose: "Failed state — error border + error-container icon."}
  - {name: list,      class: attachment-list,        purpose: "Vertical stack container for multiple attachment rows."}
sizes:
  - {name: default, class: "(default)", use: "single density; 36px media, 10px 12px padding"}
size_selection: "One density. Use the image variant only when a real thumbnail adds value over a type icon."
content_rules:
  - "Name is the file name, truncated with ellipsis when long (single line)."
  - "Meta is compact secondary text — size + type ('240 KB · PDF')."
  - "The remove control needs an aria-label naming what it removes."
layout_constraints:
  - "Rows stack in an .attachment-list; media is leading, actions trailing."
  - "Name truncates (never wraps) so the row height stays stable."
states:
  default: "card-bg surface, --border outline."
  hover: "Remove icon-btn shows its own button hover state."
  focus: "focus-visible ring on the remove / action control."
  uploading: "Progress bar under the name reflects upload percent."
  error: "Error border (--color-error) + error-container media background."
accessibility:
  roles: "Semantic list (<ul>/<li>); remove is a real <button> (icon-btn)."
  aria: ["aria-label on the remove button", "role=progressbar + aria-valuenow on the upload progress"]
  focus: "Remove/action controls are Tab-reachable with a visible focus ring."
  contrast: "Name/meta and error tokens meet AA in light + dark."
keyboard:
  - {keys: "Tab", action: "reach the remove / action control"}
  - {keys: "Enter / Space", action: "activate remove or the trailing action"}
responsive:
  - "Row reflows within its container; name truncates rather than pushing the action off-screen."
ux_principles:
  - "Make removal reversible or confirmable when the file is hard to re-obtain."
  - "Surface upload progress and errors on the row itself so status stays with the file."
common_mistakes:
  - "Using Attachment as the upload trigger instead of a real file input."
  - "Remove button with no aria-label."
  - "Letting the file name wrap and destabilize row heights instead of truncating."
  - "Signaling an error with color only, no icon/border change."
nielsen_heuristics:
  - {id: 1, name: "Visibility of system status", note: "per-file upload progress and error state"}
  - {id: 3, name: "User control and freedom", note: "remove a file before submitting"}
  - {id: 9, name: "Help users recognize and recover from errors", note: "error state flags the failed file"}
relationships:
  related: [input, chip, list, loading]
  replaces: ["ad-hoc file-row markup"]
  composed_with: [button, form, dialog]
  not_to_confuse_with:
    - {component: chip, why: "input chips are compact removable tokens; Attachment is a file row with metadata + progress"}
    - {component: input, why: "the <input type=file> does the picking; Attachment displays the result"}
tokens:
  color: [--color-surface-variant, --color-on-surface-variant, --color-error, --color-error-container, --color-primary]
  radius: [--radius-md, --radius-sm, --radius-full]
  spacing: ["10px 12px padding", "12px gap"]
source:
  css: css/components/attachment.css
  classes: [attachment-list, attachment, attachment-icon, attachment-icon-image, attachment-body, attachment-name, attachment-meta, attachment-remove, attachment-progress, attachment-progress-bar, attachment-error]
  react_wrapper: null
  docs_anchor: c-attachment
---

## Correct usage

```html
<!-- File row with metadata and an accessible remove control -->
<ul class="attachment-list">
  <li class="attachment">
    <span class="attachment-icon"><i data-lucide="file-text"></i></span>
    <div class="attachment-body">
      <div class="attachment-name">CV_Ana_Torres.pdf</div>
      <div class="attachment-meta">240 KB · PDF</div>
    </div>
    <button class="icon-btn btn-sm attachment-remove" aria-label="Quitar CV_Ana_Torres.pdf">✕</button>
  </li>
</ul>
```
*Why:* clear file identity + metadata, remove control has an accessible name.

```html
<!-- Upload in progress -->
<li class="attachment">
  <span class="attachment-icon"><i data-lucide="image"></i></span>
  <div class="attachment-body">
    <div class="attachment-name">foto_perfil.jpg</div>
    <div class="attachment-progress"><div class="attachment-progress-bar" style="width:70%"></div></div>
  </div>
</li>
```
*Why:* per-file progress keeps status attached to the file.

## Incorrect usage

```html
<!-- ✕ Using Attachment as the upload trigger -->
<div class="attachment" onclick="openFilePicker()">Subir archivo…</div>
```
*Fix:* use a real `<input type="file">` to pick; render the picked file as an Attachment afterward.
