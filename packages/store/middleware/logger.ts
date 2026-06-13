import { Effect, Console } from "effect";

import { StoreAction, StoreMiddleware, StoreState } from "../types";

interface LoggerOptions {
  duration?: boolean;
  timestamp?: boolean;
  diff?: boolean;
  predicate?: (getState: () => StoreState, action: StoreAction) => boolean;
  stateTransformer?: (state: StoreState) => unknown;
  actionTransformer?: (action: StoreAction) => unknown;
}

export const createLoggerMiddleware = (
  options: LoggerOptions = {}
): StoreMiddleware => {
  const {
    duration = true,
    timestamp = true,
    diff = false,
    predicate,
    stateTransformer = (state) => state,
    actionTransformer = (action) => action,
  } = options;

  return {
    name: "logger",
    execute: (action, next, getState) =>
      Effect.gen(function* () {
        const startTime = Date.now();

        if (predicate && !predicate(getState, action)) {
          return yield* next();
        }

        const transformedAction = actionTransformer(action);
        const prevState = stateTransformer(getState());

        const time = timestamp ? new Date().toISOString().slice(11, 23) : "";
        const actionTitle = `action ${action.type}${time ? ` @ ${time}` : ""}`;

        yield* Console.log(
          `%c${actionTitle}`,
          "color: #9E9E9E; font-weight: bold;"
        );
        yield* Console.log(
          `%c prev state %c`,
          "color: #9E9E9E; font-weight: bold;",
          "color: inherit;",
          prevState
        );
        yield* Console.log(
          `%c action %c`,
          "color: #03A9F4; font-weight: bold;",
          "color: inherit;",
          transformedAction
        );

        const result = yield* next();

        const nextState = stateTransformer(getState());
        const took = Date.now() - startTime;

        yield* Console.log(
          `%c next state %c`,
          "color: #4CAF50; font-weight: bold;",
          "color: inherit;",
          nextState
        );

        if (duration) {
          yield* Console.log(
            `%c (in ${took.toFixed(2)} ms)`,
            "color: #9E9E9E; font-weight: bold;"
          );
        }

        if (diff) {
          yield* Console.log(
            `%c diff %c`,
            "color: #9E9E9E; font-weight: bold;",
            "color: inherit;",
            { prev: prevState, next: nextState }
          );
        }

        return result;
      }),
  };
};
