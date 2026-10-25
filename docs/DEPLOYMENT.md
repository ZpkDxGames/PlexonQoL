# Verification and deployment procedure

## One local milestone, one publication

1. Make all related file changes locally on a working branch.
2. Run `npm ci` and `npm run check` before publication. Inspect the rendered app at 375px, 768px, and 1440px, including direct tool URLs and the mobile dashboard shortcut.
3. Commit all milestone files together. Publish one branch update; do not push intermediate single-file edits.
4. For an established repository, open one PR and squash the validated milestone to `main`. For an empty repository initialized through the connector, a root bootstrap commit may be necessary before a single consolidated scaffold commit.
5. Check the GitHub `Verify` workflow. Fix failures locally and group any necessary corrections into one follow-up update.

## Vercel configuration

The repository contains configuration only. Creating a Vercel project or issuing a deployment is a separate operation.

- Framework: Next.js.
- Node.js: 24.x.
- Install: `npm ci`.
- Build: `npm run build`.
- Output Directory: `.next` (the Next.js build metadata directory).
- Production branch: `main`.
- Required environment variables: none.

Keep `output: "export"` in `next.config.ts`. Next.js writes the deployable static files to `out/`, while the Vercel Next.js adapter reads its build manifests from `.next/`. Setting Vercel's Output Directory to `out` makes that adapter search for `out/routes-manifest.json` and fail with `NEXT_NO_ROUTES_MANIFEST` after an otherwise successful build. The explicit `.next` value in `vercel.json` matches the Next.js build directory and overrides an incorrect project-level Output Directory setting. The adapter detects the completed static export and publishes its assets. For local preview or a generic static file host, continue serving `out/`.

`git.deploymentEnabled` disables every branch via `"**": false` and explicitly enables `main`. The documented Vercel rule is that a matching `true` rule wins. Add a specific preview branch only when a preview is wanted. See [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).

GitHub Actions concurrency cancels redundant verification work; it does not cancel or throttle Vercel project builds. Keeping branch previews disabled and publishing consolidated milestones reduces unnecessary deployment triggers, but does not promise avoidance of an account-wide quota shared with other projects. Do not repeatedly redeploy an unchanged commit after a limit response.

## Local production preview

```sh
npm run build
npm start
```

The small static preview server binds only to `127.0.0.1`, supports GET/HEAD, serves `out/`, and is for local verification. Vercel serves the static export directly; it does not run this preview server. Font files and all calculations/data are local assets. External dashboard links navigate normally and do not share application state.
