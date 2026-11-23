import type { ListingCondition, ListingType } from '../types';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number, listingType: ListingType = 'sell'): string {
  if (listingType === 'free' || price === 0) {
    return 'Miễn phí';
  }
  const formatted = new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  if (listingType === 'service') {
    return `${formatted} / buổi`;
  }
  return formatted;
}

export function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffSeconds = Math.max(0, Math.floor((now - then) / 1000));

  if (diffSeconds < 60) return 'Vừa xong';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate));
}

export function getConditionLabel(condition: ListingCondition): string {
  const map: Record<ListingCondition, string> = {
    new: 'Mới 100%',
    'like-new': 'Như mới (95%+)',
    good: 'Đã qua sử dụng - Tốt',
    fair: 'Còn dùng ổn',
  };
  return map[condition];
}

export function getListingTypeLabel(type: ListingType): string {
  const map: Record<ListingType, string> = {
    sell: 'Cần bán',
    exchange: 'Trao đổi',
    free: 'Tặng miễn phí',
    service: 'Dịch vụ',
  };
  return map[type];
}
