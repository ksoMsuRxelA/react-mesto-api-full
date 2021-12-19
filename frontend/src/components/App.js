import { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Header from './Header';
import Register from './Register';
import Login from './Login';
import InfoToolTip from './InfoToolTip';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import CardDelete from './CardDelete';
import { api } from '../utils/Api';
import * as Auth from '../utils/Auth';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cardForDelete, setCardForDelete] = useState({});
  const [currentUser, setCurrentUser] = useState({name: '', about: '', avatar: '', _id: ''});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [failurePopup, setFailurePopup] = useState(false);
  const [userData, setUserData] = useState({});

  const history = useHistory();

  const checkTokenAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userDataRes, initCards]) => {
          setCurrentUser(userDataRes.data);
          setUserData({email: userDataRes.data.email});
          setCards(initCards.data);
          setLoggedIn(true);
          history.push('/');
        })
        .catch((err) => {
          console.log('checkTokenAuth catch: ', err);
          if(err.status === 401) {
            console.log('Время доступа к сервису пришло к концу. Пройдите повторную авторизацию.');
          }
          history.push('/signin');
        })
    } else {
      history.push('/signin');
    }
  }

  useEffect(() => {
    checkTokenAuth();
  }, []);

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setSelectedCard({});
    setSuccessPopup(false);
    setFailurePopup(false);
  }

   const openEditAvatarPopup = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  const openEditProfilePopup = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  const openAddPlacePopup = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  const openCardDeletePopup = () => {
    setIsDeleteCardPopupOpen(!isDeleteCardPopupOpen);
  }

  function submitButtonDisabling(submitButtonRef) {
    submitButtonRef.current.setAttribute('disabled', true);
    submitButtonRef.current.classList.add('popup__save-button_disabled');
  }

  const handleUpdateUser = (newUserInfo, onClose, submitButtonRef) => { //здесь и далее, я получаю методы изнутри компонента, вроде как это не запрещено чек-листом.
    submitButtonRef.current.textContent = "Сохранить..."; //здесь и далее, я использую рефы, которые получаю как аргумент, чтобы создать UX-эффект при загрузке.
    api.patchUserInfo(newUserInfo)
      .then((resUserInfo) => {
        setCurrentUser(resUserInfo.data);
        submitButtonDisabling(submitButtonRef);
        onClose();
      })
      .catch((err) => {
        console.log(`Ошибка при попытке изменить данные пользователя: ${err}.`);
      })
      .finally(() => {
        submitButtonRef.current.textContent = "Сохранить";
      });
  }

  const handleUpdateAvatar = (newAvatarUrlObject, onClose, submitButtonRef, inputReset) => {
    submitButtonRef.current.textContent = "Сохранить...";
    api.patchAvatar(newAvatarUrlObject)
      .then((resAvatarUrl) => {
        setCurrentUser(resAvatarUrl.data);
        onClose();
        inputReset();
      })
      .catch((err) => {
        console.log(`Ошибка при попытке изменить аватар пользователя: ${err}.`);
      })
      .finally(() => {
        submitButtonRef.current.textContent = "Сохранить";
        submitButtonDisabling(submitButtonRef);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => {
      return like === currentUser._id;
    });
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) => {
          return cards.map((tmpCard) => {
            return tmpCard._id === card._id ? newCard.data : tmpCard;
          });
        });
      })
      .catch((err) => {
        console.log(`Ошибка при попытке удалении/установки лайка:`, err);
      }); //здесь не нужен finally, все по той же причине что и выше. 
  }

  function handleCardDelete(card, onClose, submitButtonRef) { //тут "тупанул", полностью согласен с замечанием, благодарю!
    submitButtonRef.current.textContent = "Да...";
    api.deleteOwnerCard(card._id)
      .then(() => {
        setCards(cards.filter((tmpCard) => {
          return tmpCard._id !== card._id; 
        }));
        onClose();
      })
      .catch((err) => {
        console.log(`Ошибка при попытке удаления карточки: ${err}.`);
      })
      .finally(() => {
        submitButtonRef.current.textContent = "Да";
        submitButtonRef.current.removeAttribute('disabled'); //просто в моей логике кнопки формы по умолчанию неактивны, а кнопка удаления карточки должна быть активной. Этому и служат эти две строчки.
        submitButtonRef.current.classList.remove('popup__save-button_disabled');
      });
  }

  const handleAddCard = (newCard, onClose, handleInputsReset, submitButtonRef) => {
    submitButtonRef.current.textContent = "Сохранить...";
    api.postNewCard(newCard)
      .then((resNewCard) => {
        setCards([resNewCard.data, ...cards]);
        onClose();
        handleInputsReset();
      })
      .catch((err) => {
        console.log(`Ошибка при попытке добавить новую карточку в начало списка: ${err}.`);
      })
      .finally(() => {
        submitButtonRef.current.textContent = "Сохранить";
        submitButtonDisabling(submitButtonRef);
      });
  }

  const handleRegister = (email, password, submitButtonTitleRef) => {
    submitButtonTitleRef.current.textContent = "Зарегистрироваться...";
    Auth.register(email, password)
      .then((res) => {
        if(res) { 
          setSuccessPopup(true);
        } else {
          setFailurePopup(true);
        }
      })
      .catch((err) => {
        if(err.status === 400) {
          console.log('400 - Некорректно заполнено одно из полей...');
        } else if(err.status === 409) {
          console.log('409 - Такой пользователь уже существует.');
        }
        setFailurePopup(true);
      })
      .finally(() => {
        submitButtonTitleRef.current.textContent = "Зарегистрироваться";
      });
  }

  const handleLogin = (email, password, submitButtonRef) => { //здесь все исправил...спасибо за замечания. 
    submitButtonRef.current.firstElementChild.textContent = "Войти...";
    Auth.authorize(email, password)
      .then((data) => {
        localStorage.setItem('token', data.token);
        checkTokenAuth();
        window.location.reload();
        submitButtonRef.current.firstElementChild.textContent = "Войти";
      })
      .catch((err) => {
        if(err.status === 400) {
          console.log("400 - Не передано одно из полей...");
        } else if(err.status === 401) {
          console.log(`401 - Неверные логин/пароль. Попробуйте еще раз.`);
        }
        setFailurePopup(true);
      });
  }

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUserData({});
    setLoggedIn(false);
    setFailurePopup(false);
    history.push('/signin');
  }

  return (
    <div className="wrapper">
      <Switch>
        <Route path="/signup">
          <div className="page page_type_register">
            <Header linkTitle={"Войти"} userData={{}} onSignOut={() => {}} />
            <Register onRegister={handleRegister} />
            <InfoToolTip isRegister={true} tipType={"success"} isOpen={successPopup} onClose={closeAllPopups} />
            <InfoToolTip isRegister={true} tipType={"failure"} isOpen={failurePopup} onClose={closeAllPopups} />
          </div>
        </Route>

        <Route path="/signin">
          <div className="page page_type_login">
            <Header linkTitle={"Регистрация"} userData={{}} onSignOut={() => {}} />
            <Login onLogin={handleLogin} />
            <InfoToolTip isRegister={false} tipType={"failure"} isOpen={failurePopup} onClose={closeAllPopups} />
          </div>
        </Route>

        <ProtectedRoute
          path="/"
          loggedIn={loggedIn}
        >
          <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
              <Header linkTitle={""} userData={userData} onSignOut={handleSignOut} />
              <Main 
                onEditAvatar={openEditAvatarPopup} 
                onEditProfile={openEditProfilePopup}
                onAddPlace={openAddPlacePopup}
                onDeleteCard={openCardDeletePopup}
                handleCardClick={setSelectedCard}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelButtonClick={setCardForDelete}
              />

              <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

              <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

              <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddCard} />

              <CardDelete isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} onCardDelete={handleCardDelete} card={cardForDelete} />

              <ImagePopup 
                onClose={closeAllPopups}
                card={selectedCard}
              />
            </div>
          </CurrentUserContext.Provider>
        </ProtectedRoute>
      </Switch>
      <Footer filler="&copy; 2021 Mesto Russia" />
    </div>
  );
}

export default App;

