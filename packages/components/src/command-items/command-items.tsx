import type * as React from "react"

/**
 * Something an item can do. Order is part of the contract: `actions[0]` is what Enter
 * runs and `actions[1]` what Mod+Enter runs. The rest are reached from the preview.
 */
export interface CommandAction {
  id: string
  label: string
}

/**
 * One command: a page, an action or a record. Every field is plain data except `icon`
 * and `meta`, which are React nodes, so a list from a server or a model sends the rest
 * and the app adds those two before passing it on.
 */
export interface CommandItem {
  /** Unique across the whole list. */
  id: string
  /** What the row shows and the search matches first. */
  label: string
  /** A second line, also searched. */
  description?: string
  /** The heading the item sits under. Items with the same group are listed together. */
  group?: string
  /** What the item is, such as "Page" or "Order". Shown in the preview. */
  kind?: string
  icon?: React.ReactNode
  /** A key hint, such as "G O" or "⌘ ,". Shown only; binding it is up to the app. */
  shortcut?: string
  /** Trailing text, such as an amount. */
  meta?: React.ReactNode
  /** More words the search matches, not shown. */
  keywords?: string[]
  disabled?: boolean
  /** What it can do. Without them, running the item passes no action. */
  actions?: CommandAction[]
  /** A sub-list. Picking the item opens these in place of the list. */
  items?: CommandItem[]
}

/**
 * How a run was reached: `item-press` picks the row (a click, Enter or an agent's
 * select), `action-press` a button for one action, `keyboard` Mod+Enter.
 */
export type CommandRunReason = "item-press" | "action-press" | "keyboard"

/** Passed to `onRun`. `cancel()` refuses the run, which an agent is told about. */
export interface CommandRunDetails {
  reason: CommandRunReason
  event: Event | undefined
  isCanceled: boolean
  cancel(): void
}

/** True when every word of `query` is in the item's label, description or keywords. */
export function filterCommands(item: CommandItem, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const hay = [item.label, item.description, ...(item.keywords ?? [])].join(" ").toLowerCase()
  return words.every((w) => hay.includes(w))
}
