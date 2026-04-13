import React from 'react';
import { cn } from './Card';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 dark:bg-blue-500 dark:hover:bg-blue-600",
      secondary: "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 dark:bg-orange-600 dark:hover:bg-orange-700",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-900/30",
      ghost: "text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base font-semibold",
      lg: "px-8 py-3.5 text-lg font-bold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        {...props}
        className={cn(
          "inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95",
          "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:transform-none",
          variants[variant],
          sizes[size],
          className
        )}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
