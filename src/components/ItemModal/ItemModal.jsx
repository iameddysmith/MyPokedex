import React from "react";
import { Modal } from "../Modal/Modal";
import defaultImage from "../../assets/pokemon-unavailable.png";
import "./ItemModal.css";
import {
  addPokemonToCollection,
  removePokemonFromCollection,
} from "../../utils/api";

const ItemModal = ({
  isOpen,
  onClose,
  character,
  token,
  isLoggedIn,
  isProfileView,
}) => {
  const handleAddToCollection = () => {
    if (!token || !character) return;

    const pokemonData = {
      name: character.name,
      type: character.types,
      sprite: character.sprite,
    };

    addPokemonToCollection(token, pokemonData)
      .then(() => {
        console.log(`${character.name} added to collection!`);
        onClose();
      })
      .catch((err) => {
        console.error("Error adding Pokémon to collection:", err);
      });
  };

  const handleRemoveFromCollection = () => {
    if (!token || !character) return;

    removePokemonFromCollection(token, character._id)
      .then(() => {
        console.log(`${character.name} removed from collection!`);
        onClose();
      })
      .catch((err) => {
        console.error("Error removing Pokémon from collection:", err);
      });
  };

  return (
    <Modal name="item-modal" isOpen={isOpen} onClose={onClose}>
      <h2 className="item-modal__title">
        {character
          ? character.name.charAt(0).toUpperCase() + character.name.slice(1)
          : "Details"}
      </h2>
      <div className="item-modal__content">
        {character && (
          <>
            <div className="item-modal__image-container">
              <img
                src={character.sprite || defaultImage}
                alt={character.name || "Unknown Pokémon"}
                className="item-modal__image"
                onError={(e) => (e.target.src = defaultImage)}
              />
            </div>
            <p className="item-modal__type">
              Type:{" "}
              {Array.isArray(character.types) && character.types.length
                ? character.types.join(", ")
                : "Unknown"}
            </p>
            {isLoggedIn && (
              <button
                className="item-modal__action-button"
                onClick={
                  isProfileView
                    ? handleRemoveFromCollection
                    : handleAddToCollection
                }
              >
                {isProfileView ? "Remove from My Pokedex" : "Add to My Pokedex"}
              </button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ItemModal;
