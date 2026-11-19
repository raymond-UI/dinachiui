# Production build baseline (before fixes)

`pnpm build && pnpm start` on :3121, same machine, one browser.

| Interaction | Dev | Prod |
|---|---|---|
| Sort 95k rows (until rows change) | 1.7 to 2.7s | 212 to 635ms |
| Search keystroke, broad | 1.4 to 2.4s | 183 to 304ms |
| Search keystroke, narrow | 0.1 to 0.25s | 73ms |
| Select all 94,704 | 291ms | 199ms |
| Heat Table 763 x 90, hover | 1.6 to 1.7s | 338 + 62ms long tasks |
| Heat Table focus | | 326 + 53ms |
| Heat Table arrow key | 1.5 to 1.6s | ~300ms |
| Heat Table DOM | 211k elements | 211k elements, 594MB heap |

## After fixes (prod)

| Interaction | Before | After |
|---|---|---|
| Sort 95k rows | 212 to 635ms | 160 to 549ms |
| Select all 94,704 | 199ms | 106ms |
| Heat Table 763 x 90, rendered cells | 69,210 | 3,060 (virtualized) |
| Heat Table DOM | 211k elements | 10.5k elements |
| Heat Table hover, focus, arrow | ~300 to 400ms long tasks | no long task over 50ms |
| Heat Table scroll, worst frame | | 17ms |
| 137k values, no min/max | crash | renders |
