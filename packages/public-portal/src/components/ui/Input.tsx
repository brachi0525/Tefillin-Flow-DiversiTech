import React from "react";
import clsx from "clsx";

type InputProps = {
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  variant?: 'date' | 'search' | 'number'| 'text'|'email';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
    required?: boolean;
name?: string;
};

const Input = ({
  value,
  onChange,
  placeholder,
  variant = 'number',
  size = 'md',
  fullWidth = false,
  required=true,
  name='',
}: InputProps) => {
  const sizeClass = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-3',
    lg: 'text-lg py-3 px-4',
  }[size];

  const variantClass = {
    date: 'border border-blue-500 text-black',
    search: 'border border-red-500 text-red-700',
    number: 'border border-gray-300 text-gray-600',
    text:'border border-gray-300 text-gray-600',
    email:'border border-gray-300 text-gray-600'
  }[variant];

  return (
    <input
      className={clsx('rounded', sizeClass, variantClass, { 'w-full': fullWidth })}
      type={variant}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      name={name}
    />
  );
};
export default Input;
