import { Link } from 'react-router-dom';
import { UserButton, useUser, SignInButton } from '@clerk/clerk-react';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import './Header.css';

export function Header() {
  const { isSignedIn, user } = useUser();
  const { isAdmin } = useIsAdmin();

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          BookRoom
        </Link>
        <nav className="header__nav">
          <Link to="/rooms" className="header__link">
            Nos salles
          </Link>

          {isSignedIn ? (
            <>
              <Link to="/my-bookings" className="header__link">
                Mes réservations
              </Link>
              {isAdmin && (
                <Link to="/admin" className="header__link header__link--admin">
                  Admin
                </Link>
              )}
              <div className="header__user">
                <span className="header__username">
                  {user?.emailAddresses[0]?.emailAddress || 'Utilisateur'}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl={window.location.pathname}>
              <button className="header__link header__link--primary">Connexion</button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}
