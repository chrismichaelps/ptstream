import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import { NextUIProvider, Switch } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { I18nextProvider } from "react-i18next";
import { EffectProvider } from "./contexts/EffectContext";
import {
  StoreProvider,
  useCurrentScene,
  useSelectedGenre,
  useStoreDispatch,
  setScene,
  setGenre,
  resetGenre,
} from "../packages/store";

import Root from "./scenes/root";
import TvIcon from "./components/Icons/TvIcon";
import MovieIcon from "./components/Icons/MovieIcon";
import Search from "./components/scenes/Search";
import MyFa from "./components/scenes/MyFavorites";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import GenreSelector from "./components/GenreSelector";
import Setting from "./components/Setting";
import { Scene, SceneProps } from "./types";
import i18n from "./localization/i18n";

import "./index.css";

const queryClient = new QueryClient();

const scenes: Record<Scene, SceneProps> = {
  series: {
    icon: TvIcon,
  },
  movies: {
    icon: MovieIcon,
  },
};

function App() {
  const { resolvedTheme } = useTheme();
  const location = useLocation();
  const dispatch = useStoreDispatch();

  const currentScene = useCurrentScene() || "series";
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
    const newScene = e.target.checked ? "movies" : ("series" as Scene);
    switchScene(newScene);
  };

  const SceneIcon = scenes[currentScene as Scene]?.icon || TvIcon;

  return (
    <div
      className={`min-h-screen w-full ${
        resolvedTheme === "dark"
          ? "bg-black text-white"
          : "bg-white text-gray-900"
      }`}
    >
      <header className="flex justify-between items-center p-4">
        <NavBar />
        <div className="flex gap-4 items-center">
          {location.pathname === "/" ? (
            <Switch
              defaultChecked={currentScene === "series"}
              size="md"
              color="default"
              onChange={handleSceneSwitch}
              thumbIcon={({ className }) => <SceneIcon className={className} />}
            />
          ) : null}
          {location.pathname !== "/search" ? (
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
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/search" element={<Search />} />
          <Route path="/myFavorites" element={<MyFa />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <EffectProvider>
    <StoreProvider>
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <I18nextProvider i18n={i18n}>
              <Router>
                <div className="px-2 mx-1 sm:mx-2 lg:mx-4">
                  <App />
                </div>
              </Router>
            </I18nextProvider>
          </NextThemesProvider>
        </QueryClientProvider>
      </NextUIProvider>
    </StoreProvider>
  </EffectProvider>
);
