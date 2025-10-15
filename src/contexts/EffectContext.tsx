import React, { createContext, useContext, useMemo } from "react";
import { Effect, Context, Layer } from "effect";
import { StorageService, StorageServiceLive } from "../../packages/services";
import { LanguageService, LanguageServiceLive } from "../../packages/services";

// Create Effect context that provides all services
export const AppServices = Layer.mergeAll(
  StorageServiceLive,
  LanguageServiceLive
);

// Context for providing the Effect runtime
const EffectContext = createContext<boolean>(false);

export const EffectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isEffectEnabled = useMemo(() => true, []);

  return (
    <EffectContext.Provider value={isEffectEnabled}>
      {children}
    </EffectContext.Provider>
  );
};

export const useEffectRuntime = () => {
  const isEffectEnabled = useContext(EffectContext);
  if (!isEffectEnabled) {
    throw new Error("useEffectRuntime must be used within an EffectProvider");
  }
  return true;
};

// Hook for running effects synchronously
export const useEffectSync = <A, E>(effect: Effect.Effect<A, E, never>): A => {
  return Effect.runSync(effect);
};

// Hook for running effects as promises
export const useEffectPromise = <A, E>(
  effect: Effect.Effect<A, E, never>
): Promise<A> => {
  return Effect.runPromise(effect);
};
