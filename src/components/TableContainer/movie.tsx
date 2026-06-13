import { ReactNode } from "react";

import { MovieResult, UniqueMovie } from "../../types";
import { BaseTableContainer } from "./BaseTableContainer";

type TableContainerProps = {
  rows?: MovieResult;
  totalRecords?: number;
  page: number;
  handleOpenModal: (recordSelected: UniqueMovie) => void;
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
    handleOpenModal={(record) => handleOpenModal(record as UniqueMovie)}
  />
);
