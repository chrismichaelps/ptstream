import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_FOLDER = import.meta.glob("./*/index.ts");

const DEFAULT_LANGUAGE = "en";

const loadTranslations = async (): Promise<Resource> => {
  const resources: Resource = {};

  // "./<lang>/index.ts" → "<lang>"
  const languages = Object.keys(LANGUAGE_FOLDER)
    .map((file) => file.split("/")[1])
    .filter(Boolean);

  await Promise.all(
    languages.map(async (lang) => {
      const translation = (await import(`./${lang}/index.ts`)).default;
      resources[lang] = {
        translation: translation.common.default,
      };
    })
  );

  return resources;
};

const initI18n = async () => {
  const resources = await loadTranslations();

  await i18n.use(initReactI18next).init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    lng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
