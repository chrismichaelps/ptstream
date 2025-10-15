import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Effect } from "effect";
import { useEffectSync } from "../../contexts/EffectContext";
import { StorageServiceLive } from "../../../packages/services";

import * as ChaptersWatchedLocalStorage from "../../toolkit/ChaptersWatchedLocalStorage";

export interface ChapterWatchedButtonRef {
  toggleWatched: () => void;
  setWatched: (isWatched: boolean) => void;
  isWatched: () => boolean;
  getWatchedState: () => boolean;
}

type ChapterWatchedButtonProps = {
  item: {
    serieId: number;
    seasonId: number;
    episodeId: number;
  };
};

const ChapterWatchedButton = forwardRef<
  ChapterWatchedButtonRef,
  ChapterWatchedButtonProps
>(({ item }, ref) => {
  const { t } = useTranslation();
  const [isWatched, setIsWatched] = useState(false);

  // Generate a unique key based on serieId, seasonId, and episodeId
  const chapterKey = `${item.serieId}_${item.seasonId}_${item.episodeId}`;

  // Check if the chapter is already watched when the component mounts
  useEffect(() => {
    const watched = useEffectSync(
      ChaptersWatchedLocalStorage.wasChapterSeen(item).pipe(
        Effect.provide(StorageServiceLive)
      )
    );
    setIsWatched(watched);
  }, [chapterKey]);

  const toggleWatched = () => {
    if (isWatched) {
      useEffectSync(
        ChaptersWatchedLocalStorage.removeChapterWatchedItem(item).pipe(
          Effect.provide(StorageServiceLive)
        )
      );
    } else {
      useEffectSync(
        ChaptersWatchedLocalStorage.addChapterWatchedItem(item).pipe(
          Effect.provide(StorageServiceLive)
        )
      );
    }

    setIsWatched(!isWatched);
  };

  const setWatched = (watched: boolean) => {
    if (watched !== isWatched) {
      if (watched) {
        useEffectSync(
          ChaptersWatchedLocalStorage.addChapterWatchedItem(item).pipe(
            Effect.provide(StorageServiceLive)
          )
        );
      } else {
        useEffectSync(
          ChaptersWatchedLocalStorage.removeChapterWatchedItem(item).pipe(
            Effect.provide(StorageServiceLive)
          )
        );
      }
      setIsWatched(watched);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      toggleWatched,
      setWatched,
      isWatched: () => isWatched,
      getWatchedState: () => isWatched,
    }),
    [isWatched, item]
  );

  return (
    <motion.button
      className={`fixed z-50 bottom-4 right-14 p-2 rounded-full ${
        isWatched ? "bg-white border-green-500" : "bg-white border-black"
      } shadow-lg transition-colors duration-500 focus:outline-none`}
      onClick={toggleWatched}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isWatched ? 1.2 : 1 }}
        whileHover={{ scale: 1.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isWatched ? (
          <Tooltip content={t("Serie_ChapterState_EyeMarked")}>
            <Eye className="w-4 h-4 text-green-500" />
          </Tooltip>
        ) : (
          <Tooltip content={t("Serie_ChapterState_MarkEye")}>
            <EyeOff className="w-4 h-4 text-black" />
          </Tooltip>
        )}
      </motion.div>
    </motion.button>
  );
});

ChapterWatchedButton.displayName = "ChapterWatchedButton";

export default ChapterWatchedButton;
