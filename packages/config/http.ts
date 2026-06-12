import { Config } from "effect";

/**
 * HTTP client configuration.
 *
 * Every value can be overridden through the environment (e.g.
 * `HTTP_REQUEST_TIMEOUT_MS`); the defaults keep the app working out of the box.
 */
export const httpConfig = Config.all({
  /** Maximum time a single request may take before it is aborted. */
  requestTimeoutMillis: Config.integer("HTTP_REQUEST_TIMEOUT_MS").pipe(
    Config.withDefault(10_000)
  ),
  /** Number of retries after a failed request (network errors and 5xx). */
  retryAttempts: Config.integer("HTTP_RETRY_ATTEMPTS").pipe(
    Config.withDefault(3)
  ),
  /** Base delay of the exponential backoff between retries. */
  retryBaseDelayMillis: Config.integer("HTTP_RETRY_BASE_DELAY_MS").pipe(
    Config.withDefault(1_000)
  )
});

export type HttpConfig = Config.Config.Success<typeof httpConfig>;
