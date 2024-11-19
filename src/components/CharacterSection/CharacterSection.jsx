import React from "react";
import CharacterCard from "../CharacterCard/CharacterCard";
import "./CharacterSection.css";
import nextIcon from "../../assets/next.png";
import prevIcon from "../../assets/previous.png";

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
    <section className="character-section">
      <div className="character-section__controls">
        <div className="character-section__pagination">
          {handlePreviousPage && (
            <button
              className="character-section__pagination-button character-section__pagination-button--prev"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              <img src={prevIcon} alt="Previous Page" />
            </button>
          )}
          {generatePageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`character-section__pagination-page ${
                page === pageNumber
                  ? "character-section__pagination-page--active"
                  : ""
              }`}
              onClick={() => onPageSelect(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          {handleNextPage && (
            <button
              className="character-section__pagination-button character-section__pagination-button--next"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              <img src={nextIcon} alt="Next Page" />
            </button>
          )}
        </div>
        <div className="character-section__search">
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
              className="character-section__search-clear"
            >
              ×
            </button>
          )}
        </div>
      </div>
      {characters.length === 0 ? (
        <p className="character-section__message">
          No Pokémon found matching your criteria.
        </p>
      ) : (
        <ul className="character-section__list">
          {characters.map((character) => (
            <CharacterCard
              key={character.id || character._id || character.name}
              character={character}
              onCardClick={() => handleCardClick(character)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default CharacterSection;
