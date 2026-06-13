import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  User,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import useGetSeasonById from "../../hooks/useGetSeasonById";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { SeasonEpisode, Seasons, UniqueSerieSeason } from "../../types";
import useGetChapterBySeasonId from "../../hooks/useGetChapterBySeasonId";
import { parseDate } from "../../toolkit/serie";
import useSeasonSelected from "../../hooks/useSeasonSelected";

type SeriesDropdownProps = {
  id: number;
  watchChapter: (serieId: number, seasonId: number, episodeId: number) => void;
};

const SeriesDropdown = ({ id, watchChapter }: SeriesDropdownProps) => {
  const { t } = useTranslation();

  const [seasons, setSeasons] = useState<Seasons>([]);
  const [episodes, setEpisodes] = useState<ReadonlyArray<SeasonEpisode>>([]);
  const [selectedSeason, setSelectedSeason] =
    useState<UniqueSerieSeason | null>(null);

  const seasonSelectedState = useSeasonSelected();

  const { mutate: mutateSeasons } = useGetSeasonById({
    onSuccess: (data) => {
      // Hide the "Specials" season (season_number 0); the index of the
      // remaining seasons is NOT their season number — always use
      // season.season_number when talking to the API.
      setSeasons(data.seasons.filter((season) => season.season_number !== 0));
    },
    onError: (error: Error) => {
      console.error("Error fetching season by id:", error);
    },
  });

  const { mutate: mutateChapter } = useGetChapterBySeasonId({
    onSuccess: (data) => {
      setEpisodes(data.episodes ?? []);
    },
    onError: (error: Error) => {
      console.error("Error fetching chapter by season id:", error);
    },
  });

  // Load the seasons as soon as a serie is selected.
  useEffect(() => {
    setSelectedSeason(null);
    setEpisodes([]);
    mutateSeasons(id);
  }, [id, mutateSeasons]);

  const handleSeasonSelect = (season: UniqueSerieSeason) => {
    setSelectedSeason(season);
    setEpisodes([]);
    seasonSelectedState.set(season);
    mutateChapter({ serieId: id, seasonId: season.season_number });
  };

  const handleChapterSelect = (episode: SeasonEpisode) => {
    if (!selectedSeason) return;
    watchChapter(id, selectedSeason.season_number, episode.episode_number);
  };

  return (
    <div className="flex space-x-4">
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="bordered"
            endContent={<ChevronDownIcon className="text-xl" />}
          >
            {selectedSeason
              ? selectedSeason.name
              : t("Serie_DefaultState_SeasonSelectLabel")}
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" className="overflow-y-auto max-h-60">
          {seasons.map((season) => (
            <DropdownItem
              key={season.id}
              description={`${season.episode_count} ${t(
                "Serie_DefaultState_SeasonTotalEpisodesLabel"
              )}`}
              startContent={
                <User
                  name={null}
                  avatarProps={{
                    radius: "lg",
                    src: `https://image.tmdb.org/t/p/w185${season.poster_path}`,
                    title: season.name,
                  }}
                />
              }
              onPress={() => handleSeasonSelect(season)}
            >
              {season.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {selectedSeason && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              endContent={<ChevronDownIcon className="text-xl" />}
            >
              {t("Serie_DefaultState_ChapterSelectLabel")}
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant="faded" className="overflow-y-auto max-h-60">
            {episodes.map((episode) => (
              <DropdownItem
                key={episode.id}
                description={`${parseDate(episode.air_date)}`}
                startContent={
                  <User
                    name={null}
                    avatarProps={{
                      radius: "lg",
                      src: `https://image.tmdb.org/t/p/w185${episode.still_path}`,
                      title: episode.name,
                    }}
                  />
                }
                onPress={() => handleChapterSelect(episode)}
              >
                {episode.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};

export default SeriesDropdown;
