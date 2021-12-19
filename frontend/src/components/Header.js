import { Link } from 'react-router-dom';

const Header = ({ linkTitle, userData, onSignOut }) => {
  return (
    <header className="header page__header">
      <a href="#" className="header__logo" target="_self"></a>
      <p className="header__email">{userData.email}</p>
      {linkTitle ? <Link to={linkTitle === "Войти" ? '/signin' : '/signup'} className="header__link">{linkTitle}</Link> : <p className="header__link" onClick={onSignOut}>Выйти</p>}
    </header>
  );
}

export default Header;