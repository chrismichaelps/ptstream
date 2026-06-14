/**
 * Main-process request cache.
 *
 * Two optimizations that the old client-side fetching could not do well:
 *
 *  1. TTL caching — identical TMDB requests (same genre/page, same search term,
 *     same season) are served from memory instead of re-hitting the network.
 *  2. In-flight de-duplication — if N callers ask for the same key while a
 *     request is still pending, they all await the SAME promise instead of
 *     firing N parallel requests.
 *
 * Bounded by `maxEntries` with simple FIFO eviction so memory stays flat over a
 * long session. Only successful results are cached; rejections never poison the
 * cache (and the in-flight entry is always cleared in `finally`).
 */
export interface RequestCacheOptions {
  /** Max number of cached results kept at once. */
  readonly maxEntries?: number;
}

interface CacheEntry {
  readonly value: unknown;
  readonly expiresAt: number;
}

export class RequestCache {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly inFlight = new Map<string, Promise<unknown>>();
  private readonly maxEntries: number;

  constructor(options: RequestCacheOptions = {}) {
    this.maxEntries = options.maxEntries ?? 200;
  }

  /**
   * Return the cached value for `key`, or run `load()` (de-duplicating
   * concurrent calls) and cache its result for `ttlMillis`.
   *
   * `now` is injectable for testing; defaults to the wall clock.
   */
  async resolve<A>(
    key: string,
    ttlMillis: number,
    load: () => Promise<A>,
    now: () => number = Date.now
  ): Promise<A> {
    const current = now();

    const cached = this.entries.get(key);
    if (cached && cached.expiresAt > current) {
      return cached.value as A;
    }
    if (cached) {
      this.entries.delete(key); // expired
    }

    const pending = this.inFlight.get(key);
    if (pending) {
      return pending as Promise<A>;
    }

    const promise = load()
      .then((value) => {
        this.set(key, value, current + ttlMillis);
        return value;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);
    return promise as Promise<A>;
  }

  private set(key: string, value: unknown, expiresAt: number): void {
    // FIFO eviction once we exceed the cap (Map preserves insertion order).
    if (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest !== undefined) {
        this.entries.delete(oldest);
      }
    }
    this.entries.set(key, { value, expiresAt });
  }
}
