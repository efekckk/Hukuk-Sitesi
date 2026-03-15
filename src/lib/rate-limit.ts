/**
 * In-memory rate limiter — Edge/Node uyumlu, Redis gerektirmez.
 * Production'da birden fazla instance varsa Redis'e geçirilmeli.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Eski kayıtları periyodik temizle (bellek sızıntısı önlemi)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 60_000);
}

export interface RateLimitConfig {
  /** Pencere süresi (ms) */
  windowMs: number;
  /** Pencere içinde izin verilen maksimum istek */
  max: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * IP bazlı rate limit kontrolü.
 * @param key   — IP adresi veya benzersiz tanımlayıcı
 * @param config — windowMs ve max değerleri
 */
export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // Yeni pencere başlat
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { success: true, remaining: config.max - 1, resetAt: now + config.windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, config.max - entry.count);
  const success = entry.count <= config.max;
  return { success, remaining, resetAt: entry.resetAt };
}

/**
 * NextRequest'ten IP adresini çıkarır.
 * Nginx arkasında x-real-ip tercih edilir.
 */
export function getIp(request: Request): string {
  const headers = new Headers((request as Request).headers);
  return (
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

// Hazır konfigürasyonlar
export const RATE_LIMITS = {
  /** Public arama — 30 istek/dk */
  search: { windowMs: 60_000, max: 30 },
  /** Public GET listeler — 60 istek/dk */
  publicList: { windowMs: 60_000, max: 60 },
  /** Auth giriş — 10 deneme/15dk */
  auth: { windowMs: 15 * 60_000, max: 10 },
  /** İletişim formu — 5 istek/15dk (mevcut) */
  contact: { windowMs: 15 * 60_000, max: 5 },
} as const;
