import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { CATEGORIES } from '../data/mockData';
import { listingService } from '../services/listingService';

export function CategoriesPage() {
  const counts = listingService.getCategoryCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Hệ thống danh mục
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
          Khám phá các nhóm sản phẩm, giáo trình và dịch vụ phổ biến trong cộng đồng sinh viên.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const count = counts[cat.id] ?? 0;
          return (
            <Link key={cat.id} to={`/explore?category=${cat.id}`}>
              <Card hoverable className="flex h-full items-start gap-4 p-5">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cat.colorClass}`}>
                  <CategoryIcon name={cat.iconName} className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{cat.name}</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {count} tin
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {cat.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Xem bài đăng <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
