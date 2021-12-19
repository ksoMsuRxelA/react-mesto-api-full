import { useRef, useEffect } from 'react';
import FormValidator from '../utils/FormValidator';

const PopupWithForm = ({name, isOpen, title, children, ariaLabel, buttonTitle, onClose, onSubmit, submitButtonRef, handleInputsReset}) => {
  const className = `popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`;
  const objSelectors = {
    formSelector: '.popup__edit-form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__save-button',
    inactiveButtonClass: 'popup__save-button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error-element_visible'
  };

  const currentValidatingForm = useRef(null);

  useEffect(() => { //полностью согласен с Вами Геннадий, исправляюсь
    const formValidate = new FormValidator(objSelectors, currentValidatingForm.current);
    formValidate.enableValidation();
  }, []);


  function clearFormFromErrors() { //реализовал данный метод ввиду того что не могу воспользоваться публичным методом - clearFormFromErrorMessages, так как объект соответствующего класса находится в другм лексичесокм окружении (области видимости), а именно в колбэке useEffect. 
    submitButtonRef.current.classList.add(objSelectors['inactiveButtonClass']);
    submitButtonRef.current.setAttribute('disable', true);
    Array.from(currentValidatingForm.current.querySelectorAll(objSelectors['inputSelector']))
      .forEach((inputElement) => {
        const errorElement = currentValidatingForm.current.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.remove(objSelectors['inputErrorClass']);
        errorElement.textContent = '';
        errorElement.classList.remove(objSelectors['errorClass']);
      })
  }

  function handleClosePopup() {
    onClose();
    clearFormFromErrors();
    handleInputsReset();
    if(name === 'delete') {
      submitButtonRef.current.removeAttribute('disabled');
      submitButtonRef.current.classList.remove('popup__save-button_disabled');
    }
  }

  return (
    <section className={className}>
      <div className={`popup__container popup__container_type_${name}`}>
        <form ref={currentValidatingForm} className={`popup__edit-form popup__edit-form_type_${name}`} name={name} onSubmit={onSubmit}>
          <h2 className="popup__title">{title}</h2>
          <fieldset className="popup__info">
            {children}
            <button ref={submitButtonRef} type="sumbit" aria-label={ariaLabel} className={`popup__save-button ${name === 'delete' ? 'popup__save-button_type_delete' : 'popup__save-button_disabled'}`} disabled={name !== 'delete'}>{buttonTitle}</button>
          </fieldset>
        </form>
        <button type="button" aria-label="Закрыть всплывающее окно" className="popup__close-button" onClick={handleClosePopup} />
      </div>
    </section>
  );
};

export default PopupWithForm;