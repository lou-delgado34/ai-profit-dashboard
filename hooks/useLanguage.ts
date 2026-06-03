"use client";

import { useEffect, useState } from "react";

export function useLanguage() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("language");

    if (saved) {
      setLanguage(saved);
    }
  }, []);

  function changeLanguage(lang: string) {
    localStorage.setItem("language", lang);
    setLanguage(lang);
  }

  return {
    language,
    changeLanguage,
  };
}