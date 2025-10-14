import { MovieResult, UniqueMovie } from "../../types";
import { MovieTableContainer } from "./BaseTableContainer";

type TableContainerProps = {
  rows: MovieResult;
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueMovie) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
};

export const TableContainer = (props: TableContainerProps) => {
  return <MovieTableContainer {...props} />;
};
