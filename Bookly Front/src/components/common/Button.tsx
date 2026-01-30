import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const shadcnVariant =
    variant === 'danger' ? 'destructive' : variant === 'secondary' ? 'secondary' : 'default';

  return (
    <ShadcnButton
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      variant={shadcnVariant}
      className={cn(fullWidth && 'w-full')}
    >
      {loading ? (
        <>
          <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </ShadcnButton>
  );
}
