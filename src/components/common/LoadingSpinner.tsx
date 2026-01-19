import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Chargement...' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__circle"></div>
      <p className="loading-spinner__message">{message}</p>
    </div>
  );
}
