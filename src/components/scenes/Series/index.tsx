import { Fragment, useCallback, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import { THRESHOLDS } from "../../../../packages/constants";
import { UniqueSerie } from "../../../types";
import useSeries from "../../../hooks/useSeries";
import useMediaDiscovery from "../../../hooks/useMediaDiscovery";
import { SerieTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { SerieSection } from "../../Section";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
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

const SeriesScene = () => {
  const [record, setRecord] = useState<UniqueSerie | undefined>();

  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectedSeasonState = useSeasonSelected();

  const {
    items: series,
    page,
    totalRecords,
    requestPage,
    isLoading,
  } = useMediaDiscovery<UniqueSerie>(useSeries, "useSeries");

  const showScrollToTop = series.length >= THRESHOLDS.SCROLL_TO_TOP;
  const emptyState = !isLoading && series.length === 0;

  const handleOpenModal = useCallback(
    (recordSelected: UniqueSerie) => {
      setRecord(recordSelected);
      onOpen();
    },
    [onOpen]
  );

  const handleCloseModal = () => {
    selectedSeasonState.clear();
    onClose();
  };

  return (
    <Fragment>
      <SeoContainer title={`${t("Navigation_Home")} - ${t("Series_Title")}`} />

      <SerieTableContainer
        isLoading={isLoading}
        rows={series}
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
          onClose={handleCloseModal}
          // The season/episode dropdowns render in a portal outside the
          // modal DOM tree; a dismissable modal would treat clicks on them
          // as outside-clicks and close itself (NextUI #2723).
          isDismissable={false}
          bodyContent={<SerieSection item={record} />}
        />
      ) : null}
    </Fragment>
  );
};

export default SeriesScene;
