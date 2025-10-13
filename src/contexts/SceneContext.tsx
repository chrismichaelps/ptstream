import { createContext, ReactNode, useContext } from "react";
import { useCurrentScene } from "../../packages/store";
import { Scene } from "../types";

const SceneContext = createContext<Scene | null>(null);

export const SceneProvider = ({ children }: { children: ReactNode }) => {
  const currentScene = useCurrentScene() as Scene;

  return (
    <SceneContext.Provider value={currentScene}>
      {children}
    </SceneContext.Provider>
  );
};

export const useScene = () => {
  const context = useContext(SceneContext);
  if (context === null) {
    throw new Error("[useScene]: must be used within a SceneProvider");
  }
  return context;
};
