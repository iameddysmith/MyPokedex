import React, { useEffect, useState } from "react";
import CharacterSection from "../CharacterSection/CharacterSection";
import Sidebar from "../SideBar/SideBar";
import { fetchUserCollection } from "../../utils/api";
import Preloader from "../Preloader/Preloader";
import "./Profile.css";

const ITEMS_PER_PAGE = 50;

const Profile = ({ token, openItemModal }) => {
  const [collection, setCollection] = useState([]);
  const [filteredCollection, setFilteredCollection] = useState([]);
  const [displayedCollection, setDisplayedCollection] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCollection = () => {
    if (token) {
      setIsLoading(true);
      fetchUserCollection(token)
        .then((data) => {
          setCollection(data);
          setFilteredCollection(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError("Failed to refresh Pokémon collection.");
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    refreshCollection();
  }, [token]);

  useEffect(() => {
    let filtered = collection;

    if (selectedType) {
      filtered = filtered.filter((pokemon) => {
        const pokemonTypes = Array.isArray(pokemon.types)
          ? pokemon.types.map((type) => type.toLowerCase())
          : [];
        return pokemonTypes.includes(selectedType.toLowerCase());
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCollection(filtered);
    setPage(1);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
  }, [collection, selectedType, searchTerm]);

  useEffect(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedCollection(filteredCollection.slice(startIndex, endIndex));
  }, [filteredCollection, page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handlePageSelect = (selectedPage) => {
    setPage(selectedPage);
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p className="profile__error">{error}</p>;
  }

  return (
    <section className="profile">
      <Sidebar onTypeFilterChange={(type) => setSelectedType(type)} />
      <CharacterSection
        characters={displayedCollection}
        handleCardClick={(character) => openItemModal(character)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        page={page}
        totalPages={totalPages}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        onPageSelect={handlePageSelect}
      />
    </section>
  );
};

export default Profile;
