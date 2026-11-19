# Saltmarsh Hotels field test

A hotel operations console that stress-tests the calendar and table sets with real volume: 94,704 reservations across 763 rooms, generated deterministically in `src/lib/data`.

Components in `src/components/ui` were installed with `dinachi init` and `dinachi add`, so the CLI and templates are tested too. To retest after a component change, copy the new templates over them.

| Route | Components |
|---|---|
| `/reservations` | Data Table (client and server mode), Detail List, Drawer |
| `/book` | Date Range Picker, Calendar, Time Slots, Date Picker |
| `/occupancy` | Heat Table (`?scope=all` for 763 x 90, `?nights=180&auto` for 137k values), Year View, Month Picker |
| `/housekeeping` | Week Strip, Table, Tabs |
| `/rates` | Comparison Table |

```bash
pnpm dev     # :3120
pnpm build && pnpm start   # :3121, measure here
```

`findings/` holds what the first run found and the before and after numbers on a production build.
