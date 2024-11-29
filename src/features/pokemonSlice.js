import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
      });
  },
});

export const { filterPokemon, setPage } = pokemonSlice.actions;
export default pokemonSlice.reducer;
