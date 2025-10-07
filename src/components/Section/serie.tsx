import { useCallback, useEffect, useState } from "react";
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
import {
  chain,
  defaultTo,
  get,
  join,
  map,
  merge,
  range,
  toUpper,
} from "lodash";
import { useTranslation } from "react-i18next";
import qs from "qs";

import { PromoResult, PromoReturnType, UniqueSerie } from "../../types";
import SeriesDropdown from "../../components/SeasonsDropdown";
import useGetChapterBySeasonId from "../../hooks/useGetChapterBySeasonId";
import useGetPromoById from "../../hooks/useGetPromoById";
import { formatRuntime, parseDate } from "../../toolkit/serie";
import Banner from "../Banner";
import PlyrVideoPlayer from "../PlyrVideoPlayer";
import FavoriteButton from "../FavoriteButton";
import ChapterWatchedButton from "../ChapterWatchedButton";
import useSeasonSelected from "../../hooks/useSeasonSelected";
import { useFullscreen } from "../../hooks/useFullscreen";
import SeoContainer from "../SeoContainer";

type SerieSectionProps = {
  item: UniqueSerie;
};

type DefaultStateProps = {
  serie: UniqueSerie;
  onWatchNow: () => void;
  watchChapter: (serieId: number, seasonId: number, episodeId: number) => void;
};

type ChapterStateProps = {
  chapter: any;
  serie: UniqueSerie;
  serieId: number;
  seasonId: number;
  episodeId: number;
  onWatchNow: () => void;
  onBack: () => void;
};

type StreamingVideoProps = {
  serieId: number;
  seasonId: number;
  episodeId: number;
  onBack: () => void;
};

const renderStars = (rating: number) => {
  return map(range(1, 6), (i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${
        i <= rating / 2
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300 dark:text-gray-600"
      }`}
    />
  ));
};

const StreamingVideo = ({
  serieId,
  seasonId,
  episodeId,
  onBack,
}: StreamingVideoProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFloating] = useState(true);

  const { toggleFullscreen, isFullscreen } = useFullscreen();

  const onLoad = () => setIsLoading(false);

  // const src = `https://vidsrc.pro/embed/tv/${serieId}/${seasonId}/${episodeId}`;

  const query = {
    tmdb: serieId,
    season: seasonId,
    episode: episodeId,
    ds_lang: "es",
  };
  const queryString = qs.stringify(query);

  const src = `https://vidsrc.xyz/embed/tv?${queryString}`;

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

      <div
        className={`relative w-full h-full ${
          isFloating ? "animate-iframe-drop-effect" : ""
        }`}
      >
        <iframe
          src={src}
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={onLoad}
        />
      </div>
    </div>
  );
};

const ChapterState = ({
  chapter,
  serie,
  serieId,
  seasonId,
  episodeId,
  onWatchNow,
  onBack,
}: ChapterStateProps) => {
  const { t } = useTranslation();

  const genreKeywords = join(
    map(serie.genre_ids, (genreId) => t(`${genreId}`)),
    ", "
  );

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
                {chapter.vote_average && (
                  <span className="ml-2">
                    {chapter.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              {chapter.vote_count && (
                <span className="text-gray-700 dark:text-gray-300">
                  ({chapter.vote_count.toLocaleString()}{" "}
                  {t("Serie_ChapterState_Votes")})
                </span>
              )}
            </div>
            {onWatchNow ? (
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={onWatchNow}
                >
                  <PlayCircle className="mr-2 w-4 h-4" />
                  {t("Serie_ChapterState_WatchNow")}
                </Button>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {chapter.air_date && (
                <div className="flex items-center">
                  <Calendar className="mr-2 w-4 h-4" />
                  {t("Serie_ChapterState_AirDate")}:{" "}
                  {parseDate(chapter.air_date)}
                </div>
              )}
              {chapter.runtime && (
                <div className="flex items-center">
                  <Clock className="mr-2 w-4 h-4" />
                  {t("Serie_ChapterState_Runtime")}:{" "}
                  {formatRuntime(chapter.runtime)}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ChapterWatchedButton item={{ serieId, seasonId, episodeId }} />
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

  const seasonSelectedState = useSeasonSelected();
  const seasonSelected = seasonSelectedState.get("seasonSelected");

  const posterPath = defaultTo(
    get(seasonSelected, "poster_path"),
    get(serie, "poster_path", null)
  );

  const genreKeywords = join(
    map(serie.genre_ids, (genreId) => t(`${genreId}`)),
    ", "
  );

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
              {map(serie.genre_ids, (genreId) => (
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
                {serie.vote_average && (
                  <span className="ml-2">{serie.vote_average.toFixed(1)}</span>
                )}
              </div>
              {serie.vote_count && (
                <span className="text-gray-700 dark:text-gray-300">
                  ({serie.vote_count.toLocaleString()}{" "}
                  {t("Serie_DefaultState_Votes")})
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onWatchNow}
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
                  {toUpper(serie.original_language)}
                </div>
              )}
              {serie.popularity && (
                <div className="flex items-center">
                  <ThumbsUp className="mr-2 w-4 h-4" />
                  {t("Serie_DefaultState_Popularity")}:{" "}
                  {serie.popularity.toFixed(2)}
                </div>
              )}
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

export const Section = ({ item }: SerieSectionProps) => {
  const [watchNow, setWatchNow] = useState(false);
  const [watchPromo, setWatchPromo] = useState(false);
  const [backToSeason, setBackToSeason] = useState(false);
  const [serieId, setSerieId] = useState<number>();
  const [seasonId, setSeasonId] = useState<number>();
  const [episodeId, setEpisodeId] = useState<number>();
  const [chapter, setChapter] = useState<any>(null);
  const [promo, setPromo] = useState<PromoResult>();
  const serie = item;

  const seasonSelectedState = useSeasonSelected();

  const handleBack = () => {
    setWatchNow(false);
  };

  const handleBackToSeason = () => {
    setBackToSeason(true);
    seasonSelectedState.clear();
  };

  const { mutate: mutateChapter } = useGetChapterBySeasonId({
    onSuccess: (data: any) => {
      setChapter(data);
    },
    onError: (error: Error) => {
      console.error("Error fetching chapter by season id:", error);
    },
  });

  const { mutate: mutatePromo } = useGetPromoById({
    onSuccess: (data: PromoReturnType) => {
      setPromo(data.results);
    },
    onError: (error: Error) => {
      console.error("Error fetching promo by season id:", error);
    },
  });

  const watchChapter = useCallback(
    (serieId: number, seasonId: number, episodeId: number) => {
      setSerieId(serieId);
      setSeasonId(seasonId);
      setEpisodeId(episodeId);

      mutateChapter({
        serieId: serieId,
        seasonId: seasonId,
      });
    },
    [mutateChapter]
  );

  const episode = chain(get(chapter, "episodes", []))
    .find((episode) => episode && episode.episode_number === episodeId)
    .value();

  const reset = () => {
    setWatchNow(false);
    setBackToSeason(false);
    setChapter(null);
    setEpisodeId(null);
    setSeasonId(null);
    setSerieId(null);
  };

  // get promo for a particular serie
  useEffect(() => {
    if (serie.id) {
      mutatePromo({ id: `tv/${serie.id}` });
    }
  }, [serie.id]);

  // reset state when back to season
  useEffect(() => {
    if (backToSeason) {
      reset();
    }
  }, [backToSeason]);

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
        {watchNow ? (
          <motion.div
            key="streaming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StreamingVideo
              serieId={serieId}
              seasonId={seasonId}
              episodeId={episodeId}
              onBack={handleBack}
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
            {!chapter || backToSeason ? (
              <DefaultState
                serie={serie}
                onWatchNow={() => setWatchPromo(true)}
                watchChapter={(serieId, seasonId, episodeId) =>
                  watchChapter(serieId, seasonId, episodeId)
                }
              />
            ) : (
              <ChapterState
                chapter={episode}
                serie={serie}
                serieId={serieId}
                seasonId={seasonId}
                episodeId={episodeId}
                onWatchNow={() => setWatchNow(true)}
                onBack={handleBackToSeason}
              />
            )}
          </motion.div>
        )}
        {watchNow ? null : (
          <FavoriteButton item={merge(item, { media_type: "tv" })} />
        )}
      </AnimatePresence>
    </div>
  );
};
