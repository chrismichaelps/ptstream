import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { pluginExposeRenderer } from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      TanStackRouterVite({
        routesDirectory: './src/routes',
        generatedRouteTree: './src/routeTree.gen.ts',
      }),
      pluginExposeRenderer(name),
    ],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig;
});
