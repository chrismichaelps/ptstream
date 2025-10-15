import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import Plyr from "plyr-react";
import { X } from "lucide-react";
import { map, toLower } from "lodash";
import { Effect, pipe } from "effect";

import { PromoResult } from "../../types";

import "plyr-react/plyr.css";

export interface PlyrVideoPlayerRef {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  toggleFullscreen: () => void;
  close: () => void;
  isPlaying: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
}

type PlyrVideoPlayerProps = {
  promo: PromoResult;
  onClosePlayer: () => void;
};

export const PlyrVideoPlayer = forwardRef<
  PlyrVideoPlayerRef,
  PlyrVideoPlayerProps
>(({ promo, onClosePlayer }, ref) => {
  const [isFloating, setIsFloating] = useState(true);
  const plyrRef = useRef<any>(null);

  const sources = pipe(
    Effect.sync(() => promo),
    Effect.map((values) =>
      map(
        values,
        ({ key, site, size, type }) =>
          ({
            src: key,
            provider: toLower(site),
            size: size,
            type: type,
          }) as Plyr.Source
      )
    ),
    Effect.runSync
  );

  const handleClose = () =>
    pipe(
      Effect.sync(() => {
        onClosePlayer();
        setIsFloating(false);
      }),
      Effect.runSync
    );

  useImperativeHandle(
    ref,
    () => ({
      play: () => plyrRef.current?.play(),
      pause: () => plyrRef.current?.pause(),
      togglePlay: () => plyrRef.current?.togglePlay(),
      setVolume: (volume: number) => {
        if (plyrRef.current) plyrRef.current.volume = volume;
      },
      seek: (time: number) => {
        if (plyrRef.current) plyrRef.current.currentTime = time;
      },
      toggleFullscreen: () => plyrRef.current?.toggleFullscreen(),
      close: handleClose,
      isPlaying: () => plyrRef.current?.playing || false,
      getCurrentTime: () => plyrRef.current?.currentTime || 0,
      getDuration: () => plyrRef.current?.duration || 0,
    }),
    []
  );

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
        ref={plyrRef}
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
});

PlyrVideoPlayer.displayName = "PlyrVideoPlayer";

export default PlyrVideoPlayer;
