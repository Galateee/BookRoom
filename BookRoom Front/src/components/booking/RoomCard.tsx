import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEuroSign, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { Room } from '../../types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={room.imageUrl || '/placeholder-room.webp'}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-room.webp';
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur">
            <FontAwesomeIcon icon={faEuroSign} className="h-3 w-3 mr-1" />
            {room.pricePerHour}€/h
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-xl font-semibold tracking-tight">{room.name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
          <span>{room.capacity} personnes</span>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2">
          {room.equipments.slice(0, 3).map((equipment) => (
            <Badge key={equipment} variant="outline" className="text-xs">
              {equipment}
            </Badge>
          ))}
          {room.equipments.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{room.equipments.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/rooms/${room.id}`} className="w-full">
          <Button className="w-full group/btn">
            Voir les détails
            <FontAwesomeIcon
              icon={faArrowRight}
              className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1"
            />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
