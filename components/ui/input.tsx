'use client';

'use client';

import React, { forwardRef, memo, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:border-simon-red focus:ring-2 focus:ring-simon-red/20',
        simon: 'border-gray-700 bg-gray-900 text-white font-digital tracking-wider focus:border-simon-yellow focus:ring-2 focus:ring-simon-yellow/30',
        scoreboard: 'border-gray-800 bg-gray-950 text-simon-green font-digital text-center text-lg tracking-widest focus:border-simon-green focus:ring-1 focus:ring-simon-green/40',
      },
      size: {
        default: 'h-10',
        sm: 'h-8 text-xs',
        lg: 'h-12 text-base',
        xl: 'h-14 text-lg',
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        lg: 'rounded-lg',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    (
      {
        className,
        variant,
        size,
        rounded,
        label,
        error,
        helperText,
        leftIcon,
        rightIcon,
        containerClassName,
        type = 'text',
        id,
        disabled,
        ...props
      },
      ref
    ) => {
      const generatedId = React.useId();
      const inputId = id || generatedId;

      const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (type === 'number') {
          if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
          }
        }
      }, [type]);

      return (
        <div className={cn('w-full space-y-2', containerClassName)}>
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                error ? 'text-destructive' : 'text-foreground'
              )}
            >
              {label}
            </label>
          )}
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {leftIcon}
              </div>
            )}
            <input
              id={inputId}
              type={type}
              className={cn(
                inputVariants({ variant, size, rounded, className }),
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-destructive focus-visible:ring-destructive/20'
              )}
              ref={ref}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={
                error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
              onKeyDown={handleKeyDown}
              {...props}
            />
            {rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
          {(error || helperText) && (
            <div className="flex items-center space-x-2">
              {error ? (
                <p
                  id={`${inputId}-error`}
                  className="text-sm font-medium text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              ) : (
                helperText && (
                  <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
                    {helperText}
                  </p>
                )
              )}
            </div>
          )}
        </div>
      );
    }
  )
);

Input.displayName = 'Input';

export { Input, inputVariants };