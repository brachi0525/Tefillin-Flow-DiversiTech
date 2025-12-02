import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  size = 'md',
  type = 'button', 
}: ButtonProps) => {
  const sizeClass = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  }[size];

  const className = clsx(
    'rounded transition',
    sizeClass,
    {
      'opacity-50 cursor-not-allowed': disabled,
      'bg-blue-500 text-white': variant === 'primary',
      'bg-gray-300 text-black': variant === 'secondary',
      'bg-red-500 text-white': variant === 'ghost',
    }
  );

  return (
    <button
      type={type} 
      className={className}
      onClick={() => !disabled && onClick?.()}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
export default Button;