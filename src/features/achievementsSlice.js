import { createSlice } from "@reduxjs/toolkit";

const achievementsSlice = createSlice({
  name: "achievements",
  initialState: {
    viewed: 0,
    favorites: 0,
    achievements: [
      {
        id: "first_favorite",
        title: "First Love",
        description: "Add first Pokémon to favorites",
        unlocked: false,
      },
      // другие достижения
    ],
  },
  reducers: {
    incrementViewed: (state) => {
      state.viewed += 1;
    },
    checkAchievements: (state, action) => {
      const { favorites } = action.payload;

      // Проверка достижения "First Love"
      const firstFavoriteAchievement = state.achievements.find(
        (a) => a.id === "first_favorite"
      );
      if (!firstFavoriteAchievement.unlocked && favorites.length > 0) {
        firstFavoriteAchievement.unlocked = true;
      }
    },
  },
});

export const { incrementViewed, checkAchievements } = achievementsSlice.actions;
export default achievementsSlice.reducer;
