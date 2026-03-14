
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './game-button';

const cardVariants = cva(
  'rounded-3xl border-2 border-border bg-card shadow-card transition-all',
  {
    variants: {
      variant: {
        default: '',
        primary: 'bg-primary/5 border-primary/20',
        secondary: 'bg-secondary/5 border-secondary/20',
        success: 'bg-success/5 border-success/20',
        accent: 'bg-accent/5 border-accent/20',
        glass: 'bg-white/40 backdrop-blur-md border-white/20',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'accent' | 'glass';
  padding?: 'none' | 'sm' | 'default' | 'lg';
}

export const GameCard = ({ className, variant, padding, children, ...props }: any) => {
  return (
    <div
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    >
      {children}
    </div>
  );
};
