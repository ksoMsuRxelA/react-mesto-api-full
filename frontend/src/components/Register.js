import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FormValidator from '../utils/FormValidator';

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submitButtonTitleRef = useRef();
  
  
  const objSelectors = {
    formSelector: '.popup__edit-form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__save-button',
    inactiveButtonClass: 'popup__save-button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error-element_visible'
  };

  const registrationForm = useRef(null);
  
  useEffect(() => {
    const registrationFormValidate = new FormValidator(objSelectors, registrationForm.current);
    registrationFormValidate.enableValidation();
  }, []);
  
  function handleChangeEmail(evt) {
    setEmail(evt.target.value);
  }

  function handleChangePassword(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(email, password, submitButtonTitleRef);
    setEmail('');
    setPassword('');
  }

  return (
    <section className="popup popup_type_register popup_opened">
      <div className="popup__container popup__container_theme_black">
        <form ref={registrationForm} className="popup__edit-form" name="registration" onSubmit={handleSubmit} noValidate>
          <h2 className="popup__title popup__title_theme_black">Регистрация</h2>
          <fieldset className="popup__info">
            <input id="email-input" type="email" value={email} onChange={handleChangeEmail} placeholder="Email" className="popup__input popup__input_theme_black popup__input-email" name="email" required />
            <span className="popup__error-element email-input-error"></span>
            <input id="password-input" type="password" value={password} onChange={handleChangePassword} placeholder="Пароль" className="popup__input popup__input_theme_black popup__input-password" name="password" required minLength="6" />
            <span className="popup__error-element password-input-error"></span>
            <button type="submit" aria-label="Кнопка регистрации" className="popup__save-button popup__save-button_theme_white popup__save-button_disabled" disabled><span ref={submitButtonTitleRef} className="popup__save-button-title">Зарегистрироваться</span></button>
          </fieldset>
          <p className="popup__cite">Уже зарегистрированы? <Link to="/sign-in" className="popup__sign-in-link">Войти</Link></p>
        </form>
      </div>
    </section>
  );
}

export default Register;