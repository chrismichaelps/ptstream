import qs from "qs";

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

/** Serializes a flat parameter object into a URL query string. */
export const toQueryString = (params: QueryParams): string =>
  qs.stringify(params, { skipNulls: true });
