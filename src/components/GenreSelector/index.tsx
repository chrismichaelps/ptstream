import { useMemo } from "react";
import {
  Dropdown,
  DropdownItem,
  Button,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import { useCurrentScene } from "../../../packages/store";
import { UI_DIMENSIONS } from "../../../packages/constants";
import { VerticalDotsIcon } from "../Icons/VerticalDotsIcon";
import { moviesGenres, tvSeriesGenres } from "../../constants";

type GenreSelectorProps = {
  selectedGenre: number | null;
  onGenreChange: (genre: number | null) => void;
};

const GenreSelector = ({ selectedGenre, onGenreChange }: GenreSelectorProps) => {
  const { t } = useTranslation();
  const currentScene = useCurrentScene();

  // "Reset" (id 0) is always listed last.
  const genres = useMemo((): Array<[string, string]> => {
    const source = currentScene === "series" ? tvSeriesGenres : moviesGenres;
    return Object.entries(source).sort(([a], [b]) =>
      a === "0" ? 1 : b === "0" ? -1 : 0
    );
  }, [currentScene]);

  const selectedKeys = useMemo(
    (): string[] => (selectedGenre != null ? [String(selectedGenre)] : []),
    [selectedGenre]
  );

  const handleGenreChange = (key: React.Key | null) => {
    onGenreChange(key != null ? Number(key) : null);
  };

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
          {genres.map(([id]) => (
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
};

export default GenreSelector;
