import { useState } from 'react';
import { Bell, Bookmark, CheckCheck, Info, MessageCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/StateViews';
import { Tabs } from '../components/ui/Tabs';
import { useApp } from '../context/AppContext';
import type { NotificationType } from '../types';
import { cn, formatRelativeTime } from '../utils/format';

export function NotificationsPage() {
  const { notifications, unreadNotificationsCount, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  const displayed = filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case 'save':
        return <Bookmark className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case 'interaction':
        return <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Info className="h-5 w-5 text-sky-600 dark:text-sky-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Thông báo
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Bạn có {unreadNotificationsCount} thông báo chưa đọc
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
            leftIcon={<CheckCheck className="h-4 w-4" />}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <div className="mb-5">
        <Tabs
          activeId={filter}
          onChange={(id) => setFilter(id as 'all' | 'unread')}
          items={[
            { id: 'all', label: 'Tất cả', count: notifications.length },
            { id: 'unread', label: 'Chưa đọc', count: unreadNotificationsCount },
          ]}
        />
      </div>

      {displayed.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-7 w-7" />}
          title="Không có thông báo nào"
          description={
            filter === 'unread'
              ? 'Bạn đã đọc hết tất cả thông báo mới.'
              : 'Mọi cập nhật về tin nhắn và bài đăng sẽ hiển thị tại đây.'
          }
        />
      ) : (
        <div className="space-y-3">
          {displayed.map((notif) => (
            <Card
              key={notif.id}
              hoverable
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.link) navigate(notif.link);
              }}
              className={cn(
                'flex cursor-pointer items-start gap-4 p-4',
                !notif.isRead && 'border-indigo-200 bg-indigo-50/40 dark:border-indigo-800/70 dark:bg-indigo-950/20'
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs dark:bg-slate-800">
                {getIcon(notif.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h2>
                  {!notif.isRead && (
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" aria-label="Chưa đọc" />
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notif.description}</p>
                <span className="mt-2 block text-xs text-slate-400">{formatRelativeTime(notif.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
