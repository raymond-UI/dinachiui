/*
  One icon per documented component, drawn in the same language as the sidebar's section
  icons: a 1.25 stroke on a 16 grid, a single tinted surface (`f`) and quieter secondary
  marks (`q`). Static markup, rendered inside an <svg> by `ComponentIcon`.
*/
export const componentIconPaths: Record<string, string> = {
  // Agents
  agent:
    '<rect class="f" x="1.5" y="1.5" width="7" height="5.5" rx="1.5"/><path class="q" d="M5 7v3.75h4" stroke-dasharray="1.2 1.4"/><path d="M10 8.5l4.5 2-2 .75-.75 2Z"/>',

  // Inputs
  autocomplete:
    '<rect class="f" x="1.5" y="4.5" width="13" height="7" rx="2"/><path d="M4 8h3.5"/><path class="q" d="M9 8h3" stroke-dasharray="1 1.25"/>',
  checkbox:
    '<rect class="f" x="2.5" y="2.5" width="11" height="11" rx="2.5"/><path d="M5.25 8.25l1.9 1.9 3.6-4.1"/>',
  "checkbox-group":
    '<rect class="f" x="1.5" y="1.75" width="4" height="4" rx="1"/><path d="M2.5 3.75l.9.9 1.2-1.4"/><rect x="1.5" y="10.25" width="4" height="4" rx="1"/><path d="M8 3.75h6.5"/><path class="q" d="M8 12.25h4.5"/>',
  combobox:
    '<rect x="1.5" y="1.5" width="13" height="5" rx="1.5"/><path d="M4 3v2"/><rect class="f" x="1.5" y="8.5" width="13" height="6" rx="1.5"/><path class="q" d="M4 11.5h6"/>',
  input:
    '<rect class="f" x="1.5" y="4.5" width="13" height="7" rx="2"/><path class="q" d="M4 8h4"/><path d="M9.75 6.25v3.5"/>',
  "number-field":
    '<rect class="f" x="1.5" y="4.5" width="13" height="7" rx="2"/><path class="q" d="M5.5 4.5v7M10.5 4.5v7"/><path d="M2.75 8h1.5M11.75 8h1.5M12.5 7.25v1.5M7.25 8h1.5"/>',
  "otp-field":
    '<rect x="1" y="4.5" width="3" height="7" rx="1"/><rect class="f" x="4.67" y="4.5" width="3" height="7" rx="1"/><rect class="q" x="8.33" y="4.5" width="3" height="7" rx="1"/><rect class="q" x="12" y="4.5" width="3" height="7" rx="1"/><path d="M2.5 8h.01" stroke-width="1.75"/><path d="M6.17 6.5v3"/>',
  radio:
    '<circle class="f" cx="8" cy="8" r="5.75"/><circle cx="8" cy="8" r="2.25" fill="currentColor" stroke="none"/>',
  select:
    '<rect class="f" x="1.5" y="4.5" width="13" height="7" rx="2"/><path class="q" d="M4 8h4"/><path d="M10.75 7 12 5.75 13.25 7M10.75 9 12 10.25 13.25 9"/>',
  slider:
    '<path d="M1.5 8h5.5"/><path class="q" d="M12 8h2.5"/><circle class="f" cx="9.5" cy="8" r="2.5"/>',
  switch:
    '<rect class="f" x="1.5" y="4.5" width="13" height="7" rx="3.5"/><circle cx="11" cy="8" r="2" fill="currentColor" stroke="none"/>',
  textarea:
    '<rect class="f" x="1.5" y="2.5" width="13" height="11" rx="2"/><path d="M4 5.5h8"/><path class="q" d="M4 8h5.5"/><path class="q" d="M12.5 10.25l-2 2M12.5 11.75l-.5.5"/>',

  // Forms
  field:
    '<path d="M2.5 3h4"/><rect class="f" x="2.5" y="5.25" width="11" height="4.5" rx="1.25"/><path class="q" d="M2.5 12.75h7"/>',
  fieldset:
    '<path d="M4.25 3H3.5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H9.75"/><path d="M5.75 3h2.5"/><rect class="f" x="4" y="6" width="8" height="2.25" rx=".9"/><rect class="q" x="4" y="10" width="8" height="2.25" rx=".9"/>',
  form:
    '<rect x="2.5" y="1.5" width="11" height="13" rx="2"/><path class="q" d="M5 4.5h6M5 7h6"/><rect class="f" x="5" y="9.75" width="6" height="2.5" rx="1.25"/>',
  label:
    '<rect class="f" x="1.5" y="2.5" width="7" height="4.5" rx="1.25"/><path d="M3.5 4.75h3"/><rect class="q" x="1.5" y="9" width="13" height="4.5" rx="1.25"/>',

  // Actions
  button:
    '<rect class="f" x="1.5" y="4.5" width="13" height="7" rx="2"/><path d="M5.5 8h5"/>',
  "hold-to-confirm":
    '<rect x="1.5" y="4.5" width="13" height="7" rx="3.5"/><path class="f" d="M5 4.5h4.5v7H5a3.5 3.5 0 0 1 0-7Z" stroke="none"/><path d="M9.5 5.5v5"/>',
  link:
    '<path d="M7 9a2.5 2.5 0 0 0 3.5 0l2-2A2.5 2.5 0 0 0 9 3.5l-.75.75"/><path d="M9 7a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 7 12.5l.75-.75"/><path class="q" d="M10.5 14h4"/>',
  toggle:
    '<rect class="f" x="1.5" y="1.5" width="13" height="13" rx="2.5"/><path d="M5.75 4h2.75a2 2 0 0 1 0 4H5.75ZM5.75 8h3.25a2 2 0 0 1 0 4H5.75Z"/>',
  "toggle-group":
    '<rect x="1.5" y="4.5" width="13" height="7" rx="2"/><path class="f" d="M5.83 4.5h4.34v7H5.83Z" stroke="none"/><path class="q" d="M5.83 4.5v7M10.17 4.5v7"/><path d="M7.25 8h1.5"/>',
  toolbar:
    '<rect x="1.5" y="4.5" width="13" height="7" rx="2"/><rect class="f" x="3" y="6" width="4" height="4" rx="1"/><path class="q" d="M8.75 6v4"/><path d="M10.75 8h.01M12.75 8h.01" stroke-width="1.75"/>',

  // Overlays
  "alert-dialog":
    '<rect class="f" x="2" y="2.5" width="12" height="11" rx="2"/><path d="M8 5.25v3.25"/><path d="M8 10.75h.01" stroke-width="1.75"/>',
  dialog:
    '<rect class="q" x="1.5" y="1.5" width="13" height="13" rx="2" stroke-dasharray="1.5 1.5"/><rect class="f" x="3.5" y="4" width="9" height="8" rx="1.5"/><path d="M5.5 6.75h4"/>',
  drawer:
    '<rect class="q" x="1.5" y="2" width="13" height="12" rx="2"/><path class="f" d="M1.5 8.5h13V12a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2Z"/><path d="M6.75 10.5h2.5"/>',
  popover:
    '<path class="f" d="M4 1.5h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9.5L8 11.25 6.5 9.5H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/><path class="q" d="M4.5 4.25h7M4.5 6.75h4.5"/><rect class="q" x="5.5" y="12.75" width="5" height="1.75" rx=".875"/>',
  "preview-card":
    '<rect class="f" x="5" y="1.5" width="9.5" height="8" rx="1.5"/><circle cx="7.5" cy="4.25" r="1"/><path class="q" d="M7 7h5.5"/><path d="M1.5 13h6"/><path class="q" d="M1.5 14.75h6" stroke-dasharray="1 1"/>',
  toast:
    '<rect class="q" x="3.5" y="2" width="9" height="3.5" rx="1.25"/><rect class="f" x="1.5" y="5.5" width="13" height="8" rx="2"/><path d="M4 9.5h5"/>',
  tooltip:
    '<path class="f" d="M3.5 2.5h9a2 2 0 0 1 2 2V7a2 2 0 0 1-2 2H9.25L8 10.5 6.75 9H3.5a2 2 0 0 1-2-2V4.5a2 2 0 0 1 2-2Z"/><path class="q" d="M5 5.75h6"/><path d="M8 13.75h.01" stroke-width="1.75"/>',

  // Menus & tabs
  "animated-tabs":
    '<rect x="1.5" y="4.5" width="13" height="7" rx="2"/><rect class="f" x="7" y="6" width="5.5" height="4" rx="1"/><path class="q" d="M3.25 7h2M3.75 9h1.5"/>',
  "context-menu":
    '<path d="M2 2l4 1.6-1.5.6-.6 1.5Z"/><rect class="f" x="6.5" y="5.5" width="8" height="9" rx="1.5"/><path class="q" d="M8.75 8.5h3.5M8.75 11.5h3.5"/>',
  menu:
    '<rect class="f" x="3" y="2" width="10" height="12" rx="1.75"/><path d="M5.25 5h5.5"/><path class="q" d="M5.25 8h5.5M5.25 11h3.5"/>',
  menubar:
    '<rect x="1.5" y="1.5" width="13" height="3.5" rx="1.25"/><rect class="f" x="3" y="6.5" width="6.5" height="7.5" rx="1.25"/><path class="q" d="M5 9h2.5M5 11.5h2.5"/>',
  "navigation-menu":
    '<path class="q" d="M1.5 3h2.5M12 3h2.5"/><path d="M6.75 3h2.5"/><path class="f" d="M3 6.5h4.25L8 5.5l.75 1H13a1.5 1.5 0 0 1 1.5 1.5v4.5A1.5 1.5 0 0 1 13 14H3a1.5 1.5 0 0 1-1.5-1.5V8A1.5 1.5 0 0 1 3 6.5Z"/>',
  tabs:
    '<rect x="1.5" y="4.5" width="13" height="7" rx="2"/><rect class="f" x="3" y="6" width="5" height="4" rx="1"/><path class="q" d="M10 8h3"/>',

  // Status
  "load-transition":
    '<rect class="q" x="1.5" y="3" width="5.25" height="10" rx="1.5" stroke-dasharray="1.5 1.5"/><path d="M7.5 7l1 1-1 1"/><rect class="f" x="9.25" y="3" width="5.25" height="10" rx="1.5"/>',
  meter:
    '<path class="f" d="M2.5 11.5a5.5 5.5 0 0 1 11 0Z" stroke="none"/><path class="q" d="M2.5 11.5a5.5 5.5 0 0 1 11 0"/><path d="M2.5 11.5a5.5 5.5 0 0 1 3.1-4.95"/><path d="M8 11.5l2.75-3.25"/><path d="M1.5 11.5h13"/>',
  progress:
    '<rect class="q" x="1.5" y="6.25" width="13" height="3.5" rx="1.75"/><rect class="f" x="1.5" y="6.25" width="8" height="3.5" rx="1.75"/>',
  "progress-ring":
    '<circle class="f" cx="8" cy="8" r="5.75" stroke="none"/><circle class="q" cx="8" cy="8" r="5.75"/><path d="M8 2.25a5.75 5.75 0 0 1 5.47 7.53"/>',
  skeleton:
    '<rect class="f" x="1.5" y="2.5" width="13" height="5" rx="1.5" stroke-dasharray="1.5 1.5"/><path class="q" d="M2.25 10.75h11.5M2.25 13.25h6.5" stroke-width="1.75"/>',
  "streaming-text":
    '<path d="M2 3.5h12M2 7h12"/><path class="q" d="M2 10.5h5"/><rect class="f" x="8.25" y="9" width="2" height="3.25" rx=".5"/>',
  "text-shimmer":
    '<path class="q" d="M2 4.5h12M2 8h12M2 11.5h8"/><path class="f" d="M7 2h3.5l-3 12H4Z" stroke="none"/><path d="M5.6 4.5h3.3M4.75 8h3.3M3.9 11.5h3.3"/>',

  // Display
  accordion:
    '<path class="q" d="M1.5 2.75h13M1.5 13.75h13"/><rect class="f" x="1.5" y="5" width="13" height="6.5" rx="1.5"/><path d="M10.5 7.5l1 1 1-1"/>',
  avatar:
    '<circle class="f" cx="8" cy="8" r="6.25"/><circle cx="8" cy="6.75" r="2"/><path d="M4.4 12.4c.9-1.5 2.1-2.3 3.6-2.3s2.7.8 3.6 2.3"/>',
  badge:
    '<rect class="f" x="1.5" y="5" width="13" height="6" rx="3"/><circle cx="4.5" cy="8" r=".9" fill="currentColor" stroke="none"/><path class="q" d="M7 8h5"/>',
  card:
    '<rect x="2" y="2" width="12" height="12" rx="2"/><path class="f" d="M2 7V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3Z"/><path class="q" d="M4.5 9.75h7M4.5 11.75h4"/>',
  carousel:
    '<rect class="f" x="4" y="2.5" width="8" height="8" rx="1.5"/><path class="q" d="M1.5 4.5v4M14.5 4.5v4"/><path d="M8 13.5h.01" stroke-width="1.75"/><path class="q" d="M6 13.5h.01M10 13.5h.01" stroke-width="1.75"/>',
  collapsible:
    '<path d="M2 3.5h7.5"/><path d="M11.75 2.75l1.25 1.25 1.25-1.25"/><rect class="f" x="2" y="6.5" width="12" height="7" rx="1.5"/><path class="q" d="M4.5 10h5"/>',
  "compare-slider":
    '<rect x="1.5" y="2.5" width="13" height="11" rx="2"/><path class="f" d="M8 2.5H3.5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2H8Z" stroke="none"/><path d="M8 1v14"/><path class="q" d="M5.75 7l-1 1 1 1M10.25 7l1 1-1 1"/>',
  "expandable-card":
    '<rect class="q" x="1.5" y="1.5" width="13" height="13" rx="2" stroke-dasharray="1.5 1.5"/><rect class="f" x="1.5" y="8.5" width="6" height="6" rx="1.5"/><path d="M10 6l3-3M10.5 3H13v2.5"/>',
  "scroll-area":
    '<rect x="1.5" y="1.5" width="13" height="13" rx="2"/><rect class="f" x="11" y="3.5" width="1.75" height="5" rx=".875"/><path class="q" d="M4 5h4.5M4 8h4.5M4 11h3"/>',
  separator:
    '<rect class="f" x="3" y="2.5" width="10" height="3" rx="1"/><path d="M1.5 8h13"/><rect class="q" x="3" y="10.5" width="10" height="3" rx="1"/>',
  text:
    '<rect class="f" x="1.5" y="5.25" width="8" height="2.5" rx=".6" stroke="none"/><path d="M2 3.5h12M2 6.5h12M2 9.5h12"/><path class="q" d="M2 12.5h7"/>',

  // Lists
  "animated-list":
    '<rect class="f" x="3.5" y="2" width="11" height="3.5" rx="1.2"/><path class="q" d="M1.25 3.75h1"/><rect class="q" x="1.5" y="7.25" width="13" height="2.75" rx="1"/><rect class="q" x="1.5" y="11.5" width="13" height="2.75" rx="1"/>',
  sortable:
    '<path class="q" d="M1.5 2.5h13M1.5 13.5h13"/><rect class="f" x="1.5" y="5.75" width="13" height="4.5" rx="1.25"/><path d="M4 7.25h.01M4 8.75h.01M5.5 7.25h.01M5.5 8.75h.01" stroke-width="1.5"/>',
  "stagger-list":
    '<rect x="1.5" y="2.25" width="9" height="2.75" rx="1"/><rect class="f" x="3.5" y="6.625" width="9" height="2.75" rx="1"/><rect class="q" x="5.5" y="11" width="9" height="2.75" rx="1"/>',
  "swipeable-row":
    '<rect class="f" x="1.5" y="4.5" width="9" height="7" rx="1.5"/><path class="q" d="M12 4.5h1a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-1"/><path d="M7.5 8h-3.5M5.25 6.75 4 8l1.25 1.25"/>',

  // Effects
  "animated-icon":
    '<path class="q" d="M1.5 5.5v-2a2 2 0 0 1 2-2h2M14.5 10.5v2a2 2 0 0 1-2 2h-2"/><rect class="f" x="3.5" y="3.5" width="9" height="9" rx="2.5"/><path d="M6 8.25l1.4 1.4 2.6-3"/>',
  marquee:
    '<path class="q" d="M1.5 3.5h13M1.5 12.5h13"/><rect class="f" x="4.5" y="6.25" width="4.5" height="3.5" rx="1"/><path d="M14.5 6.25H12a1 1 0 0 0-1 1v1.5a1 1 0 0 0 1 1h2.5"/><path class="q" d="M1.5 6.25H2a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1h-.5"/>',
  "number-ticker":
    '<path class="q" d="M6 1.5h4M6 14.5h4"/><rect class="f" x="4" y="3.5" width="8" height="9" rx="1.5"/><path d="M7.25 6.25 8.5 5.25v5.5"/>',
  "scroll-progress":
    '<path d="M2 1.75h7" stroke-width="1.75"/><path class="q" d="M9 1.75h5" stroke-width="1.75"/><rect class="f" x="2" y="4" width="12" height="10.5" rx="1.5"/><path class="q" d="M4.5 7.5h7M4.5 10.5h5"/>',
  "scroll-reveal":
    '<path class="q" d="M5.5 4 8 2l2.5 2"/><rect class="f" x="2.5" y="6.5" width="11" height="7" rx="1.5"/><path d="M5 10h6"/>',
  "text-morph":
    '<path class="q" d="M1.5 11.5 4 4.5l2.5 7M2.4 9h3.2"/><path class="q" d="M7.5 8h.01M8.75 8h.01" stroke-width="1.5"/><path class="f" d="M10.25 4.5h2.25a1.75 1.75 0 0 1 0 3.5h-2.25ZM10.25 8h2.5a1.75 1.75 0 0 1 0 3.5h-2.5Z"/>',
};
