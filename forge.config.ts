import { execFileSync } from 'node:child_process';
import path from 'node:path';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { PublisherGithub } from '@electron-forge/publisher-github';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'ptstream',
    asar: true,
    // The Vite plugin would otherwise auto-set `ignore` to exclude EVERYTHING
    // except `/.vite`. We keep that (the app is fully bundled by Vite — see
    // vite.base.config.ts) but ALSO ship one extra subtree:
    // @cliqz/adblocker-electron (bundled into main.js) calls
    // `require.resolve('@cliqz/adblocker-electron-preload')` at runtime to give
    // Electron an on-disk preload path. That resolve needs the package
    // physically present, so we keep just that 160 KB subtree (and its declared
    // dep @cliqz/adblocker-content) in node_modules. Everything else stays
    // bundled, keeping the package small.
    prune: false,
    ignore: (file: string) => {
      if (!file) return false; // keep the app root itself
      if (file === '/package.json' || file.startsWith('/.vite')) return false;
      // Keep only the adblocker preload subtree inside node_modules.
      if (file === '/node_modules' || file === '/node_modules/@cliqz') return false;
      if (file.startsWith('/node_modules/@cliqz/adblocker-electron-preload')) return false;
      if (file.startsWith('/node_modules/@cliqz/adblocker-content')) return false;
      return true; // ignore everything else
    },
    // If you are not signing, you can comment this out
    // osxSign: {}
  },
  rebuildConfig: {},
  hooks: {
    // Re-apply a valid ad-hoc signature to the FINAL macOS bundle.
    //
    // Why this is needed (and why the Fuses plugin alone isn't enough):
    // @electron/packager copies a generic `Electron.app`, then the Fuses
    // plugin flips fuses + ad-hoc re-signs it during `packageAfterCopy`.
    // AFTER that, packager renames the bundle to `ptstream.app`, renames the
    // executable, and rewrites Info.plist — which INVALIDATES that signature
    // (`codesign` reports "Info.plist not bound"). With no `osxSign` config,
    // packager never re-signs, so the shipped arm64 app has a broken
    // signature. On Apple Silicon that triggers the misleading
    // "ptstream is damaged and can't be opened" Gatekeeper error for everyone
    // who downloads the release.
    //
    // `postPackage` runs after packager finishes all renaming/plist edits, so
    // signing here seals the final bundle. Ad-hoc (`--sign -`) is free — no
    // Apple Developer ID — users just right-click > Open the first time.
    postPackage: async (_forgeConfig, { platform, outputPaths }) => {
      if (platform !== 'darwin') return;
      for (const outputPath of outputPaths) {
        const appPath = path.join(outputPath, 'ptstream.app');
        execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], {
          stdio: 'inherit',
        });
      }
    },
  },
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'chrismichaelps',
        name: 'ptstream',
      },
      // Publish as a real release (not draft) so update.electronjs.org
      // serves it to running apps immediately.
      draft: false,
      prerelease: false,
      generateReleaseNotes: true,
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
