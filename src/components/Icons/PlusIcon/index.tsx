import { useImperativeHandle, forwardRef } from "react";
import { IconSvgProps } from "../../../types";

export interface PlusIconRef {
  getIconName: () => string;
  getIconType: () => string;
  getViewBox: () => string;
  getDimensions: () => { width: string | number; height: string | number };
}

const PlusIcon = forwardRef<PlusIconRef, IconSvgProps>(
  ({ size = 24, width, height, ...props }, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        getIconName: () => "PlusIcon",
        getIconType: () => "plus",
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
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        >
          <path d="M6 12h12" />
          <path d="M12 18V6" />
        </g>
      </svg>
    );
  }
);

PlusIcon.displayName = "PlusIcon";
export { PlusIcon };
