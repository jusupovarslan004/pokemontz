import React, { useState } from "react";
import { useSelector } from "react-redux";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { selectTranslation } from "../features/languageSlice";
import "../styles/BurgerMenu.css";

const BurgerMenu = ({ isPlaying, toggleMusic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const translations = useSelector(selectTranslation);

  return (
    <div className="burger-menu-container">
      <button
        className={`burger-button ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="pokeball">
          <div className="pokeball-top"></div>
          <div className="pokeball-middle">
            <div className="pokeball-dot"></div>
          </div>
          <div className="pokeball-bottom"></div>
        </div>
      </button>

      <div className={`menu-overlay ${isOpen ? "open" : ""}`}>
        <div className="menu-content">
          <div className="menu-item">
            <LanguageToggle />
          </div>
          <div className="menu-item">
            <ThemeToggle />
          </div>
          <div className="menu-item">
            <button className="music-toggle" onClick={toggleMusic}>
              {isPlaying ? translations.musicOff : translations.musicOn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu;
