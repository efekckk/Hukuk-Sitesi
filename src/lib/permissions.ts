import { prisma } from "./prisma";

type Resource =
  | "blog"
  | "categories"
  | "tags"
  | "messages"
  | "faq"
  | "hero-slides"
  | "practice-areas"
  | "team"
  | "testimonials"
  | "values"
  | "popups"
  | "page-content"
  | "settings"
  | "admin-users"
  | "audit-logs"
  | "upload";

// EDITOR'ün erişebildiği kaynaklar
const EDITOR_ALLOWED: Resource[] = [
  "blog",
  "categories",
  "tags",
  "messages",
  "faq",
  "upload",
];

/**
 * Kullanıcının belirli bir kaynağa yazma (POST/PUT/DELETE) erişimi olup olmadığını kontrol eder.
 * GET istekleri bu kontrolden muaftır (herkes okuyabilir).
 */
export function canAccess(role: string, resource: Resource): boolean {
  if (role === "SUPER_ADMIN") return true;
  return EDITOR_ALLOWED.includes(resource);
}

/**
 * Session'dan kullanıcı rolünü getirir.
 */
export async function getUserRole(userId: string): Promise<string | null> {
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role ?? null;
}
