import { Data } from "effect";

/** The request never produced a response (network failure, invalid body, …). */
export class HttpRequestError extends Data.TaggedError("HttpRequestError")<{
  readonly url: string;
  readonly cause: unknown;
}> {}

/** The server answered with a non-2xx status code. */
export class HttpStatusError extends Data.TaggedError("HttpStatusError")<{
  readonly url: string;
  readonly status: number;
}> {}

/** The request exceeded the configured timeout. */
export class HttpTimeoutError extends Data.TaggedError("HttpTimeoutError")<{
  readonly url: string;
  readonly timeoutMillis: number;
}> {}

export type HttpError = HttpRequestError | HttpStatusError | HttpTimeoutError;
