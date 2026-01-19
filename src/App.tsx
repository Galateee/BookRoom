import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { RoomList } from './pages/RoomList';
import { RoomDetail } from './pages/RoomDetail';
import { MyBookings } from './pages/MyBookings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/rooms" replace />} />
          <Route path="rooms" element={<RoomList />} />
          <Route path="rooms/:id" element={<RoomDetail />} />
          <Route path="my-bookings" element={<MyBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
