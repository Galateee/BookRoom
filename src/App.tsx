import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { RoomList } from './pages/RoomList';
import { RoomDetail } from './pages/RoomDetail';
import { MyBookings } from './pages/MyBookings';
import { LandingPage } from './pages/LandingPage';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil publique */}
        <Route path="/" element={<LandingPage />} />

        {/* Pages d'authentification */}
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/sign-up/*" element={<SignUp />} />

        {/* Pages protégées */}
        <Route path="/" element={<Layout />}>
          <Route
            path="rooms"
            element={
              <ProtectedRoute>
                <RoomList />
              </ProtectedRoute>
            }
          />
          <Route
            path="rooms/:id"
            element={
              <ProtectedRoute>
                <RoomDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
