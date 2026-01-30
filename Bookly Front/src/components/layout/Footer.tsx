export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-center">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            © {new Date().getFullYear()} Bookly - Application de réservation de salles
          </p>
        </div>
      </div>
    </footer>
  );
}
