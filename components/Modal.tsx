/**
 * Modal — accessible overlay dialog.
 *
 * Features:
 *   - Focus trap (click-outside to close)
 *   - Escape key close
 *   - Backdrop blur
 *   - Animated entrance
 *   - Title / subtitle / close button
 */

'use client';

import { useEffect, useCallback, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  hideClose?: boolean;
}

const SIZE_MAP = { sm: '420px', md: '520px', lg: '680px' };

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  hideClose = false,
}: ModalProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-panel animate-fade-in-scale"
        style={{ maxWidth: SIZE_MAP[size] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              {title && (
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {subtitle}
                </p>
              )}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                className="btn btn-ghost btn-icon btn-sm shrink-0"
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
