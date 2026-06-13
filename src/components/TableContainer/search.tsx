import { ReactNode, useMemo } from "react";
import { Spinner, Image, Input, Chip } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { truncate } from "lodash";

import { SearchMediaItem } from "../../types";
import { UI_DIMENSIONS } from "../../../packages/constants";
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
  rows?: ReadonlyArray<SearchMediaItem>;
  totalRecords?: number;
  page?: number;
  handleOpenModal: (recordSelected: SearchMediaItem) => void;
  emptyContentLabel: ReactNode;
  isLoading?: boolean;
};

const getTitle = (row: SearchMediaItem): string =>
  ("title" in row ? row.title : undefined) ??
  ("name" in row ? row.name : undefined) ??
  "";

const SearchResultCard = ({
  row,
  onOpenModal,
}: {
  row: SearchMediaItem;
  onOpenModal: (record: SearchMediaItem) => void;
}) => {
  const { t } = useTranslation();
  const title = getTitle(row);

  return (
    <div
      className="flex items-start p-4 transition-colors cursor-pointer hover:bg-gray-100"
      onClick={() => onOpenModal(row)}
    >
      {/* Image and Media Type Label */}
      <div className="flex-shrink-0">
        <Image
          alt={title}
          className="object-cover rounded-lg"
          src={`https://image.tmdb.org/t/p/w185${row.poster_path}`}
          fallbackSrc="https://via.placeholder.com/300x300"
          height={UI_DIMENSIONS.IMAGES.POSTER.HEIGHT}
          width={UI_DIMENSIONS.IMAGES.POSTER.WIDTH}
        />
        {/* Media Type Label Below Image */}
        <div className="mt-2 text-center">
          {row.media_type === "tv" ? (
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
        <p className="font-semibold text-gray-800 text-md">{title}</p>
        <p className="mt-1 text-sm text-gray-500">
          {truncate(row.overview, {
            length: 50,
            omission: "...",
          })}
        </p>
      </div>
    </div>
  );
};

export const TableContainer = ({
  rows = [],
  handleOpenModal,
  emptyContentLabel,
  isLoading,
}: TableContainerProps) => {
  const { t } = useTranslation();

  const dispatch = useStoreDispatch();
  const term = useSearchQuery();

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable={!isLoading}
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
    ),
    [isLoading, term, t, dispatch]
  );

  const mainClass = rows.length > 0 ? "mt-4" : "mt-20";

  return (
    <div>
      {topContent}
      {isLoading && (
        <div className="flex justify-center w-full mt-20">
          <Spinner color="default" size="sm" />
        </div>
      )}
      <div className={mainClass}>
        {rows.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {rows.map((row) => (
              <div key={row.id}>
                <SearchResultCard row={row} onOpenModal={handleOpenModal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center w-full">{emptyContentLabel}</div>
        )}
      </div>
    </div>
  );
};
