import React from 'react';

interface RadioProps {
  value: number;
  checked: boolean;
  onChange: (value: number) => void;
  label: string;
  name: string;
  required?: boolean;
}

export const Radio: React.FC<RadioProps> = ({ value, checked, onChange, label, name,required }) => {
  return (
    <label className="flex items-center gap-2 px-4 py-2  cursor-pointer ">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        required={required}
        onChange={() => onChange(value)}
        className="accent-blue-600"
      />
      {label}
    </label>
  );
};

