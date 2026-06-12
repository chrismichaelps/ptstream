import { ReactNode } from "react";

import { SerieResult, UniqueSerie } from "../../types";
import { BaseTableContainer } from "./BaseTableContainer";

type TableContainerProps = {
  rows?: SerieResult;
  totalRecords?: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueSerie) => void;
  watchPage: (page: number) => void;
  emptyContentLabel: ReactNode;
  isLoading?: boolean;
};

export const TableContainer = ({
  handleOpenModal,
  ...props
}: TableContainerProps) => (
  <BaseTableContainer
    {...props}
    handleOpenModal={(record) => handleOpenModal(record as UniqueSerie)}
  />
);
