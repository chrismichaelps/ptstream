import { ManagedRuntime } from "effect";

import { AppLayer } from "./layers";

/**
 * Shared application runtime.
 *
 * Builds {@link AppLayer} once and reuses it for every effect execution, so
 * services behave as singletons instead of being re-created per call.
 */
export const AppRuntime = ManagedRuntime.make(AppLayer);
