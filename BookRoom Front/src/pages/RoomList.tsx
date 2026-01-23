import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useRooms } from '../hooks/useRooms';
import { RoomCard } from '../components/booking/RoomCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RoomList() {
  const { data: rooms, loading, error, refetch } = useRooms();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-14" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="h-16 w-16 text-destructive mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Impossible de charger les salles</h2>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button onClick={refetch}>
            <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <FontAwesomeIcon icon={faDoorOpen} className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Aucune salle disponible</h2>
          <p className="text-muted-foreground mb-6">
            Aucune salle ne correspond à vos critères pour le moment.
          </p>
          <Button onClick={refetch} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Nos salles de réunion</h1>
        <p className="text-muted-foreground">
          {rooms.length} salle{rooms.length > 1 ? 's' : ''} disponible{rooms.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
