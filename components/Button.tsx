/**
 * Button — DEVKIT design-system button.
 *
 * Variants: primary | accent | ghost | danger | gold
 * Sizes: sm | md | lg | xl
 * Extras: loading spinner, left/right icon slots
 */

'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  as: Tag = 'button',
  href,
  ...props
}: ButtonProps) {
  const sizeClass = {
    sm:   'btn-sm',
    md:   '',
    lg:   'btn-lg',
    xl:   'btn-xl',
    icon: 'btn-icon',
  }[size];

  const classes = `btn btn-${variant} ${sizeClass} ${className}`;

  const content = (
    <>
      {loading ? (
        <span className="loading-spinner" style={{ borderTopColor: 'currentColor' }} />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </>
  );

  if (Tag === 'a') {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
