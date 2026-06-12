# Releases & Automatic Updates

How ptstream is built, distributed, and updated.

## Architecture

```
push to main
    │
    ▼
.github/workflows/release.yml
    │  (skips if a release for package.json's version already exists)
    ▼
electron-forge publish  (macOS / Windows / Linux matrix)
    │
    ▼
GitHub Release  v<version>   ← artifacts: .zip (macOS), Squirrel .exe + RELEASES (Windows), .deb/.rpm (Linux)
    │
    ▼
update.electronjs.org  ← polled hourly by running apps (update-electron-app in src/main.ts)
    │
    ▼
Squirrel downloads + installs the update; applied on next restart
```

- **Publisher**: `@electron-forge/publisher-github` (configured in `forge.config.ts`).
- **Updater**: [`update-electron-app`](https://github.com/electron/update-electron-app) in `src/main.ts`, pointed at the public `chrismichaelps/ptstream` repo through Electron's free update service. It no-ops in development, on Linux, and on unpackaged builds.

## Creating a release

1. Bump the version on a branch: edit `version` in `package.json` (semver — `MAJOR.MINOR.PATCH`).
2. Open a PR into `main`. CI (`ci.yml`) runs typecheck + lint.
3. Merge. The `Release` workflow:
   - reads `package.json`'s version,
   - skips entirely if release `v<version>` already exists (so doc-only merges don't re-publish),
   - otherwise builds on macOS, Windows, and Linux and publishes all artifacts to one GitHub Release with auto-generated notes.

A merge to `main` **without** a version bump publishes nothing — releases are driven by the version field, merges are just the trigger.

You can also trigger the workflow manually from the Actions tab (`workflow_dispatch`).

## Update distribution

| Platform | Mechanism | Notes |
|----------|-----------|-------|
| macOS | Squirrel.Mac via `update.electronjs.org`, served from the `.zip` artifact | **Requires the app to be code-signed.** Unsigned builds will not auto-update (Squirrel.Mac rejects them); users must download manually until signing is configured. |
| Windows | Squirrel.Windows; the `RELEASES` manifest + `.nupkg` are part of the release | Works unsigned, but SmartScreen warns on first install. |
| Linux | None (`.deb`/`.rpm` are plain packages) | Squirrel does not support Linux. Users update via the new release's package. |

Running apps check for updates on startup and then every hour. When an update is downloaded, Squirrel applies it on the next app restart (a "restart to update" dialog is shown by `update-electron-app`).

## Rollback strategy

Auto-update always serves the **latest non-draft, non-prerelease release**. To roll back a bad release `vX.Y.Z`:

1. **Stop the bleeding** — mark `vX.Y.Z` as a *pre-release* (or delete it) in the GitHub Releases UI. update.electronjs.org immediately stops serving it; the previous release becomes "latest" again. Users who already updated stay on the bad version (Squirrel never downgrades).
2. **Ship the fix forward** — revert or fix on `main`, bump to `vX.Y.Z+1`, merge. Updated users converge on the fixed version within an hour or on next launch.

Do not reuse a version number that has ever been published — Squirrel caches by version.

## Future release management

- **Code signing & notarization (macOS)**: required for macOS auto-update. Add `osxSign`/`osxNotarize` to `packagerConfig` in `forge.config.ts` and store the certificate + Apple ID credentials as GitHub Actions secrets.
- **Windows signing**: add a code-signing cert to `MakerSquirrel` config to remove SmartScreen warnings.
- **Staged rollouts / channels**: publish with `prerelease: true` for a beta channel; `update-electron-app` users on the stable channel won't receive it.
- **Changelogs**: release notes are auto-generated from merged PRs (`generateReleaseNotes: true`); keep PR titles user-readable.
- **Version bump automation**: a follow-up could add a `release-please` or changesets workflow so version bumps + changelog PRs are generated automatically instead of edited by hand.

## Known constraints / decisions

- `update.electronjs.org` only works for **public** repos. If the repo ever goes private, switch the updater to `UpdateSourceType.StaticStorage` (S3/R2) or self-host [Nucleus](https://github.com/atlassian/nucleus)/[Hazel](https://github.com/vercel/hazel).
- The `version` in `package.json` is the single source of truth; tags are created by the publisher, never by hand.
- Linux auto-update is intentionally out of scope (no Squirrel support); revisit with AppImage + electron-updater if Linux demand grows.
