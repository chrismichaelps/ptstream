import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { GithubIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Effect, pipe } from "effect";
import { UI_DIMENSIONS } from "../../../packages/constants";

export interface FooterRef {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  isVisible: () => boolean;
  getCurrentYear: () => number;
}

const Footer = forwardRef<FooterRef, {}>(({}, ref) => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    pipe(
      Effect.sync(() => true),
      Effect.tap((value) => Effect.sync(() => setIsVisible(value))),
      Effect.runSync
    );
  }, []);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);
  const toggle = () => setIsVisible((prev) => !prev);
  const isVisibleCheck = () => isVisible;
  const getCurrentYear = () => currentYear;

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
      toggle,
      isVisible: isVisibleCheck,
      getCurrentYear,
    }),
    [isVisible, currentYear]
  );

  return (
    <footer
      className={`
        bg-white py-2 px-4 fixed bottom-0 left-0 right-0 shadow-md
        transition-all duration-1000 ease-in-out
        ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }
        z-50 // Ensure the footer is above other content
      `}
    >
      <div className="container flex justify-between items-center mx-auto">
        <p className="text-sm text-gray-700">
          &copy; {currentYear} {t("Copyright")}
        </p>
        <a
          href={"https://github.com/chrismichaelps/ptstream"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 transition-colors hover:text-gray-900 group"
        >
          <GithubIcon
            size={UI_DIMENSIONS.ICONS.MEDIUM}
            className="transition-transform duration-300 ease-in-out transform group-hover:rotate-12 group-hover:scale-110"
          />
        </a>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
