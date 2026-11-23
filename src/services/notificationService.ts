import { MOCK_NOTIFICATIONS } from '../data/mockData';
import type { Notification } from '../types';
import { readStorage, simulateNetwork, writeStorage } from './apiClient';
import { STORAGE_KEYS } from './storageKeys';

function getStoredNotifications(): Notification[] {
  const existing = readStorage<Notification[] | null>(STORAGE_KEYS.NOTIFICATIONS, null);
  if (!existing || existing.length === 0) {
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    return MOCK_NOTIFICATIONS;
  }
  return existing;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const all = getStoredNotifications().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return simulateNetwork(all, 100);
  },

  markAsRead(id: string): Notification[] {
    const all = getStoredNotifications().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    return all;
  },

  markAllAsRead(): Notification[] {
    const all = getStoredNotifications().map((n) => ({ ...n, isRead: true }));
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    return all;
  },

  addNotification(notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification[] {
    const all = getStoredNotifications();
    const created: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    const next = [created, ...all];
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, next);
    return next;
  },
};
