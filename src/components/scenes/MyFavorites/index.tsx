import {
  useState,
  Fragment,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Chip, useDisclosure } from "@nextui-org/react";
import { filter, get, includes, map, size } from "lodash";
import { useTranslation } from "react-i18next";
import { Effect } from "effect";
import { useEffectSync } from "../../../contexts/EffectContext";
import { StorageServiceLive } from "../../../../packages/services";
import { useSelectedGenre } from "../../../../packages/store";
import { THRESHOLDS } from "../../../../packages/constants";

import { MyFavoritesTableContainer } from "../../TableContainer";
import { ModalContainer } from "../../ModalContainer";
import { MovieSection, SerieSection } from "../../Section";
import * as MyFavLocalStorage from "../../../toolkit/MyFavLocalStorage";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import { MediaType } from "../../../types";
import SeoContainer from "../../../components/SeoContainer";

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
          {[
            "Harry Potter",
            "The Lord of the Rings",
            "Game of Thrones",
            "Breaking Bad",
          ].map((term) => (
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

const transformMyFavorites = (data: any) => map(data, (item) => item);

export interface MyFavoritesSceneRef {
  refreshFavorites: () => void;
  openModal: (record: any) => void;
  closeModal: () => void;
  getFavorites: () => any[];
  getFilteredFavorites: () => any[];
  isModalOpen: () => boolean;
  isLoading: () => boolean;
  clearFavorites: () => void;
}

const MyFavoritesScene = forwardRef<MyFavoritesSceneRef, {}>(({}, ref) => {
  const [record, setRecord] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useTranslation();

  const currentGenre = useSelectedGenre();

  // Get items from storage
  const items = useEffectSync(
    MyFavLocalStorage.getAllLikedItems().pipe(
      Effect.provide(StorageServiceLive)
    )
  );

  // Transform items to array format
  const transformedItems = transformMyFavorites(items);

  // Calculate filtered favorites based on current genre
  const myFavorites =
    currentGenre > 0
      ? filter(transformedItems, (item) =>
          includes(item.genre_ids, currentGenre)
        )
      : transformedItems;

  const showScrollToTop = size(myFavorites) >= THRESHOLDS.SCROLL_TO_TOP;

  const handleOpenModal = (recordSelected: any) => {
    setRecord(recordSelected);
    onOpen();
  };

  const content: Record<MediaType, { component: JSX.Element }> = {
    movie: {
      component: <MovieSection item={record} />,
    },
    tv: {
      component: <SerieSection item={record} />,
    },
  };

  // Set loading to false after items are loaded and refresh when items change
  useEffect(() => {
    setIsLoading(false);
  }, [items]);

  // Add a refresh mechanism to prevent flickering
  const refreshFavorites = () => {
    setIsLoading(true);
    // Force a re-render by updating the component
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // Listen for storage changes to refresh favorites
  useEffect(() => {
    const handleStorageChange = () => {
      refreshFavorites();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Imperative methods
  const openModal = (recordSelected: any) => {
    setRecord(recordSelected);
    onOpen();
  };

  const closeModal = () => {
    onClose();
  };

  const getFavorites = () => transformedItems;
  const getFilteredFavorites = () => myFavorites;
  const isModalOpen = () => isOpen;
  const isLoadingState = () => isLoading;
  const clearFavorites = () => {
    // This would need to be handled by the parent component
    console.log("Clear all favorites requested");
  };

  useImperativeHandle(
    ref,
    () => ({
      refreshFavorites,
      openModal,
      closeModal,
      getFavorites,
      getFilteredFavorites,
      isModalOpen,
      isLoading: isLoadingState,
      clearFavorites,
    }),
    [transformedItems, myFavorites, isOpen, isLoading, refreshFavorites]
  );

  return (
    <Fragment>
      <SeoContainer title={`${t("Navigation_MyFavorites")}`} />

      <MyFavoritesTableContainer
        isLoading={isLoading}
        rows={myFavorites}
        totalRecords={myFavorites.length}
        page={1}
        watchPage={() => {}}
        handleOpenModal={handleOpenModal}
        emptyContentLabel={
          currentGenre > 0 ? <FilterEmptyState /> : <DefaultState />
        }
      />

      {showScrollToTop ? <ScrollToTopButton /> : null}

      {record ? (
        <ModalContainer
          size="full"
          isOpen={isOpen}
          onClose={onClose}
          bodyContent={
            get(content, [get(record, "media_type")], { component: null })
              .component
          }
          children={null}
        />
      ) : null}
    </Fragment>
  );
});

MyFavoritesScene.displayName = "MyFavoritesScene";
export default MyFavoritesScene;
