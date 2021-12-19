import { useState, useRef, useEffect } from 'react';
import FormValidator from '../utils/FormValidator';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submitButtonRef = useRef();

  const objSelectors = {
    formSelector: '.popup__edit-form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__save-button',
    inactiveButtonClass: 'popup__save-button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error-element_visible'
  };

  const loginForm = useRef(null);

  useEffect(() => {
    const loginFormValidate = new FormValidator(objSelectors, loginForm.current);
    loginFormValidate.enableValidation();
  }, []);

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if(!email || !password) {
      return;
    }
    onLogin(email, password, submitButtonRef);
    setEmail('');
    setPassword('');
  }

  return (
    <section className="popup popup_type_login popup_opened">
      <div className="popup__container popup__container_theme_black">
        <form ref={loginForm} className="popup__edit-form" name="personal_info" onSubmit={handleSubmit} noValidate>
          <h2 className="popup__title popup__title_theme_black">Вход</h2>
          <fieldset className="popup__info">
            <input id="email-input" type="email" value={email} onChange={handleEmailChange} placeholder="Email" className="popup__input popup__input_theme_black popup__input-name" name="email" required />
            <span className="popup__error-element email-input-error"></span>
            <input id="password-input" type="password" value={password} onChange={handlePasswordChange} placeholder="Пароль" className="popup__input popup__input_theme_black popup__input-role" name="password" required minLength="6" />
            <span className="popup__error-element password-input-error"></span>
            <button ref={submitButtonRef} type="submit" aria-label="Кнопка Войти" className="popup__save-button popup__save-button_theme_white popup__save-button_disabled" disabled><span className="popup__save-button-title">Войти</span></button>
          </fieldset>
        </form>
      </div>
    </section>
  );
}

export default Login;