import { useState } from 'react';
import {
  Bell,
  Bookmark,
  Compass,
  Grid2X2,
  Home,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  PlusCircle,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { Logo } from './Logo';

export function Navbar() {
  const { user, unreadNotificationsCount, unreadMessagesCount, savedIds, logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Logo />
            <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 md:flex">
              <NavLink to="/" className={navLinkClass} end>
                <Home className="h-4 w-4" />
                <span>Trang chủ</span>
              </NavLink>
              <NavLink to="/explore" className={navLinkClass}>
                <Compass className="h-4 w-4" />
                <span>Khám phá</span>
              </NavLink>
              <NavLink to="/categories" className={navLinkClass}>
                <Grid2X2 className="h-4 w-4" />
                <span>Danh mục</span>
              </NavLink>
              <NavLink to="/saved" className={navLinkClass}>
                <Bookmark className="h-4 w-4" />
                <span>Đã lưu</span>
                {savedIds.length > 0 && (
                  <span className="ml-0.5 rounded-full bg-slate-200 px-1.5 py-0.2 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {savedIds.length}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/create')}
              leftIcon={<PlusCircle className="h-4 w-4" />}
              className="hidden sm:inline-flex"
            >
              Đăng bài
            </Button>

            <Link
              to="/messages"
              aria-label="Tin nhắn"
              className="relative hidden h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline-flex"
            >
              <MessageSquare className="h-5 w-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>

            <Link
              to="/notifications"
              aria-label="Thông báo"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <Dropdown
                trigger={
                  <button
                    type="button"
                    aria-label="Menu tài khoản"
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pr-2.5 pl-1 transition hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                  >
                    <Avatar src={user.avatar} name={user.name} size="xs" verified={user.verifiedStudent} />
                    <span className="hidden max-w-28 truncate text-xs font-semibold text-slate-800 dark:text-slate-200 lg:inline">
                      {user.name}
                    </span>
                  </button>
                }
              >
                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">@{user.username}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <UserIcon className="h-4 w-4" />
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    to="/saved"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Bookmark className="h-4 w-4" />
                    Bài đăng đã lưu ({savedIds.length})
                  </Link>
                  <Link
                    to="/messages"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Tin nhắn
                  </Link>
                </div>
                <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </Dropdown>
            ) : (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth?mode=login')}>
                  Đăng nhập
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/auth?mode=register')}>
                  Đăng ký
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Mở menu di động"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden animate-fade-in">
            <nav className="flex flex-col gap-1" onClick={() => setMobileMenuOpen(false)}>
              <NavLink to="/" className={navLinkClass} end>
                <Home className="h-4 w-4" /> Trang chủ
              </NavLink>
              <NavLink to="/explore" className={navLinkClass}>
                <Compass className="h-4 w-4" /> Khám phá
              </NavLink>
              <NavLink to="/categories" className={navLinkClass}>
                <Grid2X2 className="h-4 w-4" /> Danh mục
              </NavLink>
              <NavLink to="/saved" className={navLinkClass}>
                <Bookmark className="h-4 w-4" /> Đã lưu ({savedIds.length})
              </NavLink>
              <NavLink to="/notifications" className={navLinkClass}>
                <Bell className="h-4 w-4" /> Thông báo ({unreadNotificationsCount})
              </NavLink>
              {!user && (
                <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" size="sm" onClick={() => navigate('/auth?mode=login')}>
                    <LogIn className="h-4 w-4" /> Đăng nhập
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/auth?mode=register')}>
                    Đăng ký
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Điều hướng nhanh di động"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white/95 py-1.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            )
          }
        >
          <Home className="h-5 w-5" />
          <span>Trang chủ</span>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            )
          }
        >
          <Compass className="h-5 w-5" />
          <span>Khám phá</span>
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold',
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-600 dark:text-indigo-400'
            )
          }
        >
          <PlusCircle className="h-6 w-6" />
          <span>Đăng bài</span>
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            cn(
              'relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            )
          }
        >
          <div className="relative">
            <MessageSquare className="h-5 w-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span>Tin nhắn</span>
        </NavLink>

        <NavLink
          to={user ? '/profile' : '/auth'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            )
          }
        >
          <UserIcon className="h-5 w-5" />
          <span>{user ? 'Hồ sơ' : 'Tài khoản'}</span>
        </NavLink>
      </nav>
    </>
  );
}
