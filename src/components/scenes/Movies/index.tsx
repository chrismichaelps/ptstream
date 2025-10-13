import { useState, useCallback, Fragment, useRef, useEffect } from "react";
import { useDisclosure } from "@nextui-org/react";
import { set, size, unionBy } from "lodash";
import { useTranslation } from "react-i18next";
import { useSelectedGenre } from "../../../../packages/store";

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

export default function MovieScene() {
  const [movies, setMovies] = useState<MovieResult>([]);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [record, setRecord] = useState<UniqueMovie | undefined>();

  const prevGenreRef = useRef<number>(GENRE_RESET_FILTER);

  const currentGenre = useSelectedGenre();

  const { t } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const showScrollToTop = size(movies) >= 100;

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
}
