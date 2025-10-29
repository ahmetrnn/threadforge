"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { I18n } from "i18n-js";
import en from "./locales/en.json";
import tr from "./locales/tr.json";

const i18nInstance = new I18n({
  en,
  tr,
});

i18nInstance.defaultLocale = "en";
i18nInstance.locale = "en";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  i18n: I18n;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState("en");

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    i18nInstance.locale = lang;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, i18n: i18nInstance }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return context.i18n;
};
