import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
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
          <Link to="/my-bookings" className="header__link">
            Mes réservations
          </Link>
        </nav>
      </div>
    </header>
  );
}
