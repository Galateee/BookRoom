import { Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Header } from './Header';
import { Footer } from './Footer';
import './Layout.css';

export function Layout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
