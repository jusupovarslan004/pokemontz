import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import "../styles/ThemeToggle.css";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div className="theme-toggle-wrapper">
      <div className="theme-toggle-label">☀️</div>
      <label className="theme-switch">
        <input
          type="checkbox"
          checked={isDark}
          onChange={() => dispatch(toggleTheme())}
        />
        <span className="slider round">
          <span className="slider-thumb"></span>
        </span>
      </label>
      <div className="theme-toggle-label">🌙</div>
    </div>
  );
};

export default ThemeToggle;
