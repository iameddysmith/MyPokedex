import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../SideBar/SideBar";
import CharacterSection from "../CharacterSection/CharacterSection";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ItemModal from "../ItemModal/ItemModal";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { fetchPokemonWithCache } from "../../utils/api";
import { register, login, checkToken } from "../../utils/auth";
import Preloader from "../Preloader/Preloader";
import "./App.css";

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      checkToken(jwt)
        .then((userData) => {
          setCurrentUser(userData);
          setToken(jwt);
          setIsLoggedIn(true);
        })
        .catch(() => {
          localStorage.removeItem("jwt");
          setIsLoggedIn(false);
        });
    }
  }, []);

  const totalPages = Math.ceil(totalResults / 50);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await fetchPokemonWithCache(
          selectedType,
          searchTerm,
          page
        );
        if (data) {
          setCharacters(data.pokemon);
          setTotalResults(data.totalResults);
        } else {
          setCharacters([]);
          setTotalResults(0);
        }
      } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
        setCharacters([]);
        setTotalResults(0);
      } finally {
        setIsInitialLoading(false);
      }
    };

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

  const openItemModal = (character) => {
    setSelectedCharacter(character);
  };

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

  const handleLogin = (credentials) => {
    return login(credentials)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setToken(res.token);
        return checkToken(res.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        setIsLoggedIn(true);
        closeLoginModal();
      })
      .catch((error) => {
        const errorMessage = error.message || "Incorrect email or password";
        console.log("Login failed:", errorMessage);
        throw new Error(errorMessage);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  if (isInitialLoading) {
    return <Preloader />;
  }

  return (
    <div className="page">
      <Header
        onLoginClick={openLoginModal}
        onSignUpClick={openRegisterModal}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />
      <main className="page__content">
        <Routes>
          <Route
            path="/"
            element={
              <>
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
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Profile
                  currentUser={currentUser}
                  token={token}
                  openItemModal={openItemModal}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

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
          token={token}
          isLoggedIn={isLoggedIn}
          isProfileView={window.location.pathname === "/profile"}
          onClose={closeItemModal}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
