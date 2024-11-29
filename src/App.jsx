import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemon, filterPokemon } from "./features/pokemonSlice";
import "./App.css";

const Modal = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="modal-header">
          <h2 className="modal-title">{pokemon.name}</h2>
          <img
            className="modal-image"
            src={pokemon.sprites.other.dream_world.front_default}
            alt={pokemon.name}
          />
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

const App = () => {
  const dispatch = useDispatch();
  const { filteredPokemon, pokemon, selectedType, status } = useSelector(
    (state) => state.pokemon
  );
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPokemon());
    }
  }, [status, dispatch]);

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

  if (status === "loading") {
    return <div className="loading">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="error">Error loading pokemon!</div>;
  }

  return (
    <div className="anime-background">
      <audio ref={audioRef} loop src="/pokemon-theme.mp3" />
      <button className="music-toggle" onClick={toggleMusic}>
        {isPlaying ? "🔇 Выключить музыку" : "🔊 Включить музыку"}
      </button>
      <h1 className="title">Pokémon Universe</h1>
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
          </div>
        ))}
      </div>
      <Modal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </div>
  );
};

export default App;
