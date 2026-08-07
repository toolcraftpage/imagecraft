// Centralized z‑index design tokens (mirrored as CSS variables in globals.css)
export const Z_INDEX = {
  background: 0,
  workspace: 1,
  canvas: 2,
  toolbar: 10,
  sidebar: 10,
  dropdown: 50,
  popover: 60,
  modal: 100,
  toast: 110,
  tooltip: 120,
} as const;