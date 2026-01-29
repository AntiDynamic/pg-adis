import React from 'react';

interface InputProps {
<<<<<<< HEAD
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time';
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
=======
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
>>>>>>> d9bc5d3c1a2923fd1ec3b256229a32f9b8be8f9d
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  label?: string;
  className?: string;
<<<<<<< HEAD
  maxLength?: number;
=======
>>>>>>> d9bc5d3c1a2923fd1ec3b256229a32f9b8be8f9d
}

/**
 * Input Component
 * Usage: Forms, search bars, filters
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  icon,
  error,
  label,
  className = '',
<<<<<<< HEAD
  maxLength,
  min: _min,
=======
>>>>>>> d9bc5d3c1a2923fd1ec3b256229a32f9b8be8f9d
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
<<<<<<< HEAD
          maxLength={maxLength}
=======
>>>>>>> d9bc5d3c1a2923fd1ec3b256229a32f9b8be8f9d
          className={`
            w-full bg-surface border border-gray-700 rounded-xl
            px-4 py-3 text-gray-100 placeholder-gray-500
            focus-ring transition-all
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500' : ''}
          `}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
