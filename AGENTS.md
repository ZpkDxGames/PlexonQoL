# PlexonQoL engineering guide

Scope: the PlexonQoL utility workspace only. Use `README.md` and `docs/DATA_CONTRACTS.md` for current behavior and limitations. The dashboard reference is a separate repository and is not to be modified as part of this scaffold.

- Keep Next.js App Router, TypeScript strict mode, Tailwind CSS, Lucide, and static export support.
- Keep tool logic client-side, with pure models under each `src/modules/*/` directory. Do not add databases, authentication, external APIs, or runtime environment secrets without a feature requirement.
- Keep the exact `https://plexon-panel-dashboard.vercel.app/` one-click shortcut in the global header and the sidebar footer, including mobile navigation.
- Preserve versioned, validated browser storage. Do not read browser-only APIs during server rendering or overwrite saved data during hydration.
- Label incomplete data and schematic assets. Never invent PlexonCraft item IDs, recipes, server connection details, or live status.
- Before Next.js-specific changes, read the matching installed documentation in `node_modules/next/dist/docs/`.
- Run `npm run check` and browser verification for affected flows before publishing. Keep 3×3 recipe grids intact on mobile, maintain modal focus behavior, and honor reduced motion.
- Publish related changes in one consolidated commit per milestone. Keep Vercel preview guardrails. Avoid single-file API commits in a loop.
- Section 3's Claude skill authoring is a separate follow-up. Do not claim it has been delivered by Section 2.
