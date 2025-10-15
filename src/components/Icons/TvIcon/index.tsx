// icon:tv-2 | Lucide https://lucide.dev/ | Lucide

import React, { useImperativeHandle, forwardRef } from "react";

export interface TvIconRef {
  getIconName: () => string;
  getIconType: () => string;
  getViewBox: () => string;
  getDimensions: () => { width: string; height: string };
}

const TvIcon = forwardRef<TvIconRef, {}>(({}, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      getIconName: () => "TvIcon",
      getIconType: () => "tv",
      getViewBox: () => "0 0 24 24",
      getDimensions: () => ({ width: "1em", height: "1em" }),
    }),
    []
  );

  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
    >
      <path d="M7 21h10" />
      <path d="M4 3 H20 A2 2 0 0 1 22 5 V15 A2 2 0 0 1 20 17 H4 A2 2 0 0 1 2 15 V5 A2 2 0 0 1 4 3 z" />
    </svg>
  );
});

TvIcon.displayName = "TvIcon";
export default TvIcon;
