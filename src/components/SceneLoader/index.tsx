import { Suspense, lazy, useImperativeHandle, forwardRef } from "react";

import { Scene } from "../../types";
import { Spinner } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

export interface SceneLoaderRef {
  loadScene: (newScene: Scene) => void;
  getCurrentScene: () => Scene;
  preloadScene: (scene: Scene) => void;
  isSceneLoaded: (scene: Scene) => boolean;
}

const scenes = {
  series: lazy(() => import("../scenes/Series")),
  movies: lazy(() => import("../scenes/Movies")),
};

const SceneLoader = forwardRef<SceneLoaderRef, { scene: Scene }>(
  ({ scene }, ref) => {
    const { t } = useTranslation();

    const SceneComponent = scenes[scene];

    const loadScene = (newScene: Scene) => {
      // This would need to be handled by the parent component
      console.log("Scene load requested:", newScene);
    };

    const getCurrentScene = () => scene;

    const preloadScene = (sceneToPreload: Scene) => {
      // Preload the scene component
      if (scenes[sceneToPreload]) {
        console.log("Scene preload requested:", sceneToPreload);
      }
    };

    const isSceneLoaded = (sceneToCheck: Scene) => {
      return scenes[sceneToCheck] !== undefined;
    };

    useImperativeHandle(
      ref,
      () => ({
        loadScene,
        getCurrentScene,
        preloadScene,
        isSceneLoaded,
      }),
      [scene]
    );

    return (
      <Suspense
        fallback={
          <div>
            <Spinner color="default" size="sm" />
          </div>
        }
      >
        {SceneComponent ? (
          <SceneComponent />
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="max-w-md mb-6 text-default-500">
              {t("Scene_NotFound")}
            </p>
          </div>
        )}
      </Suspense>
    );
  }
);

SceneLoader.displayName = "SceneLoader";

export default SceneLoader;
