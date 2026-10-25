# PlexonQoL

A local-first Minecraft utility workspace, with a persistent one-click shortcut to [PlexonPanel Dashboard](https://plexon-panel-dashboard.vercel.app/).

Next.js App Router, React, TypeScript, Tailwind CSS 4, and Lucide icons. Every tool runs in the browser. Production is a static export in `out/`; there is no database, account system, backend API, or required environment secret.

## Develop and verify

Use Node.js 24 LTS and npm. The committed lockfile is authoritative.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`. To verify and preview the production output:

```sh
npm run check
npm start
```

Both local commands bind to `127.0.0.1`. `npm start` serves the generated static output; run the build first. Set `PORT` if another local application uses 3000.

## Workspace

| Route                     | Client module                        | Included behavior                                                                                                                     |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                       | `src/app/page.tsx`                   | Bento overview and direct tool links                                                                                                  |
| `/nether-calculator/`     | `src/modules/nether-calculator/`     | Bidirectional X/Z conversion, independent/clamped Y, distance and radius planning, frame cost, saved pairs                            |
| `/armor-trims/`           | `src/modules/armor-trims/`           | Four-slot state, 18 patterns, 10 materials, six armor bases plus turtle helmet, layered schematic SVG, URL sharing, duplication costs |
| `/jei-recipes/`           | `src/modules/jei-recipes/`           | Fuzzy starter item index, station-specific recipe inspection, recipe/uses navigation, pins, plugin data boundaries                    |
| `/enchantment-optimizer/` | `src/modules/enchantment-optimizer/` | Exact bounded fresh-book transfer solver, directed merges, prior-work penalties, incompatible enchantment validation                  |
| `/world-math/`            | `src/modules/world-math/`            | Chunk/region/local coordinates, storage conversion, hopper clock estimate                                                             |

Shared chrome lives in `src/components/layout/{AppShell,Sidebar,Topbar,CommandPalette}.tsx`. Shared controls live in `src/components/ui/`. Calculators are pure functions beside each module and are tested independently.

## Keyboard and browser storage

- `Cmd/Ctrl + K` or `/`: open command/recipe search.
- In the recipe browser, focus or hover an item and press `R` for recipes, `U` for uses, or `A` to toggle a pin.
- Portal pairs, recipe pins, and the coordinate scratchpad are stored under `plexon-qol:v1:*` in this browser only. No data is sent to PlexonPanel.
- Armor selections are encoded in the shareable URL: `?h=netherite:silence:amethyst&c=...&l=...&b=...`.
- Native modal dialogs provide focus containment and Escape dismissal; reduced-motion preferences are respected.

## Data scope

The starter data target is **Minecraft Java 1.21.1**. This deliberately matches the handoff's 18 trim templates and 10 materials, rather than claiming completeness for all later `1.21+` releases or Paper versions.

- `src/data/armor-trims.json`: metadata, palette colors, slot compatibility, and template duplication ingredients.
- `src/data/recipes.json`: a small hand-authored starter catalog, not a full vanilla index. Item glyphs are schematic placeholders. Each PlexonCraft plugin has an empty, explicit `awaiting-verified-export` boundary; no server recipes or private item IDs are invented.
- `src/data/enchantments.json`: 42 Java 1.21.1 enchantments, levels, compatibility/exclusions, and anvil transfer multipliers.

The armor renderer previews colors and distinct schematic motifs. It does **not** reproduce vanilla UV textures. Texture licensing/provenance, an exhaustive recipe import, and verified server-specific exports are future content milestones. See [docs/DATA_CONTRACTS.md](docs/DATA_CONTRACTS.md).

The anvil solver minimizes the sum of **level costs** for at most eight distinct fresh books. It does not model repairing durability, renaming, existing enchantments, or combining duplicates. XP points depend on the player's level before each operation and are not presented as interchangeable with levels.

## CI and deployment budget

`.github/workflows/verify.yml` runs `npm ci`, lint, typecheck, calculator/data tests, and production build on pull requests and pushes to `main`. Concurrent verification runs for the same ref are canceled.

`vercel.json` configures the static `out/` directory and permits Git deployments only for `main`. Development branches still receive GitHub CI verification. To deliberately enable a preview branch, add an explicit `true` entry for that branch in the deployment map as part of a consolidated milestone.

Create and validate changes locally, then publish **one consolidated commit per milestone**. Do not use the single-file Contents API in a loop. GitHub CI concurrency does not limit Vercel deployments or reset account-level quotas. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Design reference

The source reference is `ZpkDxGames/PlexonPanel-Dashboard` at verified `main` commit `8f6c907235766e9033b4f8a443b7384d160f9392`, inspected on 2026-10-25. The shared obsidian palette, local Manrope/JetBrains Mono fonts, fine borders, semantic domain colors, and persistent navigation inform this shell. PlexonQoL uses the labeled 250px sidebar requested by its own handoff; no relay, authentication, or server-control code is copied.

This is the Section 2 implementation. Section 3's Claude-authored refinement skill remains a separate handoff.
