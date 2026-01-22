import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faDoorOpen,
  faCalendarDays,
  faShieldHalved,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-96 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <FontAwesomeIcon icon={faShieldHalved} className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-3">Accès refusé</h2>
          <p className="text-muted-foreground mb-8">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page. Seuls les
            administrateurs peuvent accéder au dashboard.
          </p>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard Administrateur</h1>
        <p className="text-muted-foreground">Gérez vos salles et réservations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/statistics">
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer h-full">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">
                Statistiques
              </CardTitle>
              <CardDescription>Vue d'ensemble et indicateurs de performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-primary font-medium">
                Voir les stats
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/rooms">
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer h-full">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <FontAwesomeIcon icon={faDoorOpen} className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">
                Gestion des salles
              </CardTitle>
              <CardDescription>Créer, modifier et supprimer des salles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-primary font-medium">
                Gérer les salles
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/bookings">
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer h-full">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <FontAwesomeIcon icon={faCalendarDays} className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">
                Réservations
              </CardTitle>
              <CardDescription>Voir et gérer toutes les réservations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-primary font-medium">
                Gérer les réservations
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
