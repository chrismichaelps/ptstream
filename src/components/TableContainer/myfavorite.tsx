import { forwardRef } from "react";
import { SerieResult, UniqueSerie } from "../../types";
import { BaseTableContainer } from "./BaseTableContainer";
import { BaseTableContainerRef } from "./BaseTableContainer";

type TableContainerProps = {
  rows: SerieResult;
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueSerie) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
};

export const TableContainer = forwardRef<
  BaseTableContainerRef,
  TableContainerProps
>((props, ref) => {
  return <BaseTableContainer ref={ref} {...props} mediaType="tv" />;
});

TableContainer.displayName = "MyFavoritesTableContainer";
