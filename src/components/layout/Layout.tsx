import { Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
