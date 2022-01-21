import { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

const CardDelete = ({isOpen, onClose, onCardDelete, card}) => {
  const submitButtonRef = useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    onCardDelete(card, onClose, submitButtonRef);
  }

  return (
    <PopupWithForm 
      onClose={onClose}
      isOpen={isOpen} 
      name="delete" 
      title="Вы уверены?" 
      ariaLabel="Удалить карточку с фотографией" 
      buttonTitle="Да" 
      submitButtonRef={submitButtonRef}
      onSubmit={handleSubmit}
      handleInputsReset={() => {}}
    />
  );
}

export default CardDelete;