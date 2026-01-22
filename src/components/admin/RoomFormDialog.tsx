import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Room } from '@/types';

interface RoomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room | null;
  onSubmit: (roomData: Partial<Room>) => Promise<void>;
}

export function RoomFormDialog({ open, onOpenChange, room, onSubmit }: RoomFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 1,
    pricePerHour: 0,
    imageUrl: '',
    equipments: [] as string[],
  });
  const [newEquipment, setNewEquipment] = useState('');

  useEffect(() => {
    if (open) {
      if (room) {
        setFormData({
          name: room.name || '',
          description: room.description || '',
          capacity: room.capacity || 1,
          pricePerHour: room.pricePerHour || 0,
          imageUrl: room.imageUrl || '',
          equipments: room.equipments || [],
        });
      } else {
        setFormData({
          name: '',
          description: '',
          capacity: 1,
          pricePerHour: 0,
          imageUrl: '',
          equipments: [],
        });
      }
    }
  }, [open, room]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData({
        ...formData,
        equipments: [...formData.equipments, newEquipment.trim()],
      });
      setNewEquipment('');
    }
  };

  const removeEquipment = (index: number) => {
    setFormData({
      ...formData,
      equipments: formData.equipments.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{room ? 'Modifier la salle' : 'Créer une nouvelle salle'}</DialogTitle>
          <DialogDescription>
            {room
              ? 'Modifiez les informations de la salle'
              : 'Remplissez les informations pour créer une nouvelle salle'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Nom de la salle <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ex: Salle Panorama"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez la salle..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Capacité <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })
                }
                required
                placeholder="Ex: 20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Prix par heure (€) <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                min={0}
                value={formData.pricePerHour}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) || 0 })
                }
                required
                placeholder="Ex: 50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL de l'image</label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.imageUrl && (
            <div className="relative h-48 w-full overflow-hidden rounded-md border">
              <img
                src={formData.imageUrl}
                alt="Aperçu"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-room.jpg';
                }}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Équipements</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addEquipment();
                  }
                }}
                placeholder="Ajouter un équipement"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button type="button" onClick={addEquipment} size="icon">
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              </Button>
            </div>

            {formData.equipments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.equipments.map((equipment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
                  >
                    <span>{equipment}</span>
                    <button
                      type="button"
                      onClick={() => removeEquipment(index)}
                      className="hover:text-destructive"
                    >
                      <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'En cours...' : room ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
