"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageToggle() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex gap-2 rounded-xl border border-zinc-700 p-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-4 py-2 rounded-lg font-bold ${
          language === "en"
            ? "bg-blue-600 text-white"
            : "bg-black text-zinc-400"
        }`}
      >
        EN
      </button>

      <button
        onClick={() => changeLanguage("es")}
        className={`px-4 py-2 rounded-lg font-bold ${
          language === "es"
            ? "bg-orange-600 text-white"
            : "bg-black text-zinc-400"
        }`}
      >
        ES
      </button>
    </div>
  );
}