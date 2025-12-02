import React from "react";
import clsx from "clsx";

type CardProps = {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger' | 'ghost';
  className?: string;
};

const Card = ({ title, children, variant = 'default', className = '' }: CardProps) => {
  const variantClass = {
    default: 'bg-white text-gray-800 border border-gray-200',
    danger: 'bg-red-50 text-red-800 border border-red-300',
    ghost: 'bg-transparent text-gray-600 border border-dashed border-gray-300',
  }[variant];

  return (
    <div
      role="region"
      aria-label={title}
      className={clsx('rounded-xl p-4 shadow-sm', variantClass, className)}
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Card;
