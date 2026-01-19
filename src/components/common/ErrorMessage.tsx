import { Button } from './Button';
import './ErrorMessage.css';

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
    <div className="error-message">
      <div className="error-message__icon">⚠️</div>
      <h3 className="error-message__title">{title}</h3>
      <p className="error-message__text">{message}</p>
      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="primary">
          Réessayer
        </Button>
      )}
    </div>
  );
}
