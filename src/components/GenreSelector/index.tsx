import React, {
  useCallback,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/react";
import { map, sortBy } from "lodash";
import { useTranslation } from "react-i18next";
import { useCurrentScene } from "../../../packages/store";
import { UI_DIMENSIONS } from "../../../packages/constants";

import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import { moviesGenres, tvSeriesGenres } from "../../constants";

export interface GenreSelectorRef {
  selectGenre: (genre: number | null) => void;
  clearSelection: () => void;
  getSelectedGenre: () => number | null;
  getAvailableGenres: () => Array<[string, string]>;
}

type GenreSelectorProps = {
  selectedGenre: number | null;
  onGenreChange: (genre: number | null) => void;
};

const GenreSelector = forwardRef<GenreSelectorRef, GenreSelectorProps>(
  ({ selectedGenre, onGenreChange }, ref) => {
    const { t } = useTranslation();
    const currentScene = useCurrentScene();

    const getGenres = useMemo((): Array<[string, string]> => {
      const genres = currentScene === "series" ? tvSeriesGenres : moviesGenres;
      const entries = Object.entries(genres);
      return sortBy(entries, ([id]) => (id === "0" ? 1 : 0));
    }, [currentScene]);

    const selectedKeys = useMemo(
      (): string[] =>
        selectedGenre ? map([selectedGenre], (key) => key.toString()) : [],
      [selectedGenre]
    );

    const handleGenreChange = useCallback(
      (key: string | null) => {
        const genre = key ? Number(key) : null;
        onGenreChange(genre);
      },
      [onGenreChange]
    );

    const selectGenre = useCallback(
      (genre: number | null) => {
        onGenreChange(genre);
      },
      [onGenreChange]
    );

    const clearSelection = useCallback(() => {
      onGenreChange(null);
    }, [onGenreChange]);

    const getSelectedGenre = useCallback(() => selectedGenre, [selectedGenre]);
    const getAvailableGenres = useCallback(() => getGenres, [getGenres]);

    useImperativeHandle(
      ref,
      () => ({
        selectGenre,
        clearSelection,
        getSelectedGenre,
        getAvailableGenres,
      }),
      [selectGenre, clearSelection, getSelectedGenre, getAvailableGenres]
    );

    const reorderedGenres = getGenres;

    return (
      <div className="mx-auto w-full max-w-xs">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="light"
              style={{
                padding: "4px",
                minWidth: "auto",
                width: `${UI_DIMENSIONS.BUTTONS.ICON_SIZE}px`,
                height: `${UI_DIMENSIONS.BUTTONS.ICON_SIZE}px`,
              }}
            >
              <VerticalDotsIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            selectedKeys={selectedKeys}
            onAction={handleGenreChange}
            selectionMode="single"
            className="max-h-[300px] overflow-y-auto"
          >
            {map(reorderedGenres, ([id, genre]) => (
              <DropdownItem
                key={id}
                value={id}
                className={id === "0" ? "text-red-500" : ""}
              >
                {t(id)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
);

GenreSelector.displayName = "GenreSelector";

export default GenreSelector;
