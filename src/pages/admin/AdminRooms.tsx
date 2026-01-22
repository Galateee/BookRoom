import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPlus,
  faPencil,
  faTrash,
  faUsers,
  faEuroSign,
  faSpinner,
  faExclamationTriangle,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminRooms } from '@/hooks/useAdminRooms';
import { RoomFormDialog } from '@/components/admin/RoomFormDialog';
import type { Room } from '@/types';

export default function AdminRooms() {
  const { rooms, loading, error, refetch, createRoom, updateRoom, deleteRoom, toggleRoomStatus } =
    useAdminRooms();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [roomToToggle, setRoomToToggle] = useState<Room | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleCreateRoom = async (roomData: Partial<Room>) => {
    try {
      await createRoom(roomData);
      setActionMessage({ type: 'success', text: 'Salle créée avec succès' });
      setTimeout(() => setActionMessage(null), 10000);
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erreur lors de la création',
      });
      setTimeout(() => setActionMessage(null), 10000);
      throw err;
    }
  };

  const handleUpdateRoom = async (roomData: Partial<Room>) => {
    if (selectedRoom) {
      try {
        await updateRoom(selectedRoom.id, roomData);
        setSelectedRoom(null);
        setActionMessage({ type: 'success', text: 'Salle modifiée avec succès' });
        setTimeout(() => setActionMessage(null), 10000);
      } catch (err) {
        setActionMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Erreur lors de la modification',
        });
        setTimeout(() => setActionMessage(null), 10000);
        throw err;
      }
    }
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleToggleClick = (room: Room) => {
    setRoomToToggle(room);
    setToggleDialogOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (roomToToggle) {
      setToggling(true);
      try {
        await toggleRoomStatus(roomToToggle.id);
        setToggleDialogOpen(false);
        setRoomToToggle(null);
        setActionMessage({
          type: 'success',
          text: roomToToggle.isActive
            ? "Salle désactivée. Elle n'est plus visible par les utilisateurs."
            : 'Salle activée. Elle est maintenant visible par les utilisateurs.',
        });
        setTimeout(() => setActionMessage(null), 10000);
      } catch (err) {
        setToggleDialogOpen(false);
        setRoomToToggle(null);
        setActionMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Erreur lors du changement de statut',
        });
        setTimeout(() => setActionMessage(null), 10000);
      } finally {
        setToggling(false);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (roomToDelete) {
      setDeleting(true);
      try {
        await deleteRoom(roomToDelete.id);
        setDeleteDialogOpen(false);
        setRoomToDelete(null);
        setActionMessage({
          type: 'success',
          text: 'Salle supprimée définitivement',
        });
        setTimeout(() => setActionMessage(null), 10000);
      } catch (err) {
        setDeleteDialogOpen(false);
        setRoomToDelete(null);
        setActionMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Erreur lors de la suppression',
        });
        setTimeout(() => setActionMessage(null), 10000);
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-32 mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
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
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
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
          <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button onClick={refetch}>
            <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Message de succès/erreur */}
      {actionMessage && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border max-h-32 overflow-y-auto ${
            actionMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={actionMessage.type === 'success' ? faPlus : faExclamationTriangle}
              className="h-5 w-5 mt-0.5"
            />
            <p className="flex-1 text-sm font-medium">{actionMessage.text}</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <Link to="/admin">
          <Button variant="ghost" className="gap-2 mb-4">
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Retour au dashboard
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Gestion des salles</h1>
            <p className="text-muted-foreground">{rooms.length} salles au total</p>
          </div>
          <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Nouvelle salle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className={`overflow-hidden ${!room.isActive ? 'border-2 border-dashed border-destructive/50 bg-muted/30' : ''}`}
          >
            <div className="relative h-48">
              <img
                src={room.imageUrl}
                alt={room.name}
                className={`w-full h-full object-cover ${!room.isActive ? 'grayscale opacity-50' : ''}`}
              />
              {/* Badge Actif/Désactivé */}
              <div className="absolute top-2 right-2">
                <Badge variant={room.isActive ? 'default' : 'destructive'} className="shadow-md">
                  {room.isActive ? 'Actif' : 'Désactivé'}
                </Badge>
              </div>
              {/* Overlay pour salles désactivées */}
              {!room.isActive && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-white text-center px-4">
                    <p className="text-lg font-semibold mb-1">Salle désactivée</p>
                    <p className="text-sm opacity-90">Non visible par les utilisateurs</p>
                  </div>
                </div>
              )}
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>{room.name}</span>
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
                  <span>{room.capacity} pers.</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4" />
                  <span>{room.pricePerHour}€/h</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-2">
                {room.equipments.slice(0, 3).map((equipment, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
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

            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  setSelectedRoom(room);
                  setIsFormOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant={room.isActive ? 'secondary' : 'default'}
                className={`flex-1 gap-2`}
                onClick={() => handleToggleClick(room)}
              >
                <FontAwesomeIcon
                  icon={room.isActive ? faSpinner : faCircleCheck}
                  className="h-4 w-4"
                />
                {room.isActive ? 'Désactiver' : 'Activer'}
              </Button>
              {!room.isActive && (
                <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(room)}>
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Formulaire de création/modification */}
      <RoomFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedRoom(null);
        }}
        room={selectedRoom}
        onSubmit={selectedRoom ? handleUpdateRoom : handleCreateRoom}
      />

      {/* Dialog de confirmation de désactivation/activation */}
      <Dialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirmer {roomToToggle?.isActive ? 'la désactivation' : "l'activation"}
            </DialogTitle>
            <DialogDescription>
              {roomToToggle?.isActive ? (
                <>
                  Êtes-vous sûr de vouloir désactiver la salle "{roomToToggle?.name}" ?
                  <br />
                  <br />
                  La salle ne sera plus visible par les utilisateurs mais les réservations
                  existantes seront maintenues.
                </>
              ) : (
                <>
                  Êtes-vous sûr de vouloir activer la salle "{roomToToggle?.name}" ?
                  <br />
                  <br />
                  La salle sera visible par les utilisateurs et pourra être réservée.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant={roomToToggle?.isActive ? 'secondary' : 'default'}
              onClick={handleConfirmToggle}
              disabled={toggling}
            >
              {toggling ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                  {roomToToggle?.isActive ? 'Désactivation...' : 'Activation...'}
                </>
              ) : roomToToggle?.isActive ? (
                'Désactiver'
              ) : (
                'Activer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression définitive</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement la salle "{roomToDelete?.name}" ?
              <br />
              <br />
              <strong className="text-destructive">
                Cette action est irréversible et ne peut être effectuée que si aucune réservation
                n'existe pour cette salle.
              </strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer définitivement'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
