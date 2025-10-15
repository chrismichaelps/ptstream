import { Context, Effect, Layer } from "effect";
import { Scene } from "../../../src/types";

export interface AppStateService {
  readonly getCurrentScene: () => Effect.Effect<Scene, never, never>;
  readonly setCurrentScene: (scene: Scene) => Effect.Effect<void, never, never>;
  readonly getSelectedGenre: () => Effect.Effect<number | null, never, never>;
  readonly setSelectedGenre: (genre: number | null) => Effect.Effect<void, never, never>;
  readonly resetGenre: () => Effect.Effect<void, never, never>;
}

export const AppStateService = Context.Tag("AppStateService")<AppStateService, AppStateService>();

const makeAppStateService = (): AppStateService => {
  let currentScene: Scene = "series";
  let selectedGenre: number | null = null;

  return {
    getCurrentScene: () => Effect.sync(() => currentScene),

    setCurrentScene: (scene: Scene) => Effect.sync(() => {
      currentScene = scene;
    }),

    getSelectedGenre: () => Effect.sync(() => selectedGenre),

    setSelectedGenre: (genre: number | null) => Effect.sync(() => {
      selectedGenre = genre;
    }),

    resetGenre: () => Effect.sync(() => {
      selectedGenre = null;
    })
  };
};

export const AppStateServiceLive = Layer.succeed(AppStateService, makeAppStateService());
