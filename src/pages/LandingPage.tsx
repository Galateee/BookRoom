import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import './Auth.css';

export function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="landing-page">
      <div>
        <h1>📚 BookRoom</h1>
        <p>Réservez votre salle de réunion en quelques clics</p>

        <div className="landing-actions">
          {isSignedIn ? (
            <Link to="/rooms" className="landing-btn landing-btn-primary">
              Voir les salles disponibles
            </Link>
          ) : (
            <>
              <Link to="/sign-in" className="landing-btn landing-btn-primary">
                Se connecter
              </Link>
              <Link to="/sign-up" className="landing-btn landing-btn-secondary">
                Créer un compte
              </Link>
            </>
          )}
        </div>

        <div className="landing-features">
          <div className="feature-card">
            <h3>🔍 Recherche facile</h3>
            <p>Trouvez la salle parfaite selon vos besoins</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Réservation instantanée</h3>
            <p>Réservez en quelques secondes</p>
          </div>
          <div className="feature-card">
            <h3>📱 Gestion simplifiée</h3>
            <p>Suivez toutes vos réservations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
