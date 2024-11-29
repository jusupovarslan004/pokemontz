import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

export const fetchPokemon = createAsyncThunk(
  "pokemon/fetchPokemon",
  async (page = 1) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    const detailPokemon = await Promise.all(
      data.results.map(async (item) => {
        const response = await fetch(item.url);
        return response.json();
      })
    );
    return {
      pokemon: detailPokemon,
      totalCount: data.count,
    };
  }
);

export const searchPokemon = createAction("pokemon/searchPokemon");

export const searchPokemonAsync = createAsyncThunk(
  "pokemon/searchPokemonAsync",
  async (searchTerm) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
    );
    if (response.ok) {
      const data = await response.json();
      return [data];
    }
    return [];
  }
);

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState: {
    pokemon: [],
    filteredPokemon: [],
    selectedType: "all",
    status: "idle",
    error: null,
    currentPage: 1,
    totalPages: 0,
    favorites: [],
    showOnlyFavorites: false,
  },
  reducers: {
    filterPokemon: (state, action) => {
      state.selectedType = action.payload;
      if (action.payload === "all") {
        state.filteredPokemon = state.pokemon;
      } else {
        state.filteredPokemon = state.pokemon.filter((p) =>
          p.types.some((t) => t.type.name === action.payload)
        );
      }
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    toggleFavorite: (state, action) => {
      const pokemonId = action.payload;
      const index = state.favorites.indexOf(pokemonId);
      if (index === -1) {
        state.favorites.push(pokemonId);
      } else {
        state.favorites.splice(index, 1);
      }
    },
    toggleShowFavorites: (state) => {
      state.showOnlyFavorites = !state.showOnlyFavorites;
      if (state.showOnlyFavorites) {
        state.filteredPokemon = state.pokemon.filter((p) =>
          state.favorites.includes(p.id)
        );
      } else {
        state.filteredPokemon = state.pokemon;
      }
    },
    [searchPokemon]: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      if (searchTerm === "") {
        state.filteredPokemon = state.pokemon;
      } else {
        state.filteredPokemon = state.pokemon.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pokemon = action.payload.pokemon;
        state.filteredPokemon = action.payload.pokemon;
        state.totalPages = Math.ceil(action.payload.totalCount / 20);
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(searchPokemonAsync.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.filteredPokemon = action.payload;
        }
      });
  },
});

export const { filterPokemon, setPage, toggleFavorite, toggleShowFavorites } =
  pokemonSlice.actions;
export default pokemonSlice.reducer;
