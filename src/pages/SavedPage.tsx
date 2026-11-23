import { useEffect, useState } from 'react';
import { Bookmark, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ListingCard } from '../components/listings/ListingCard';
import { Button } from '../components/ui/Button';
import { ListingGridSkeleton } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/StateViews';
import { useApp } from '../context/AppContext';
import { listingService } from '../services/listingService';
import type { Listing } from '../types';

export function SavedPage() {
  const { savedIds } = useApp();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function loadSaved() {
      setLoading(true);
      const data = await listingService.getListingsByIds(savedIds);
      if (active) {
        setItems(data);
        setLoading(false);
      }
    }
    loadSaved();
    return () => {
      active = false;
    };
  }, [savedIds]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Bài đăng đã lưu
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Xem lại các sản phẩm và dịch vụ bạn đã đánh dấu quan tâm ({items.length})
        </p>
      </div>

      {loading ? (
        <ListingGridSkeleton count={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-7 w-7" />}
          title="Chưa có bài đăng nào được lưu"
          description="Nhấn vào biểu tượng đánh dấu trên các bài đăng để lưu lại và xem nhanh khi cần."
          action={
            <Button onClick={() => navigate('/explore')} leftIcon={<Compass className="h-4 w-4" />}>
              Khám phá bài đăng ngay
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}
    </div>
  );
}
