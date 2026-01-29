import React from 'react';
import { CardProps } from '../../types';

/**
 * Card Component
 * Usage: Content containers, listing items, information blocks
 */
export const Card: React.FC<CardProps> = ({
  elevated = false,
  hoverable = false,
  children,
  className = '',
}) => {
  const baseStyles = 'card-base p-6 transition-all duration-200';
  const elevatedStyles = elevated ? 'bg-surface-elevated' : '';
  const hoverStyles = hoverable ? 'hover:shadow-card-hover hover:border-gray-700 cursor-pointer hover:-translate-y-1' : '';

  return (
    <div className={`${baseStyles} ${elevatedStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
