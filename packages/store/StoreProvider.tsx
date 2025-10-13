import React, { createContext, useContext, useMemo, useEffect } from "react";
import { defineConfig } from "./defineConfig";
import { createStore } from "./store";

// Create store context
const StoreContext = createContext<boolean>(false);

// Store provider component
export const StoreProvider: React.FC<{
  children: React.ReactNode;
  config?: Parameters<typeof defineConfig>[0];
}> = ({ children, config }) => {
  const isStoreEnabled = useMemo(() => true, []);

  useEffect(() => {
    // Initialize store when provider mounts
    const { initialState, middlewares } = defineConfig(config || {});
    createStore(initialState, middlewares);
  }, [config]);

  // Initialize store synchronously on first render to prevent undefined state
  useMemo(() => {
    const { initialState, middlewares } = defineConfig(config || {});
    createStore(initialState, middlewares);
  }, []);

  return (
    <StoreContext.Provider value={isStoreEnabled}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook to check if store is available
export const useStoreContext = () => {
  const isStoreEnabled = useContext(StoreContext);
  if (!isStoreEnabled) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return true;
};
