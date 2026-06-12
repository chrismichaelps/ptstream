import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Chip, useDisclosure } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import { AppRuntime } from "../../../../packages/runtime";
import { useSelectedGenre } from "../../../../packages/store";
import { THRESHOLDS } from "../../../../packages/constants";
import { MyFavoritesTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection, SerieSection } from "../../Section";
import * as MyFavLocalStorage from "../../../toolkit/MyFavLocalStorage";
import { FAVORITES_CHANGED_EVENT } from "../../../toolkit/MyFavLocalStorage";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import { FavoriteItem, UniqueMovie, UniqueSerie } from "../../../types";
import SeoContainer from "../../../components/SeoContainer";

const exampleSearchTerms = [
  "Harry Potter",
  "The Lord of the Rings",
  "Game of Thrones",
  "Breaking Bad",
];

const DefaultState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex-col items-center">
        <h2 className="mb-2 text-3xl font-semibold tracking-tight">
          {t("MyFavorites_DefaultState_Text1")}
        </h2>
      </div>
      <p className="max-w-md mb-6 text-default-500">
        {t("MyFavorites_DefaultState_Text2")}
      </p>
      <div className="text-sm text-default-500">
        <p>{t("MyFavorites_DefaultState_Text3")}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {exampleSearchTerms.map((term) => (
            <Chip key={term} variant="flat" color="default">
              {term}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-default-500">
      <p>{t("MyFavorites_FilterEmptyState")}</p>
    </div>
  );
};

const MyFavoritesScene = () => {
  const [record, setRecord] = useState<FavoriteItem | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useTranslation();

  const currentGenre = useSelectedGenre();

  // Re-read favorites whenever the storage changes (same window or another one).
  useEffect(() => {
    const refresh = () => setRefreshKey((key) => key + 1);

    window.addEventListener(FAVORITES_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const favorites = useMemo(
    () => AppRuntime.runSync(MyFavLocalStorage.getAllLikedItems()),
    [refreshKey]
  );

  // Filter favorites by the currently selected genre
  const myFavorites = useMemo(
    () =>
      currentGenre != null && currentGenre > 0
        ? favorites.filter((item) =>
            (item.genre_ids ?? []).includes(currentGenre)
          )
        : favorites,
    [favorites, currentGenre]
  );

  const showScrollToTop = myFavorites.length >= THRESHOLDS.SCROLL_TO_TOP;

  const handleOpenModal = useCallback(
    (recordSelected: FavoriteItem) => {
      setRecord(recordSelected);
      onOpen();
    },
    [onOpen]
  );

  const modalContent =
    record?.media_type === "movie" ? (
      <MovieSection item={record as unknown as UniqueMovie} />
    ) : record ? (
      <SerieSection item={record as unknown as UniqueSerie} />
    ) : null;

  return (
    <Fragment>
      <SeoContainer title={`${t("Navigation_MyFavorites")}`} />

      <MyFavoritesTableContainer
        isLoading={false}
        rows={myFavorites}
        totalRecords={myFavorites.length}
        page={1}
        watchPage={() => {}}
        handleOpenModal={handleOpenModal}
        emptyContentLabel={
          currentGenre != null && currentGenre > 0 ? (
            <FilterEmptyState />
          ) : (
            <DefaultState />
          )
        }
      />

      {showScrollToTop ? <ScrollToTopButton /> : null}

      {record ? (
        <ModalContainer
          size="full"
          isOpen={isOpen}
          onClose={onClose}
          // Series sections embed portaled dropdowns; see SeriesScene.
          isDismissable={record.media_type !== "tv"}
          bodyContent={modalContent}
        />
      ) : null}
    </Fragment>
  );
};

export default MyFavoritesScene;
