import React, { useEffect } from "react";
import defaultImage from "../../assets/pokemon-unavailable.png";
import "./ItemModal.css";

//item modal
const ItemModal = ({ isOpen, onClose, character }) => {
  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (e.target.classList.contains("item-modal")) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscClose);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscClose);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleAddToPokedex = () => {
    onClose();
  };

  return (
    <div className={`item-modal ${isOpen ? "item-modal_open" : ""}`}>
      <div className="item-modal__content">
        <button
          onClick={onClose}
          className="item-modal__close-button"
          type="button"
        />
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
                  alt={character.name}
                  className="item-modal__image"
                  onError={(e) => (e.target.src = defaultImage)}
                />
              </div>
              <p className="item-modal__type">
                Type: {character.types.join(", ")}
              </p>
              <button
                className="item-modal__add-button"
                onClick={handleAddToPokedex}
              >
                Add to MyPokedex
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
