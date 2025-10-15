import { forwardRef, useImperativeHandle } from "react";
import { MovieResult, UniqueMovie } from "../../types";
import { MovieTableContainer } from "./BaseTableContainer";
import { BaseTableContainerRef } from "./BaseTableContainer";

type TableContainerProps = {
  rows: MovieResult;
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueMovie) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
};

export const TableContainer = forwardRef<
  BaseTableContainerRef,
  TableContainerProps
>((props, ref) => {
  return <MovieTableContainer ref={ref} {...props} />;
});

TableContainer.displayName = "MovieTableContainer";
