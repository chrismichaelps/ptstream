import { ReactNode } from "react";

import { FavoriteItem } from "../../types";
import { BaseTableContainer } from "./BaseTableContainer";

type TableContainerProps = {
  rows?: ReadonlyArray<FavoriteItem>;
  totalRecords?: number;
  page: number;
  handleOpenModal: (recordSelected: FavoriteItem) => void;
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
    handleOpenModal={(record) => handleOpenModal(record as FavoriteItem)}
  />
);
