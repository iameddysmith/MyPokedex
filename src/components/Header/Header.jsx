import React from "react";
import "./Header.css";
import headerLogo from "../../assets/mypokedexlogo.png";
import avatar1 from "../../assets/avatar1.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";
import avatar5 from "../../assets/avatar5.png";
import { Link } from "react-router-dom";

const avatarImages = {
  "/assets/avatar1.png": avatar1,
  "/assets/avatar2.png": avatar2,
  "/assets/avatar3.png": avatar3,
  "/assets/avatar4.png": avatar4,
  "/assets/avatar5.png": avatar5,
};

function Header({
  isLoggedIn,
  currentUser,
  onLoginClick,
  onSignUpClick,
  onLogout,
}) {
  const profileAvatar = avatarImages[currentUser?.avatar];

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo-link">
          <img src={headerLogo} alt="MyPokedex Logo" className="header__logo" />
        </Link>
        <nav className="header__navigation">
          {isLoggedIn ? (
            <>
              <Link to="/" className="header__navigation-link">
                View Pokedex
              </Link>
              <button
                onClick={onLogout}
                className="header__button header__logout-button"
              >
                Log Out
              </button>
              <Link to="/profile" className="header__profile">
                <span className="header__profile-name">{currentUser.name}</span>
                <img
                  src={profileAvatar}
                  alt={currentUser.name || "User Avatar"}
                  className="header__profile-avatar"
                />
              </Link>
            </>
          ) : (
            <>
              <button onClick={onSignUpClick} className="header__button">
                Sign Up
              </button>
              <button onClick={onLoginClick} className="header__button">
                Log In
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
