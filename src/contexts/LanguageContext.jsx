
import React, { createContext, useContext, useMemo } from "react";
import { Effect } from "effect";
import { useEffect, useEffectSync } from "./EffectContext";
import { LanguageService } from "../../packages/services";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const languageService = useEffectSync(LanguageService);

  const contextValue = useMemo(() => ({
    lang: useEffectSync(languageService.getLanguage()),
    setLang: (newLang) => {
      useEffectSync(languageService.setLanguage(newLang));
    }
  }), [languageService]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
