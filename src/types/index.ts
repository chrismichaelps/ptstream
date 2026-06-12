import { Schema } from "effect";
import { ComponentType, ReactNode, SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type SceneProps = {
  component?: ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export type Scene = "series" | "movies";

export type MediaType = "movie" | "tv";

export const MovieFilterSchema = Schema.Struct({
  page: Schema.Number,
  sort_by: Schema.optional(Schema.String),
  with_original_language: Schema.optional(Schema.String),
  without_keywords: Schema.optional(Schema.String),
  include_adult: Schema.optional(Schema.Boolean),
  include_video: Schema.optional(Schema.Boolean),
  api_key: Schema.optional(Schema.String),
});

export const SerieFilterSchema = Schema.Struct({
  sort_by: Schema.optional(Schema.String),
  api_key: Schema.optional(Schema.String),
  with_original_language: Schema.optional(Schema.String),
  include_adult: Schema.optional(Schema.Boolean),
  with_type: Schema.optional(Schema.Number),
  without_keywords: Schema.optional(Schema.String),
  page: Schema.Number,
  include_video: Schema.optional(Schema.Boolean),
});

export const PromoResultSchema = Schema.Struct({
  iso_639_1: Schema.String,
  iso_3166_1: Schema.String,
  name: Schema.String,
  key: Schema.String,
  site: Schema.String,
  size: Schema.Number,
  type: Schema.String,
  official: Schema.Boolean,
  published_at: Schema.String,
  id: Schema.String,
});

export const MovieResultsEntitySchema = Schema.Struct({
  adult: Schema.Boolean,
  backdrop_path: Schema.String,
  genre_ids: Schema.optional(Schema.Array(Schema.Number)),
  id: Schema.Number,
  original_language: Schema.String,
  original_title: Schema.String,
  overview: Schema.String,
  popularity: Schema.Number,
  poster_path: Schema.String,
  release_date: Schema.String,
  title: Schema.String,
  video: Schema.Boolean,
  vote_average: Schema.Number,
  vote_count: Schema.Number,
});

export const SerieResultsEntitySchema = Schema.Struct({
  adult: Schema.Boolean,
  backdrop_path: Schema.String,
  genre_ids: Schema.optional(Schema.Array(Schema.Number)),
  id: Schema.Number,
  original_language: Schema.String,
  original_name: Schema.String,
  overview: Schema.String,
  popularity: Schema.Number,
  poster_path: Schema.String,
  first_air_date: Schema.String,
  name: Schema.String,
  vote_average: Schema.Number,
  vote_count: Schema.Number,
});

export const SerieSeasonsResultsEntitySchema = Schema.Struct({
  adult: Schema.Boolean,
  backdrop_path: Schema.String,
  created_by: Schema.Array(
    Schema.Struct({
      id: Schema.Number,
      credit_id: Schema.String,
      name: Schema.String,
      original_name: Schema.String,
      gender: Schema.Number,
      profile_path: Schema.optional(Schema.String),
    })
  ),
  episode_run_time: Schema.Array(Schema.Number),
  first_air_date: Schema.String,
  genres: Schema.Array(
    Schema.Struct({
      id: Schema.Number,
      name: Schema.String,
    })
  ),
  homepage: Schema.String,
  id: Schema.Number,
  in_production: Schema.Boolean,
  languages: Schema.Array(Schema.String),
  last_air_date: Schema.String,
  last_episode_to_air: Schema.Struct({
    id: Schema.Number,
    name: Schema.String,
    overview: Schema.String,
    vote_average: Schema.Number,
    vote_count: Schema.Number,
    air_date: Schema.String,
    episode_number: Schema.Number,
    episode_type: Schema.String,
    production_code: Schema.String,
    runtime: Schema.Number,
    season_number: Schema.Number,
    show_id: Schema.Number,
    still_path: Schema.String,
  }),
  name: Schema.String,
  next_episode_to_air: Schema.optional(Schema.Any),
  networks: Schema.Array(
    Schema.Struct({
      id: Schema.Number,
      logo_path: Schema.String,
      name: Schema.String,
      origin_country: Schema.String,
    })
  ),
  number_of_episodes: Schema.Number,
  number_of_seasons: Schema.Number,
  origin_country: Schema.Array(Schema.String),
  original_language: Schema.String,
  original_name: Schema.String,
  overview: Schema.String,
  popularity: Schema.Number,
  poster_path: Schema.String,
  production_companies: Schema.Array(
    Schema.Struct({
      id: Schema.Number,
      logo_path: Schema.optional(Schema.String),
      origin_country: Schema.String,
    })
  ),
  production_countries: Schema.Array(
    Schema.Struct({
      iso_3166_1: Schema.String,
      name: Schema.String,
    })
  ),
  seasons: Schema.Array(
    Schema.Struct({
      air_date: Schema.String,
      episode_count: Schema.Number,
      id: Schema.Number,
      name: Schema.String,
      overview: Schema.String,
      poster_path: Schema.String,
      season_number: Schema.Number,
      vote_average: Schema.Number,
    })
  ),
  spoken_languages: Schema.Array(
    Schema.Struct({
      english_name: Schema.String,
      iso_639_1: Schema.String,
      name: Schema.String,
    })
  ),
  status: Schema.String,
  tagline: Schema.String,
  type: Schema.String,
  vote_average: Schema.Number,
  vote_count: Schema.Number,
});

export const MovieSchema = Schema.Struct({
  page: Schema.Number,
  results: Schema.optional(Schema.Array(MovieResultsEntitySchema)),
  total_pages: Schema.Number,
  total_results: Schema.Number,
});

export const SerieSchema = Schema.Struct({
  page: Schema.Number,
  results: Schema.optional(Schema.Array(SerieResultsEntitySchema)),
  total_pages: Schema.Number,
  total_results: Schema.Number,
});

export const PromoSchema = Schema.Struct({
  page: Schema.Number,
  results: Schema.optional(Schema.Array(PromoResultSchema)),
});

export type MovieReturnType = Schema.Schema.Type<typeof MovieSchema>;
export type SerieReturnType = Schema.Schema.Type<typeof SerieSchema>;
export type PromoReturnType = Schema.Schema.Type<typeof PromoSchema>;

export type UniqueMovie = Schema.Schema.Type<typeof MovieResultsEntitySchema>;
export type UniqueSerie = Schema.Schema.Type<typeof SerieResultsEntitySchema>;
export type UniquePromo = Schema.Schema.Type<typeof PromoResultSchema>;

export type MovieResult = ReadonlyArray<UniqueMovie>;
export type SerieResult = ReadonlyArray<UniqueSerie>;
export type PromoResult = ReadonlyArray<UniquePromo>;

export type SerieSeasonsResult = Schema.Schema.Type<
  typeof SerieSeasonsResultsEntitySchema
>;
export type Seasons = SerieSeasonsResult["seasons"];
export type UniqueSerieSeason = Seasons[number];

/** A single episode of a season, as returned by the TMDB season-details endpoint. */
export type SeasonEpisode = {
  readonly id: number;
  readonly name: string;
  readonly overview: string;
  readonly air_date: string;
  readonly episode_number: number;
  readonly runtime?: number;
  readonly season_number: number;
  readonly still_path: string | null;
  readonly vote_average: number;
  readonly vote_count: number;
};

/** Payload of the TMDB season-details endpoint (subset the app consumes). */
export type SeasonChapters = {
  readonly id?: number;
  readonly name?: string;
  readonly episodes?: ReadonlyArray<SeasonEpisode>;
};

/** A search result can be a movie or a serie, discriminated by `media_type`. */
export type SearchMediaItem = (UniqueMovie | UniqueSerie) & {
  readonly media_type: MediaType;
};

/** Shape persisted by the favorites local storage. */
export type FavoriteItem = SearchMediaItem & {
  readonly likedAt: string;
};

export type MovieFilter = Schema.Schema.Type<typeof MovieFilterSchema>;
export type SerieFilter = Schema.Schema.Type<typeof SerieFilterSchema>;

export type HttpClientConfig = {
  baseUrl: string;
};
