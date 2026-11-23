import { MOCK_REVIEWS, MOCK_USERS } from '../data/mockData';
import type { Review, User } from '../types';
import { readStorage, simulateNetwork, writeStorage } from './apiClient';
import { STORAGE_KEYS } from './storageKeys';

function getStoredUsers(): User[] {
  const existing = readStorage<User[] | null>(STORAGE_KEYS.USERS, null);
  if (!existing || existing.length === 0) {
    writeStorage(STORAGE_KEYS.USERS, MOCK_USERS);
    return MOCK_USERS;
  }
  return existing;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  university?: string;
}

export const authService = {
  getCurrentUser(): User | null {
    return readStorage<User | null>(STORAGE_KEYS.AUTH_USER, null);
  },

  getUserById(userId: string): User | null {
    const users = getStoredUsers();
    return users.find((u) => u.id === userId) ?? null;
  },

  getAllUsers(): User[] {
    return getStoredUsers();
  },

  async login(payload: LoginPayload): Promise<User> {
    const email = payload.email.trim().toLowerCase();
    if (!email || !payload.password || payload.password.length < 6) {
      throw new Error('Email hoặc mật khẩu không hợp lệ (tối thiểu 6 ký tự).');
    }

    const users = getStoredUsers();
    const matched = users.find((u) => u.email.toLowerCase() === email) ?? users[0];

    // Never store plain-text password in storage; store sanitized session user + mock token
    const sessionUser: User = { ...matched };
    writeStorage(STORAGE_KEYS.AUTH_USER, sessionUser);
    writeStorage(STORAGE_KEYS.AUTH_TOKEN, `mock-jwt-${sessionUser.id}-${Date.now()}`);

    return simulateNetwork(sessionUser, 350);
  },

  async loginDemo(): Promise<User> {
    const users = getStoredUsers();
    const demoUser = users[0];
    writeStorage(STORAGE_KEYS.AUTH_USER, demoUser);
    writeStorage(STORAGE_KEYS.AUTH_TOKEN, `mock-jwt-demo-${Date.now()}`);
    return simulateNetwork(demoUser, 200);
  },

  async register(payload: RegisterPayload): Promise<User> {
    const users = getStoredUsers();
    const email = payload.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error('Email này đã được đăng ký tài khoản.');
    }

    const cleanUsername = payload.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: payload.name.trim(),
      username: cleanUsername || `sv_${Date.now().toString().slice(-4)}`,
      email,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(payload.name)}&backgroundColor=c7d2fe`,
      university: payload.university?.trim() || 'Đại học Quốc gia',
      major: 'Sinh viên',
      location: 'TP.HCM',
      bio: 'Thành viên mới của cộng đồng Student P2P.',
      rating: 5.0,
      reviewCount: 0,
      joinedAt: new Date().toISOString(),
      verifiedStudent: false,
      contactHandle: 'Nhắn tin trực tiếp qua Student P2P',
    };

    const nextUsers = [newUser, ...users];
    writeStorage(STORAGE_KEYS.USERS, nextUsers);
    writeStorage(STORAGE_KEYS.AUTH_USER, newUser);
    writeStorage(STORAGE_KEYS.AUTH_TOKEN, `mock-jwt-${newUser.id}-${Date.now()}`);

    return simulateNetwork(newUser, 350);
  },

  async requestPasswordReset(email: string): Promise<void> {
    if (!email.includes('@')) {
      throw new Error('Vui lòng nhập địa chỉ email hợp lệ.');
    }
    await simulateNetwork(undefined, 300);
  },

  async updateProfile(userId: string, patch: Partial<User>): Promise<User> {
    const users = getStoredUsers();
    let updated: User | null = null;
    const nextUsers = users.map((u) => {
      if (u.id === userId) {
        updated = { ...u, ...patch };
        return updated;
      }
      return u;
    });
    if (!updated) throw new Error('Không tìm thấy người dùng.');

    writeStorage(STORAGE_KEYS.USERS, nextUsers);
    const current = this.getCurrentUser();
    if (current?.id === userId) {
      writeStorage(STORAGE_KEYS.AUTH_USER, updated);
    }
    return simulateNetwork(updated, 250);
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getUserReviews(userId: string): Review[] {
    const all = readStorage<Review[]>(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
    return all.filter((r) => r.targetUserId === userId);
  },
};
