import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPokemon,
  filterPokemon,
  setPage,
  searchPokemon,
  toggleFavorite,
  searchPokemonAsync,
  toggleShowFavorites,
} from "./features/pokemonSlice";
import { checkAchievements } from "./features/achievementsSlice";
import LanguageToggle from "./components/LanguageToggle";
import { selectTranslation } from "./features/languageSlice";
import ThemeToggle from "./components/ThemeToggle";
import BurgerMenu from './components/BurgerMenu';
import "./App.css";

const Modal = ({ pokemon, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!pokemon) return null;

  const images = [
    pokemon.sprites.front_default,
    pokemon.sprites.back_default,
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
    pokemon.sprites.other.dream_world.front_default,
    pokemon.sprites.other["official-artwork"].front_default,
  ].filter(Boolean); // Remove null values

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="modal-header">
          <h2 className="modal-title">{pokemon.name}</h2>
          <div className="image-gallery">
            <button className="gallery-nav prev" onClick={prevImage}>
              ❮
            </button>
            <img
              className="modal-image"
              src={images[currentImageIndex]}
              alt={`${pokemon.name} sprite ${currentImageIndex + 1}`}
            />
            <button className="gallery-nav next" onClick={nextImage}>
              ❯
            </button>
          </div>
          <div className="image-counter">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
        <div className="modal-body">
          <h3>Stats</h3>
          <div className="stats-container">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className="stat-item">
                <span className="stat-name">{stat.stat.name}:</span>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar"
                    style={{ width: `${(stat.base_stat / 150) * 100}%` }}
                  ></div>
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pokemon-info">
            <div className="info-item">
              <span>Height:</span> {pokemon.height / 10}m
            </div>
            <div className="info-item">
              <span>Weight:</span> {pokemon.weight / 10}kg
            </div>
            <div className="info-item">
              <span>Base Experience:</span> {pokemon.base_experience}
            </div>
          </div>
          <div className="pokemon-types">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`type-badge ${type.type.name}`}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingScreen = () => {
  return (
    <div className="anime-background">
      <div className="loading-container">
        <div className="pokeball-loading"></div>
        <h2 className="loading">Catching Pokémon...</h2>
      </div>
    </div>
  );
};

const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 2) {
      // Поиск начинается после ввода 2 символов
      dispatch(searchPokemon(value));
      dispatch(searchPokemonAsync(value));
    } else if (value === "") {
      dispatch(searchPokemon(""));
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
    </div>
  );
};

const CompareModal = ({ pokemon1, pokemon2, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="compare-modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="compare-container">
          <div className="compare-pokemon">
            <h3>{pokemon1.name}</h3>
            {/* Статистика первого покемона */}
          </div>
          <div className="compare-vs">VS</div>
          <div className="compare-pokemon">
            <h3>{pokemon2.name}</h3>
            {/* Статистика второго покемона */}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const {
    filteredPokemon,
    pokemon,
    selectedType,
    status,
    currentPage,
    totalPages,
    favorites,
    showOnlyFavorites,
  } = useSelector((state) => state.pokemon);
  const achievements = useSelector((state) => state.achievements);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const translations = useSelector(selectTranslation);
  const isDark = useSelector((state) => state.theme.isDark);

  console.log("Achievements:", achievements);

  useEffect(() => {
    dispatch(fetchPokemon(currentPage));
  }, [currentPage, dispatch]);

  const toggleMusic = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const pokemonTypes = [
    "all",
    ...new Set(pokemon.flatMap((p) => p.types.map((t) => t.type.name))),
  ];

  const handleFilterChange = (type) => {
    dispatch(filterPokemon(type));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "failed") {
    return <div className="error">Error loading pokemon!</div>;
  }

  return (
    <div className={`anime-background ${isDark ? "dark" : "light"}`}>
      <audio ref={audioRef} loop src="/pokemon-theme.mp3" />
      
      {/* Desktop controls */}
      <div className="top-controls desktop-only">
        <div className="left-controls">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <button className="music-toggle" onClick={toggleMusic}>
          {isPlaying ? translations.musicOff : translations.musicOn}
        </button>
      </div>

      {/* Mobile burger menu */}
      <BurgerMenu isPlaying={isPlaying} toggleMusic={toggleMusic} />

      <h1 className="title">{translations.title}</h1>
      <div className="controls-container">
        <SearchBar />
        <button
          className={`favorites-toggle ${showOnlyFavorites ? "active" : ""}`}
          onClick={() => dispatch(toggleShowFavorites())}
        >
          ❤ Favorites
        </button>
      </div>
      <div className="filter-container">
        {pokemonTypes.map((type) => (
          <button
            key={type}
            className={`filter-button ${
              selectedType === type ? "active" : ""
            } ${type}`}
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="pokemon-container">
        {filteredPokemon.map((item) => (
          <div
            key={item.id}
            className="pokemon-card"
            onClick={() => setSelectedPokemon(item)}
          >
            <span className="pokemon-name">{item.name}</span>
            <img
              className="pokemon-image"
              src={item.sprites.other.dream_world.front_default}
              alt={item.name}
            />
            <div className="pokemon-types">
              {item.types.map((type) => (
                <span
                  key={type.type.name}
                  className={`type-badge ${type.type.name}`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
            <button
              className={`favorite-button ${
                favorites.includes(item.id) ? "active" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleFavorite(item.id));
                dispatch(checkAchievements({ favorites: favorites }));
              }}
            >
              ❤
            </button>
          </div>
        ))}
      </div>
      <Modal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
