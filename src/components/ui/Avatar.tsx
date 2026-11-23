import { useState } from 'react';
import { cn } from '../../utils/format';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  className?: string;
}

export function Avatar({ src, name, size = 'md', verified = false, className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl',
  };

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

  return (
    <div className={cn('relative inline-flex shrink-0 items-center justify-center', className)}>
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={cn(
            'rounded-full object-cover ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800',
            sizes[size]
          )}
        />
      ) : (
        <div
          aria-label={name}
          className={cn(
            'flex items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 ring-2 ring-white dark:bg-indigo-950 dark:text-indigo-300 dark:ring-slate-900',
            sizes[size]
          )}
        >
          {initials || 'SV'}
        </div>
      )}
      {verified && (
        <span
          title="Sinh viên đã xác thực"
          className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"
        />
      )}
    </div>
  );
}
