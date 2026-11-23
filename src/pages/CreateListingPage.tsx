import React, { useState } from 'react';
import { Eye, ImagePlus, Plus, Send, Sparkles, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Select, Textarea } from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, LOCATIONS } from '../data/mockData';
import { listingService } from '../services/listingService';
import type { CategoryId, ListingCondition, ListingType } from '../types';
import { formatPrice, getConditionLabel, getListingTypeLabel } from '../utils/format';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
];

interface FormErrors {
  title?: string;
  shortDescription?: string;
  description?: string;
  price?: string;
  contactInfo?: string;
}

export function CreateListingPage() {
  const { user, loginDemo } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('giao-trinh');
  const [listingType, setListingType] = useState<ListingType>('sell');
  const [condition, setCondition] = useState<ListingCondition>('like-new');
  const [price, setPrice] = useState('100000');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [contactInfo, setContactInfo] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([SAMPLE_IMAGES[0]]);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (title.trim().length < 6) next.title = 'Tiêu đề cần ít nhất 6 ký tự.';
    if (shortDescription.trim().length < 10) next.shortDescription = 'Mô tả ngắn cần ít nhất 10 ký tự.';
    if (description.trim().length < 20) next.description = 'Mô tả chi tiết cần ít nhất 20 ký tự.';
    if (listingType !== 'free') {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice <= 0) {
        next.price = 'Vui lòng nhập mức giá hợp lệ lớn hơn 0.';
      }
    }
    if (contactInfo.trim().length < 5) next.contactInfo = 'Vui lòng nhập thông tin hoặc cách thức liên hệ.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      showToast('URL hình ảnh phải bắt đầu bằng http:// hoặc https://', 'error');
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setImageUrlInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Ảnh tải lên tối đa 2MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImages((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Vui lòng đăng nhập trước khi đăng bài.', 'error');
      navigate('/auth?mode=login');
      return;
    }
    if (!validate()) {
      showToast('Vui lòng kiểm tra lại các trường thông tin bị lỗi.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const numericPrice = listingType === 'free' ? 0 : Number(price);
      const tags = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const created = await listingService.createListing(
        {
          title,
          shortDescription,
          description,
          price: numericPrice,
          isNegotiable,
          listingType,
          categoryId,
          condition,
          images,
          location,
          contactInfo,
          tags,
        },
        user.id
      );

      showToast('Đăng bài thành công!', 'success');
      navigate(`/listing/${created.id}`);
    } catch {
      showToast('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId);
  const previewPrice = listingType === 'free' ? 0 : Number(price) || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            Đăng bài mới
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Chia sẻ sản phẩm, giáo trình hoặc dịch vụ của bạn đến cộng đồng sinh viên.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMobilePreview((v) => !v)}
          leftIcon={<Eye className="h-4 w-4" />}
          className="lg:hidden"
        >
          {showMobilePreview ? 'Quay lại chỉnh sửa' : 'Xem trước bài đăng'}
        </Button>
      </div>

      {!user && (
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <div>
            <strong>Bạn chưa đăng nhập.</strong> Hãy đăng nhập hoặc dùng tài khoản Demo để đăng bài ngay.
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={loginDemo} leftIcon={<Sparkles className="h-4 w-4" />}>
              Dùng tài khoản Demo
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/auth?mode=login')}>
              Đăng nhập
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className={showMobilePreview ? 'hidden lg:col-span-7 lg:block space-y-5' : 'lg:col-span-7 space-y-5'}
        >
          <Card className="space-y-4 p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Thông tin cơ bản</h2>

            <Input
              label="Tiêu đề bài đăng"
              required
              placeholder="VD: Giáo trình Giải tích 1 ĐHBK hoặc Chuột Logitech MX Master 3S"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Danh mục"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as CategoryId)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Hình thức"
                required
                value={listingType}
                onChange={(e) => setListingType(e.target.value as ListingType)}
              >
                <option value="sell">Cần bán</option>
                <option value="exchange">Trao đổi</option>
                <option value="free">Tặng miễn phí</option>
                <option value="service">Dịch vụ sinh viên</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {listingType !== 'free' && (
                <Input
                  label={listingType === 'service' ? 'Mức giá (VNĐ / buổi)' : 'Giá mong muốn (VNĐ)'}
                  type="number"
                  min={0}
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  error={errors.price}
                />
              )}

              <Select
                label="Tình trạng"
                required
                value={condition}
                onChange={(e) => setCondition(e.target.value as ListingCondition)}
              >
                <option value="new">Mới 100%</option>
                <option value="like-new">Như mới (95%+)</option>
                <option value="good">Đã qua sử dụng - Tốt</option>
                <option value="fair">Còn dùng ổn</option>
              </Select>
            </div>

            {listingType !== 'free' && (
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Cho phép sinh viên thương lượng giá
              </label>
            )}
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Mô tả &amp; Hình ảnh</h2>

            <Input
              label="Mô tả ngắn"
              required
              placeholder="Tóm tắt 1 câu điểm nổi bật của sản phẩm/dịch vụ..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              error={errors.shortDescription}
            />

            <Textarea
              label="Mô tả chi tiết"
              required
              rows={5}
              placeholder="Ghi rõ tình trạng thực tế, phụ kiện đi kèm, thời gian bảo hành hoặc lịch hẹn..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
            />

            {/* Images */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Hình ảnh ({images.length})
              </label>

              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-indigo-400 bg-indigo-50/50 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                  <ImagePlus className="h-4 w-4" />
                  Tải ảnh từ máy
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <div className="flex flex-1 gap-2 min-w-56">
                  <Input
                    placeholder="Hoặc dán URL ảnh (https://...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddImageUrl} leftIcon={<Plus className="h-4 w-4" />}>
                    Thêm
                  </Button>
                </div>
              </div>

              {/* Quick sample picker */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                <span>Ảnh mẫu nhanh:</span>
                {SAMPLE_IMAGES.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setImages([url])}
                    className="rounded-md border border-slate-200 px-2 py-0.5 hover:border-indigo-400 dark:border-slate-700 cursor-pointer"
                  >
                    Mẫu {i + 1}
                  </button>
                ))}
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-2 sm:grid-cols-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                      <img src={img} alt={`Ảnh ${idx + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        aria-label="Xóa ảnh"
                        className="absolute top-1 right-1 rounded-full bg-slate-900/75 p-1 text-white opacity-0 transition group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Địa điểm &amp; Liên hệ</h2>

            <Select label="Khu vực giao dịch" value={location} onChange={(e) => setLocation(e.target.value)}>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>

            <Input
              label="Thông tin / Ghi chú liên hệ"
              required
              placeholder="VD: Nhắn tin trực tiếp hoặc hẹn gặp tại sảnh A1 KTX Khu A sau 17h"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              error={errors.contactInfo}
            />

            <Input
              label="Từ khóa tìm kiếm (cách nhau bằng dấu phẩy)"
              placeholder="VD: giáo trình, toán cao cấp, đhbk"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
            />
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button type="submit" size="lg" isLoading={submitting} leftIcon={<Send className="h-4 w-4" />}>
              Đăng bài ngay
            </Button>
          </div>
        </form>

        {/* Live Preview */}
        <aside className={showMobilePreview ? 'block lg:col-span-5' : 'hidden lg:block lg:col-span-5'}>
          <div className="sticky top-24 space-y-3">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Xem trước hiển thị (Live Preview)
            </p>
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
                {images[0] ? (
                  <img src={images[0]} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Chưa có ảnh minh họa
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant="primary">{getListingTypeLabel(listingType)}</Badge>
                </div>
              </div>
              <div className="space-y-2.5 p-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedCategory?.name}
                  </span>
                  <span>{getConditionLabel(condition)}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {title.trim() || 'Tiêu đề bài đăng của bạn sẽ hiển thị ở đây'}
                </h3>
                <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {formatPrice(previewPrice, listingType)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {shortDescription.trim() || 'Mô tả ngắn gọn giúp người mua nắm nhanh thông tin sản phẩm.'}
                </p>
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Avatar src={user?.avatar} name={user?.name ?? 'Sinh viên'} size="xs" verified={user?.verifiedStudent} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {user?.name ?? 'Tài khoản của bạn'} • {location}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
