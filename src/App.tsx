import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import { RoomList } from './pages/RoomList';
import { RoomDetail } from './pages/RoomDetail';
import { MyBookings } from './pages/MyBookings';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';
import BookingSuccess from './pages/BookingSuccess';
import BookingCancelled from './pages/BookingCancelled';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Skeleton } from './components/ui/skeleton';

// Lazy loading des pages admin
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminStatistics = lazy(() => import('./pages/admin/AdminStatistics'));
const AdminRooms = lazy(() => import('./pages/admin/AdminRooms'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));

// Composant de chargement pour les pages lazy
function AdminPageLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages d'authentification */}
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/sign-up/*" element={<SignUp />} />

        {/* Pages avec layout */}
        <Route path="/" element={<Layout />}>
          {/* Page d'accueil publique - Liste des salles */}
          <Route index element={<RoomList />} />
          <Route path="rooms" element={<RoomList />} />

          {/* Détail salle - public mais réservation protégée */}
          <Route path="rooms/:id" element={<RoomDetail />} />

          {/* Pages de paiement */}
          <Route
            path="booking-success"
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="booking-cancelled" element={<BookingCancelled />} />

          {/* Pages protégées */}
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminPageLoading />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/statistics"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminPageLoading />}>
                  <AdminStatistics />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/rooms"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminPageLoading />}>
                  <AdminRooms />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/bookings"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminPageLoading />}>
                  <AdminBookings />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Route 404 - doit être la dernière */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
