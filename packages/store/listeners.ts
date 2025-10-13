import { StoreState } from "./types";

// Global listeners set for store state changes
export const listeners = new Set<(state: StoreState) => void>();
