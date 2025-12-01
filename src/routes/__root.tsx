import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextUIProvider, Switch } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { I18nextProvider } from 'react-i18next';
import { EffectProvider } from '../contexts/EffectContext';
import { StoreProvider, useCurrentScene, useSelectedGenre, useStoreDispatch, setScene, setGenre, resetGenre } from '../../packages/store';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import GenreSelector from '../components/GenreSelector';
import Setting from '../components/Setting';
import { Scene } from '../types';
import TvIcon from '../components/Icons/TvIcon';
import MovieIcon from '../components/Icons/MovieIcon';
import i18n from '../localization/i18n';

const queryClient = new QueryClient();

type SceneConfig = {
  icon: React.ReactElement;
};

const scenes: Record<Scene, SceneConfig> = {
  series: {
    icon: <TvIcon />,
  },
  movies: {
    icon: <MovieIcon />,
  },
};

function RootComponent() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const dispatch = useStoreDispatch();

  const currentScene = useCurrentScene() || 'series';
  const selectedGenre = useSelectedGenre();

  const reset = () => {
    dispatch(resetGenre());
  };

  const switchScene = (scene: Scene) => {
    dispatch(setScene(scene));
    reset();
  };

  const handleGenreChange = (genre: number | null) => {
    dispatch(setGenre(genre));
  };

  const handleSceneSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScene = e.target.checked ? 'movies' : ('series' as Scene);
    switchScene(newScene);
  };

  const sceneIcon = scenes[currentScene]?.icon || scenes.series.icon;
  const isRootPath = router.state.location.pathname === '/';

  return (
    <div
      className={`min-h-screen w-full ${resolvedTheme === 'dark'
        ? 'bg-black text-white'
        : 'bg-white text-gray-900'
        }`}
    >
      <header className="flex justify-between items-center p-4">
        <NavBar />
        <div className="flex gap-4 items-center">
          {isRootPath ? (
            <Switch
              defaultChecked={currentScene === 'series'}
              size="md"
              color="default"
              onChange={handleSceneSwitch}
              thumbIcon={() => sceneIcon}
            />
          ) : null}
          {router.state.location.pathname !== '/search' ? (
            <GenreSelector
              selectedGenre={selectedGenre}
              onGenreChange={handleGenreChange}
            />
          ) : null}
          <div className="ml-10">
            <Setting />
          </div>
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export const Route = createRootRoute({
  component: () => (
    <EffectProvider>
      <StoreProvider>
        <NextUIProvider>
          <QueryClientProvider client={queryClient}>
            <NextThemesProvider attribute="class" defaultTheme="light">
              <I18nextProvider i18n={i18n}>
                <div className="px-2 mx-1 sm:mx-2 lg:mx-4">
                  <RootComponent />
                </div>
              </I18nextProvider>
            </NextThemesProvider>
          </QueryClientProvider>
        </NextUIProvider>
      </StoreProvider>
    </EffectProvider>
  ),
});
