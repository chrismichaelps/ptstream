import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Image, Spinner } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlayCircle,
  Star,
  Calendar,
  Clock,
  Globe,
  ThumbsUp,
  ArrowLeft,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  PromoResult,
  SeasonChapters,
  SeasonEpisode,
  UniqueSerie,
} from "../../types";
import SeriesDropdown from "../../components/SeasonsDropdown";
import useGetChapterBySeasonId from "../../hooks/useGetChapterBySeasonId";
import useGetPromoById from "../../hooks/useGetPromoById";
import { formatRuntime, parseDate } from "../../toolkit/serie";
import Banner from "../Banner";
import { PlyrVideoPlayer } from "../PlyrVideoPlayer";
import FavoriteButton from "../FavoriteButton";
import ChapterWatchedButton from "../ChapterWatchedButton";
import useSeasonSelected from "../../hooks/useSeasonSelected";
import { useFullscreen } from "../../hooks/useFullscreen";
import SeoContainer from "../SeoContainer";

type SerieSectionProps = {
  item: UniqueSerie;
};

/** Identifies the episode currently being browsed or streamed. */
type EpisodeRef = {
  serieId: number;
  seasonId: number;
  episodeId: number;
};

/**
 * The section is always in exactly one of these views; the promo player is
 * an independent overlay on top of any of them.
 */
type SectionView =
  | { kind: "default" }
  | { kind: "chapter"; episode: EpisodeRef }
  | { kind: "streaming"; episode: EpisodeRef };

type DefaultStateProps = {
  serie: UniqueSerie;
  onWatchNow: () => void;
  watchChapter: (serieId: number, seasonId: number, episodeId: number) => void;
};

type ChapterStateProps = {
  chapter: SeasonEpisode;
  serie: UniqueSerie;
  episodeRef: EpisodeRef;
  onWatchNow: () => void;
  onBack: () => void;
};

type StreamingVideoProps = EpisodeRef & {
  onBack: () => void;
};

const STAR_RATINGS = [1, 2, 3, 4, 5] as const;

const renderStars = (rating: number) =>
  STAR_RATINGS.map((i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${
        i <= rating / 2
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300 dark:text-gray-600"
      }`}
    />
  ));

const useGenreKeywords = (serie: UniqueSerie) => {
  const { t } = useTranslation();
  return (serie.genre_ids ?? []).map((genreId) => t(`${genreId}`)).join(", ");
};

const StreamingVideo = ({
  serieId,
  seasonId,
  episodeId,
  onBack,
}: StreamingVideoProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const { toggleFullscreen, isFullscreen } = useFullscreen();

  const src = `https://vidsrc-embed.ru/embed/tv/${serieId}/${seasonId}/${episodeId}?ds_lang=es`;

  return (
    <div className="fixed inset-0 text-black bg-gradient-to-br from-black to-gray-900 dark:text-white">
      <div className="flex absolute top-4 right-4 z-10 gap-3 p-4 rounded-2xl backdrop-blur-lg bg-black/20">
        <button
          onClick={onBack}
          className="flex justify-center items-center w-10 h-10 text-white rounded-xl transition-all bg-white/10 hover:bg-white/20 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => toggleFullscreen()}
          className="flex justify-center items-center w-10 h-10 text-white rounded-xl transition-all bg-white/10 hover:bg-white/20 hover:scale-105"
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {isLoading && (
        <div className="flex absolute inset-0 justify-center items-center backdrop-blur-sm bg-black/50">
          <Spinner size="lg" className="w-12 h-12" />
        </div>
      )}

      <div className="relative w-full h-full animate-iframe-drop-effect">
        <iframe
          src={src}
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

const ChapterState = ({
  chapter,
  serie,
  episodeRef,
  onWatchNow,
  onBack,
}: ChapterStateProps) => {
  const { t } = useTranslation();
  const genreKeywords = useGenreKeywords(serie);

  return (
    <div className="overflow-y-auto max-h-screen text-black dark:text-white">
      <SeoContainer
        title={chapter.name}
        description={serie.overview}
        keywords={genreKeywords}
      />

      <button
        onClick={onBack}
        className="flex justify-center items-center p-1 w-8 h-8 text-black rounded-full border backdrop-blur-md transition-colors bg-gray-200/30 border-gray-200/50 dark:bg-gray-800/30 dark:text-white dark:border-gray-800/50 hover:bg-gray-200/40 dark:hover:bg-gray-800/40"
      >
        <ArrowLeft className="w-4 h-4 text-black dark:text-white" />
      </button>

      {serie.backdrop_path ? (
        <Banner srcImg={serie.backdrop_path} alt={chapter.name} />
      ) : null}

      <div className="container px-4 py-8">
        <div className="flex gap-8 lg:gap-16">
          {chapter.still_path ? (
            <div className="flex-none w-1/3 lg:w-1/4">
              <Image
                src={"https://image.tmdb.org/t/p/w1280" + chapter.still_path}
                alt={chapter.name}
                className="object-cover w-full h-56 rounded-lg shadow-lg lg:h-auto"
              />
            </div>
          ) : null}

          <div className="flex-1 space-y-6">
            {chapter.name && (
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                {chapter.name}
              </h1>
            )}
            {chapter.overview && (
              <div className="overflow-y-auto max-h-36">
                <p className="text-lg text-gray-700 dark:text-gray-300 sm:text-xl">
                  {chapter.overview}
                </p>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {renderStars(chapter.vote_average)}
                {chapter.vote_average ? (
                  <span className="ml-2">
                    {chapter.vote_average.toFixed(1)}
                  </span>
                ) : null}
              </div>
              {chapter.vote_count ? (
                <span className="text-gray-700 dark:text-gray-300">
                  ({chapter.vote_count.toLocaleString()}{" "}
                  {t("Serie_ChapterState_Votes")})
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onPress={onWatchNow}
              >
                <PlayCircle className="mr-2 w-4 h-4" />
                {t("Serie_ChapterState_WatchNow")}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {chapter.air_date && (
                <div className="flex items-center">
                  <Calendar className="mr-2 w-4 h-4" />
                  {t("Serie_ChapterState_AirDate")}:{" "}
                  {parseDate(chapter.air_date)}
                </div>
              )}
              {chapter.runtime ? (
                <div className="flex items-center">
                  <Clock className="mr-2 w-4 h-4" />
                  {t("Serie_ChapterState_Runtime")}:{" "}
                  {formatRuntime(chapter.runtime)}
                </div>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ChapterWatchedButton item={episodeRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DefaultState = ({
  serie,
  onWatchNow,
  watchChapter,
}: DefaultStateProps) => {
  const { t } = useTranslation();
  const genreKeywords = useGenreKeywords(serie);

  const seasonSelectedState = useSeasonSelected();
  const seasonSelected = seasonSelectedState.get();

  const posterPath = seasonSelected?.poster_path ?? serie.poster_path ?? null;

  return (
    <div className="overflow-y-auto max-h-screen text-black dark:text-white">
      <SeoContainer
        title={serie.name}
        description={serie.overview}
        keywords={genreKeywords}
      />

      {serie.backdrop_path ? (
        <Banner srcImg={serie.backdrop_path} alt={serie.name} />
      ) : null}

      <div className="container px-4 py-8">
        <div className="flex gap-8 lg:gap-16">
          {posterPath ? (
            <div className="flex-none w-1/3 lg:w-1/4">
              <Image
                src={"https://image.tmdb.org/t/p/w1280" + posterPath}
                alt={serie.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          ) : null}

          <div className="flex-1 space-y-6">
            {serie.name && (
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                {serie.name}
              </h1>
            )}
            {serie.overview && (
              <div className="overflow-y-auto max-h-36">
                <p className="text-lg text-gray-700 dark:text-gray-300 sm:text-xl">
                  {serie.overview}
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {(serie.genre_ids ?? []).map((genreId) => (
                <Badge
                  key={genreId}
                  className="text-black bg-gray-200 dark:bg-gray-700 dark:text-white"
                >
                  {t(`${genreId}`)}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {renderStars(serie.vote_average)}
                {serie.vote_average ? (
                  <span className="ml-2">{serie.vote_average.toFixed(1)}</span>
                ) : null}
              </div>
              {serie.vote_count ? (
                <span className="text-gray-700 dark:text-gray-300">
                  ({serie.vote_count.toLocaleString()}{" "}
                  {t("Serie_DefaultState_Votes")})
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onPress={onWatchNow}
              >
                <PlayCircle className="mr-2 w-4 h-4" />
                {t("Serie_DefaultState_WatchPromo")}
              </Button>
              <SeriesDropdown id={serie.id} watchChapter={watchChapter} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {serie.first_air_date && (
                <div className="flex items-center">
                  <Calendar className="mr-2 w-4 h-4" />
                  {t("Serie_DefaultState_FirstAirDate")}:{" "}
                  {parseDate(serie.first_air_date)}
                </div>
              )}
              {serie.original_language && (
                <div className="flex items-center">
                  <Globe className="mr-2 w-4 h-4" />
                  {t("Serie_DefaultState_Language")}:{" "}
                  {serie.original_language.toUpperCase()}
                </div>
              )}
              {serie.popularity ? (
                <div className="flex items-center">
                  <ThumbsUp className="mr-2 w-4 h-4" />
                  {t("Serie_DefaultState_Popularity")}:{" "}
                  {serie.popularity.toFixed(2)}
                </div>
              ) : null}
              {serie.adult && (
                <div className="flex items-center">
                  <Badge>{t("AdultContent")}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Section = ({ item: serie }: SerieSectionProps) => {
  const [view, setView] = useState<SectionView>({ kind: "default" });
  const [watchPromo, setWatchPromo] = useState(false);
  const [chapters, setChapters] = useState<SeasonChapters | null>(null);
  const [promo, setPromo] = useState<PromoResult>([]);

  const seasonSelectedState = useSeasonSelected();

  const { mutate: mutateChapter } = useGetChapterBySeasonId({
    onSuccess: (data) => {
      setChapters(data);
    },
    onError: (error: Error) => {
      console.error("Error fetching chapter by season id:", error);
    },
  });

  const { mutate: mutatePromo } = useGetPromoById({
    onSuccess: (data) => {
      setPromo(data.results ?? []);
    },
    onError: (error: Error) => {
      console.error("Error fetching promo by season id:", error);
    },
  });

  // get promo for a particular serie
  useEffect(() => {
    if (serie.id) {
      mutatePromo({ id: `tv/${serie.id}` });
    }
  }, [serie.id, mutatePromo]);

  const watchChapter = useCallback(
    (serieId: number, seasonId: number, episodeId: number) => {
      setView({ kind: "chapter", episode: { serieId, seasonId, episodeId } });
      mutateChapter({ serieId, seasonId });
    },
    [mutateChapter],
  );

  const handleBackToSeason = () => {
    setView({ kind: "default" });
    setChapters(null);
    seasonSelectedState.clear();
  };

  const episodeRef = view.kind === "default" ? null : view.episode;

  const currentEpisode = useMemo(() => {
    if (!episodeRef) return null;
    return (
      chapters?.episodes?.find(
        (episode) => episode.episode_number === episodeRef.episodeId,
      ) ?? null
    );
  }, [chapters, episodeRef]);

  const isStreaming = view.kind === "streaming";

  return (
    <div className="relative">
      {watchPromo ? (
        <motion.div
          key="streaming"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <PlyrVideoPlayer
            promo={promo}
            onClosePlayer={() => setWatchPromo(false)}
          />
        </motion.div>
      ) : null}
      <AnimatePresence>
        {isStreaming && episodeRef ? (
          <motion.div
            key="streaming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StreamingVideo
              {...episodeRef}
              onBack={() => setView({ kind: "chapter", episode: episodeRef })}
            />
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {view.kind === "chapter" && episodeRef && currentEpisode ? (
              <ChapterState
                chapter={currentEpisode}
                serie={serie}
                episodeRef={episodeRef}
                onWatchNow={() =>
                  setView({ kind: "streaming", episode: episodeRef })
                }
                onBack={handleBackToSeason}
              />
            ) : (
              <DefaultState
                serie={serie}
                onWatchNow={() => setWatchPromo(true)}
                watchChapter={watchChapter}
              />
            )}
          </motion.div>
        )}
        {isStreaming ? null : (
          <FavoriteButton item={{ ...serie, media_type: "tv" }} />
        )}
      </AnimatePresence>
    </div>
  );
};
