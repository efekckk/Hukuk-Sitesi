/**
 * Admin panel ortak sabitler.
 * Tüm admin componentleri buradan import eder — hardcode tekrar yok.
 */

// ── Mesaj durumları ──────────────────────────────────────────────
export const MESSAGE_STATUSES = ["UNREAD", "READ", "REPLIED", "ARCHIVED"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  UNREAD: "Okunmadı",
  READ: "Okundu",
  REPLIED: "Yanıtlandı",
  ARCHIVED: "Arşivlendi",
};

export const MESSAGE_STATUS_CLASSES: Record<MessageStatus, string> = {
  UNREAD: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  READ: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  REPLIED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  ARCHIVED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
};

// ── Roller ───────────────────────────────────────────────────────
export const ADMIN_ROLES = ["EDITOR", "SUPER_ADMIN"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  EDITOR: "Editör",
  SUPER_ADMIN: "Süper Admin",
};

// ── Audit log ────────────────────────────────────────────────────
export const AUDIT_ACTION_LABELS: Record<string, { label: string; color: string }> = {
  CREATE: { label: "Oluşturma", color: "text-green-600 dark:text-green-400" },
  UPDATE: { label: "Güncelleme", color: "text-blue-600 dark:text-blue-400" },
  DELETE: { label: "Silme", color: "text-red-600 dark:text-red-400" },
};

export const AUDIT_ENTITY_LABELS: Record<string, string> = {
  BlogPost: "Blog Yazısı",
  Category: "Kategori",
  Tag: "Etiket",
  FaqItem: "SSS",
  ContactSubmission: "Mesaj",
  HeroSlide: "Slider",
  PracticeArea: "Hizmet Alanı",
  TeamMember: "Ekip Üyesi",
  Testimonial: "Referans",
  Value: "Değer",
  Popup: "Popup",
  PageContent: "Sayfa İçeriği",
  SiteSetting: "Site Ayarı",
  AdminUser: "Kullanıcı",
};

// ── Popup tipleri ─────────────────────────────────────────────────
export const POPUP_TYPES = ["modal", "banner"] as const;
export type PopupType = (typeof POPUP_TYPES)[number];

export const POPUP_TYPE_LABELS: Record<PopupType, string> = {
  modal: "Modal (Ortalanmış)",
  banner: "Banner (Üst Bar)",
};

// ── Settings grup etiketleri ──────────────────────────────────────
export const SETTINGS_GROUP_LABELS: Record<string, string> = {
  general: "Genel",
  contact: "İletişim",
  social: "Sosyal Medya",
  seo: "SEO",
  appearance: "Görünüm",
  stats: "İstatistikler",
  cta: "CTA",
};

// ── İkon seti (tüm admin componentleri için ortak) ────────────────
export const ADMIN_ICON_NAMES = [
  "Shield", "Heart", "Briefcase", "Building2", "Landmark", "Home",
  "Award", "BookOpen", "Scale", "Users", "Star", "Target", "Lightbulb",
  "Gavel", "Lock", "TrendingUp", "Truck", "Globe", "FileText", "Handshake",
] as const;
export type AdminIconName = (typeof ADMIN_ICON_NAMES)[number];

// ── Doğrulama sabitleri ───────────────────────────────────────────
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  REPLY_MIN_LENGTH: 10,
  SETTINGS_PREVIEW_LENGTH: 100,
} as const;

// ── Pagination ────────────────────────────────────────────────────
export const PAGINATION = {
  POSTS_PER_PAGE: 20,
  AUDIT_LOGS_PER_PAGE: 30,
  DASHBOARD_RECENT_ITEMS: 5,
} as const;
