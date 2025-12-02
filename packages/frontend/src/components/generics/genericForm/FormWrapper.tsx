import React, { useState } from 'react';

type FormFieldConfig = {
    initialValue: any;
    validators?: ((value: any) => string | null)[];
};

type FormConfig = {
    [key: string]: FormFieldConfig;
};

type FormWrapperProps = {
    config: FormConfig;
    onSubmit: (values: { [key: string]: any }) => void;
    children: (args: {
        values: { [key: string]: any };
        errors: { [key: string]: string | null };
        handleChange: (e: React.ChangeEvent<any>) => void;
    }) => React.ReactNode;
};

const FormWrapper: React.FC<FormWrapperProps> = ({ config, onSubmit, children }) => {
    const initialValues = Object.fromEntries(
        Object.entries(config).map(([key, val]) => [key, val.initialValue])
    );
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, type, value, checked } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string | null } = {};
        for (const key in config) {
            const val = values[key];
            const validators = config[key].validators || [];
            for (const validate of validators) {
                const error = validate(val);
                if (error) {
                    newErrors[key] = error;
                    break;
                }
            }
        }
        setErrors(newErrors);
        if (Object.values(newErrors).every((err) => !err)) {
            onSubmit(values);
        }
    };

    return <form onSubmit={handleSubmit}>{children({ values, errors, handleChange })}</form>;
};

export default FormWrapper;
