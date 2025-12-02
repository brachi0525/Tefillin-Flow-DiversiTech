import Button from '@mui/material/Button';
import React from 'react';

interface ButtonProps {
  label: any;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  children?: React.ReactNode;
  sx?: object;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean; 
}

const GenericButton = ({
  label,
  onClick,
  variant = 'contained',
  children,
  sx,
  size = 'small',
  disabled = false,
}: ButtonProps) => {
  return (
    <Button 
      variant={variant} 
      onClick={onClick} 
      startIcon={children} 
      sx={sx} 
      size={size}
      disabled={disabled}   // העברת הערך ל-Button
    >
      {label}
    </Button>
  );
};

export default GenericButton;