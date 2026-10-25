# Section 2 verification record

Date: 2026-10-25. Scope: the PlexonQoL scaffold and its six routes, using the production static export. Reference repository: PlexonPanel-Dashboard `main` at `8f6c907235766e9033b4f8a443b7384d160f9392`.

The user story is a player choosing a utility from the shared shell, editing browser state, and receiving a local calculation or static-data view. Saved state is restored from browser storage; the dashboard bridge is an ordinary external link. No API or database boundary is required.

## Automated checks

| Check                          | Result                                               |
| ------------------------------ | ---------------------------------------------------- |
| Clean locked install, `npm ci` | Passed                                               |
| `npm run lint`, zero warnings  | Passed                                               |
| `npm run typecheck`            | Passed                                               |
| `npm test`                     | 7 tests passed                                       |
| `npm run build`                | Passed; all six workspace routes exported statically |
| Post-format lint/typecheck     | Passed                                               |
| Git whitespace check           | Passed                                               |

The tests cover negative-coordinate floor division; destination Y limits and distance; obsidian frame costs; invalid saved portal data; negative region boundaries; 16/64-item storage capacities; hopper timing; armor URL parsing/round trips and turtle-slot restrictions; duplication costs; anvil transfer direction, prior work, conflicts and the 40-level ceiling; and catalog reference integrity.

## Browser checks

Chromium was driven against `npm start` serving the built `out/` directory on localhost.

- Inspected the overview and tool screens at 1440px, 768px, and 375px widths. All six routes were checked for horizontal overflow at both smaller widths.
- Confirmed the visible header bridge and exact PlexonPanel URL; opened and dismissed the mobile navigation dialog and confirmed its footer bridge.
- Opened command search, searched for `diamond`, and navigated into the filtered recipe browser.
- Pinned Diamond Pickaxe with `A`, reloaded, and confirmed browser-storage persistence.
- Entered Overworld X = −9 and observed Nether X = −2; saved `QA Base`, reloaded, and confirmed the waypoint remained.
- Loaded a shared four-slot armor URL, verified the turtle helmet and iron chestplate state, changed the trim material, and observed the serialized URL update.
- Confirmed the default anvil plan costs 14 total levels. Selected Infinity and Mending on a bow and observed the incompatibility message.
- Entered block Z = −513 and observed `r.-1.-2.mca` for the default X = −1.
- Confirmed the recipe grid remains nine cells in three rows/columns at 375px.
- No page exceptions, console errors, or failed asset/data requests were observed. Canceled speculative HEAD probes were recorded separately; explicit HEAD requests to all six routes returned 200.

## Boundaries and next content milestones

Recipe coverage is a 34-item, 23-recipe Java 1.21.1 starter dataset. Custom plugin definitions remain explicitly empty pending verified configuration/export. Armor and item visuals are schematic. The bounded anvil solver does not model all in-game anvil operations. These limits are documented in the UI and data contracts.

The workflow is configured to run the same verification steps on pull requests and pushes to `main`. This local record does not claim that a remote Actions run or a Vercel deployment has succeeded; check the corresponding GitHub run after publication. No Vercel project creation or manual deployment is part of this scaffold operation.
