import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ListingCard } from '../components/listings/ListingCard';
import { SearchBar } from '../components/listings/SearchBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { ListingGridSkeleton } from '../components/ui/Loading';
import { CATEGORIES } from '../data/mockData';
import { listingService } from '../services/listingService';
import type { Listing } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [latest, setLatest] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadHome() {
      setLoading(true);
      const [featData, latestData] = await Promise.all([
        listingService.getFeaturedListings(4),
        listingService.getLatestListings(8),
      ]);
      if (active) {
        setFeatured(featData);
        setLatest(latestData);
        setLoading(false);
      }
    }
    loadHome();
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/explore${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-slate-900 dark:border-slate-800">
        <img
          src="/banner.jpg"
          alt="Student P2P Banner"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/65 to-slate-950/85 backdrop-blur-[1px]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              Nền tảng P2P kết nối trực tiếp dành riêng cho sinh viên
            </div>

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Mua bán &amp; trao đổi đồ sinh viên{' '}
              <span className="bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent">
                nhanh gọn, minh bạch
              </span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-200 sm:text-lg">
              Tìm giáo trình cũ, laptop học tập, phụ kiện công nghệ, đồ phòng trọ hoặc dịch vụ gia sư trực tiếp từ các bạn sinh viên cùng trường, cùng ký túc xá.
            </p>

            {/* Hero Search */}
            <div className="mt-7">
              <SearchBar
                size="lg"
                onSubmit={handleSearch}
                placeholder="Bạn đang tìm gì? (VD: Giáo trình Giải tích, Dell XPS, Chuột, Gia sư...)"
              />
            </div>

            {/* Quick CTA Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => navigate('/explore')} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Khám phá bài đăng
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/create')}
                leftIcon={<PlusCircle className="h-4 w-4" />}
                className="border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                Đăng bài miễn phí
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-200">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Không qua trung gian
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-indigo-300" /> Cộng đồng sinh viên các trường
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-sky-300" /> Giao dịch trực tiếp tại campus
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
              Danh mục phổ biến
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Chọn nhanh nhóm sản phẩm hoặc dịch vụ bạn đang cần
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {CATEGORIES.slice(0, 12).map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.id}`}
              className="group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            >
              <div className={`mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl ${cat.colorClass}`}>
                <CategoryIcon name={cat.iconName} className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
              Bài đăng nổi bật
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sản phẩm chất lượng được nhiều sinh viên quan tâm
            </p>
          </div>
          <Link
            to="/explore?sort=popular"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Xem thêm <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <ListingGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Listings */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
              Bài đăng mới nhất
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Cập nhật liên tục từ các bạn sinh viên
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Khám phá tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <ListingGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </section>

      {/* How it works + CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            Student P2P hoạt động như thế nào?
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            3 bước đơn giản để mua bán, trao đổi đồ dùng trong cộng đồng sinh viên
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card className="p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Tìm kiếm nhanh chóng</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Lọc theo danh mục, mức giá, tình trạng hoặc khu vực KTX / trường đại học gần bạn nhất.
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Nhắn tin trực tiếp</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Trao đổi thông tin, thương lượng giá hoặc hẹn lịch xem đồ trực tiếp ngay trên hệ thống chat P2P.
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Gặp mặt &amp; hoàn tất</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Kiểm tra sản phẩm trực tiếp tại giảng đường, thư viện hoặc sảnh KTX để đảm bảo an toàn tuyệt đối.
            </p>
          </Card>
        </div>

        {/* CTA Banner */}
        <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-600 p-8 text-white shadow-lg sm:flex-row sm:p-10">
          <div>
            <h3 className="font-display text-2xl font-bold">Bạn có giáo trình hay đồ dùng không còn dùng tới?</h3>
            <p className="mt-1.5 text-sm text-indigo-100">
              Đăng bài chỉ mất 30 giây để chia sẻ hoặc thanh lý cho các bạn sinh viên khác.
            </p>
          </div>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/create')}
            leftIcon={<PlusCircle className="h-5 w-5 text-indigo-600" />}
            className="shrink-0 bg-white text-indigo-700 hover:bg-indigo-50 dark:bg-white dark:text-indigo-700"
          >
            Đăng bài ngay
          </Button>
        </div>
      </section>
    </div>
  );
}
