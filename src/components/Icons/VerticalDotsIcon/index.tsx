import { useImperativeHandle, forwardRef } from "react";
import { IconSvgProps } from "../../../types";

export interface VerticalDotsIconRef {
  getIconName: () => string;
  getIconType: () => string;
  getViewBox: () => string;
  getDimensions: () => { width: string | number; height: string | number };
}

const VerticalDotsIcon = forwardRef<VerticalDotsIconRef, IconSvgProps>(
  ({ size = 24, width, height, ...props }, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        getIconName: () => "VerticalDotsIcon",
        getIconType: () => "vertical-dots",
        getViewBox: () => "0 0 24 24",
        getDimensions: () => ({
          width: size || width || 24,
          height: size || height || 24,
        }),
      }),
      [size, width, height]
    );

    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
      >
        <path
          d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

VerticalDotsIcon.displayName = "VerticalDotsIcon";
export { VerticalDotsIcon };
