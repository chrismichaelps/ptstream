import { useCallback, useEffect, useState } from "react";

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const getFullscreenElement = () => {
  const doc = document as FullscreenDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
};

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(
    () => getFullscreenElement() !== null
  );

  // Track the real fullscreen state so Esc / system exits stay in sync.
  useEffect(() => {
    const handleChange = () => setIsFullscreen(getFullscreenElement() !== null);

    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
    };
  }, []);

  const toggleFullscreen = useCallback(
    (element: HTMLElement = document.documentElement) => {
      const target = element as FullscreenElement;
      const doc = document as FullscreenDocument;

      if (!getFullscreenElement()) {
        if (target.requestFullscreen) {
          void target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          void target.webkitRequestFullscreen();
        }
      } else if (doc.exitFullscreen) {
        void doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        void doc.webkitExitFullscreen();
      }
    },
    []
  );

  return { isFullscreen, toggleFullscreen };
};
