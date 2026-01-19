import { useRooms } from '../hooks/useRooms';
import { RoomCard } from '../components/booking/RoomCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import './RoomList.css';

export function RoomList() {
  const { data: rooms, loading, error, refetch } = useRooms();

  if (loading) {
    return <LoadingSpinner message="Chargement des salles disponibles..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Impossible de charger les salles"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="Aucune salle disponible"
        message="Aucune salle ne correspond à vos critères pour le moment."
        actionLabel="Réessayer"
        onAction={refetch}
      />
    );
  }

  return (
    <div className="room-list">
      <div className="room-list__header">
        <h1 className="room-list__title">Nos salles de réunion</h1>
        <p className="room-list__count">{rooms.length} salle(s) disponible(s)</p>
      </div>

      <div className="room-list__grid">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
