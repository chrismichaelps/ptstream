import { Fragment } from "react";
import { Chip, useDisclosure } from "@nextui-org/react";
import { chain, includes, map, size } from "lodash";
import { useTranslation } from "react-i18next";
import { THRESHOLDS } from "../../../../packages/constants";

import { SearchTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection, SerieSection } from "../../Section";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import useSearchHandler from "../../../hooks/useSearchHandler";
import { MediaType } from "../../../types";
import {
  useSearchRecords,
  useSelectedRecord,
  useTotalRecords,
  useCurrentPage,
  useStoreDispatch,
  setSearchRecords,
  setCurrentPage,
  setTotalRecords,
  setSelectedRecord,
  setSearchQuery,
} from "../../../../packages/store";
import SeoContainer from "../../../components/SeoContainer";

const defaultSearchTerms = [
  "Harry Potter",
  "The Lord of the Rings",
  "Game of Thrones",
  "Breaking Bad",
];

const DefaultState = ({
  terms,
  onSelectTerm,
}: {
  terms: string[];
  onSelectTerm: (term: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight">
        {t("Search_DefaultState_Text1")}
      </h2>
      <p className="max-w-md mb-6 text-default-500">
        {t("Search_DefaultState_Text2")}
      </p>
      <div className="text-sm text-default-500">
        <p>{t("Search_DefaultState_Text3")}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {map(terms, (term) => (
            <Chip
              key={term}
              className="transition duration-300 cursor-pointer"
              variant="flat"
              color="default"
              onClick={() => onSelectTerm(term)}
            >
              {term}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
};

const ModalContent = ({
  mediaType,
  record,
}: {
  mediaType: MediaType;
  record: any;
}) => {
  const scenes = {
    movie: <MovieSection item={record} />,
    tv: <SerieSection item={record} />,
  };

  return scenes[mediaType] || null;
};

const SerieScene = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  // Store-based state hooks
  const records = useSearchRecords();
  const record = useSelectedRecord();
  const totalRecords = useTotalRecords();
  const page = useCurrentPage();
  const dispatch = useStoreDispatch();

  const showScrollToTop = size(records) >= THRESHOLDS.SCROLL_TO_TOP;

  const filterOutMediaTypes = (mediaTypes: string[], data: any) =>
    chain(data)
      .reject((item) => includes(mediaTypes, item.media_type))
      .value();

  const { isLoading } = useSearchHandler(
    (data) => {
      const filteredResults = filterOutMediaTypes(["person"], data.results);

      dispatch(setSearchRecords(filteredResults));
      dispatch(setCurrentPage(data.page));
      dispatch(setTotalRecords(data.total_pages));
    },
    (searchQuery: string) => {
      dispatch(setSearchQuery(searchQuery));
    }
  );

  const handleOpenModal = (recordSelected: any) => {
    dispatch(setSelectedRecord(recordSelected));
    onOpen();
  };

  const handleSelectTerm = (term: string) => dispatch(setSearchQuery(term));

  return (
    <Fragment>
      <SeoContainer title={`${t("Navigation_Search")}`} />

      <SearchTableContainer
        isLoading={isLoading}
        rows={records}
        totalRecords={totalRecords}
        page={page}
        handleOpenModal={handleOpenModal}
        emptyContentLabel={
          <DefaultState
            terms={defaultSearchTerms}
            onSelectTerm={handleSelectTerm}
          />
        }
      />

      {showScrollToTop && <ScrollToTopButton />}

      {record ? (
        <ModalContainer
          size="full"
          isOpen={isOpen}
          onClose={onClose}
          bodyContent={
            <ModalContent mediaType={record["media_type"]} record={record} />
          }
          children={null}
        />
      ) : null}
    </Fragment>
  );
};

export default SerieScene;
