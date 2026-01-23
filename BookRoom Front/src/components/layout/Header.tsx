import { Link } from 'react-router-dom';
import { UserButton, useUser, SignInButton } from '@clerk/clerk-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faCalendarCheck, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { isSignedIn, user } = useUser();
  const { isAdmin } = useIsAdmin();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <FontAwesomeIcon
              icon={faDoorOpen}
              className="h-6 w-6 text-primary transition-transform group-hover:scale-110"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              BookRoom
            </span>
          </Link>

          <nav className="flex items-center space-x-1">
            <Link to="/rooms">
              <Button variant="ghost" className="gap-2">
                <FontAwesomeIcon icon={faDoorOpen} className="h-4 w-4" />
                Nos salles
              </Button>
            </Link>

            {isSignedIn ? (
              <>
                <Link to="/my-bookings">
                  <Button variant="ghost" className="gap-2">
                    <FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4" />
                    Mes réservations
                  </Button>
                </Link>

                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" className="gap-2">
                      <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4" />
                      Admin
                      <Badge variant="secondary" className="ml-1">
                        Pro
                      </Badge>
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                  <span className="text-sm text-muted-foreground hidden md:inline">
                    {user?.emailAddresses[0]?.emailAddress}
                  </span>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'h-9 w-9',
                      },
                    }}
                  />
                </div>
              </>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl={window.location.pathname}>
                <Button variant="default" size="sm" className="ml-2">
                  Connexion
                </Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
