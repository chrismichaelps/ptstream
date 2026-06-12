import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { AppRuntime } from "../../../packages/runtime";
import * as ChaptersWatchedLocalStorage from "../../toolkit/ChaptersWatchedLocalStorage";
import { ChapterRef } from "../../toolkit/ChaptersWatchedLocalStorage";

type ChapterWatchedButtonProps = {
  item: ChapterRef;
};

const ChapterWatchedButton = ({ item }: ChapterWatchedButtonProps) => {
  const { t } = useTranslation();
  const [isWatched, setIsWatched] = useState(false);

  // Check if the chapter is already watched when the component mounts
  useEffect(() => {
    const watched = AppRuntime.runSync(
      ChaptersWatchedLocalStorage.wasChapterSeen(item)
    );
    setIsWatched(watched);
  }, [item.serieId, item.seasonId, item.episodeId]);

  const toggleWatched = () => {
    if (isWatched) {
      AppRuntime.runSync(
        ChaptersWatchedLocalStorage.removeChapterWatchedItem(item)
      );
    } else {
      AppRuntime.runSync(
        ChaptersWatchedLocalStorage.addChapterWatchedItem(item)
      );
    }

    setIsWatched((watched) => !watched);
  };

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
};

export default ChapterWatchedButton;
