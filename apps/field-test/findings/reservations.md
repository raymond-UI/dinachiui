# Reservations: Data Table and Detail List at 94,704 rows

Screen: `/reservations` (`src/app/reservations/page.tsx`, `src/components/reservations/`).
Client mode virtualizes every row; server mode drives `rowCount` with controlled sort,
filters and pages over a 300ms fake fetch that fails 8% of the time.

All timings are from the dev server in agent-browser (CDP attached), with
`console.timeStamp` and `performance.measure` stubbed after the first runs showed React's
dev performance tracks were most of the cost. Treat them as relative numbers; a production
build will be several times faster. Paths below are under `src/components/ui/`.

## Measurements

| Action (94,704 rows, client mode) | Time |
|---|---|
| Data generation (`hotel()`) | 126ms |
| DOMContentLoaded / mount effect | 1,659ms / 3,625ms |
| Sort a column, tracks on | 4.7 to 7.5s |
| Sort a column, tracks stubbed | 1.7 to 2.7s |
| Of which `Array.sort` | 98ms |
| Of which React render phase | about 390ms (sort model 137ms, selection checks 75ms) |
| Search keystroke, broad match ("K", "s") | 1,390 to 2,400ms |
| Search keystroke, narrow match ("Kem", "smit") | 98 to 250ms |
| Clearing the search | 1,100 to 1,240ms |
| Header checkbox, selects all 94,704 | 291ms |
| Check in on 94,704 selected | 2,787ms |
| Export CSV of 94,704 (11.2MB) | 347ms |
| Density toggle | 131ms |
| Resize by keyboard, per step | 135ms |
| Resize by pointer, worst move | 141ms |
| Scroll, 120px per frame | median 16.5ms, p95 25.6ms, 2 of 60 over 50ms |
| Scroll, 600px per frame | median 20.9ms, p95 62.5ms, 4 of 60 over 50ms |
| Drawer open (Enter on a row) | 195ms |
| Row actions menu open | 39ms |
| Switch to server mode | 93ms, then skeleton |

A CPU profile of one sort put about 97% of the time in React's dev `logComponentRender`
(`console.createTask().run`, `performance.measure`, `addObjectDiffToProperties`), which
scales with the number of fibers that re-render. That number is high because of items 7 and 8.

## Component problems

1. **Data Table, bug: "Move left/right" ignores hidden columns.** `data-table.tsx:836-844`
   indexes into `columnOrder`, which still holds hidden columns, but the menu passes
   indices from `centerIds`, which only holds visible ones (`:1614-1620`, and drop at
   `:1328`). Repro: hide Room, then "Move Hotel right". Nothing visibly moves, because
   Hotel swapped with the hidden Room. Each hidden column to the left shifts every later
   move by one. Fix: map the target to the neighbouring visible id, not an index.
2. **Data Table, bug: selection survives filters with no sign of it.** Select all 94,704,
   then filter to one hotel (27,940 rows). The bar still reads "94704 selected", and
   Check in, Cancel and Export act on all of them. Unchecking the header then clears only
   the visible 27,940 and leaves "66764 selected" with nothing selected on screen.
   `data-table.tsx:622-626` counts `rowSelection` keys, not matching rows. Needs either
   pruning on filter change or a "N hidden by filters" note in the bar (`:1545`).
3. **Data Table, bug: "Select page" selects everything when virtualized.**
   `manualPagination: manual || virtualize` (`data-table.tsx:559`) makes the page every
   row, so the header checkbox labelled "Select page" (`:1262-1269`) selects 94,704. The
   label should be "Select all", or the "Select all N" affordance should apply.
4. **Data Table, API gap: no cross-page selection in server mode.**
   `loadedAll = !manual || data.length >= total` (`data-table.tsx:628`) hides "Select all N"
   whenever `rowCount` is set. Selection does persist across pages ("50 selected" on page
   2), but `selectionActions` receives `rows` mapped from the current page only
   (`:625-626`), so rows from page 1 are missing. The app works around it by reading the
   controlled `rowSelection` ids. Needs an `onSelectAll` (or a selection mode flag) so a
   server can select by query.
5. **Data Table, bug: stale row height after a density change.** `VirtualRows` keeps its
   `estimateSize` (`data-table.tsx:1765`) and never calls `virtualizer.measure()` when
   `rowHeight` changes. Repro: filter to 27,940 rows, scroll to the middle, choose
   Compact. `scrollHeight` stays at 1,340,794px; at 36px it should be about 1,006,000px.
   The scrollbar is a third too long and row offsets are computed at 48px. Overscan (8)
   currently hides the gap. `initialRect` is hardcoded to 452 (`:1768`) whatever
   `maxHeight` is.
6. **Data Table, API gap: no row open.** No `onRowClick` / `onRowOpen` prop
   (`data-table.tsx:117-184`), and Enter on a cell does nothing (`:801-825` handles only
   Space and arrows). Opening the app's own drawer needs `DataTableRowTrigger` with
   `preventDefault()` to suppress the built-in sheet, plus a wrapper `onClick`/`onKeyDown`
   that hit-tests `tr[data-row-id]` and filters out buttons, checkboxes, separators and
   menu items.
7. **Data Table, perf: every state change re-renders every visible row.** `bodyRow`
   (`data-table.tsx:1461-1473`) is a plain function, with no memoized row component, so a
   sort, keystroke or single checkbox re-renders all rows and their cells. Each row also
   mounts its own Base UI Menu tree for `rowActions` (`:1422-1436`). Mounting the menu
   lazily, on first open, and memoizing rows on `row.original` plus selection would cut
   most of the work.
8. **Data Table, perf: unthrottled client search.** `data-table.tsx:942-966` refilters
   94,704 rows across 13 accessors synchronously on every keystroke: 1.4 to 2.4s for a
   broad first letter. Needs `useDeferredValue` or a debounce prop. `allColumns` is
   memoized on `rowActions` (`:500-510`), so an inline `rowActions` also rebuilds every
   column definition per render.
9. **Data Table, perf: O(n) work on every render.** `matching` and `pageSelectable`
   (`data-table.tsx:629-632`) walk every filtered row on every render, and `selectedRows`
   maps every selected id (`:625`). This came to about 75ms per render at 94,704 rows.
10. **Data Table, API gap: selection bar replaces the toolbar.** With anything selected
    (`data-table.tsx:1539`), search, facet chips and the Columns menu disappear, so you
    can't narrow the list while selecting. Filters placed outside the table stay
    reachable, which is how item 2 was found.
11. **Data Table, a11y: focus and announcements during load and error.** Loading swaps
    rows and the footer for skeletons (`data-table.tsx:1666-1667`, `:1683`), so the
    pagination button you pressed unmounts and focus falls to `body`. The same happens
    after "Try again" (`:879-883`). The error block has no `role="alert"`, and the live
    region (`:756`) still announces "Sorted by Total, descending. 27,940 reservations."
    when the fetch failed. The selection bar also vanishes while loading, then returns.
    Nothing keeps the previous rows on screen while loading (a `keepPreviousRows` option).
12. **Data Table, API gap: column order and sizes are uncontrolled.** `sizes` and `order`
    are internal state (`data-table.tsx:469-470`) with no value, default or onChange, so
    layouts can't be saved or restored, unlike every other slice.
13. **Data Table, API gap: one facet only.** `facet` takes one column (`data-table.tsx:129`).
    Hotel and Channel filters had to be built outside the table as multi-selects writing
    into `columnFilters`. There is no toolbar slot to put them beside the search.
14. **Data Table, API gap: no filtered count out.** The table knows it is showing 27,940
    of 94,704 but nothing exposes it (no table instance or `onRowCountChange`), so the
    page title count can't follow filters in client mode.
15. **Data Table, polish: unformatted selection count.** `{selectedCount}`
    (`data-table.tsx:1545`) renders "94704 selected" while every other count uses
    `toLocaleString()`.
16. **Data Table, polish: dev `Date.now()` error under `cacheComponents`.** SSR of
    DataTable logs "Next.js encountered the unstable value `Date.now()`" in dev, reported
    at `data-table.tsx:577`. TanStack's `memo` calls `Date.now()` whenever
    `NODE_ENV === "development"`, because its `debug` option is a function and always
    truthy. Harmless in production, but noisy; a `<Suspense>` boundary is the user's
    only workaround.
17. **Data Table, a11y: column header names include widths.** The snapshot names the Hotel
    header "Hotel 100", because the resize separator inside the `th` contributes its
    value (`data-table.tsx:1345-1357`).
18. **Detail List, API gap: text-only editing.** Values are strings and the editor is a
    text input or textarea (`detail-list.tsx:299-368`). Status needed a custom Select in
    `DetailListDetails`, outside the list's edit, validate and save flow.
19. **Detail List, polish: a draft that is only whitespace is trimmed silently**
    (`detail-list.tsx:305`). Leading and trailing spaces disappear without notice.
    Otherwise it held up: a 2,500 character note was blocked by `validate` with the
    message wired through `aria-describedby`, and a 1,760 character unbroken note
    wrapped inside the 440px drawer with no overflow.
20. **Badge, polish: focus ring on a non-focusable `div`** (`badge.tsx:8`).

What worked: sort, facet counts and paging reset in server mode, the empty state with
Clear filters, the drawer returning focus to the cell that opened it, and status edits
in the drawer updating the row and facet counts at once.

## App problems (this screen)

1. The action notice ("Exported 94,704") never clears.
2. The title count shows all rows, not the filtered count (blocked by item 14).
3. Check in on 94,704 selected takes 2.8s: `patch` copies the full array and the table
   re-renders. It should chunk or skip unchanged rows.
4. Row open relies on the wrapper hit-test from item 6, so it breaks if the table's
   markup changes.
