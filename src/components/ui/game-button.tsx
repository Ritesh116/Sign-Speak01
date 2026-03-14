
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:translate-y-[2px]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-game hover:bg-primary/90 border-b-4 border-black/20',
        secondary: 'bg-secondary text-secondary-foreground shadow-game hover:bg-secondary/90 border-b-4 border-black/20',
        success: 'bg-success text-success-foreground shadow-game hover:bg-success/90 border-b-4 border-black/20',
        outline: 'border-2 border-border bg-transparent hover:bg-muted text-foreground',
        ghost: 'hover:bg-muted text-foreground',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        default: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export const GameButton = ({ className, variant, size, children, ...props }: any) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
};
