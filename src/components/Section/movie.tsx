import { useEffect, useState } from "react";
import { Badge, Button, Image, Spinner } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlayCircle,
  Star,
  Calendar,
  Globe,
  ThumbsUp,
  ArrowLeft,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import qs from "qs";

import { PromoResult, UniqueMovie } from "../../types";
import { parseDate } from "../../toolkit/serie";
import Banner from "../Banner";
import useGetPromoById from "../../hooks/useGetPromoById";
import { PlyrVideoPlayer } from "../PlyrVideoPlayer";
import FavoriteButton from "../FavoriteButton";
import { useFullscreen } from "../../hooks/useFullscreen";
import SeoContainer from "../SeoContainer";

type MovieSectionProps = {
  item: UniqueMovie;
};

type DefaultStateProps = {
  movie: UniqueMovie;
  onWatchNow: () => void;
  onWatchPromo: () => void;
};

type StreamingVideoProps = {
  movie: UniqueMovie;
  onBack: () => void;
};

const STAR_RATINGS = [1, 2, 3, 4] as const;

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

const StreamingVideo = ({ movie: { id }, onBack }: StreamingVideoProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const { toggleFullscreen, isFullscreen } = useFullscreen();

  const queryString = qs.stringify({ ds_lang: "es" });
  const src = `https://vidsrcme.ru/embed/movie/${id}?${queryString}`;

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

const DefaultState = ({
  movie,
  onWatchNow,
  onWatchPromo,
}: DefaultStateProps) => {
  const { t } = useTranslation();

  const genreIds = movie.genre_ids ?? [];
  const genreKeywords = genreIds.map((genreId) => t(`${genreId}`)).join(", ");

  return (
    <div className="overflow-y-auto max-h-screen text-black dark:text-white">
      <SeoContainer
        title={movie.title}
        description={movie.overview}
        keywords={genreKeywords}
      />

      {movie.backdrop_path ? (
        <Banner srcImg={movie.backdrop_path} alt={movie.title} />
      ) : null}

      <div className="container px-4 py-8">
        <div className="flex gap-8 lg:gap-16">
          {movie.poster_path ? (
            <div className="flex-none w-1/3 lg:w-1/4">
              <Image
                src={"https://image.tmdb.org/t/p/w1280" + movie.poster_path}
                alt={movie.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          ) : null}

          <div className="flex-1 space-y-6">
            {movie.title && (
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                {movie.title}
              </h1>
            )}
            {movie.overview && (
              <div className="overflow-y-auto max-h-36">
                <p className="text-lg text-gray-700 dark:text-gray-300 sm:text-xl">
                  {movie.overview}
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {genreIds.map((genreId) => (
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
                {renderStars(movie.vote_average)}
                {movie.vote_average ? (
                  <span className="ml-2">{movie.vote_average.toFixed(1)}</span>
                ) : null}
              </div>
              {movie.vote_count ? (
                <span className="text-gray-700 dark:text-gray-300">
                  ({movie.vote_count.toLocaleString()}{" "}
                  {t("Movie_DefaultState_Votes")})
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onPress={onWatchNow}
              >
                <PlayCircle className="mr-2 w-4 h-4" />
                {t("Movie_ChapterState_WatchNow")}
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onPress={onWatchPromo}
              >
                <PlayCircle className="mr-2 w-4 h-4" />
                {t("Movie_DefaultState_WatchPromo")}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {movie.release_date && (
                <div className="flex items-center">
                  <Calendar className="mr-2 w-4 h-4" />
                  {t("Movie_DefaultState_ReleaseDate")}:{" "}
                  {parseDate(movie.release_date)}
                </div>
              )}
              {movie.original_language && (
                <div className="flex items-center">
                  <Globe className="mr-2 w-4 h-4" />
                  {t("Movie_DefaultState_Language")}:{" "}
                  {movie.original_language.toUpperCase()}
                </div>
              )}
              {movie.popularity ? (
                <div className="flex items-center">
                  <ThumbsUp className="mr-2 w-4 h-4" />
                  {t("Movie_DefaultState_Popularity")}:{" "}
                  {movie.popularity.toFixed(2)}
                </div>
              ) : null}
              {movie.adult && (
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

export const Section = ({ item }: MovieSectionProps) => {
  const [watchNow, setWatchNow] = useState(false);
  const [watchPromo, setWatchPromo] = useState(false);
  const [promo, setPromo] = useState<PromoResult>([]);
  const movie = item;

  const { mutate: mutatePromo } = useGetPromoById({
    onSuccess: (data) => {
      setPromo(data.results ?? []);
    },
    onError: (error: Error) => {
      console.error("Error fetching promo by movie id:", error);
    },
  });

  // get promo for a particular movie
  useEffect(() => {
    if (movie.id) {
      mutatePromo({ id: `movie/${movie.id}` });
    }
  }, [movie.id, mutatePromo]);

  return (
    <div className="relative">
      {watchPromo ? (
        <PlyrVideoPlayer
          promo={promo}
          onClosePlayer={() => setWatchPromo(false)}
        />
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
            <StreamingVideo movie={movie} onBack={() => setWatchNow(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DefaultState
              movie={movie}
              onWatchNow={() => setWatchNow(true)}
              onWatchPromo={() => setWatchPromo(true)}
            />
          </motion.div>
        )}
        {watchNow ? null : (
          <FavoriteButton item={{ ...item, media_type: "movie" }} />
        )}
      </AnimatePresence>
    </div>
  );
};
