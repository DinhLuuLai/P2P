import { MOCK_LISTINGS, MOCK_USERS } from '../data/mockData';
import type {
  CreateListingPayload,
  Listing,
  ListingFilters,
  ListingStatus,
  PaginatedResult,
  User,
} from '../types';
import { readStorage, simulateNetwork, writeStorage } from './apiClient';
import { STORAGE_KEYS } from './storageKeys';

function getStoredListings(): Listing[] {
  const existing = readStorage<Listing[] | null>(STORAGE_KEYS.LISTINGS, null);
  if (!existing || existing.length === 0) {
    writeStorage(STORAGE_KEYS.LISTINGS, MOCK_LISTINGS);
    return MOCK_LISTINGS;
  }
  return existing;
}

function getStoredUsers(): User[] {
  return readStorage<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
}

export const listingService = {
  async getListings(filters: ListingFilters = {}): Promise<PaginatedResult<Listing>> {
    const all = getStoredListings().filter((item) => item.status === 'active');
    const users = getStoredUsers();

    const {
      query = '',
      categoryId = 'all',
      condition = 'all',
      listingType = 'all',
      minPrice,
      maxPrice,
      location = '',
      sortBy = 'newest',
      timeRange = 'all',
      page = 1,
      limit = 9,
    } = filters;

    const normalizedQuery = query.trim().toLowerCase();
    const now = Date.now();

    const filtered = all.filter((item) => {
      if (categoryId !== 'all' && item.categoryId !== categoryId) return false;
      if (condition !== 'all' && item.condition !== condition) return false;
      if (listingType !== 'all' && item.listingType !== listingType) return false;
      if (typeof minPrice === 'number' && item.price < minPrice) return false;
      if (typeof maxPrice === 'number' && item.price > maxPrice) return false;
      if (location && location !== 'all' && !item.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      if (timeRange !== 'all') {
        const createdMs = new Date(item.createdAt).getTime();
        const hoursDiff = (now - createdMs) / (1000 * 3600);
        if (timeRange === '24h' && hoursDiff > 24) return false;
        if (timeRange === '7d' && hoursDiff > 24 * 7) return false;
        if (timeRange === '30d' && hoursDiff > 24 * 30) return false;
      }

      if (normalizedQuery) {
        const seller = users.find((u) => u.id === item.sellerId);
        const haystack = [
          item.title,
          item.shortDescription,
          item.description,
          item.location,
          ...item.tags,
          seller?.name ?? '',
          seller?.username ?? '',
          seller?.university ?? '',
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return b.views + b.savedCount * 3 - (a.views + a.savedCount * 3);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return simulateNetwork({
      items,
      total,
      page: safePage,
      limit,
      totalPages,
    });
  },

  async getFeaturedListings(count = 4): Promise<Listing[]> {
    const all = getStoredListings().filter((item) => item.status === 'active' && item.isFeatured);
    return simulateNetwork(all.slice(0, count), 120);
  },

  async getLatestListings(count = 8): Promise<Listing[]> {
    const all = getStoredListings()
      .filter((item) => item.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return simulateNetwork(all.slice(0, count), 120);
  },

  async getListingById(id: string): Promise<Listing | null> {
    const all = getStoredListings();
    const found = all.find((item) => item.id === id) ?? null;
    if (found) {
      // Increment views lightly
      const updated = all.map((item) => (item.id === id ? { ...item, views: item.views + 1 } : item));
      writeStorage(STORAGE_KEYS.LISTINGS, updated);
    }
    return simulateNetwork(found, 150);
  },

  async getSimilarListings(listing: Listing, count = 4): Promise<Listing[]> {
    const all = getStoredListings().filter(
      (item) => item.id !== listing.id && item.status === 'active'
    );
    const sameCategory = all.filter((item) => item.categoryId === listing.categoryId);
    const others = all.filter((item) => item.categoryId !== listing.categoryId);
    return simulateNetwork([...sameCategory, ...others].slice(0, count), 120);
  },

  async getListingsBySeller(sellerId: string): Promise<Listing[]> {
    const all = getStoredListings().filter((item) => item.sellerId === sellerId);
    return simulateNetwork(
      all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      140
    );
  },

  async getListingsByIds(ids: string[]): Promise<Listing[]> {
    const all = getStoredListings();
    const idSet = new Set(ids);
    return simulateNetwork(
      all.filter((item) => idSet.has(item.id)),
      120
    );
  },

  async createListing(payload: CreateListingPayload, sellerId: string): Promise<Listing> {
    const all = getStoredListings();
    const nowIso = new Date().toISOString();
    const newListing: Listing = {
      id: `listing-${Date.now()}`,
      title: payload.title.trim(),
      shortDescription: payload.shortDescription.trim(),
      description: payload.description.trim(),
      price: payload.listingType === 'free' ? 0 : payload.price,
      isNegotiable: payload.isNegotiable,
      listingType: payload.listingType,
      categoryId: payload.categoryId,
      condition: payload.condition,
      images:
        payload.images.length > 0
          ? payload.images
          : ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80'],
      location: payload.location,
      sellerId,
      createdAt: nowIso,
      updatedAt: nowIso,
      views: 1,
      savedCount: 0,
      isFeatured: false,
      status: 'active',
      contactInfo: payload.contactInfo.trim(),
      tags: payload.tags ?? [],
    };
    const updated = [newListing, ...all];
    writeStorage(STORAGE_KEYS.LISTINGS, updated);
    return simulateNetwork(newListing, 320);
  },

  async updateListingStatus(id: string, status: ListingStatus): Promise<Listing | null> {
    const all = getStoredListings();
    let updatedItem: Listing | null = null;
    const next = all.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, status, updatedAt: new Date().toISOString() };
        return updatedItem;
      }
      return item;
    });
    writeStorage(STORAGE_KEYS.LISTINGS, next);
    return simulateNetwork(updatedItem, 150);
  },

  async deleteListing(id: string): Promise<void> {
    const all = getStoredListings();
    writeStorage(
      STORAGE_KEYS.LISTINGS,
      all.filter((item) => item.id !== id)
    );
    await simulateNetwork(undefined, 150);
  },

  getCategoryCounts(): Record<string, number> {
    const all = getStoredListings().filter((item) => item.status === 'active');
    return all.reduce<Record<string, number>>((acc, item) => {
      acc[item.categoryId] = (acc[item.categoryId] ?? 0) + 1;
      return acc;
    }, {});
  },
};
