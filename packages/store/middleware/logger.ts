import { Effect, Console } from "effect";
import { StoreMiddleware, StoreState } from "../types";

interface LoggerOptions {
  collapsed?: boolean | ((getState: () => StoreState, action: any) => boolean);
  duration?: boolean;
  timestamp?: boolean;
  level?: 'log' | 'warn' | 'error' | 'info';
  diff?: boolean;
  predicate?: (getState: () => StoreState, action: any) => boolean;
  stateTransformer?: (state: StoreState) => any;
  actionTransformer?: (action: any) => any;
}

export const createLoggerMiddleware = (options: LoggerOptions = {}): StoreMiddleware => {
  const {
    collapsed = false,
    duration = true,
    timestamp = true,
    level = 'log',
    diff = false,
    predicate,
    stateTransformer = (state) => state,
    actionTransformer = (action) => action
  } = options;

  return {
    name: "logger",
    execute: (action, next) =>
      Effect.gen(function* () {
        const startTime = Date.now();

        // Get current state
        const getState = () => (globalThis as any).__storeState || {};

        // Check predicate
        if (predicate && !predicate(getState, action)) {
          return yield* next();
        }

        const transformedAction = actionTransformer(action);
        const prevState = stateTransformer(getState());

        // Format timestamp
        const time = timestamp ? new Date().toISOString().substr(11, 12) : '';

        // Determine if should collapse
        const shouldCollapse = typeof collapsed === 'function'
          ? collapsed(getState, action)
          : collapsed;

        // Log action start
        const actionTitle = `action ${action.type}${time ? ` @ ${time}` : ''}`;

        if (shouldCollapse) {
          yield* Console.log(`%c${actionTitle}`, 'color: #9E9E9E; font-weight: bold;');
        } else {
          yield* Console.log(`%c${actionTitle}`, 'color: #9E9E9E; font-weight: bold;');
        }

        // Log prev state
        yield* Console.log(`%c prev state %c`, 'color: #9E9E9E; font-weight: bold;', 'color: inherit;', prevState);

        // Log action
        yield* Console.log(`%c action %c`, 'color: #03A9F4; font-weight: bold;', 'color: inherit;', transformedAction);

        // Execute next middleware
        const result = yield* next();

        // Get new state after action
        const nextState = stateTransformer(getState());
        const endTime = Date.now();
        const took = endTime - startTime;

        // Log next state
        yield* Console.log(`%c next state %c`, 'color: #4CAF50; font-weight: bold;', 'color: inherit;', nextState);

        // Log duration if enabled
        if (duration) {
          yield* Console.log(`%c (in ${took.toFixed(2)} ms)`, 'color: #9E9E9E; font-weight: bold;');
        }

        // Show diff if enabled
        if (diff) {
          yield* Console.log(`%c diff %c`, 'color: #9E9E9E; font-weight: bold;', 'color: inherit;', {
            prev: prevState,
            next: nextState
          });
        }

        return result;
      })
  };
};
