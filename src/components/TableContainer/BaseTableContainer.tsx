import { useCallback, useEffect, memo, useMemo } from "react";
import { Spinner, Image } from "@nextui-org/react";
import { map, size, throttle, truncate } from "lodash";

import { UniqueMovie, UniqueSerie } from "../../types";

const SCROLL_DELAY = 500; // Throttle delay in ms

// Universal media item type
type UniversalMediaItem = UniqueMovie | UniqueSerie;

// Type guard functions
const isMovie = (item: UniversalMediaItem): item is UniqueMovie => {
  return "title" in item && "release_date" in item;
};

const isSerie = (item: UniversalMediaItem): item is UniqueSerie => {
  return "name" in item && "first_air_date" in item;
};

// Media type configuration
interface MediaTypeConfig {
  getTitle: (item: UniversalMediaItem) => string;
  getDate: (item: UniversalMediaItem) => string;
  getAltText: (item: UniversalMediaItem) => string;
  getDateLabel: (item: UniversalMediaItem) => string;
}

const mediaConfigs: Record<string, MediaTypeConfig> = {
  movie: {
    getTitle: (item) => (isMovie(item) ? item.title : "Unknown"),
    getDate: (item) => (isMovie(item) ? item.release_date : ""),
    getAltText: (item) => (isMovie(item) ? item.title : "Movie"),
    getDateLabel: () => "Released",
  },
  tv: {
    getTitle: (item) => (isSerie(item) ? item.name : "Unknown"),
    getDate: (item) => (isSerie(item) ? item.first_air_date : ""),
    getAltText: (item) => (isSerie(item) ? item.name : "Series"),
    getDateLabel: () => "First Aired",
  },
};

// Base table container props
interface BaseTableContainerProps {
  rows: readonly UniversalMediaItem[];
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniversalMediaItem) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
  mediaType?: "movie" | "tv";
  showRatings?: boolean;
  showDates?: boolean;
  customCardRenderer?: (item: UniversalMediaItem) => JSX.Element;
}

// Memoized media card component
const BaseMediaCard = memo<{
  item: UniversalMediaItem;
  onOpenModal: (item: UniversalMediaItem) => void;
  mediaType: "movie" | "tv";
  customRenderer?: (item: UniversalMediaItem) => JSX.Element;
}>(({ item, onOpenModal, mediaType, customRenderer }) => {
  const config = mediaConfigs[mediaType];

  // Use custom renderer if provided
  if (customRenderer) {
    return customRenderer(item);
  }

  const title = config.getTitle(item);
  const altText = config.getAltText(item);

  return (
    <div
      className="flex items-start p-4 transition-colors cursor-pointer hover:bg-gray-100"
      onClick={() => onOpenModal(item)}
    >
      <Image
        alt={altText}
        className="object-cover rounded-lg"
        src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
        fallbackSrc="https://via.placeholder.com/300x300"
        height={120}
        width={80}
      />
      <div className="flex-1 ml-4">
        <p className="font-semibold text-gray-800 text-md">{title}</p>
        <p className="mt-1 text-sm text-gray-500">
          {truncate(item.overview, {
            length: 50,
            omission: "...",
          })}
        </p>
      </div>
    </div>
  );
});

BaseMediaCard.displayName = "BaseMediaCard";

// Main base table container component
export const BaseTableContainer = memo<BaseTableContainerProps>(
  ({
    rows,
    totalRecords,
    page,
    handleOpenModal,
    watchPage,
    emptyContentLabel,
    isLoading,
    mediaType = "movie",
    showRatings = true,
    showDates = true,
    customCardRenderer,
  }) => {
    const hasMore = page < totalRecords;

    // Memoized render function
    const renderMediaCard = useCallback(
      (item: UniversalMediaItem) => {
        return (
          <BaseMediaCard
            key={item.id}
            item={item}
            onOpenModal={handleOpenModal}
            mediaType={mediaType}
            customRenderer={customCardRenderer}
          />
        );
      },
      [handleOpenModal, mediaType, customCardRenderer]
    );

    // Scroll event listener with throttling
    useEffect(() => {
      const handleScroll = throttle(() => {
        const scrollableHeight = document.documentElement.scrollHeight;
        const scrolled = window.innerHeight + window.scrollY;

        // Check if near the bottom of the page and if there are more pages to load
        if (scrolled >= scrollableHeight && hasMore && !isLoading) {
          watchPage(page + 1);
        }
      }, SCROLL_DELAY);

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        handleScroll.cancel(); // Cancel any pending throttled calls
      };
    }, [hasMore, isLoading, page, watchPage]);

    // Memoized data state
    const DataState = useCallback(
      () => map(rows, renderMediaCard),
      [rows, renderMediaCard]
    );

    // Memoized empty state
    const EmptyState = useCallback(
      () => (
        <div className="flex justify-center w-full">{emptyContentLabel}</div>
      ),
      [emptyContentLabel]
    );

    // Memoized loading state
    const LoadingState = useCallback(
      () => (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner color="default" size="lg" />
        </div>
      ),
      []
    );

    // Memoized grid classes based on media type
    const gridClasses = useMemo(() => {
      const baseClasses = "grid grid-cols-1 gap-4";
      const responsiveClasses = "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      return `${baseClasses} ${responsiveClasses}`;
    }, []);

    return (
      <div>
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className={gridClasses}>
            {size(rows) > 0 ? <DataState /> : <EmptyState />}
          </div>
        )}
      </div>
    );
  }
);

BaseTableContainer.displayName = "BaseTableContainer";

// Type-specific table containers for backward compatibility
export const MovieTableContainer = memo<{
  rows: readonly UniqueMovie[];
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueMovie) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
}>((props) => <BaseTableContainer {...props} mediaType="movie" />);

export const SerieTableContainer = memo<{
  rows: readonly UniqueSerie[];
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueSerie) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
}>((props) => <BaseTableContainer {...props} mediaType="tv" />);

MovieTableContainer.displayName = "MovieTableContainer";
SerieTableContainer.displayName = "SerieTableContainer";
