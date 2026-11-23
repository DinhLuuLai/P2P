import { useCallback, useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { FilterPanel } from '../components/listings/FilterPanel';
import { ListingCard } from '../components/listings/ListingCard';
import { SearchBar } from '../components/listings/SearchBar';
import { Button } from '../components/ui/Button';
import { ListingGridSkeleton } from '../components/ui/Loading';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState, ErrorState } from '../components/ui/StateViews';
import { listingService } from '../services/listingService';
import type { CategoryId, Listing, ListingFilters, ListingType, SortOption } from '../types';

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<ListingFilters>(() => ({
    query: searchParams.get('q') ?? '',
    categoryId: (searchParams.get('category') as CategoryId | 'all') ?? 'all',
    listingType: (searchParams.get('type') as ListingType | 'all') ?? 'all',
    sortBy: (searchParams.get('sort') as SortOption) ?? 'newest',
    condition: 'all',
    location: 'all',
    timeRange: 'all',
    page: 1,
    limit: 9,
  }));

  const [items, setItems] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async (currentFilters: ListingFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listingService.getListings(currentFilters);
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      setError('Không thể tải danh sách bài đăng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings(filters);
  }, [filters, fetchListings]);

  const updateFilters = (patch: Partial<ListingFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      const params = new URLSearchParams();
      if (next.query) params.set('q', next.query);
      if (next.categoryId && next.categoryId !== 'all') params.set('category', next.categoryId);
      if (next.listingType && next.listingType !== 'all') params.set('type', next.listingType);
      if (next.sortBy && next.sortBy !== 'newest') params.set('sort', next.sortBy);
      setSearchParams(params, { replace: true });
      return next;
    });
  };

  const resetFilters = () => {
    setSearchParams({}, { replace: true });
    setFilters({
      query: '',
      categoryId: 'all',
      condition: 'all',
      listingType: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      location: 'all',
      timeRange: 'all',
      sortBy: 'newest',
      page: 1,
      limit: 9,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            Khám phá bài đăng
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tìm thấy <strong className="text-slate-900 dark:text-white">{total}</strong> kết quả phù hợp
          </p>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen((v) => !v)}
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
          >
            {mobileFilterOpen ? 'Ẩn bộ lọc' : 'Bộ lọc nâng cao'}
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <SearchBar
          value={filters.query ?? ''}
          onChange={(val) => updateFilters({ query: val, page: 1 })}
          onSubmit={(val) => updateFilters({ query: val, page: 1 })}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar filter on desktop / toggleable on mobile */}
        <aside className={mobileFilterOpen ? 'block lg:col-span-1' : 'hidden lg:block lg:col-span-1'}>
          <div className="mb-2 flex items-center justify-between lg:hidden">
            <span className="text-sm font-semibold">Lọc kết quả</span>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="rounded-lg p-1 text-slate-500"
              aria-label="Đóng bộ lọc"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <FilterPanel filters={filters} onChange={updateFilters} onReset={resetFilters} />
        </aside>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <ListingGridSkeleton count={6} />
          ) : error ? (
            <ErrorState description={error} onRetry={() => fetchListings(filters)} />
          ) : items.length === 0 ? (
            <EmptyState
              title="Không tìm thấy kết quả phù hợp"
              description="Thử thay đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc để xem nhiều bài đăng hơn."
              action={
                <Button variant="primary" size="sm" onClick={resetFilters}>
                  Xóa tất cả bộ lọc
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
              <Pagination
                page={filters.page ?? 1}
                totalPages={totalPages}
                onPageChange={(nextPage) => updateFilters({ page: nextPage })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
