import React, { useState } from 'react';
import { Bookmark, Clock, MapPin, MessageCircle, ImageOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { authService } from '../../services/authService';
import type { Listing } from '../../types';
import {
  cn,
  formatPrice,
  formatRelativeTime,
  getConditionLabel,
  getListingTypeLabel,
} from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate();
  const { isSaved, toggleSaveListing } = useApp();
  const [imgFailed, setImgFailed] = useState(false);

  const saved = isSaved(listing.id);
  const seller = authService.getUserById(listing.sellerId);
  const category = CATEGORIES.find((c) => c.id === listing.categoryId);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/messages?to=${listing.sellerId}&listing=${listing.id}`);
  };

  return (
    <Card hoverable className="group flex h-full flex-col overflow-hidden">
      <Link to={`/listing/${listing.id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {listing.images[0] && !imgFailed ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 dark:from-slate-800 dark:to-slate-900">
            <ImageOff className="h-7 w-7" />
            <span className="text-xs font-medium">Student P2P</span>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <Badge
            variant={
              listing.listingType === 'free'
                ? 'success'
                : listing.listingType === 'exchange'
                ? 'warning'
                : listing.listingType === 'service'
                ? 'primary'
                : 'default'
            }
            className="backdrop-blur-md shadow-xs"
          >
            {getListingTypeLabel(listing.listingType)}
          </Badge>
          {listing.isFeatured && (
            <Badge variant="primary" className="bg-indigo-600/95 text-white dark:bg-indigo-500/95 dark:text-white">
              Nổi bật
            </Badge>
          )}
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={saved ? 'Bỏ lưu bài đăng' : 'Lưu bài đăng'}
          aria-pressed={saved}
          className={cn(
            'absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition cursor-pointer',
            saved
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white/85 text-slate-700 hover:bg-white dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900'
          )}
        >
          <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            {category?.name ?? 'Khác'}
          </span>
          <span className="truncate rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {getConditionLabel(listing.condition)}
          </span>
        </div>

        <Link to={`/listing/${listing.id}`} className="group/title">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 transition-colors group-hover/title:text-indigo-600 dark:text-slate-100 dark:group-hover/title:text-indigo-400">
            {listing.title}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {formatPrice(listing.price, listing.listingType)}
          </span>
          {listing.isNegotiable && listing.price > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500">Thương lượng</span>
          )}
        </div>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {listing.shortDescription}
        </p>

        <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>{formatRelativeTime(listing.createdAt)}</span>
          </div>
        </div>

        {/* Footer: Seller & Quick Contact */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3 mt-4 dark:border-slate-800">
          <Link
            to={`/listing/${listing.id}`}
            className="flex min-w-0 items-center gap-2 hover:opacity-80"
          >
            <Avatar
              src={seller?.avatar}
              name={seller?.name ?? 'Sinh viên'}
              size="xs"
              verified={seller?.verifiedStudent}
            />
            <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
              {seller?.name ?? 'Sinh viên'}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleContactClick}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300 dark:hover:bg-indigo-900/70 cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Liên hệ
          </button>
        </div>
      </div>
    </Card>
  );
}
