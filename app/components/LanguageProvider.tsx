"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "es";

const LanguageContext = createContext({
  lang: "en" as Lang,
  setLang: (lang: Lang) => {},
  t: (en: string, es: string) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("team_avengers_language") as Lang;
    if (saved === "en" || saved === "es") {
      setLangState(saved);
    }
  }, []);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    localStorage.setItem("team_avengers_language", newLang);
  }

  function t(en: string, es: string) {
    return lang === "es" ? es : en;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}