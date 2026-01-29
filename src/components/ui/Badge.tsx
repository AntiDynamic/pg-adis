import React from 'react';
import { BadgeProps } from '../../types';

/**
 * Badge Component
 * Usage: Verified indicators, status labels, categories
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  icon,
  className = '',
}) => {
  const baseStyles = 'badge-base font-medium';
  
  const variants: Record<string, string> = {
    verified: 'bg-trust-500/10 text-trust-400 border border-trust-500/20 verified-glow',
    premium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    new: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    default: 'bg-gray-800 text-gray-300 border border-gray-700',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
