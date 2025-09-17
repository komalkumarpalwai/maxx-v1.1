import React from 'react';

/**
 * Avatar
 * - Render a circular initials avatar instead of relying on app logo or uploaded images.
 * - This component intentionally avoids using `/avathar.png` or any logo image.
 * - It accepts `alt` (user full name) and derives initials from it.
 */
const Avatar = ({
  alt,
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-3xl'
  };

  const sizeClass = sizes[size] || sizes.md;
  const classes = `${sizeClass} rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-semibold ${className}`;

  // derive initials from alt/name
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(alt || '');

  return (
    <div className={classes} role="img" aria-label={alt || 'avatar'} title={alt || 'avatar'}>
      {initials || '?'}
    </div>
  );
};

export default Avatar;








