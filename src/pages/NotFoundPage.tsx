import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center animate-fade-in">
      <p className="font-display text-6xl font-extrabold text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Không tìm thấy trang</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
      </p>
      <Button className="mt-6" onClick={() => navigate('/')} leftIcon={<Home className="h-4 w-4" />}>
        Về trang chủ
      </Button>
    </div>
  );
}
