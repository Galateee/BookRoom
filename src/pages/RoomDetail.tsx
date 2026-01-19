import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { BookingForm } from '../components/booking/BookingForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/common/Button';
import './RoomDetail.css';

export function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: room, loading, error, refetch } = useRoom(id);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (loading) {
    return <LoadingSpinner message="Chargement des informations..." />;
  }

  if (error) {
    if (error.code === 'ROOM_NOT_FOUND') {
      return (
        <ErrorMessage
          title="Salle introuvable"
          message="Cette salle n'existe pas ou n'est plus disponible"
          onRetry={() => navigate('/rooms')}
          showRetry={true}
        />
      );
    }

    return (
      <ErrorMessage
        title="Impossible de charger les détails de la salle"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  if (!room) {
    return null;
  }

  const handleBookingSuccess = () => {
    setShowSuccessModal(true);
  };

  return (
    <div className="room-detail">
      {showSuccessModal && (
        <div className="room-detail__modal-overlay">
          <div className="room-detail__modal">
            <div className="room-detail__modal-icon">✓</div>
            <h2 className="room-detail__modal-title">Réservation confirmée !</h2>
            <p className="room-detail__modal-message">
              Votre réservation pour <strong>{room.name}</strong> a été confirmée. Un email de
              confirmation vous a été envoyé.
            </p>
            <div className="room-detail__modal-actions">
              <Button onClick={() => navigate('/my-bookings')}>Voir mes réservations</Button>
              <Button variant="secondary" onClick={() => navigate('/rooms')}>
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      )}

      <button className="room-detail__back" onClick={() => navigate('/rooms')}>
        ← Retour à la liste
      </button>

      <div className="room-detail__content">
        <div className="room-detail__info">
          <div className="room-detail__image-container">
            <img
              src={room.imageUrl || '/placeholder-room.jpg'}
              alt={room.name}
              className="room-detail__image"
            />
          </div>

          <h1 className="room-detail__title">{room.name}</h1>

          {room.description && <p className="room-detail__description">{room.description}</p>}

          <div className="room-detail__specs">
            <div className="room-detail__spec">
              <span className="room-detail__spec-label">Capacité</span>
              <span className="room-detail__spec-value">👥 {room.capacity} personnes</span>
            </div>
            <div className="room-detail__spec">
              <span className="room-detail__spec-label">Prix</span>
              <span className="room-detail__spec-value">💰 {room.pricePerHour}€/heure</span>
            </div>
          </div>

          <div className="room-detail__equipments">
            <h3 className="room-detail__subtitle">Équipements</h3>
            <div className="room-detail__equipment-list">
              {room.equipments.map((equipment) => (
                <span key={equipment} className="room-detail__equipment">
                  ✓ {equipment}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="room-detail__booking">
          <BookingForm room={room} onSuccess={handleBookingSuccess} />
        </div>
      </div>
    </div>
  );
}
