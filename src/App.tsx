import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { RoomList } from './pages/RoomList';
import { RoomDetail } from './pages/RoomDetail';
import { MyBookings } from './pages/MyBookings';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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
                <AdminDashboard />
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
