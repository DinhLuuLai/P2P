import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pb-20 dark:border-slate-800 dark:bg-slate-950 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <Logo showSubtext />
            <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Nền tảng kết nối trực tiếp dành riêng cho cộng đồng sinh viên Việt Nam. Mua bán, trao đổi giáo trình, đồ công nghệ và dịch vụ sinh viên minh bạch, tiết kiệm và an toàn.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Giao dịch P2P trực tiếp
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-indigo-500" /> Cộng đồng sinh viên
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" /> Miễn phí đăng bài
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Khám phá</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Tất cả bài đăng
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Danh mục sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/explore?type=exchange" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Trao đổi đồ dùng
                </Link>
              </li>
              <li>
                <Link to="/explore?type=service" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Dịch vụ sinh viên
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tài khoản</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/create" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Đăng bài mới
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Bài đăng đã lưu
                </Link>
              </li>
              <li>
                <Link to="/messages" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Tin nhắn
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Hồ sơ sinh viên
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Student P2P. Dự án nền tảng kết nối sinh viên.</p>
          <p>Hỗ trợ responsive toàn diện • Dark Mode • Sẵn sàng mở rộng Backend</p>
        </div>
      </div>
    </footer>
  );
}
