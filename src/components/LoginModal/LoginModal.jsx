import React, { useRef, useEffect, useState } from "react";
import "./LoginModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useFormAndValidation } from "../../hooks/useFormAndValidation";

const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToSignUp }) => {
  const formRef = useRef();
  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation(formRef);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setIncorrectPassword(false);
      setIsButtonDisabled(false);
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      setIsButtonDisabled(true);
      try {
        await onLogin(values);
        setIncorrectPassword(false);
      } catch (err) {
        setIncorrectPassword(true);
        console.log("Login failed:", err.message);
      } finally {
        setIsButtonDisabled(false);
      }
    }
  };

  const handleInputChange = (e) => {
    handleChange(e);
    if (incorrectPassword) {
      setIncorrectPassword(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <ModalWithForm
      modalTitle="Log In"
      buttonText="Log In"
      secondaryButtonText="or Sign Up"
      onSecondaryButtonClick={onSwitchToSignUp}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={isValid && !isButtonDisabled}
      ref={formRef}
    >
      <label htmlFor="loginModal-email" className="modal__label">
        Email*
        <input
          type="email"
          id="loginModal-email"
          name="email"
          placeholder="Email"
          value={values.email || ""}
          onChange={handleInputChange}
          required
          className="modal__form-input"
        />
      </label>
      <span
        className={`modal__form-input-error ${
          errors.email ? "modal__form-input-error_visible" : ""
        }`}
        id="loginModal-email-error"
      >
        {errors.email}
      </span>

      <label
        htmlFor="loginModal-password"
        className={`modal__label ${
          incorrectPassword ? "modal__label_error" : ""
        }`}
      >
        {incorrectPassword ? "Incorrect Password" : "Password*"}
        <input
          type="password"
          id="loginModal-password"
          name="password"
          placeholder="Password"
          value={values.password || ""}
          onChange={handleInputChange}
          required
          className={`modal__form-input ${
            incorrectPassword ? "modal__form-input_type_error" : ""
          }`}
        />
      </label>
      <span
        className={`modal__form-input-error ${
          errors.password || incorrectPassword
            ? "modal__form-input-error_visible"
            : ""
        }`}
        id="loginModal-password-error"
      >
        {errors.password}
      </span>
    </ModalWithForm>
  );
};

export default LoginModal;
