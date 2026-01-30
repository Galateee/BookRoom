import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-semibold mb-4">Page introuvable</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Button onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faHome} className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
            Page précédente
          </Button>
        </div>
      </div>
    </div>
  );
}
