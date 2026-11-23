import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService, type LoginPayload, type RegisterPayload } from '../services/authService';
import { readStorage, writeStorage } from '../services/apiClient';
import { chatService } from '../services/chatService';
import { notificationService } from '../services/notificationService';
import { STORAGE_KEYS } from '../services/storageKeys';
import type { Notification, User } from '../types';
import { useToast } from './ToastContext';

interface AppContextValue {
  user: User | null;
  savedIds: string[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  isSaved: (listingId: string) => boolean;
  toggleSaveListing: (listingId: string) => void;
  login: (payload: LoginPayload) => Promise<User>;
  loginDemo: () => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => Promise<User>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  refreshCounts: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.SAVED_IDS, ['listing-2', 'listing-5'])
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

  const refreshCounts = useCallback(async () => {
    const notifs = await notificationService.getNotifications();
    setNotifications(notifs);
    if (user) {
      const convs = await chatService.getConversations(user.id);
      const unread = convs.reduce((sum, c) => sum + c.unreadCount, 0);
      setUnreadMessagesCount(unread);
    } else {
      setUnreadMessagesCount(0);
    }
  }, [user]);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  const isSaved = useCallback((listingId: string) => savedIds.includes(listingId), [savedIds]);

  const toggleSaveListing = useCallback(
    (listingId: string) => {
      setSavedIds((prev) => {
        const exists = prev.includes(listingId);
        const next = exists ? prev.filter((id) => id !== listingId) : [listingId, ...prev];
        writeStorage(STORAGE_KEYS.SAVED_IDS, next);
        showToast(exists ? 'Đã bỏ lưu bài đăng' : 'Đã lưu vào danh sách yêu thích', exists ? 'info' : 'success');
        return next;
      });
    },
    [showToast]
  );

  const login = async (payload: LoginPayload) => {
    const loggedIn = await authService.login(payload);
    setUser(loggedIn);
    showToast(`Chào mừng ${loggedIn.name} quay lại!`, 'success');
    return loggedIn;
  };

  const loginDemo = async () => {
    const loggedIn = await authService.loginDemo();
    setUser(loggedIn);
    showToast(`Đã đăng nhập nhanh với tài khoản ${loggedIn.name}`, 'success');
    return loggedIn;
  };

  const register = async (payload: RegisterPayload) => {
    const created = await authService.register(payload);
    setUser(created);
    showToast('Tạo tài khoản Student P2P thành công!', 'success');
    return created;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    showToast('Bạn đã đăng xuất tài khoản.', 'info');
  };

  const updateProfile = async (patch: Partial<User>) => {
    if (!user) throw new Error('Chưa đăng nhập');
    const updated = await authService.updateProfile(user.id, patch);
    setUser(updated);
    showToast('Cập nhật hồ sơ thành công!', 'success');
    return updated;
  };

  const markNotificationRead = (id: string) => {
    const updated = notificationService.markAsRead(id);
    setNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
    showToast('Đã đánh dấu tất cả thông báo là đã đọc', 'info');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        user,
        savedIds,
        notifications,
        unreadNotificationsCount,
        unreadMessagesCount,
        isSaved,
        toggleSaveListing,
        login,
        loginDemo,
        register,
        logout,
        updateProfile,
        markNotificationRead,
        markAllNotificationsRead,
        refreshCounts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
