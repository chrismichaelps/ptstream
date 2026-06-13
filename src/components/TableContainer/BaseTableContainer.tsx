import { memo, ReactNode, useEffect } from "react";
import { Spinner, Image } from "@nextui-org/react";
import { throttle, truncate } from "lodash";

import { UniqueMovie, UniqueSerie } from "../../types";

const SCROLL_DELAY = 500; // Throttle delay in ms
// Start fetching the next page this many pixels before the real bottom so
// the user never hits a hard stop while scrolling.
const PREFETCH_THRESHOLD_PX = 800;

// Universal media item type
export type UniversalMediaItem = UniqueMovie | UniqueSerie;

// Type guard functions
const isMovie = (item: UniversalMediaItem): item is UniqueMovie =>
  "title" in item;

// Derive the display title from the item's actual shape so mixed lists
// (e.g. favorites holding both movies and series) always resolve a title.
const getTitle = (item: UniversalMediaItem): string =>
  isMovie(item) ? item.title : item.name ?? "Unknown";

export interface BaseTableContainerProps {
  rows?: ReadonlyArray<UniversalMediaItem>;
  totalRecords?: number;
  page: number;
  handleOpenModal: (recordSelected: UniversalMediaItem) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: ReactNode;
  isLoading?: boolean;
}

// Memoized media card component
const BaseMediaCard = memo<{
  item: UniversalMediaItem;
  onOpenModal: (item: UniversalMediaItem) => void;
}>(({ item, onOpenModal }) => {
  const title = getTitle(item);

  return (
    <div
      className="flex items-start p-4 transition-colors cursor-pointer hover:bg-gray-100"
      onClick={() => onOpenModal(item)}
    >
      <Image
        alt={title}
        className="object-cover rounded-lg"
        src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
        fallbackSrc="https://via.placeholder.com/300x300"
        height={120}
        width={80}
        loading="lazy"
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

export const BaseTableContainer = ({
  rows = [],
  totalRecords = 0,
  page,
  handleOpenModal,
  watchPage,
  emptyContentLabel,
  isLoading,
}: BaseTableContainerProps) => {
  const hasMore = page < totalRecords;

  // Infinite scroll: load the next page when reaching the bottom.
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollableHeight = document.documentElement.scrollHeight;
      const scrolled = window.innerHeight + window.scrollY;

      if (
        scrolled >= scrollableHeight - PREFETCH_THRESHOLD_PX &&
        hasMore &&
        !isLoading
      ) {
        watchPage(page + 1);
      }
    }, SCROLL_DELAY);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel(); // Cancel any pending throttled calls
    };
  }, [hasMore, isLoading, page, watchPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner color="default" size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {rows.length > 0 ? (
          rows.map((item) => (
            <BaseMediaCard
              key={item.id}
              item={item}
              onOpenModal={handleOpenModal}
            />
          ))
        ) : (
          <div className="flex justify-center w-full">{emptyContentLabel}</div>
        )}
      </div>
    </div>
  );
};
