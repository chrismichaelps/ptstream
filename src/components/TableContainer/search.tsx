import { useCallback, useMemo } from "react";
import { Spinner, Image, Input, Chip } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { get, map, size, truncate } from "lodash";

import { SerieResult, UniqueSerie } from "../../types";
import { SearchIcon } from "../Icons/SearchIcon";
import TvIcon from "../Icons/TvIcon";
import MovieIcon from "../Icons/MovieIcon";
import {
  useSearchQuery,
  useStoreDispatch,
  setSearchQuery,
  clearSearchQuery,
} from "../../../packages/store";

type TableContainerProps = {
  rows: SerieResult;
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueSerie) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
};

export const TableContainer = ({
  rows,
  handleOpenModal,
  emptyContentLabel,
  isLoading,
}: TableContainerProps) => {
  const { t } = useTranslation();

  const dispatch = useStoreDispatch();
  const term = useSearchQuery();

  const renderUserCard = useCallback(
    (row: UniqueSerie) => {
      const mediaType = get(row, "media_type", null);

      return (
        <div
          className="flex items-start p-4 transition-colors cursor-pointer hover:bg-gray-100"
          onClick={() => handleOpenModal(row)}
        >
          {/* Image and Media Type Label */}
          <div className="flex-shrink-0">
            <Image
              alt={get(row, "name", null) || get(row, "title", null)}
              className="object-cover rounded-lg"
              src={`https://image.tmdb.org/t/p/w185${get(row, "poster_path")}`}
              fallbackSrc="https://via.placeholder.com/300x300"
              height={120}
              width={80}
            />
            {/* Media Type Label Below Image */}
            <div className="mt-2 text-center">
              {mediaType === "tv" ? (
                <Chip
                  className="flex items-center px-3 py-1 text-xs font-medium rounded-lg"
                  variant="flat"
                  avatar={<TvIcon />}
                >
                  {t("Search_TableContent_MediaTypeSerie")}
                </Chip>
              ) : (
                <Chip
                  className="flex items-center px-3 py-1 text-xs font-medium rounded-lg"
                  variant="flat"
                  avatar={<MovieIcon />}
                >
                  {t("Search_TableContent_MediaTypeMovie")}
                </Chip>
              )}
            </div>
          </div>

          {/* Content (Title and Overview) */}
          <div className="flex-1 ml-4">
            <p className="font-semibold text-gray-800 text-md">
              {get(row, "name", null) || get(row, "title", null)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {truncate(get(row, "overview", null), {
                length: 50,
                omission: "...",
              })}
            </p>
          </div>
        </div>
      );
    },
    [handleOpenModal, t]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable={isLoading ? false : true}
            className="w-full sm:max-w-[44%]"
            placeholder={t("Search_TableContent_Input_Placeholder")}
            startContent={<SearchIcon />}
            endContent={
              isLoading ? <Spinner size="sm" color="default" /> : null
            }
            value={term}
            onValueChange={(value) => dispatch(setSearchQuery(value))}
            onClear={() => dispatch(clearSearchQuery())}
          />
        </div>
      </div>
    );
  }, [isLoading, term, t]);

  const DataState = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {map(rows, (row) => (
        <div key={row.id}>{renderUserCard(row)}</div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex justify-center w-full">{emptyContentLabel}</div>
  );

  const LoadingState = () => (
    <div className="flex justify-center w-full mt-20">
      <Spinner color="default" size="sm" />
    </div>
  );

  const mainClass = size(rows) > 0 ? "mt-4" : "mt-20";

  return (
    <div>
      {topContent}
      {isLoading && <LoadingState />}
      <div className={mainClass}>
        {size(rows) > 0 ? <DataState /> : <EmptyState />}
      </div>
    </div>
  );
};
