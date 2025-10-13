import { useCallback } from "react";
import { Spinner, Image } from "@nextui-org/react";
import { get, map, size, truncate } from "lodash";

import { SerieResult, UniqueSerie } from "../../types";
import { UI_DIMENSIONS } from "../../../packages/constants";

type TableContainerProps = {
  rows: SerieResult;
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
  const renderUserCard = useCallback(
    (row: UniqueSerie) => {
      return (
        <div
          className="flex items-start p-4 transition-colors cursor-pointer hover:bg-gray-100"
          onClick={() => handleOpenModal(row)}
        >
          <Image
            alt={get(row, "name", null) || get(row, "title", null)}
            className="object-cover rounded-lg"
            src={`https://image.tmdb.org/t/p/w185${get(row, "poster_path")}`}
            fallbackSrc="https://via.placeholder.com/300x300"
            height={UI_DIMENSIONS.IMAGES.POSTER.HEIGHT}
            width={UI_DIMENSIONS.IMAGES.POSTER.WIDTH}
          />
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
    [handleOpenModal]
  );

  const DataState = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {map(rows, (row) => (
        <div key={`${row.id}-${row.likedAt || Date.now()}`}>
          {renderUserCard(row)}
        </div>
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
      {isLoading && <LoadingState />}
      <div className={mainClass}>
        {size(rows) > 0 ? <DataState /> : <EmptyState />}
      </div>
    </div>
  );
};
