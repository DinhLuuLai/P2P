import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock,
  Eye,
  GraduationCap,
  ImageOff,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ListingCard } from '../components/listings/ListingCard';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/StateViews';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../data/mockData';
import { authService } from '../services/authService';
import { listingService } from '../services/listingService';
import type { Listing } from '../types';
import {
  cn,
  formatPrice,
  formatRelativeTime,
  getConditionLabel,
  getListingTypeLabel,
} from '../utils/format';

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaved, toggleSaveListing } = useApp();
  const { showToast } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadDetail() {
      if (!id) return;
      setLoading(true);
      setError(false);
      setActiveImage(0);
      setShowContact(false);
      try {
        const found = await listingService.getListingById(id);
        if (!found) {
          if (active) setError(true);
          return;
        }
        const sim = await listingService.getSimilarListings(found, 4);
        if (active) {
          setListing(found);
          setSimilar(sim);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDetail();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <LoadingSpinner label="Đang tải chi tiết bài đăng..." />;
  if (error || !listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState
          title="Không tìm thấy bài đăng"
          description="Bài đăng này có thể đã bị xóa hoặc đường dẫn không hợp lệ."
          onRetry={() => navigate('/explore')}
        />
      </div>
    );
  }

  const seller = authService.getUserById(listing.sellerId);
  const category = CATEGORIES.find((c) => c.id === listing.categoryId);
  const saved = isSaved(listing.id);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết bài đăng!', 'success');
    } catch {
      showToast('Không thể sao chép liên kết lúc này.', 'info');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại
        </button>
        <span>/</span>
        <Link to={`/explore?category=${listing.categoryId}`} className="hover:text-indigo-600">
          {category?.name ?? 'Danh mục'}
        </Link>
        <span>/</span>
        <span className="truncate text-slate-400">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Gallery + Description */}
        <div className="space-y-6 lg:col-span-7">
          {/* Gallery */}
          <Card className="overflow-hidden p-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              {listing.images[activeImage] ? (
                <img
                  src={listing.images[activeImage]}
                  alt={`${listing.title} - ảnh ${activeImage + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <ImageOff className="h-10 w-10" />
                </div>
              )}
            </div>

            {listing.images.length > 1 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      'relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition cursor-pointer',
                      activeImage === idx
                        ? 'border-indigo-600 dark:border-indigo-400'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mô tả chi tiết</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {listing.description}
            </p>

            {listing.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                {listing.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/explore?q=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Info + Actions + Seller */}
        <div className="space-y-5 lg:col-span-5">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{category?.name ?? 'Khác'}</Badge>
              <Badge variant="outline">{getListingTypeLabel(listing.listingType)}</Badge>
              <Badge variant="success">{getConditionLabel(listing.condition)}</Badge>
            </div>

            <h1 className="mt-3 font-display text-2xl font-bold leading-snug text-slate-900 dark:text-white">
              {listing.title}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {formatPrice(listing.price, listing.listingType)}
              </span>
              {listing.isNegotiable && listing.price > 0 && (
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  Có thể thương lượng
                </span>
              )}
            </div>

            <div className="mt-4 space-y-2 border-y border-slate-100 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                <span>Đăng {formatRelativeTime(listing.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{listing.views} lượt xem • {listing.savedCount} lượt lưu</span>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="mt-5 space-y-2.5">
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate(`/messages?to=${listing.sellerId}&listing=${listing.id}`)}
                leftIcon={<MessageCircle className="h-5 w-5" />}
              >
                Nhắn tin trực tiếp với người đăng
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => setShowContact((v) => !v)}
                  leftIcon={<Phone className="h-4 w-4" />}
                >
                  {showContact ? 'Ẩn liên hệ' : 'Thông tin liên hệ'}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={saved ? 'primary' : 'outline'}
                    onClick={() => toggleSaveListing(listing.id)}
                    aria-label={saved ? 'Bỏ lưu' : 'Lưu bài'}
                    leftIcon={<Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />}
                  >
                    {saved ? 'Đã lưu' : 'Lưu'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    aria-label="Chia sẻ bài đăng"
                    leftIcon={<Share2 className="h-4 w-4" />}
                  >
                    Chia sẻ
                  </Button>
                </div>
              </div>

              {showContact && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-sm text-indigo-900 dark:border-indigo-800/70 dark:bg-indigo-950/50 dark:text-indigo-200 animate-fade-in">
                  <p className="font-semibold">Ghi chú liên hệ từ người đăng:</p>
                  <p className="mt-1">{listing.contactInfo}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Seller Info */}
          {seller && (
            <Card className="p-5">
              <div className="flex items-start gap-3.5">
                <Avatar src={seller.avatar} name={seller.name} size="lg" verified={seller.verifiedStudent} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{seller.name}</h3>
                    {seller.verifiedStudent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> Đã xác thực
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">@{seller.username}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5 text-indigo-500" /> {seller.university}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" /> {seller.rating} ({seller.reviewCount} đánh giá)
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{seller.bio}</p>
            </Card>
          )}

          {/* Safety Tip */}
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-100/70 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p>
              <strong>Lưu ý an toàn:</strong> Ưu tiên kiểm tra sản phẩm trực tiếp tại nơi công cộng (sảnh trường, thư viện, sảnh KTX) trước khi thanh toán.
            </p>
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      {similar.length > 0 && (
        <section className="mt-12 border-t border-slate-200 pt-10 dark:border-slate-800">
          <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">Tin đăng tương tự</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
