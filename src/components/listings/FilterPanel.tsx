import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, LOCATIONS } from '../../data/mockData';
import type {
  CategoryId,
  ListingCondition,
  ListingFilters,
  ListingType,
  SortOption,
  TimeRangeOption,
} from '../../types';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';

interface FilterPanelProps {
  filters: ListingFilters;
  onChange: (next: Partial<ListingFilters>) => void;
  onReset: () => void;
}

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <SlidersHorizontal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Bộ lọc tìm kiếm</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
        >
          Đặt lại
        </Button>
      </div>

      <Select
        label="Danh mục"
        value={filters.categoryId ?? 'all'}
        onChange={(e) => onChange({ categoryId: e.target.value as CategoryId | 'all', page: 1 })}
      >
        <option value="all">Tất cả danh mục</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>

      <Select
        label="Hình thức"
        value={filters.listingType ?? 'all'}
        onChange={(e) => onChange({ listingType: e.target.value as ListingType | 'all', page: 1 })}
      >
        <option value="all">Tất cả hình thức</option>
        <option value="sell">Cần bán</option>
        <option value="exchange">Trao đổi</option>
        <option value="free">Tặng miễn phí</option>
        <option value="service">Dịch vụ sinh viên</option>
      </Select>

      <Select
        label="Tình trạng"
        value={filters.condition ?? 'all'}
        onChange={(e) => onChange({ condition: e.target.value as ListingCondition | 'all', page: 1 })}
      >
        <option value="all">Mọi tình trạng</option>
        <option value="new">Mới 100%</option>
        <option value="like-new">Như mới (95%+)</option>
        <option value="good">Đã qua sử dụng - Tốt</option>
        <option value="fair">Còn dùng ổn</option>
      </Select>

      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Khoảng giá (VNĐ)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Từ (0)"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
          />
          <Input
            type="number"
            min={0}
            placeholder="Đến..."
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
          />
        </div>
      </div>

      <Select
        label="Khu vực / Campus"
        value={filters.location ?? 'all'}
        onChange={(e) => onChange({ location: e.target.value, page: 1 })}
      >
        <option value="all">Tất cả khu vực</option>
        {LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </Select>

      <Select
        label="Thời gian đăng"
        value={filters.timeRange ?? 'all'}
        onChange={(e) => onChange({ timeRange: e.target.value as TimeRangeOption, page: 1 })}
      >
        <option value="all">Mọi thời điểm</option>
        <option value="24h">24 giờ qua</option>
        <option value="7d">7 ngày qua</option>
        <option value="30d">30 ngày qua</option>
      </Select>

      <Select
        label="Sắp xếp theo"
        value={filters.sortBy ?? 'newest'}
        onChange={(e) => onChange({ sortBy: e.target.value as SortOption, page: 1 })}
      >
        <option value="newest">Mới nhất</option>
        <option value="popular">Phổ biến nhất</option>
        <option value="price-asc">Giá thấp đến cao</option>
        <option value="price-desc">Giá cao đến thấp</option>
      </Select>
    </div>
  );
}
