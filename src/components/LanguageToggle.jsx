import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../features/languageSlice";

const LanguageToggle = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.language.current);

  return (
    <div className="language-toggle">
      <button
        className={`language-btn ${currentLanguage === "en" ? "active" : ""}`}
        onClick={() => dispatch(setLanguage("en"))}
      >
        🇬🇧 EN
      </button>
      <button
        className={`language-btn ${currentLanguage === "ru" ? "active" : ""}`}
        onClick={() => dispatch(setLanguage("ru"))}
      >
        🇷🇺 RU
      </button>
    </div>
  );
};

export default LanguageToggle;
