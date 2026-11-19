# Occupancy, housekeeping and rates

Screens: `/occupancy`, `/housekeeping`, `/rates` (app code in `src/app/<route>/`).
`pnpm exec tsc --noEmit` passes. All three routes return 200 with no server errors.

Numbers are from the dev server (React dev build, Profiler on), Chrome 151, 1440×900.
A production build will be faster; the ratios between cases are the useful part.

Every item below has been confirmed in the browser except where marked **(code)**.
The full 763-room grid's hover and keyboard tests were run once each and then stopped,
because Chrome went past 2 GB.

## Measured

| Case | React render | Click to next paint | DOM elements | JS heap |
|---|---|---|---|---|
| One hotel, 108 rooms × 90 (9,720 cells), mount | 250 ms | | | |
| Room-type table, 6 × 90 (540 cells), mount | 75 ms | | | |
| Switch to All hotels, 763 × 90 (68,670 cells) | 1,769 ms | 3,639 ms | 211,167 | 259 MB |
| Month change at 763 × 90 (Dec 2026) | 1,214 ms | 3,701 ms | 211,166 | 540 MB |
| Month change at 763 × 90 (Jan 2027) | 2,417 ms | 4,782 ms | 211,166 | 629 MB |
| Month change at 763 × 90 (Mar 2027) | 908 ms | 3,125 ms | 211,166 | 860 MB |
| Hover, 540-cell table, with the 763-room grid in the DOM | 62 to 87 ms first, then 7 to 8 ms | 16 to 48 ms, one at 264 ms | | |
| Load `?scope=all` (69,210 cells) | 183 ms mount, then 1,181 ms when scope lands | | 211,166 | 274 MB |
| Hover, 763 × 90 grid, real pointer, 2 moves | 1,126 ms, 858 ms | 1,728 ms, 1,576 ms | | 624 MB |
| Arrow keys, 763 × 90 grid (Right, Down, Left) | 869, 878, 940 ms | 1,528, 1,472, 1,632 ms | | 1,218 MB |

- Heap rose by 600 MB over three month changes and did not come back after 5 s idle.
  No GC was forced, so this may be lag rather than a leak.
- Chrome's process tree at 763 × 90: 2,417 MB after load (renderer 1,127 MB, browser
  315 MB), 2,030 to 2,072 MB during hover and keys. At 108 rooms it sits at 700 MB to
  1.3 GB. The full-grid tests were stopped at that point.
- An earlier pointer sweep over the 763-room grid (8 moves, about 31 px apart) left the
  browser session dead: the next command relaunched Chrome on `about:blank`. A
  renderer crash or OOM is likely but not confirmed.
- SSR HTML: `/housekeeping` is 598 KB, of which the Week Strip is 536 KB (546 days,
  about 980 bytes each). `/occupancy` is 796 KB with the room grid client-only (see A1).

## Findings

### Heat Table

1. **Heat Table: every hover re-renders every cell.** perf.
   `src/components/ui/heat-table.tsx:119` keeps `hover` in state and `:241` sets it on
   `onMouseEnter`. Nothing is memoised, so each move re-runs `cellOf`, `format` and
   `label` for every cell (`:225-263`), and also rebuilds `values` (`:111`).
   Repro: All hotels, move the pointer across the grid.
   Measured: 7 to 8 ms of React per hover on the 540-cell table. On the 763 × 90 grid,
   858 to 1,126 ms of React and 1.6 to 1.7 s from event to paint per pointer move.
   Headers could take the highlight through CSS or a ref, and
   cells could be memoised per row.

2. **Heat Table: no virtualisation, three elements per cell.** perf.
   `heat-table.tsx:233-260` renders `td > span > span` for every cell.
   Measured at 763 × 90: 211,167 DOM elements, 1.2 to 2.4 s React and 3.1 to 4.8 s
   to paint per month change, heap 259 to 860 MB. There is no windowing, and
   `containerRef` on `Table` is not forwarded, so an app can't add one.

3. **Heat Table: the default min and max crash past about 125k values.** bug.
   `heat-table.tsx:112` and `:114` call `Math.min(...values)` and `Math.max(...values)`.
   In V8 the spread throws "Maximum call stack size exceeded" past about 120,000
   arguments. 763 × 90 = 68,670 gets through.
   Confirmed in the app: `/occupancy?scope=all&nights=180&auto` (137k values, no
   `min`/`max`) replaces the whole page with "This page couldn't load", and the dev log
   shows `RangeError: Maximum call stack size exceeded at HeatTableInner
   (src/components/ui/heat-table.tsx:112:31)`. In the browser, 120,000 values work and
   125,000 throw. The app passes `min` and `max` by default, so it is only hit through
   the `auto` test hook. Use a loop instead.

4. **Heat Table: arrow keys scan every filled cell.** perf.
   `heat-table.tsx:145-146` filters `filled` (68,670 entries) twice per key press,
   then `move` (`:140`) sets state, so each arrow press re-renders the whole grid
   (point 1). Measured at 763 × 90: 869 to 940 ms of React and 1.5 to 1.6 s from
   keydown to paint per arrow press. Movement itself is correct (Right, Down, Left
   ended on the right cell), and focus scrolls the cell into view inside an app-made
   scroll container (Ctrl+End scrolled it to 2,318 / 1,694 px).

5. **Heat Table: cell callbacks and hover state are not exposed.** API gap.
   There is no `renderCell` or tooltip slot and no `onCellHover`, `onCellFocus` or
   `onCellClick`. Hover lives in private state (`:119`).
   App workaround: `onMouseOver` and `onFocus` on the table, then parse the
   undocumented `data-cell="r-c"` attribute (`:236`) to show the guest in a readout
   kept outside React so the grid does not re-render for it
   (`src/app/occupancy/occupancy.tsx`, `point` and `Readout`).

6. **Heat Table: fixed cell size.** API gap.
   `heat-table.tsx:251` hard-codes `h-[38px] w-14`, so 90 columns are over 5,000 px
   wide. There is no `density` or size prop.
   App workaround: descendant selectors on `className` (`compact` in `occupancy.tsx`).

7. **Heat Table: no sticky header or row header, and the scroll container can't be styled.** API gap.
   `heat-table.tsx:170` fixes `Table`'s `containerClassName`. The component's own
   `containerClassName` (`:165`) goes to the outer wrapper instead, which is confusing
   because `Table` uses the same name for the scroller.
   App workaround: `[&_[data-slot=table-container]]:max-h-[70vh] overflow-auto`, plus
   sticky `thead th` and `th[role=rowheader]` (`sticky` in `occupancy.tsx`). Header
   cells are `rounded-md` and the table uses `border-spacing-[3px]`, so scrolled cells
   showed through the corners and gaps (very visible in dark mode). The app now adds
   `rounded-none` and a 3px `--background` box-shadow to the sticky cells. App side
   effect: the opaque sticky background overrides the `data-active` row-header tint
   from `lift` (`:77`), so the row header no longer tints on hover. That is an app
   problem caused by the gap.

8. **Heat Table: no separate short label for desktop columns, and no column groups.** API gap.
   The header prints `column` (`:206`). `phoneColumns` applies below 768px only.
   Narrow date columns need "18" on screen but "Wed 18 Nov 2026" for screen readers.
   App workaround: `columns` are day numbers and `label` gives the full date. There is
   no way to group columns by month, so month boundaries are invisible in the header.

9. **Heat Table: the selected cell has no `aria-selected`.** a11y.
   `heat-table.tsx:238` sets only `data-selected` on a `role="grid"` cell. Confirmed:
   after a click the cell is `td[role=gridcell][data-selected]` with no `aria-selected`. Column
   headers are bare day numbers that repeat across months ("1" appears three times),
   so the column header a screen reader announces is ambiguous unless `label` is set.

10. **Heat Table: phone layout squeezes every column into the width.** bug.
    `heat-table.tsx:173` (`max-md:w-full max-md:table-fixed`) and `:253`
    (`max-md:w-full aspect-square`) fit all columns into the viewport. At 390px,
    90 columns come to about 3 px each. Seen: the app-sized 28px cells sit 3 px apart
    and overlap into a smear of grey bars, with no way to read a night. The types table
    (no app sizing) still overflows, pushing the page to 591 px wide at a 390 px
    viewport, because the phone container is `overflow-visible`. The phone layout assumes a handful of columns
    (cohorts). It needs a column cap, or horizontal scroll past a minimum size.

11. **Heat Table: small cells become circles under a large theme radius.** polish.
    `heat-table.tsx:251` uses `rounded-md`. With this theme's `--radius: 1.05rem` and
    24px app-sized cells, every cell renders as a circle (seen in screenshot).

26. **Heat Table: row header name runs `meta` into the label.** a11y.
    `heat-table.tsx:222-223` renders `{row.label}<span class="ms-2">{row.meta}</span>`
    with no text between them. The gap is margin only, so the accessible name of the
    row header is "Standard Queen33" (seen in the accessibility tree), and every
    cell in that row is announced with it. A space or a separate
    `aria-describedby` would fix it.

27. **Heat Table: null cells collapse to zero width.** polish.
    `heat-table.tsx:227` renders a non-value as `<TableCell className="h-auto p-0" />`
    with no size. When a row's later columns are all `null` (start after 1 Apr 2027,
    past the data window), those columns have no width, so their header day numbers
    crowd into one unreadable run at the right. An empty cell should keep the cell
    size and show as blank.

### Year View

12. **Year View: `today` blocks future days.** API gap.
    `src/components/ui/year-view.tsx:117`: `open(d)` requires `d <= today`, and future
    days are outlined and can't be picked (`:205-210`). Occupancy is mostly bookings
    ahead of today. App workaround: `today={WINDOW_END}`. That also changes the
    meaning of "today" for the default heading (`:246`, "in the last 12 months"), so
    the app supplies its own `heading`. It needs an `allowFuture` option, or a
    `max` separate from `today`.

13. **Year View: fixed at 53 weeks, no start prop.** API gap.
    `year-view.tsx:114-116`. The data runs Jan 2026 to Jun 2027, but only Jul 2026 to
    Jun 2027 can be shown. The Month Picker beside it allows Jan to Jun 2026. When the
    value falls outside the view, nothing is outlined. The tab stop falls back to the
    last day (`:193`), and the readout still names the hidden date. Seen: the view
    starts on 29 Jun 2026.

14. **Year View: selection follows focus.** API gap / perf.
    `year-view.tsx:152-163`: each arrow key calls `select`, which fires
    `onValueChange`. Confirmed: every arrow press moved the heat table's start.
    Right/Left move a week and Up/Down a day; Home, End and PageDown do nothing. Here every arrow press re-renders the 763-room grid (1 to 2.4 s
    each, see the table), so arrowing through a week means seconds of lag. There is
    no way to move focus without committing (no Enter to confirm), and no
    Home, End or PageUp/PageDown.

15. **Year View: clicking the picked day sends `null`.** polish.
    `year-view.tsx:212`. When the value drives a view (here the heat table start), a
    second click on the same day tries to clear it. The app ignores `null`
    (confirmed: the day stays pressed). A
    `deselectable={false}` would save every consumer the guard.

### Month Picker

16. **Month Picker: a value outside `min` and `max` is shown, not clamped.** polish.
    `src/components/ui/month-picker.tsx:283` and `:289`. A day picked in the Year View
    after April 2027 gives a start month past `max`. The picker shows it selected and
    disabled at 30% opacity. It is app-reachable here because the Year View can pick
    any day up to Jun 30 2027. Confirmed: after picking 20 Jun 2027, June shows
    `aria-pressed=true` and `aria-disabled=true` at 30% opacity. The app does not clamp, on purpose, so the heat table's
    `null` cells past the window get exercised.

### Week Strip

17. **Week Strip: previous and next week are disabled when the next week is only partly in range.** bug.
    `src/components/ui/week-strip.tsx:195` disables the button when `stop ± 7` is
    outside `min`/`max`, and `:223` drops PageUp/PageDown the same way instead of
    clamping. With `min` = Thu 1 Jan 2026 and the value on Mon 5 Jan, Previous week
    is disabled though 1 to 4 Jan exist. The same happens at the end with
    `max` = Wed 30 Jun 2027. Confirmed: on 5 and 7 Jan 2026 Previous week is disabled
    and PageUp does nothing. On 24 and 28 Jun 2027 Next week is disabled and PageDown
    does nothing. End is not handled. Crossing Nov to Dec and Dec 2026 to Jan 2027 with
    PageDown and arrows works, and Home returns to today.

18. **Week Strip: no year anywhere.** a11y.
    The title (`week-strip.tsx:171-172`, `EEEE d MMMM`) and every day's name (`:240`)
    leave out the year. On a strip that spans 18 months, "Friday 1 January" is
    ambiguous to a screen reader and on screen. Nothing marks where a month starts,
    since only the week gap (`:252`) separates days. Confirmed: stepping into 2027
    gives the title "Fri 1 Jan" and the option name "Friday 1 January, Quiet".

19. **Week Strip: dots are the raw count, capped at 3.** API gap.
    `week-strip.tsx:260`. Any real count (portfolio turnovers here run in the
    hundreds) shows 3 dots every day. Year View has `thresholds` and Week Strip does
    not. App workaround: bucket by the 50th, 75th and 90th percentile, then pass 0 to 3
    as `counts` with `formatCount` naming the level.

20. **Week Strip: renders every day in range.** perf.
    `week-strip.tsx:102` builds all of `min` to `max`, 546 buttons here, with two
    date-fns `format` calls each on every render. Measured: 536 KB of the 598 KB SSR
    HTML for `/housekeeping`.

21. **Week Strip: week buttons are hidden below 768px.** a11y.
    `week-strip.tsx:197` (`max-md:hidden`). On a phone the only ways across weeks are
    swiping, which scrolls but does not select, or the keyboard. There is no visible
    control for switch or voice users. Confirmed at 390px: both buttons are
    `display: none`.

### Comparison Table

22. **Comparison Table: billing is fixed to Monthly and Yearly.** API gap.
    `src/components/ui/comparison-table.tsx:14`, `:22`, `:50-53`, `:240-268`. Plans
    must give `price: Record<"monthly" | "yearly">`, and the toggle can't be relabelled,
    extended or turned off. Nightly hotel rates have no billing period, and the hotel
    toggle the screen needs is a different axis. App workaround: the same price for
    both periods, the billing toggle hidden with
    `[&_[data-slot=comparison-table-billing]]:hidden`, and an app-level
    `ToggleGroup` for the hotel.

23. **Comparison Table: the highlighted plan has no label and no accessible signal.** a11y / API gap.
    `comparison-table.tsx:296-299`: only `data-highlighted`, a tint and a filled
    button. Nothing tells a screen reader which plan is recommended. `name` is a
    string because it also feeds the phone `Select` (`:362`), so it can't hold a badge.
    App workaround: a `Badge` inside `per`. At 390px the phone layout does not show
    `per`, so the badge and any recommended signal vanish there, and the plan
    `Select`s truncate names to "J…" and "G…".

24. **Comparison Table: the call to action is mandatory, and a custom label loses the plan name.** API gap / a11y.
    `comparison-table.tsx:192-208` always renders a button ("Choose {name}" by
    default). A rate sheet for staff has no action per column. The app labels it
    "Book". `:193` uses `cta.label` as the whole name, with no `aria-label` or
    `aria-describedby` tying it to the plan, so the page has six (plus two phone)
    buttons all named "Book".

25. **Comparison Table: features keyed by label.** polish. **(code)**
    `comparison-table.tsx:336` and `:407` key rows by `feature.label`, and `:325` keys
    groups by `group.label`. Two features with the same label in one group collide.
    The rate sheet reuses rate plan names across the "Rate per night" and
    "Cancellation" groups, which is fine only because they are separate groups.

28. **Comparison Table: a wrapping plan name pushes that column's price down.** polish.
    The plan header stacks name, price and `per` with no shared row height, so
    "Standard Queen" wraps to two lines and its price sits a line lower than the other
    five at 1440px. The CTAs stay aligned.

Checked and fine: Comparison Table hotel toggle changes every price, "Only differences"
drops identical rows (Wi-Fi, Rain shower, Advance saver cancellation), and rates are
readable in dark mode. Heat Table and Year View names: grid cells take `label`, Year View
days read "Sunday 1 November 2026: 64% occupied", Month Picker months read
"November 2026" with `aria-pressed` and `aria-current="date"`.

## App-side notes (not component problems)

- A1. The 763-room grid renders client-only (`useSyncExternalStore` mount gate in
  `occupancy.tsx`), so SSR doesn't emit about 69k cells. Initial numbers above are
  client renders.
- A2. Perf probes: a `React.Profiler` around each Heat Table writes to `window.__prof`.
  The measurement scripts are in `/tmp/occ-tools/`.
- A3. The Year View jump does not clamp to the last 90-night start, so jumps after
  1 Apr 2027 show blank (`null`) cells past the window. This is deliberate.
- A4. The Month Picker sets the start to the 1st. A Year View click sets it to that
  day. The Month Picker then shows that day's month.
- A5. The types table footer shows bare numbers ("65"), so screen readers hear no %.
  The footer formatter should add it.
- A6. Year View thresholds were `[60, 75, 85, 95]` while portfolio occupancy peaks at
  73%, so 342 of 371 days shared one shade. Now `[50, 60, 65, 70]` (25 / 95 / 175 / 72
  days across levels 1 to 4).
- A7. The housekeeping `TabsList` used `flex-wrap` against the component's fixed
  `h-10`, so wrapped tabs spilled over the lists below at 390px. Fixed with `h-auto`.
- A8. Test hooks on `/occupancy`: `?scope=all`, `?nights=N`, `?auto` (drops `min` and
  `max` on the room grid).
- A9. Shell, not these screens: at 390px the nav sidebar stays 208px wide, leaving
  about 160px for content, and the dark mode toggle does not survive navigation. Both
  affect every 390px reading above.
