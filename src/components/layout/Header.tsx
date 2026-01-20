import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import './Header.css';

export function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="header">
      <div className="header__container">
        <Link to={isSignedIn ? '/rooms' : '/'} className="header__logo">
          📚 BookRoom
        </Link>
        <nav className="header__nav">
          {isSignedIn ? (
            <>
              <Link to="/rooms" className="header__link">
                Nos salles
              </Link>
              <Link to="/my-bookings" className="header__link">
                Mes réservations
              </Link>
              <div className="header__user">
                <span className="header__username">
                  {user?.emailAddresses[0]?.emailAddress || 'Utilisateur'}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="header__link">
                Connexion
              </Link>
              <Link to="/sign-up" className="header__link header__link--primary">
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
