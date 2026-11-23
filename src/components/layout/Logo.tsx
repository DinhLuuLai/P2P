import { Link } from 'react-router-dom';
import { cn } from '../../utils/format';

interface LogoProps {
  className?: string;
  showSubtext?: boolean;
}

export function Logo({ className, showSubtext = false }: LogoProps) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5 group', className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 shadow-sm shadow-indigo-600/20 transition-transform duration-200 group-hover:scale-105">
        <svg viewBox="0 0 40 40" className="h-6 w-6" fill="none" aria-hidden="true">
          <circle cx="13" cy="14" r="4" fill="#FFFFFF" />
          <circle cx="27" cy="14" r="4" fill="#FFFFFF" fillOpacity="0.9" />
          <circle cx="20" cy="27" r="4" fill="#34D399" />
          <path
            d="M16.5 15.5L23.5 15.5M14.8 17.5L18.5 23.8M25.2 17.5L21.5 23.8"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
          Student <span className="text-indigo-600 dark:text-indigo-400">P2P</span>
        </span>
        {showSubtext && (
          <span className="mt-0.5 text-[10px] font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Campus Exchange
          </span>
        )}
      </div>
    </Link>
  );
}
