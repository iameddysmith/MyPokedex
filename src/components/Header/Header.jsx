import React from "react";
import "./Header.css";
import headerLogo from "../../assets/mypokedexlogo.png";
import defaultAvatar from "../../assets/avatar1.png";
import { Link } from "react-router-dom";

function Header({ onLoginClick, onSignUpClick }) {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo-link">
          <img src={headerLogo} alt="MyPokedex Logo" className="header__logo" />
        </Link>
        <div className="header__user-actions">
          <button className="header__login-btn" onClick={onLoginClick}>
            Log In
          </button>
          <button className="header__signup-btn" onClick={onSignUpClick}>
            Sign Up
          </button>
          <img
            src={defaultAvatar}
            alt="Avatar Image"
            className="header__avatar"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
