import { useCallback, useEffect } from "react";
import { debounce } from "lodash";

import useSearch from "./useSearch";
import { useSearchQuery } from "../../packages/store";

const useSearchHandler = (
  onSuccess: (data: any) => void,
  watchInputSearch: (searchQuery: string) => void
) => {
  const inputValue = useSearchQuery();

  const { mutate: mutateSearch, status } = useSearch({
    onSuccess,
    onError: (error: Error) => {
      console.error("[useSearchHandler] error", error);
    },
  });

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim()) {
        onSuccess({ results: [], page: 1, total_pages: 0 });
        return;
      }
      mutateSearch({ q: searchQuery });
    }, 500),
    [mutateSearch]
  );

  useEffect(() => {
    watchInputSearch(inputValue);
    debouncedSearch(inputValue);
  }, [inputValue]);

  return { isLoading: status === "pending" };
};

export default useSearchHandler;