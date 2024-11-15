import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Sidebar.css";

function Sidebar({ onTypeFilterChange }) {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/type");
        const allTypes = response.data.results;
        const filteredTypes = [];
        for (const type of allTypes) {
          const typeData = await axios.get(type.url);
          if (typeData.data.pokemon.length > 0) {
            filteredTypes.push(
              type.name.charAt(0).toUpperCase() + type.name.slice(1)
            );
          }
        }

        setTypes(filteredTypes.sort());
      } catch (error) {
        console.error("Failed to fetch types", error);
      }
    };

    fetchTypes();
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
    <div className="sidebar">
      <h2 className="sidebar__title">Filter by Pokémon Type</h2>
      <div className="sidebar__filters">
        {types.map((type) => (
          <button
            key={type}
            className={`sidebar__filter-button ${
              selectedType === type ? "sidebar__filter-button--active" : ""
            }`}
            onClick={() => handleTypeClick(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
