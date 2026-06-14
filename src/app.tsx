import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';
import { routeTree } from './routeTree.gen';

// Use hash history so routing works when the packaged app is served from
// file://.../index.html. With the default browser history the initial URL is
// the on-disk file path (which matches no route → "Not Found" on launch); hash
// history keeps routes after `#`, independent of the file path. Works the same
// in dev (http://localhost) and in production (file://).
const router = createRouter({ routeTree, history: createHashHistory() });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = createRoot(document.getElementById('root')!);
root.render(<RouterProvider router={router} />);
