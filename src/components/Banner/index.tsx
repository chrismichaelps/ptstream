import { useImperativeHandle, forwardRef } from "react";
import { Image } from "@nextui-org/react";

export interface BannerRef {
  updateImage: (src: string, alt: string) => void;
  updateStyles: (
    style?: React.CSSProperties,
    imageStyle?: React.CSSProperties
  ) => void;
  getCurrentSrc: () => string;
  getCurrentAlt: () => string;
  getCurrentStyle: () => React.CSSProperties | undefined;
  getCurrentImageStyle: () => React.CSSProperties | undefined;
}

type BannerProps = {
  srcImg: string;
  alt: string;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
};

const Banner = forwardRef<BannerRef, BannerProps>(
  ({ srcImg, alt, style, imageStyle }, ref) => {
    const updateImage = (src: string, newAlt: string) => {
      // This would need to be handled by the parent component
      console.log("Image update requested:", src, newAlt);
    };

    const updateStyles = (
      newStyle?: React.CSSProperties,
      newImageStyle?: React.CSSProperties
    ) => {
      console.log("Styles update requested:", newStyle, newImageStyle);
    };

    const getCurrentSrc = () => srcImg;
    const getCurrentAlt = () => alt;
    const getCurrentStyle = () => style;
    const getCurrentImageStyle = () => imageStyle;

    useImperativeHandle(
      ref,
      () => ({
        updateImage,
        updateStyles,
        getCurrentSrc,
        getCurrentAlt,
        getCurrentStyle,
        getCurrentImageStyle,
      }),
      [srcImg, alt, style, imageStyle]
    );

    return (
      <div className="relative m-4 overflow-hidden rounded-2xl" style={style}>
        <Image
          className="object-cover w-full h-full"
          src={`https://image.tmdb.org/t/p/original${srcImg}`}
          alt={`${alt} backdrop`}
          style={{
            ...imageStyle,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, var(--nextui-colors-background), transparent)",
          }}
        />
      </div>
    );
  }
);

Banner.displayName = "Banner";

export default Banner;
