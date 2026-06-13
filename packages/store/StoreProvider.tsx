import React, { createContext, useContext, useRef } from "react";

import { defineConfig } from "./defineConfig";
import { createStore } from "./store";
import { Store } from "./types";

// Create store context
const StoreContext = createContext<Store | null>(null);

// Store provider component. The store is created exactly once per provider
// instance — never re-created on re-render or in an effect, so state is not
// silently reset after mount.
export const StoreProvider: React.FC<{
  children: React.ReactNode;
  config?: Parameters<typeof defineConfig>[0];
}> = ({ children, config }) => {
  const storeRef = useRef<Store | null>(null);

  if (storeRef.current === null) {
    const { initialState, middlewares } = defineConfig(config ?? {});
    storeRef.current = createStore(initialState, middlewares);
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook to access the store instance
export const useStoreContext = (): Store => {
  const store = useContext(StoreContext);
  if (store === null) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return store;
};
