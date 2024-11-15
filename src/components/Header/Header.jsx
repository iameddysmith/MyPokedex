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
        <div className="header__user-actions">
          {isLoggedIn ? (
            <>
              <Link to="/" className="header__btn">
                View Pokedex
              </Link>
              <button
                onClick={onLogout}
                className="header__btn header__logout-btn"
              >
                Log Out
              </button>
              <Link to="/profile" className="header__user-container">
                <span className="header__user-name">{currentUser.name}</span>
                <img
                  src={profileAvatar}
                  alt={currentUser.name}
                  className="header__avatar"
                />
              </Link>
            </>
          ) : (
            <>
              <button onClick={onSignUpClick} className="header__btn">
                Sign Up
              </button>
              <button onClick={onLoginClick} className="header__btn">
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
