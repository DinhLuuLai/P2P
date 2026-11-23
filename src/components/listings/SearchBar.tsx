import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/format';

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  onSubmit?: (val: string) => void;
  placeholder?: string;
  size?: 'md' | 'lg';
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Tìm giáo trình, laptop, chuột, gia sư hoặc tên sinh viên...',
  size = 'md',
  className,
}: SearchBarProps) {
  const [internal, setInternal] = useState(value ?? '');
  const currentValue = value !== undefined ? value : internal;

  const handleChange = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(currentValue.trim());
  };

  return (
    <form onSubmit={handleFormSubmit} className={cn('relative flex w-full items-center', className)} role="search">
      <Search
        className={cn(
          'pointer-events-none absolute left-3.5 text-slate-400',
          size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
        )}
        aria-hidden="true"
      />
      <input
        type="search"
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Tìm kiếm bài đăng"
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-white pr-20 text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
          size === 'lg' ? 'h-12 pl-11 text-sm sm:text-base shadow-sm' : 'h-10 pl-10 text-sm'
        )}
      />
      {currentValue && (
        <button
          type="button"
          onClick={() => handleChange('')}
          aria-label="Xóa từ khóa"
          className="absolute right-16 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <button
        type="submit"
        className={cn(
          'absolute right-1.5 rounded-lg bg-indigo-600 font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 cursor-pointer',
          size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'
        )}
      >
        Tìm
      </button>
    </form>
  );
}
