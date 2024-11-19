import React, { useState, useEffect } from "react";
import { fetchPokemonTypes } from "../../utils/pokemonApi";
import "./Sidebar.css";

function Sidebar({ onTypeFilterChange }) {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const fetchedTypes = await fetchPokemonTypes();
        setTypes(fetchedTypes);
      } catch (error) {
        console.error("Error fetching Pokémon types:", error);
      }
    };

    loadTypes();
  }, []);

  const handleTypeClick = (type) => {
    if (selectedType === type) {
      setSelectedType("");
      onTypeFilterChange("");
    } else {
      setSelectedType(type);
      onTypeFilterChange(type);
    }
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">Filter by Pokémon Type</h2>
      <div className="sidebar__filters">
        {types.map((type) => (
          <button
            key={type}
            className={`sidebar__filter-button ${
              selectedType === type ? "sidebar__filter-button_active" : ""
            }`}
            onClick={() => handleTypeClick(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
