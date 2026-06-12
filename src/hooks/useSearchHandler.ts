import { useEffect, useMemo } from "react";
import { debounce } from "lodash";

import useSearch, { SearchReturnType } from "./useSearch";
import { useSearchQuery } from "../../packages/store";

const SEARCH_DEBOUNCE_MS = 500;

const EMPTY_RESULT: SearchReturnType = { results: [], page: 1, total_pages: 0 };

const useSearchHandler = (
  onSuccess: (data: SearchReturnType) => void,
  watchInputSearch: (searchQuery: string) => void
) => {
  const inputValue = useSearchQuery();

  const { mutate: mutateSearch, status } = useSearch({
    onSuccess,
    onError: (error: Error) => {
      console.error("[useSearchHandler] error", error);
    },
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((searchQuery: string) => {
        if (!searchQuery.trim()) {
          onSuccess(EMPTY_RESULT);
          return;
        }
        mutateSearch({ q: searchQuery });
      }, SEARCH_DEBOUNCE_MS),
    [mutateSearch]
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  useEffect(() => {
    watchInputSearch(inputValue);
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  return { isLoading: status === "pending" };
};

export default useSearchHandler;
