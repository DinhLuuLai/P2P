import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Sparkles, User as UserIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/layout/Logo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

type AuthMode = 'login' | 'register' | 'forgot';

export function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as AuthMode) || 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const { login, register, loginDemo } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setSearchParams({ mode: next }, { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim().includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    if (mode === 'forgot') {
      setLoading(true);
      try {
        await authService.requestPasswordReset(email);
        showToast('Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi!', 'success');
        switchMode('login');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (mode === 'register') {
      if (name.trim().length < 2) {
        setError('Vui lòng nhập họ tên đầy đủ.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email, password, rememberMe });
      } else {
        await register({
          name,
          username: username || email.split('@')[0],
          email,
          password,
          university,
        });
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginDemo();
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-10 animate-fade-in">
      <div className="mb-6 flex justify-center">
        <Logo showSubtext />
      </div>

      <Card className="p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {mode === 'login' && 'Đăng nhập Student P2P'}
            {mode === 'register' && 'Tạo tài khoản sinh viên'}
            {mode === 'forgot' && 'Quên mật khẩu'}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login' && 'Kết nối, mua bán và trao đổi đồ dùng cùng sinh viên.'}
            {mode === 'register' && 'Tham gia cộng đồng P2P sinh viên hoàn toàn miễn phí.'}
            {mode === 'forgot' && 'Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.'}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {mode === 'register' && (
            <>
              <Input
                label="Họ và tên"
                required
                placeholder="VD: Nguyễn Minh Khoa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<UserIcon className="h-4 w-4" />}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Username"
                  placeholder="vd: minhkhoa_it"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  label="Trường đại học"
                  placeholder="VD: ĐH Bách Khoa"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </div>
            </>
          )}

          <Input
            label="Email sinh viên / cá nhân"
            type="email"
            required
            placeholder="ten@student.edu.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
          />

          {mode !== 'forgot' && (
            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Ít nhất 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute top-9 right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}

          {mode === 'register' && (
            <Input
              label="Xác nhận mật khẩu"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                />
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" isLoading={loading}>
            {mode === 'login' && 'Đăng nhập'}
            {mode === 'register' && 'Đăng ký tài khoản'}
            {mode === 'forgot' && 'Gửi yêu cầu đặt lại'}
          </Button>
        </form>

        {mode !== 'forgot' && (
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={loading}
              leftIcon={<Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
            >
              Đăng nhập nhanh (Tài khoản Demo)
            </Button>
          </div>
        )}

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          {mode === 'login' ? (
            <>
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
              >
                Quay lại đăng nhập
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
