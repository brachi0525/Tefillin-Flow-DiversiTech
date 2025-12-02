import React from 'react';

type SelectProps = {
    label: string;
    name: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
};

const SelectField: React.FC<SelectProps> = ({ label, name, value, options, onChange, error }) => (
    <div>
        <label htmlFor={name}>{label}</label>
        <select id={name} name={name} value={value} onChange={onChange}>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        {error && <p>{error}</p>}
    </div>
);

export default SelectField;

