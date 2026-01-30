import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

export function SignIn() {
  return (
    <div className="auth-container">
      <ClerkSignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/rooms" />
    </div>
  );
}
