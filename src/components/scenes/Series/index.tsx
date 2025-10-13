import { useState, useCallback, Fragment, useEffect, useRef } from "react";
import { useDisclosure } from "@nextui-org/react";
import { unionBy, set, size } from "lodash";
import { useTranslation } from "react-i18next";
import { useSelectedGenre } from "../../../../packages/store";

import { SerieResult, SerieReturnType, UniqueSerie } from "../../../types";
import useSeries from "../../../hooks/useSeries";
import { SerieTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { SerieSection } from "../../Section";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import { GENRE_RESET_FILTER } from "../../../constants";
import useSeasonSelected from "../../../hooks/useSeasonSelected";
import SeoContainer from "../../SeoContainer";

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-default-500">
      <p>{t("Serie_EmptyState_Text1")}</p>
    </div>
  );
};

export default function SerieScene() {
  const [series, setSeries] = useState<SerieResult>([]);
  const [totalRecords, setTotalRecords] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [record, setRecord] = useState<UniqueSerie | undefined>();

  const prevGenreRef = useRef<number>(GENRE_RESET_FILTER);

  const currentGenre = useSelectedGenre();

  const { t } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectedSeasonState = useSeasonSelected();

  const showScrollToTop = size(series) >= 100;

  const handleCloseModal = () => {
    selectedSeasonState.clear();
    onClose();
  };

  const handleOpenModal = (recordSelected: UniqueSerie) => {
    setRecord(recordSelected);
    onOpen();
  };

  const { mutate: mutateSeries, status } = useSeries({
    onSuccess: (data: SerieReturnType) => {
      setSeries((prev) => unionBy([...prev, ...data.results], "id"));
      setTotalRecords(data.total_pages);
    },
    onError: (error: Error) => {
      console.error("[useSeries] error", error);
    },
  });

  const reset = useCallback(() => {
    setPage(1);
    setSeries([]);
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

    mutateSeries(buildPayload());
    prevGenreRef.current = currentGenre;
  }, [currentGenre, buildPayload, mutateSeries, reset]);

  useEffect(() => {
    makeRequest();
  }, [makeRequest]);

  const isLoading = status === "pending";
  const emptyState = !isLoading && size(series) === 0;

  return (
    <Fragment>
      <SeoContainer title={`${t("Navigation_Home")} - ${t("Series_Title")}`} />

      <SerieTableContainer
        isLoading={isLoading}
        rows={series}
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
        onClose={handleCloseModal}
        bodyContent={<SerieSection item={record} />}
        children={null}
      />
    </Fragment>
  );
}
