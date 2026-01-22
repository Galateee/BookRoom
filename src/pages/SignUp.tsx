import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

export function SignUp() {
  return (
    <div className="auth-container">
      <ClerkSignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/rooms" />
    </div>
  );
}
