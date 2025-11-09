import React from 'react';

interface IconProps { className?: string }

export const HomeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 3 3 10v11a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10l-9-7z" />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z" />
    <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26 6.91.99-5 4.87L18.18 22 12 18.56 5.82 22 7 14.12l-5-4.87 6.91-.99L12 2z" />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M7 2h10v3h3a2 2 0 0 1 2 2c0 3.87-3.13 7-7 7H9C5.13 14 2 10.87 2 7a2 2 0 0 1 2-2h3V2zm10 3V4H7v1H4c0 3.31 2.69 6 6 6h4c3.31 0 6-2.69 6-6h-3zm-5 9a5 5 0 0 0 5 5v2H7v-2a5 5 0 0 0 5-5z" />
  </svg>
);

export const GiftIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M20 7h-2.18A3 3 0 1 0 12 5a3 3 0 1 0-5.82 2H4a2 2 0 0 0-2 2v2h20V9a2 2 0 0 0-2-2zM9 4a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2h2zm8 0a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2h2z" />
    <path d="M2 13h9v9H4a2 2 0 0 1-2-2v-7zm11 0h9v7a2 2 0 0 1-2 2h-7v-9z" />
    <path d="M11 8h2v14h-2z" />
  </svg>
);

export const GearIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.03 7.03 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 14.3 1h-4.6a.5.5 0 0 0-.49.42l-.36 2.54c-.58.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L1.71 7.98a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.23.39.32.62.22l2.39-.96c.5.4 1.05.72 1.63.94l.36 2.54c.05.24.25.42.49.42h4.6c.24 0 .44-.18.49-.42l.36-2.54c.58-.23 1.12-.54 1.63-.94l2.39.96c.24.1.5 0 .62-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" />
  </svg>
);
