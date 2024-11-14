import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Sidebar from "../SideBar/SideBar";
import CharacterSection from "../CharacterSection/CharacterSection";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ItemModal from "../ItemModal/ItemModal";
import Footer from "../Footer/Footer";
import axios from "axios";
import { register, login, checkToken, updateProfile } from "../../utils/auth";
import "./App.css";

const fetchPokemonWithCache = async (type, searchTerm, page) => {
  const cacheKey = `${type}-${searchTerm}-${page}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  try {
    const response = await axios.get("http://localhost:3001/api/pokemon", {
      params: { type, search: searchTerm, page },
    });
    const data = response.data;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Failed to fetch Pokémon data:", error);
    return null;
  }
};

function App() {
  const [characters, setCharacters] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      checkToken(jwt)
        .then((userData) => {
          setCurrentUser(userData);
          setToken(jwt);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          setIsLoggedIn(false);
        });
    }
  }, []);

  const totalPages = Math.ceil(totalResults / 50);

  useEffect(() => {
    async function fetchCharacters() {
      const data = await fetchPokemonWithCache(selectedType, searchTerm, page);
      if (data) {
        setCharacters(data.pokemon);
        setTotalResults(data.totalResults);
      }
    }
    fetchCharacters();
  }, [selectedType, searchTerm, page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handlePageSelect = (selectedPage) => {
    if (selectedPage !== page) setPage(selectedPage);
  };

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);

  const openItemModal = (character) => setSelectedCharacter(character);
  const closeItemModal = () => setSelectedCharacter(null);

  const switchToSignUp = () => {
    closeLoginModal();
    openRegisterModal();
  };

  const switchToLogin = () => {
    closeRegisterModal();
    openLoginModal();
  };

  const handleRegister = (data) => {
    register(data)
      .then(() => handleLogin({ email: data.email, password: data.password }))
      .then(closeRegisterModal)
      .catch((error) => console.error("Registration failed:", error));
  };

  const handleLogin = async (credentials) => {
    try {
      const res = await login(credentials);
      localStorage.setItem("jwt", res.token);
      setToken(res.token);
      const userData = await checkToken(res.token);
      setCurrentUser(userData);
      setIsLoggedIn(true);
      closeLoginModal();
    } catch (error) {
      const errorMessage = error.message || "Incorrect email or password";
      console.log("Login failed:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="page">
      <Header
        onLoginClick={openLoginModal}
        onSignUpClick={openRegisterModal}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />
      <div className="page__content">
        <Sidebar
          onTypeFilterChange={(type) => {
            setSelectedType(type);
            setPage(1);
          }}
        />
        <CharacterSection
          characters={characters}
          handleCardClick={openItemModal}
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            setPage(1);
          }}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          page={page}
          totalPages={totalPages}
          onPageSelect={handlePageSelect}
        />
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLoginModal}
        onLogin={handleLogin}
        onSwitchToSignUp={switchToSignUp}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeRegisterModal}
        onRegister={handleRegister}
        onSwitchToLogin={switchToLogin}
      />

      {selectedCharacter && (
        <ItemModal
          isOpen={!!selectedCharacter}
          character={selectedCharacter}
          onClose={closeItemModal}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
