import { useMemo, useState } from "react";
import Plyr from "plyr-react";
import { X } from "lucide-react";

import { PromoResult, UniquePromo } from "../../types";

import "plyr-react/plyr.css";

type PlyrVideoPlayerProps = {
  promo: PromoResult;
  onClosePlayer: () => void;
};

// Plyr treats `sources` as quality variants of ONE video, so we must pick a
// single promo — preferring the official trailer — rather than passing every
// teaser/clip TMDB returns.
const pickBestPromo = (promo: PromoResult): UniquePromo | undefined => {
  const youtubeVideos = promo.filter(
    (video) => video.site.toLowerCase() === "youtube"
  );

  return (
    youtubeVideos.find((video) => video.type === "Trailer" && video.official) ??
    youtubeVideos.find((video) => video.type === "Trailer") ??
    youtubeVideos[0]
  );
};

export const PlyrVideoPlayer = ({
  promo,
  onClosePlayer,
}: PlyrVideoPlayerProps) => {
  const [isFloating, setIsFloating] = useState(true);

  const sources = useMemo((): Plyr.Source[] => {
    const best = pickBestPromo(promo);
    if (!best) return [];

    return [
      {
        src: best.key,
        provider: best.site.toLowerCase(),
        size: best.size,
        type: best.type,
      } as Plyr.Source,
    ];
  }, [promo]);

  const handleClose = () => {
    onClosePlayer();
    setIsFloating(false);
  };

  return (
    <div
      className={`${
        isFloating
          ? "fixed bottom-4 right-10 z-50 w-1/3 animate-pip-drop-effect"
          : "relative mx-auto w-3/4"
      } overflow-hidden rounded-lg aspect-w-16 aspect-h-9`}
    >
      {/* Close Button */}
      {isFloating && (
        <button
          className="absolute top-2 right-2 z-10 p-2 bg-transparent rounded-full border-none cursor-pointer"
          onClick={handleClose}
        >
          <X color="white" />
        </button>
      )}
      <Plyr
        source={{
          type: "video",
          sources: sources,
        }}
        options={{
          quality: {
            default: 1080,
            options: [1080, 720, 480],
            forced: true,
          },
          fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: true,
          },
          disableContextMenu: false,
        }}
        controls={true}
      />
    </div>
  );
};

export default PlyrVideoPlayer;
