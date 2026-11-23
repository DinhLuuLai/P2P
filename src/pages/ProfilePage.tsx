import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  GraduationCap,
  MapPin,
  Package,
  PlusCircle,
  Sparkles,
  Star,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Loading';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/StateViews';
import { Tabs } from '../components/ui/Tabs';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { listingService } from '../services/listingService';
import type { Listing, Review } from '../types';
import { formatPrice, formatRelativeTime } from '../utils/format';

export function ProfilePage() {
  const { user, loginDemo, updateProfile } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'listings' | 'reviews' | 'activity'>('listings');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUniversity, setEditUniversity] = useState('');
  const [editMajor, setEditMajor] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let active = true;
    async function loadProfileData() {
      setLoading(true);
      const list = await listingService.getListingsBySeller(user!.id);
      const revs = authService.getUserReviews(user!.id);
      if (active) {
        setMyListings(list);
        setReviews(revs);
        setLoading(false);
      }
    }
    loadProfileData();
    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          icon={<UserIcon className="h-7 w-7" />}
          title="Bạn chưa đăng nhập"
          description="Đăng nhập để quản lý hồ sơ sinh viên, bài đăng và đánh giá từ cộng đồng."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={loginDemo} leftIcon={<Sparkles className="h-4 w-4" />}>
                Dùng tài khoản Demo
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth?mode=login')}>
                Đăng nhập
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const openEditModal = () => {
    setEditName(user.name);
    setEditUniversity(user.university);
    setEditMajor(user.major);
    setEditLocation(user.location);
    setEditBio(user.bio);
    setEditAvatar(user.avatar);
    setEditOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim().length < 2) {
      showToast('Tên hiển thị không hợp lệ', 'error');
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile({
        name: editName.trim(),
        university: editUniversity.trim(),
        major: editMajor.trim(),
        location: editLocation.trim(),
        bio: editBio.trim(),
        avatar: editAvatar.trim() || user.avatar,
      });
      setEditOpen(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleToggleSold = async (item: Listing) => {
    const nextStatus = item.status === 'active' ? 'sold' : 'active';
    const updated = await listingService.updateListingStatus(item.id, nextStatus);
    if (updated) {
      setMyListings((prev) => prev.map((l) => (l.id === item.id ? updated : l)));
      showToast(
        nextStatus === 'sold' ? 'Đã đánh dấu bài đăng là Đã bán' : 'Đã mở lại bài đăng',
        'success'
      );
    }
  };

  const handleDeleteListing = async (id: string) => {
    await listingService.deleteListing(id);
    setMyListings((prev) => prev.filter((l) => l.id !== id));
    showToast('Đã xóa bài đăng.', 'info');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Profile Header */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar src={user.avatar} name={user.name} size="xl" verified={user.verifiedStudent} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                {user.verifiedStudent && (
                  <Badge variant="success">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Sinh viên xác thực
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">@{user.username} • {user.email}</p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-indigo-500" />
                  {user.university} ({user.major})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {user.location}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  {user.rating} ({user.reviewCount} đánh giá)
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={openEditModal} leftIcon={<Edit3 className="h-4 w-4" />}>
              Chỉnh sửa hồ sơ
            </Button>
            <Button size="sm" onClick={() => navigate('/create')} leftIcon={<PlusCircle className="h-4 w-4" />}>
              Đăng bài
            </Button>
          </div>
        </div>

        {user.bio && (
          <p className="mt-5 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
            {user.bio}
          </p>
        )}
      </Card>

      {/* Tabs */}
      <div className="mt-6">
        <Tabs
          activeId={tab}
          onChange={(id) => setTab(id as 'listings' | 'reviews' | 'activity')}
          items={[
            { id: 'listings', label: 'Bài đăng của tôi', count: myListings.length },
            { id: 'reviews', label: 'Đánh giá', count: reviews.length },
            { id: 'activity', label: 'Hoạt động' },
          ]}
        />
      </div>

      {/* Tab Content */}
      <div className="mt-5">
        {loading ? (
          <LoadingSpinner />
        ) : tab === 'listings' ? (
          myListings.length === 0 ? (
            <EmptyState
              icon={<Package className="h-7 w-7" />}
              title="Bạn chưa có bài đăng nào"
              description="Hãy đăng bán hoặc trao đổi giáo trình, đồ dùng không còn dùng tới."
              action={
                <Button onClick={() => navigate('/create')} leftIcon={<PlusCircle className="h-4 w-4" />}>
                  Tạo bài đăng đầu tiên
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {myListings.map((item) => (
                <Card key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <Link to={`/listing/${item.id}`} className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
                    </Link>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link to={`/listing/${item.id}`} className="truncate text-sm font-bold text-slate-900 hover:text-indigo-600 dark:text-white">
                          {item.title}
                        </Link>
                        <Badge variant={item.status === 'active' ? 'success' : 'default'}>
                          {item.status === 'active' ? 'Đang hiển thị' : 'Đã bán'}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {formatPrice(item.price, item.listingType)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.views} lượt xem • Đăng {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleToggleSold(item)}>
                      {item.status === 'active' ? 'Đánh dấu đã bán' : 'Mở bán lại'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteListing(item.id)}
                      aria-label="Xóa bài đăng"
                      className="text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : tab === 'reviews' ? (
          reviews.length === 0 ? (
            <EmptyState
              icon={<Star className="h-7 w-7" />}
              title="Chưa có đánh giá nào"
              description="Sau khi hoàn tất giao dịch với các sinh viên khác, đánh giá uy tín sẽ hiển thị ở đây."
            />
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => {
                const author = authService.getUserById(rev.authorId);
                return (
                  <Card key={rev.id} className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={author?.avatar} name={author?.name ?? 'Sinh viên'} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {author?.name ?? 'Sinh viên'}
                          </p>
                          <p className="text-xs text-slate-400">{formatRelativeTime(rev.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{rev.comment}</p>
                  </Card>
                );
              })}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs font-medium text-slate-500">Tổng bài đã đăng</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{myListings.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-medium text-slate-500">Tổng lượt xem bài</p>
              <p className="mt-1 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {myListings.reduce((sum, l) => sum + l.views, 0)}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-medium text-slate-500">Ngày tham gia</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {new Date(user.joinedAt).toLocaleDateString('vi-VN')}
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Chỉnh sửa hồ sơ sinh viên">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input label="Họ và tên" required value={editName} onChange={(e) => setEditName(e.target.value)} />
          <Input label="Trường đại học" value={editUniversity} onChange={(e) => setEditUniversity(e.target.value)} />
          <Input label="Ngành học / Khóa" value={editMajor} onChange={(e) => setEditMajor(e.target.value)} />
          <Input label="Khu vực thường giao dịch" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
          <Input
            label="URL Ảnh đại diện (Avatar)"
            value={editAvatar}
            onChange={(e) => setEditAvatar(e.target.value)}
            hint="Bạn có thể dùng link ảnh hoặc giữ nguyên avatar hiện tại."
          />
          <Textarea label="Giới thiệu ngắn" rows={3} value={editBio} onChange={(e) => setEditBio(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={savingProfile}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
