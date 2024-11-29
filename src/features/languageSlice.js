import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    current: "en",
    translations: {
      en: {
        search: "Search Pokémon...",
        loading: "Catching Pokémon...",
        title: "Pokémon Universe",
        favorites: "Favorites",
        previous: "Previous",
        next: "Next",
        page: "Page",
        of: "of",
        stats: "Stats",
        height: "Height",
        weight: "Weight",
        baseExperience: "Base Experience",
        musicOn: "🔊 Turn on music",
        musicOff: "🔇 Turn off music",
        error: "Error loading pokemon!",
      },
      ru: {
        search: "Поиск покемона...",
        loading: "Ловим покемонов...",
        title: "Вселенная Покемонов",
        favorites: "Избранное",
        previous: "Назад",
        next: "Вперед",
        page: "Страница",
        of: "из",
        stats: "Характеристики",
        height: "Рост",
        weight: "Вес",
        baseExperience: "Базовый опыт",
        musicOn: "🔊 Включить музыку",
        musicOff: "🔇 Выключить музыку",
        error: "Ошибка загрузки покемонов!",
      },
    },
  },
  reducers: {
    setLanguage: (state, action) => {
      state.current = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const selectTranslation = (state) =>
  state.language.translations[state.language.current];
export default languageSlice.reducer;
