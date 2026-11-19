# /book: new booking form

Built in `src/app/book/page.tsx`, `src/components/book/booking-form.tsx` and
`src/components/book/availability.ts`. Type-checks clean (`pnpm exec tsc --noEmit`; the only
error is in `src/app/occupancy/page.tsx`, another screen).

Data note: the most sold-out nights any hotel and type has from today on is 56
(Fells, Garden Suite). Most combinations have 0. Fells Garden Suite is the test case below.
The form has a "Stress" checkbox that adds a 720-date blackout list matched by a linear
scan, for the perf run.

Paths are under `src/components/ui/`.

## Component findings

1. **Range picking lets a preview run across sold-out nights and reports a wrong count**.
   Calendar + Date Range Picker. Severity: bug.
   Repro: Fells, Garden Suite. Open Nights, pick 21 Nov, arrow to 29 Nov (27 and 28 are sold
   out). The band paints 21 to 29 straight through 27 and 28, and the footer reads
   "21 Nov to 30 Nov 2026, 9 nights · 9 days". Pressing Enter then drops the range.
   Same in the picker across New Year (Fells Garden Suite, 2 Jan sold out): pick 29 Dec,
   then 3 Jan. The range restarts on 3 Jan and the footer says "3 Jan to 4 Jan 2027, 1 night
   · 1 day" while Apply is disabled. The focus preview reads as a valid one-night stay.
   Cause: `preview` never checks `blocked`, `calendar.tsx:661-666`. The band comes from
   `shown`, `calendar.tsx:670-680`. The readout reads the hover, `date-range-picker.tsx:270-288`.

2. **A range that would cross a disabled day restarts without telling anyone**.
   Calendar. Severity: bug (a11y as well).
   Repro: as above, press Enter on 29 Nov. The value turns into `{ from: 29 Nov, to: null }`.
   The live readout says "29 Nov to ...", Apply goes disabled, and nothing says why.
   `calendar.tsx:656`: `if (blocked(d)) return commit({ from: day, to: null }, details)`.
   `details.reason` is still `"day-press"`, so an app can't tell this case apart. The
   inline calendar works around it in `onInlinePick` by spotting the restart and naming the
   night. The picker can't do the same, because its draft is internal and has no change
   callback (finding 6).

3. **A range end can't land on a disabled day, so stays can't be check-in to check-out**.
   Calendar + Date Range Picker. Severity: API gap.
   In a hotel, the check-out day only has to be free as a check-in day. A sold-out night
   is a fine check-out. `isDateDisabled` disables the cell (`calendar.tsx:504`, `:345`
   `pointer-events-none`), and the picker refuses a disabled `to` (`date-range-picker.tsx:167`).
   Workaround: the range holds the nights, first to last, and check-out is shown as last + 1
   through `formatRange`. Needed: a way to disable a day as a start but not as an end (or
   `isDateDisabled(date, role: "start" | "end" | "inside")`), and a minimum length.

4. **No day content, modifiers or classNames, so no price per night or sold-out styling**.
   Calendar. Severity: API gap.
   `CalendarBaseProps`, `calendar.tsx:183-213`, has no `renderDay`, `dayContent`,
   `modifiers`, `modifiersClassNames` or `components` pass-through. `DayButton` is fixed at
   `calendar.tsx:851`. So price per night can't go on the days, and a sold-out night looks
   exactly like a past one (both are `opacity-50 text-muted-foreground`, `calendar.tsx:345`).
   Screen readers hear only "disabled", not why. Workaround: price per night is listed in
   the summary.

5. **The range readout always says "days"**.
   Date Range Picker. Severity: API gap.
   `date-range-picker.tsx:272` counts `daysBetween + 1` and `:285` prints "days". There is
   no prop to change it. With `formatRange` naming nights, the footer reads
   "21 Nov to 27 Nov 2026, 6 nights · 6 days". Needed: `formatCount` or `unit: "nights"`,
   which would also count check-in to check-out as n, not n + 1.

6. **The Date Range Picker passes through nothing for layout**.
   Date Range Picker. Severity: API gap.
   `calendar(...)`, `date-range-picker.tsx:311-330`, fixes the scroll layout, one column,
   no `captionLayout`, and hard-coded heights. There is no `onDraftChange` or `onPreview`,
   so an app can't explain a refused range (finding 2) or show a price for the draft.
   There is also no `open` / `onOpenChange`.

7. **The Date Picker has no `captionLayout`, so a birth date in 1920 is a long scroll**.
   Date Picker. Severity: API gap.
   `calendarProps`, `date-picker.tsx:245`, carries no `captionLayout`, `layout` or
   `numberOfMonths`, and `DatePickerProps` (`date-picker.tsx:72-102`) has none of them.
   Measured from 12 Mar 1975: each scroll to the top adds 6 months (`GROW`,
   `calendar.tsx:255`), about 44 ms each. One month is about 265 px, so from the default
   anchor (the max, Nov 2008) back to Jan 1920 is about 1,066 months, around 280,000 px of
   scrolling. Keyboard works: Shift+PageUp moves a year at about 71 ms a press (10 presses in
   714 ms), and it clamps at 1 Jan 1920. Typing is the practical path.

8. **Two-digit years are read into the future**.
   Calendar `parseDate`, used by Date Picker. Severity: bug for birth dates.
   `fullYear`, `calendar.tsx:93-98`, puts a two-digit year within 50 years ahead, so
   "12/03/75" is 2075 and a DOB field answers "The latest is Tue, 18 Nov 2008."
   Workaround: `parseBirthDate` in the app, through the `parseDate` prop, picks the past
   century.

9. **Day/month order follows `navigator.language` and ignores the page's language**.
   Calendar `dayFirst`. Severity: polish.
   `calendar.tsx:83`. The page is `lang="en-GB"`, but the browser is `en-US`, so "12/03/1975"
   reads as 3 Dec 1975. Workaround: pass `locale={enGB}`.

10. **The Date Picker hint runs its two parts together in text**.
    Date Picker. Severity: a11y.
    `date-picker.tsx:380-388` puts `<b>` and `<span>` side by side in an `aria-live` region
    with only CSS `gap` between them. `textContent` reads "Wed, 12 Mar 197552 years ago".
    Some screen readers announce it that way. It needs a text separator. Also, `relative`
    (`date-picker.tsx:63`) rounds 53.7 years to "54 years ago", which misstates an age.
    Polish.

11. **Focus is lost when scroll trims the focused month**.
    Calendar (scroll layout). Severity: a11y.
    Repro: open the DOB calendar on 12 Mar 1975 and scroll up about 20 years. The month
    holding the focused day is dropped (`MAX_MONTHS` trim, `calendar.tsx:557-559`), so focus
    falls to the popup `DIV`. The next arrow key does nothing.

12. **Presets that would cross a disabled day disappear without a trace**.
    Date Range Picker. Severity: polish.
    `date-range-picker.tsx:174` filters them out. With Fells Garden Suite, "This weekend"
    (Fri 20 is sold out) and "Next week" vanish, leaving "Tonight" and "Custom". A disabled
    preset with a reason would tell the desk more. The default `pastPresets` are all in the
    past, and with `min = today` only "Today" survives, so a booking app has to pass its own.

13. **Arrow keys skip disabled days. Good, with one gap**.
    Calendar. Severity: none (verified).
    ArrowRight from 18 Nov goes to 21 (19 and 20 are sold out), and from 26 to 29. ArrowUp
    from 18 Nov stays put, since 11 Nov is before min. Tab into the grid lands on the last
    focused day, not the selected start, after the range changed from outside. This is
    react-day-picker's priority, `LastFocused` over `Selected`, in
    `calculateFocusTarget.js`. Polish.

14. **The focus ring is clipped on the last column in the scroll layout**.
    Calendar. Severity: polish.
    The `overflow-x-hidden` scroller (`calendar.tsx:822`) cuts the ring and offset on Sunday
    cells (seen on 29 Nov in the picker).

15. **The paged layout's nav comes first in tab order, and adds a landmark per calendar**.
    Calendar. Severity: a11y polish.
    With `captionLayout="dropdown"`, Tab goes "Go to the Next Month", then Month, Year, a
    day, then the second month's Month and Year. Each calendar adds a `navigation "Navigation bar"`
    landmark with react-day-picker's English labels. `labels` isn't passed (`calendar.tsx:824-875`),
    so even with `locale={enGB}` the nav reads in default English.

16. **Time Slots is a duration booker, with no single-time mode**.
    Time Slots. Severity: API gap.
    Arrival is a point in time. The workaround is `min=840 max=1440 step=30 minDuration=30
    maxDuration=30`. The readout then says "15:30 to 16:00 UK time · 30 min"
    (`time-slots.tsx:179`, `:491-503`), and the last tick reads "24:00" (`:320`, `t <= max`).
    The keyboard works: ArrowRight with no value seeks the first free slot (14:30, since
    14:00 is full), End goes to the last free one (23:00), and arrows step over full slots.

17. **Full slots aren't announced**.
    Time Slots (horizontal). Severity: a11y.
    Busy blocks are `aria-hidden` (`time-slots.tsx:379-387`), and `aria-valuetext` (`:353`)
    names only the picked slot. Arrowing skips full slots silently, so a screen reader user
    can't tell 14:00 was full rather than missing. The group and the slider share one name
    ("Arrival time", `:330` and `:348`), so it is announced twice.

18. **A controlled range is not checked against `isDateDisabled`**.
    Calendar + Date Range Picker. Severity: API gap.
    Repro: pick 21 to 30 Nov on Harbour Standard Queen, then switch to Fells Garden Suite.
    Both calendars keep the band straight across sold-out 27 and 28 Nov, and the picker
    reopens on that range with Apply enabled ("21 Nov to 1 Dec 2026, 10 nights · 10 days").
    Nothing marks the clash. Only the app's own summary says "Saltmarsh Fells has no Garden
    Suite left on Fri 27 Nov 2026." A `rangeRefusal` export or an `invalid` state on the
    picker would let the trigger show it.

19. **The range band is nearly invisible, worst in dark mode**.
    Calendar. Severity: a11y.
    Days inside a range get `bg-secondary` (`calendar.tsx:364`). Against the card that is
    1.07:1 in dark mode (secondary `oklch(0.1844)` on card `oklch(0.133)`) and about 1.2:1 in
    light. Only the two ends are clearly marked, so a 6-night stay reads as two lone days.
    WCAG 1.4.11 asks 3:1 for a state indicator. `aria-selected` is set on the middle days,
    so screen readers are fine.

20. **PageUp and Shift+PageUp stop short of the edges**.
    Calendar. Severity: polish.
    Picker on Fells Garden Suite, focus 28 Jun 2027. Shift+PageUp does nothing (28 Jun 2026
    is before min; it doesn't clamp to min). PageUp seven times stops at 28 Dec 2026: 28 Nov
    is sold out, so react-day-picker retries a month further back, hits min, and gives up.
    November can't be reached by PageUp from the 28th. Arrows still work.
    The DOB picker did clamp to 1 Jan 1920, because that target was exact.

21. **The first month dropdown offers a month it then ignores**.
    Calendar (paged, two months, `captionLayout="dropdown"`). Severity: polish.
    With max 30 Jun 2027, picking 2027 in the first Year select jumps to May (so two months
    fit). The first Month select then lists Jun as enabled, and choosing it does nothing.

22. **Time Slots `now` is the caller's job, in whatever zone `timeZone` names**.
    Time Slots. Severity: API gap.
    `timeZone` is a display string only (`time-slots.tsx:78`, `:179`) and `now` is minutes
    (`:88`). An app that reads `new Date().getHours()` shades the wrong slots for any desk
    not in the hotel's zone: in Asia/Beirut at 19:28 UK time the marker sat at 21:28.
    A `timeZone` that took an IANA id and worked out `now` itself would close this.
    Also, the hint under the track says "Drag across free time", which is pointer-only.

## App findings (fixed in app code)

A. **The nights loop dropped a night where DST starts at midnight**. I wrote `nightsOf` as
   `d <= to` over `seed.addDays`, which keeps the hour. In Asia/Beirut, 28 Mar 2027 starts
   at 01:00, so 26 to 29 Mar gave 3 nights instead of 4. Run under `TZ=` in node for London,
   Santiago, Beirut and Havana, late March and late October. It now counts calendar days.
   The calendar's own helpers (`calendar.tsx:16-35`) rebuild dates from Y/M/D and gave the
   right answer in every zone.

B. The inline calendar was too wide. Three months overflowed, and so did two at 3rem: 696 px
   in a 656 px column at a 1280 px viewport, hiding Sundays and the next arrow in December.
   Now two months at 2.75rem (640 px). There is no responsive `numberOfMonths`.

C. The stay label dropped the start year across New Year ("29 Dec to 4 Jan 2027"). It now
   reads "29 Dec 2026 to 4 Jan 2027".

D. The arrival "now" came from the browser's clock, so a desk outside the UK shaded the
   wrong slots (finding 22). It now reads Europe/London through `Intl.DateTimeFormat`.

## Verified working

- Keyboard-only path: hotel and type selects, picker open, Enter on a start and an end,
  Apply. Focus returns to the trigger, and the inline calendar shows 21 to 26 Nov as
  selected. Then arrival by arrows, name, email, DOB by ArrowDown, Shift+PageUp and Enter.
  Book with missing fields focuses the stay picker and lists the errors.
- The DOB calendar clamps at 1 Jan 1920. Day labels follow `locale` ("Wednesday,
  12 March 1975, selected").

- Keyboard submit end to end: "Booked SM-200408" with guest, room, stay, arrival 14:00 and
  £755, and focus moves to the confirmation heading.
- Max edge: 27 to 30 Jun 2027 books, with check-out 1 Jul. PageDown, End and ArrowRight
  all stay on 30 Jun. The Month select disables Jul to Dec 2027.
- Dec/Jan: 29 Dec 2026 to 3 Jan 2027 gives 6 nights and £763, and the inline calendar
  follows to Dec 2026 and Jan 2027.
- Switching hotel or type re-validates at once. The summary marks each sold-out night and
  names the first.
- DST, with the page timezone set over CDP (`Emulation.setTimezoneOverride`):
  - Asia/Beirut, where 28 Mar 2027 starts at 01:00: 26 to 29 Mar gives 4 nights and selects
    26, 27, 28 and 29.
  - America/Santiago, where clocks go back at midnight on 4 Apr 2027: 2 to 5 Apr gives
    4 nights.
  - The picker's footer and band matched in both zones.
- Dark mode: text, disabled days, selects and the summary all read fine, apart from the
  range band (finding 19).

## Performance

The 720-date blackout list is checked with a linear `.some()` scan per day. It disables
180 of the 225 days in the window.

| Measure | Matcher off | 720-date matcher |
| --- | --- | --- |
| Inline day click, React Profiler (median of 20) | 7.0 to 8.0 ms | 6.4 to 6.5 ms |
| Inline day click, to next frame | 15.5 to 20.2 ms | 16.1 to 16.5 ms |
| Turning the matcher on or off, Profiler | 12 to 30 ms | 13 to 35 ms |
| Opening the picker (8 months), Profiler | 10 to 60 ms | 10 to 26 ms |

The two columns are within noise of each other. Running the matcher over all 225 days
takes 0.09 ms in the page. The matcher costs nothing measurable at this size; the
calendar's own render, about 7 ms a click, is what a click costs. The first picker open
was 60 ms (cold). One scroll-growth step took 333 ms once; the rest were 31 to 35 ms.

## Not confirmed in the browser

- Finding 12's second half, the default `pastPresets`, is from code. The app passes its
  own presets.
