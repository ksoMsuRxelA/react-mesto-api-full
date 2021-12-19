import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Card = ({card, onCardClick, onCardLike, onDeleteCard, onCardDelButtonClick }) => {
  const currentUser =  useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const cardDeleteButtonClassName = (
    `element__delete-button ${isOwn ? 'element__delete-button_visible' : 'element__delete-button_hidden'}`
  );

  const isLiked = card.likes.some(like => like === currentUser._id);
  const cardLikeButtonClassName = (
    `element__like-button ${isLiked ? 'element__like-button_active ' : ''}`
  );

  const handleClick = () => {
    onCardClick(card);
  };

  const handleLikeClick = () => {
    onCardLike(card);
  }

  const handleDeleteClick = () => {
    onDeleteCard(); //открывает попап подтверждения
    onCardDelButtonClick(card); //передает внещней функции (в App) экземпляр карточки которую нужно удалить.
  }

  return (
    <div className="element">
      <img src={card.link} alt="some" className="element__image" onClick={handleClick} />
      <h2 className="element__title">{card.name}</h2>
      <div className="element__like-counter">{card.likes.length}</div>
      <button type="button" aria-label="Кнопка Нравится" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
      <button type="button" aria-label="Кнопка удаления карточки" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
    </div>
  );
}

export default Card;

//задать CSS селекторы element__delete-button_visible и element__delete-button_hidden