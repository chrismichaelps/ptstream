import { Fragment, useCallback, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import { THRESHOLDS } from "../../../../packages/constants";
import { UniqueMovie } from "../../../types";
import useMovies from "../../../hooks/useMovies";
import useMediaDiscovery from "../../../hooks/useMediaDiscovery";
import { MovieTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection } from "../../Section";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import SeoContainer from "../../SeoContainer";

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-default-500">
      <p>{t("Movie_EmptyState_Text1")}</p>
    </div>
  );
};

const MoviesScene = () => {
  const [record, setRecord] = useState<UniqueMovie | undefined>();

  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    items: movies,
    page,
    totalRecords,
    requestPage,
    isLoading,
  } = useMediaDiscovery<UniqueMovie>(useMovies, "useMovies");

  const showScrollToTop = movies.length >= THRESHOLDS.SCROLL_TO_TOP;
  const emptyState = !isLoading && movies.length === 0;

  const handleOpenModal = useCallback(
    (recordSelected: UniqueMovie) => {
      setRecord(recordSelected);
      onOpen();
    },
    [onOpen]
  );

  return (
    <Fragment>
      <SeoContainer title={`${t("Navigation_Home")} - ${t("Movies_Title")}`} />

      <MovieTableContainer
        isLoading={isLoading}
        rows={movies}
        totalRecords={totalRecords}
        page={page}
        watchPage={requestPage}
        handleOpenModal={handleOpenModal}
        emptyContentLabel={emptyState ? <EmptyState /> : null}
      />

      {showScrollToTop ? <ScrollToTopButton /> : null}

      {record ? (
        <ModalContainer
          size="full"
          isOpen={isOpen}
          onClose={onClose}
          bodyContent={<MovieSection item={record} />}
        />
      ) : null}
    </Fragment>
  );
};

export default MoviesScene;
