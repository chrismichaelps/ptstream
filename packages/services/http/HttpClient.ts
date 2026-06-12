import { Duration, Effect, Schedule } from "effect";

import { httpConfig } from "../../config";
import {
  HttpError,
  HttpRequestError,
  HttpStatusError,
  HttpTimeoutError
} from "../../errors";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
} as const;

const isRetryable = (error: HttpError): boolean =>
  error._tag !== "HttpStatusError" || error.status >= 500;

/**
 * Thin `fetch`-based JSON client with timeout and exponential-backoff retry,
 * both driven by {@link httpConfig}.
 */
export class HttpClient extends Effect.Service<HttpClient>()("HttpClient", {
  effect: Effect.gen(function* () {
    const config = yield* httpConfig;

    const retryPolicy = Schedule.exponential(
      Duration.millis(config.retryBaseDelayMillis)
    ).pipe(Schedule.intersect(Schedule.recurs(config.retryAttempts)));

    const getJson = <A = unknown>(
      url: string,
      options?: RequestInit
    ): Effect.Effect<A, HttpError> =>
      Effect.tryPromise({
        try: (signal) =>
          fetch(url, {
            ...options,
            headers: { ...DEFAULT_HEADERS, ...options?.headers },
            signal
          }),
        catch: (cause) => new HttpRequestError({ url, cause })
      }).pipe(
        Effect.filterOrFail(
          (response) => response.ok,
          (response) => new HttpStatusError({ url, status: response.status })
        ),
        Effect.flatMap((response) =>
          Effect.tryPromise({
            try: () => response.json() as Promise<A>,
            catch: (cause) => new HttpRequestError({ url, cause })
          })
        ),
        Effect.timeoutFail({
          duration: Duration.millis(config.requestTimeoutMillis),
          onTimeout: () =>
            new HttpTimeoutError({
              url,
              timeoutMillis: config.requestTimeoutMillis
            })
        }),
        Effect.retry({ schedule: retryPolicy, while: isRetryable }),
        Effect.tapError((error) =>
          Effect.logError("HTTP request failed", error)
        ),
        Effect.withSpan("HttpClient.getJson", { attributes: { url } })
      );

    return { getJson } as const;
  })
}) {}
