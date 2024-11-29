import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "../features/pokemonSlice";
import achievementsReducer from "../features/achievementsSlice";
import languageReducer from "../features/languageSlice";
import themeReducer from "../features/themeSlice";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    achievements: achievementsReducer,
    language: languageReducer,
    theme: themeReducer,
  },
});
