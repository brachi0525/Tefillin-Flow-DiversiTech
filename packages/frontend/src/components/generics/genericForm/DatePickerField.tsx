import React from 'react';

type DatePickerProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

const DatePickerField: React.FC<DatePickerProps> = ({ label, name, value, onChange, error }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input id={name} name={name} type="date" value={value} onChange={onChange} />
    {error && <p>{error}</p>}
  </div>
);

export default DatePickerField;
