import { SerieResult, UniqueSerie } from "../../types";
import { BaseTableContainer } from "./BaseTableContainer";

type TableContainerProps = {
  rows: SerieResult;
  totalRecords: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueSerie) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: JSX.Element;
  isLoading?: boolean;
};

export const TableContainer = (props: TableContainerProps) => {
  return <BaseTableContainer {...props} mediaType="tv" />;
};
