import { Effect } from "effect";
import { useEffectSync } from "../contexts/EffectContext";
import { AppStateService, AppStateServiceLive } from "../../packages/services";
import { Scene } from "../types";

// Scene management hooks
export const useCurrentScene = () => {
  return useEffectSync(
    Effect.gen(function* () {
      const appStateService = yield* AppStateService;
      return yield* appStateService.getCurrentScene();
    }).pipe(
      Effect.provide(AppStateServiceLive)
    )
  );
};

export const useSetCurrentScene = () => {
  return (scene: Scene) => {
    useEffectSync(
      Effect.gen(function* () {
        const appStateService = yield* AppStateService;
        return yield* appStateService.setCurrentScene(scene);
      }).pipe(
        Effect.provide(AppStateServiceLive)
      )
    );
  };
};

// Genre management hooks
export const useSelectedGenre = () => {
  return useEffectSync(
    Effect.gen(function* () {
      const appStateService = yield* AppStateService;
      return yield* appStateService.getSelectedGenre();
    }).pipe(
      Effect.provide(AppStateServiceLive)
    )
  );
};

export const useSetSelectedGenre = () => {
  return (genre: number | null) => {
    useEffectSync(
      Effect.gen(function* () {
        const appStateService = yield* AppStateService;
        return yield* appStateService.setSelectedGenre(genre);
      }).pipe(
        Effect.provide(AppStateServiceLive)
      )
    );
  };
};

export const useResetGenre = () => {
  return () => {
    useEffectSync(
      Effect.gen(function* () {
        const appStateService = yield* AppStateService;
        return yield* appStateService.resetGenre();
      }).pipe(
        Effect.provide(AppStateServiceLive)
      )
    );
  };
};
