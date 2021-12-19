class FormValidator {
  constructor(objSelectors, formElement) {
    this._objSelectors = objSelectors;
    this._formElement = formElement;
  }

  enableValidation = () => {
    this._setEventListeners();
  }

  _setEventListeners = () => {
    this._inputList = Array.from(this._formElement.querySelectorAll(this._objSelectors['inputSelector']));
    this._buttonElement = this._formElement.querySelector(this._objSelectors['submitButtonSelector']);
    // this._toggleButtonState(); //когда он тут был нужен, теперь же он бесполезен ну пусть посидит за компанию. за выслугу лет, так сказать.
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      })
    });
  }
  
  _checkInputValidity = (inputElement) => {
    if(!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _disableSubmitButton = () => {
    this._buttonElement.classList.add(this._objSelectors['inactiveButtonClass']);
    this._buttonElement.setAttribute('disabled', true);
  }

  _ableSubmitButton = () => {
    this._buttonElement.classList.remove(this._objSelectors['inactiveButtonClass']);
    this._buttonElement.removeAttribute('disabled', false);
  }

  _toggleButtonState = () => {
    if(this._hasInvalidInput()) {
      this._disableSubmitButton();
    } else {
      this._ableSubmitButton();
    }
  }

  _hasInvalidInput = () => {
    return this._inputList.some((input) => {
      return input.validity.valid === false;
    });
  }

  _showInputError = (inputElement, errorMessage) => {
    this._errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(this._objSelectors['inputErrorClass']);
    this._errorElement.textContent = errorMessage;
    this._errorElement.classList.add(this._objSelectors['errorClass']);
  }

  _hideInputError = (inputElement) => {
    this._errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(this._objSelectors['inputErrorClass']);
    this._errorElement.textContent = '';
    this._errorElement.classList.remove(this._objSelectors['errorClass']);
  }

  // clearFormFromErrorMessages = () => { //данный публичный метод необходим для очистки формы от элементов ошибок. Он вызывается каждый раз когда закрывается форма редактирования или добавления. Без нее, единожды появившиеся элементы ошибок остаются навсегда. 
  //   this._disableSubmitButton(); //спасибо что обнаружили этот БАГ, надеюсь такое исправление Вас удовлетворит :) Необязательные замечания я обязательно исправлю, так как эти замечания весьма конструктивны и за это Вам тоже большое спасибо! 
  //   this._inputList.forEach((inputElement) => {
  //     this._hideInputError(inputElement);
  //   });
  // }
}

export default FormValidator;