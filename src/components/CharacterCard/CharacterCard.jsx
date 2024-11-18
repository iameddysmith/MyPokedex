import React from "react";
import "./CharacterCard.css";
import defaultImage from "../../assets/pokemon-unavailable.png";

function CharacterCard({ character, onCardClick }) {
  return (
    <li className="character-card" onClick={() => onCardClick(character)}>
      <img
        src={character.sprite || defaultImage}
        alt={character.name || "Unknown Pokémon"}
        className="character-card__image"
        onError={(e) => (e.target.src = defaultImage)}
      />
      <h3 className="character-card__name">{character.name || "Unknown"}</h3>
    </li>
  );
}

export default CharacterCard;
