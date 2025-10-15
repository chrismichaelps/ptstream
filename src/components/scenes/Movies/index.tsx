import {
  useState,
  useCallback,
  Fragment,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useDisclosure } from "@nextui-org/react";
import { set, size, unionBy } from "lodash";
import { useTranslation } from "react-i18next";
import { useSelectedGenre } from "../../../../packages/store";
import { THRESHOLDS } from "../../../../packages/constants";

import { MovieResult, MovieReturnType, UniqueMovie } from "../../../types";
import useMovies from "../../../hooks/useMovies";
import { MovieTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection } from "../../Section";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import { GENRE_RESET_FILTER } from "../../../constants";
import SeoContainer from "../../SeoContainer";

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-default-500">
      <p>{t("Movie_EmptyState_Text1")}</p>
    </div>
  );
};

export interface MoviesSceneRef {
  loadMovies: (genre?: number) => void;
  clearMovies: () => void;
  openModal: (record: UniqueMovie) => void;
  closeModal: () => void;
  getMovies: () => MovieResult;
  getCurrentPage: () => number;
  getTotalPages: () => number | undefined;
  isModalOpen: () => boolean;
  isLoading: () => boolean;
  refreshMovies: () => void;
}

const MoviesScene = forwardRef<MoviesSceneRef, {}>(({}, ref) => {
  const [movies, setMovies] = useState<MovieResult>([]);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [record, setRecord] = useState<UniqueMovie | undefined>();

  const prevGenreRef = useRef<number>(GENRE_RESET_FILTER);

  const currentGenre = useSelectedGenre();

  const { t } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const showScrollToTop = size(movies) >= THRESHOLDS.SCROLL_TO_TOP;

  const handleOpenModal = (recordSelected: UniqueMovie) => {
    setRecord(recordSelected);
    onOpen();
  };

  const { mutate: mutateMovies, status } = useMovies({
    onSuccess: (data: MovieReturnType) => {
      setMovies((prev) => unionBy([...prev, ...data.results], "id"));
      setPage(data.page);
      setTotalRecords(data.total_pages);
    },
    onError: (error: Error) => {
      console.error("[useMovies] error", error);
    },
  });

  const reset = useCallback(() => {
    setPage(1);
    setMovies([]);
  }, []);

  const buildPayload = useCallback(() => {
    const payload = { page };
    if (currentGenre > GENRE_RESET_FILTER) {
      set(payload, "with_genres", currentGenre);
    }
    return payload;
  }, [page, currentGenre]);

  const makeRequest = useCallback(() => {
    // Reset only if the genre has changed
    if (currentGenre !== prevGenreRef.current) {
      reset();
    }

    // If the current genre is 0, refresh the app
    if (currentGenre === 0) {
      window.location.reload();
    }

    mutateMovies(buildPayload());
    prevGenreRef.current = currentGenre;
  }, [currentGenre, buildPayload, mutateMovies, reset]);

  useEffect(() => {
    makeRequest();
  }, [makeRequest]);

  const isLoading = status === "pending";
  const emptyState = !isLoading && size(movies) === 0;

  // Imperative methods
  const loadMovies = (genre?: number) => {
    if (genre !== undefined) {
      // This would need to be handled by the parent component
      console.log("Load movies with genre:", genre);
    } else {
      makeRequest();
    }
  };

  const clearMovies = () => {
    reset();
  };

  const openModal = (recordSelected: UniqueMovie) => {
    setRecord(recordSelected);
    onOpen();
  };

  const closeModal = () => {
    onClose();
  };

  const getMovies = () => movies;
  const getCurrentPage = () => page;
  const getTotalPages = () => totalRecords;
  const isModalOpen = () => isOpen;
  const isLoadingState = () => isLoading;
  const refreshMovies = () => {
    makeRequest();
  };

  useImperativeHandle(
    ref,
    () => ({
      loadMovies,
      clearMovies,
      openModal,
      closeModal,
      getMovies,
      getCurrentPage,
      getTotalPages,
      isModalOpen,
      isLoading: isLoadingState,
      refreshMovies,
    }),
    [movies, page, totalRecords, isOpen, isLoading, makeRequest, reset]
  );

  return (
    <Fragment>
      <SeoContainer title={`${t("Navigation_Home")} - ${t("Movies_Title")}`} />

      <MovieTableContainer
        isLoading={isLoading}
        rows={movies}
        totalRecords={totalRecords}
        page={page}
        watchPage={setPage}
        handleOpenModal={handleOpenModal}
        emptyContentLabel={emptyState ? <EmptyState /> : null}
      />

      {showScrollToTop ? <ScrollToTopButton /> : null}

      <ModalContainer
        size="full"
        isOpen={isOpen}
        onClose={onClose}
        bodyContent={<MovieSection item={record} />}
        children={null}
      />
    </Fragment>
  );
});

MoviesScene.displayName = "MoviesScene";
export default MoviesScene;
