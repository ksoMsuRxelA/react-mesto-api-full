import { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

const EditAvatarPopup = ({ isOpen, onClose, onUpdateAvatar }) => {
  const inputRef = useRef();
  const submitButtonRef = useRef();

  function inputReset() {
    inputRef.current.value = '';
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: inputRef.current.value,
    }, onClose, submitButtonRef, inputReset);
  }

  return (
    <PopupWithForm
      onClose={onClose} 
      isOpen={isOpen} 
      name="avatar" 
      title="Обновить аватар" 
      ariaLabel="Изменить аватар" 
      buttonTitle="Сохранить"
      onSubmit={handleSubmit}
      submitButtonRef={submitButtonRef}
      handleInputsReset={inputReset}
    >
      <input ref={inputRef} id="url-input-avatar" type="url" placeholder="Ссылка на картинку" className="popup__input popup__input_type_avatar popup__input-link" name="avatar" required />
      <span className="popup__error-element url-input-avatar-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;