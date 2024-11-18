import React, { useRef, useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useFormAndValidation } from "../../hooks/useFormAndValidation";
import avatar1 from "../../assets/avatar1.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";
import avatar5 from "../../assets/avatar5.png";
import "./RegisterModal.css";

const RegisterModal = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
  const formRef = useRef();
  const avatarOptions = [
    { src: avatar1, value: "/assets/avatar1.png" },
    { src: avatar2, value: "/assets/avatar2.png" },
    { src: avatar3, value: "/assets/avatar3.png" },
    { src: avatar4, value: "/assets/avatar4.png" },
    { src: avatar5, value: "/assets/avatar5.png" },
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].value);

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation(formRef);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setSelectedAvatar(avatarOptions[0].value);
    }
  }, [isOpen, resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onRegister({ ...values, avatar: selectedAvatar });
      onClose();
      resetForm();
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar.value);
  };

  return (
    <ModalWithForm
      modalTitle="Sign Up"
      buttonText="Sign Up"
      secondaryButtonText="or Log In"
      onSecondaryButtonClick={onSwitchToLogin}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={isValid}
      ref={formRef}
    >
      <label htmlFor="registerModal-email" className="modal__label">
        Email*
        <input
          type="email"
          id="registerModal-email"
          name="email"
          placeholder="Email"
          value={values.email || ""}
          onChange={handleChange}
          required
          className="modal__form-input"
        />
      </label>
      <span
        className={`modal__form-input-error ${
          errors.email ? "modal__form-input-error_visible" : ""
        }`}
      >
        {errors.email}
      </span>

      <label htmlFor="registerModal-password" className="modal__label">
        Password*
        <input
          type="password"
          id="registerModal-password"
          name="password"
          placeholder="Password"
          minLength="5"
          value={values.password || ""}
          onChange={handleChange}
          required
          className="modal__form-input"
        />
      </label>
      <span
        className={`modal__form-input-error ${
          errors.password ? "modal__form-input-error_visible" : ""
        }`}
      >
        {errors.password}
      </span>

      <label htmlFor="registerModal-name" className="modal__label">
        Name*
        <input
          type="text"
          id="registerModal-name"
          name="name"
          placeholder="Name"
          minLength="2"
          maxLength="40"
          value={values.name || ""}
          onChange={handleChange}
          required
          className="modal__form-input"
        />
      </label>
      <span
        className={`modal__form-input-error ${
          errors.name ? "modal__form-input-error_visible" : ""
        }`}
      >
        {errors.name}
      </span>

      <div className="modal__avatar-section">
        <p className="modal__label">Choose an Avatar*</p>
        <div className="modal__avatar-options">
          {avatarOptions.map((avatar) => (
            <img
              key={avatar.value}
              src={avatar.src}
              alt="Avatar"
              className={`modal__avatar-option ${
                selectedAvatar === avatar.value
                  ? "modal__avatar-option_selected"
                  : ""
              }`}
              onClick={() => handleAvatarSelect(avatar)}
            />
          ))}
        </div>
      </div>
    </ModalWithForm>
  );
};

export default RegisterModal;
