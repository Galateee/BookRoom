import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import './NotFound.css';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__title">404</h1>
        <h2 className="not-found__subtitle">Page introuvable</h2>
        <p className="not-found__message">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="not-found__actions">
          <Button onClick={() => navigate('/')} variant="primary">
            Retour à l'accueil
          </Button>
          <Button onClick={() => navigate(-1)} variant="secondary">
            Page précédente
          </Button>
        </div>
      </div>
    </div>
  );
}
