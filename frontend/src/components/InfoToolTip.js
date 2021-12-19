import { Link } from 'react-router-dom';
import success from "../images/success.svg";
import fail from "../images/fail.svg";

const InfoToolTip = ({ isRegister, tipType, isOpen, onClose }) => {  
  const className = `popup popup_type_info-tool-tip ${isOpen ? 'popup_opened' : ''}`;

  return (
    <section className={className}>
      <div className="popup__container">
        <form className="popup__edit-form" name="personal_info" noValidate>
          <div className="popup__sign" style={{backgroundImage: `url(${tipType === 'success' ? success : fail})`}}></div>
          <h2 className="popup__title popup__title_type_info-tool-tip">{tipType === 'success' ? 'Вы успешно зарегистрировались!' : (<div>Что-то пошло не так!<div className="popup__new-line"></div>Попробуйте еще раз.</div>)}</h2>
          {isRegister ? <Link to={tipType === 'success' ? '/sign-in' : '/sign-up'} className="popup__close-button" onClick={onClose} /> : <Link to="/sign-in" className="popup__close-button" onClick={onClose} />}
        </form>
      </div>
    </section>
  );
}

export default InfoToolTip;