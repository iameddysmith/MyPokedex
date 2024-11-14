import React from "react";
import CharacterCard from "../CharacterCard/CharacterCard";
import "./CharacterSection.css";
import nextIcon from "../../assets/next.png";
import prevIcon from "../../assets/previous.png";

//char section
function CharacterSection({
  characters = [],
  handleCardClick,
  searchTerm,
  setSearchTerm,
  handleNextPage,
  handlePreviousPage,
  page,
  totalPages,
  onPageSelect,
}) {
  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const clearSearch = () => setSearchTerm("");

  const generatePageNumbers = () => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  };

  return (
    <div className="character-section">
      <div className="character-section__pagination-container">
        <div className="character-section__pagination">
          <button
            className="pagination__button-previous"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            <img src={prevIcon} alt="Previous Page" />
          </button>
          {generatePageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`pagination__button ${
                page === pageNumber ? "active" : ""
              }`}
              onClick={() => onPageSelect(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="pagination__button-next"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            <img src={nextIcon} alt="Next Page" />
          </button>
        </div>
        <div className="character-section__search-container">
          <input
            type="text"
            placeholder="Search Pokémon"
            value={searchTerm}
            onChange={handleSearchChange}
            className="character-section__search-input"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="character-section__clear-button"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <ul className="character-section__list">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onCardClick={() => handleCardClick(character)}
          />
        ))}
      </ul>
    </div>
  );
}

export default CharacterSection;
