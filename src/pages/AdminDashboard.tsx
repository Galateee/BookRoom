import { Link } from 'react-router';
import { useIsAdmin } from '../hooks/useIsAdmin';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__loading">Vérification des permissions...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__error">
          <h2>Accès refusé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <Link to="/" className="admin-dashboard__back-link">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>Dashboard Administrateur</h1>
      </div>

      <nav className="admin-dashboard__nav">
        <Link to="/admin/statistics" className="admin-nav-card">
          <div className="admin-nav-card__icon">📊</div>
          <div className="admin-nav-card__content">
            <h3>Statistiques</h3>
            <p>Vue d'ensemble et KPIs</p>
          </div>
        </Link>

        <Link to="/admin/rooms" className="admin-nav-card">
          <div className="admin-nav-card__icon">🏢</div>
          <div className="admin-nav-card__content">
            <h3>Gestion des salles</h3>
            <p>Créer, modifier et supprimer des salles</p>
          </div>
        </Link>

        <Link to="/admin/bookings" className="admin-nav-card">
          <div className="admin-nav-card__icon">📅</div>
          <div className="admin-nav-card__content">
            <h3>Réservations</h3>
            <p>Voir et gérer toutes les réservations</p>
          </div>
        </Link>
      </nav>
    </div>
  );
}
