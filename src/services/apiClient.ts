/**
 * API Client Abstraction Layer
 * ----------------------------
 * Hiện tại sử dụng localStorage + mock delay để mô phỏng backend thật.
 * Khi kết nối Supabase / Firebase / REST API:
 * chỉ cần thay thế các hàm trong thư mục `src/services/` bằng fetch/SDK calls.
 */

export async function simulateNetwork<T>(data: T, delayMs = 220): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return data;
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors gracefully
  }
}
