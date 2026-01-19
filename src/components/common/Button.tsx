import React from 'react';
import './Button.css';

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
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`button button--${variant} ${fullWidth ? 'button--full' : ''} ${loading ? 'button--loading' : ''}`}
    >
      {loading ? (
        <>
          <span className="button__spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
