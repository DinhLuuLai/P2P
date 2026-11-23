export type CategoryId =
  | 'sach'
  | 'giao-trinh'
  | 'dien-thoai'
  | 'laptop'
  | 'phu-kien'
  | 'do-dien-tu'
  | 'xe'
  | 'do-dung-ca-nhan'
  | 'thoi-trang'
  | 'do-gia-dung'
  | 'dich-vu'
  | 'khac';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  colorClass: string;
}

export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair';
export type ListingType = 'sell' | 'exchange' | 'free' | 'service';
export type ListingStatus = 'active' | 'sold' | 'hidden';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  university: string;
  major: string;
  location: string;
  bio: string;
  rating: number;
  reviewCount: number;
  joinedAt: string;
  verifiedStudent: boolean;
  contactHandle: string;
}

export interface Listing {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  isNegotiable: boolean;
  listingType: ListingType;
  categoryId: CategoryId;
  condition: ListingCondition;
  images: string[];
  location: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  savedCount: number;
  isFeatured: boolean;
  status: ListingStatus;
  contactInfo: string;
  tags: string[];
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';
export type TimeRangeOption = 'all' | '24h' | '7d' | '30d';

export interface ListingFilters {
  query?: string;
  categoryId?: CategoryId | 'all';
  condition?: ListingCondition | 'all';
  listingType?: ListingType | 'all';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: SortOption;
  timeRange?: TimeRangeOption;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  listingRefId?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  listingId?: string;
  lastMessage?: string;
  updatedAt: string;
  unreadCount: number;
}

export type NotificationType = 'message' | 'save' | 'interaction' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
}

export interface Review {
  id: string;
  targetUserId: string;
  authorId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateListingPayload {
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  isNegotiable: boolean;
  listingType: ListingType;
  categoryId: CategoryId;
  condition: ListingCondition;
  images: string[];
  location: string;
  contactInfo: string;
  tags?: string[];
}
