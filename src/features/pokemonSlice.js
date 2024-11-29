import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPokemon = createAsyncThunk(
  "pokemon/fetchPokemon",
  async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await response.json();
    const detailPokemon = await Promise.all(
      data.results.map(async (item) => {
        const response = await fetch(item.url);
        return response.json();
      })
    );
    return detailPokemon;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pokemon = action.payload;
        state.filteredPokemon = action.payload;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { filterPokemon } = pokemonSlice.actions;
export default pokemonSlice.reducer;
