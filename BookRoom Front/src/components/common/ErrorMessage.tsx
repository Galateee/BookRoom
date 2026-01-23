import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorMessage({
  title = 'Une erreur est survenue',
  message,
  onRetry,
  showRetry = true,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {showRetry && onRetry && (
        <Button onClick={onRetry} className="gap-2">
          <FontAwesomeIcon icon={faRotateRight} className="h-4 w-4" />
          Réessayer
        </Button>
      )}
    </div>
  );
}
