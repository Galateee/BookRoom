import { Link } from 'react-router-dom';
import type { Room } from '../../types';
import { Button } from '../common/Button';
import './RoomCard.css';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="room-card">
      <div className="room-card__image-container">
        <img
          src={room.imageUrl || '/placeholder-room.jpg'}
          alt={room.name}
          className="room-card__image"
        />
      </div>
      <div className="room-card__content">
        <h3 className="room-card__title">{room.name}</h3>
        <div className="room-card__info">
          <span className="room-card__capacity">👥 {room.capacity} personnes</span>
          <span className="room-card__price">{room.pricePerHour}€/h</span>
        </div>
        <div className="room-card__equipments">
          {room.equipments.slice(0, 3).map((equipment) => (
            <span key={equipment} className="room-card__equipment">
              {equipment}
            </span>
          ))}
          {room.equipments.length > 3 && (
            <span className="room-card__equipment">+{room.equipments.length - 3}</span>
          )}
        </div>
        <Link to={`/rooms/${room.id}`}>
          <Button fullWidth>Voir les détails</Button>
        </Link>
      </div>
    </div>
  );
}
