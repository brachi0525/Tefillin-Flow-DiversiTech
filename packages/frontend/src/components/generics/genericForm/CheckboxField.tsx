import React from 'react';

type CheckboxProps = {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CheckboxField: React.FC<CheckboxProps> = ({ label, name, checked, onChange }) => (
  <div>
    <label>
      <input name={name} type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  </div>
);

export default CheckboxField;
