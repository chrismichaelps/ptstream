import { useEffect, useRef, useState } from "react";

import {
  useSelectedGenre,
  useStoreDispatch,
  resetGenre,
} from "../../packages/store";
import { GENRE_RESET_FILTER } from "../constants";

export type DiscoverFilter = {
  page: number;
  with_genres?: number;
};

type DiscoverPage<Item> = {
  page: number;
  results?: ReadonlyArray<Item>;
  total_pages: number;
};

type DiscoverMutation<Item> = (options: {
  onSuccess: (data: DiscoverPage<Item>) => void;
  onError: (error: Error) => void;
}) => {
  mutate: (filter: DiscoverFilter) => void;
  status: "idle" | "pending" | "error" | "success";
};

const dedupeById = <Item extends { id: number }>(
  items: ReadonlyArray<Item>
): ReadonlyArray<Item> => {
  const seen = new Set<number>();
  return items.filter((item) =>
    seen.has(item.id) ? false : (seen.add(item.id), true)
  );
};

/**
 * Genre-aware, paginated discovery list shared by the Movies and Series
 * scenes: accumulates pages, resets on genre change, and clears the genre
 * filter (instead of reloading the app) when the "Reset" genre is picked.
 */
const useMediaDiscovery = <Item extends { id: number }>(
  useDiscoverMutation: DiscoverMutation<Item>,
  label: string
) => {
  const [items, setItems] = useState<ReadonlyArray<Item>>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);

  const currentGenre = useSelectedGenre();
  const dispatch = useStoreDispatch();
  const prevGenreRef = useRef<number | null>(currentGenre);

  const { mutate, status } = useDiscoverMutation({
    onSuccess: (data) => {
      setItems((prev) => dedupeById([...prev, ...(data.results ?? [])]));
      setPage(data.page);
      setTotalRecords(data.total_pages);
    },
    onError: (error) => {
      console.error(`[${label}] error`, error);
    },
  });

  useEffect(() => {
    const genreChanged = currentGenre !== prevGenreRef.current;
    prevGenreRef.current = currentGenre;

    if (genreChanged) {
      setItems([]);
      if (page !== 1) {
        setPage(1);
        return; // the page change re-runs this effect and fetches page 1
      }
    }

    // "Reset" genre: clear the filter and let the effect re-run without it.
    if (currentGenre === GENRE_RESET_FILTER) {
      dispatch(resetGenre());
      return;
    }

    const filter: DiscoverFilter = { page };
    mutate(
      currentGenre != null && currentGenre > GENRE_RESET_FILTER
        ? { ...filter, with_genres: currentGenre }
        : filter
    );
  }, [currentGenre, page, mutate, dispatch]);

  return {
    items,
    page,
    totalRecords,
    requestPage: setPage,
    isLoading: status === "pending",
  };
};

export default useMediaDiscovery;
