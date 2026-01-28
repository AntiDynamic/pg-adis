import React from 'react';
import { ButtonProps } from '../../types';

/**
 * Primary Button Component
 * Usage: CTAs, form submissions, primary actions
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  onClick,
  disabled = false,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl btn-transition focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants: Record<string, string> = {
    primary: 'bg-trust-500 text-white hover:bg-trust-600 shadow-md hover:shadow-lg hover:shadow-trust-500/20',
    secondary: 'bg-surface text-gray-100 hover:bg-surface-hover border border-gray-700',
    outline: 'border-2 border-trust-500 text-trust-500 hover:bg-trust-500/10',
    ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
