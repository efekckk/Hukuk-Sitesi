"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  HelpCircle,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Briefcase,
  Layers,
  SlidersHorizontal,
  Info,
  Heart,
  Phone,
  BarChart3,
  Quote,
  Megaphone,
  Bell,
  Tag,
  UserCog,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "./admin-dark-wrapper";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface SidebarGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: SidebarLink[];
}

type SidebarItem = SidebarLink | SidebarGroup;

function isGroup(item: SidebarItem): item is SidebarGroup {
  return "children" in item;
}

// Items visible only to SUPER_ADMIN (top-level hrefs or group labels)
const SUPER_ADMIN_ONLY_HREFS = new Set([
  "/admin/uzmanlik-alanlari",
  "/admin/ekip",
  "/admin/kullanicilar",
  "/admin/ayarlar",
]);
const SUPER_ADMIN_ONLY_GROUP_LABELS = new Set(["Sayfalar"]);

function buildSidebarItems(
  unreadCount: number,
  isSuperAdmin: boolean,
  role: string
): SidebarItem[] {
  const isEditor = role === "EDITOR";

  const all: SidebarItem[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      label: "Sayfalar",
      icon: Layers,
      children: [
        { href: "/admin/sayfalar/slider", label: "Slider", icon: SlidersHorizontal },
        { href: "/admin/sayfalar/hakkimizda", label: "Hakkımızda", icon: Info },
        { href: "/admin/sayfalar/degerlerimiz", label: "Değerlerimiz", icon: Heart },
        { href: "/admin/sayfalar/iletisim", label: "İletişim", icon: Phone },
        { href: "/admin/sayfalar/istatistikler", label: "İstatistikler", icon: BarChart3 },
        // Referanslar gizlendi — public sitede kullanılmıyor
        // { href: "/admin/sayfalar/referanslar", label: "Referanslar", icon: Quote },
        { href: "/admin/sayfalar/cta", label: "CTA Bloğu", icon: Megaphone },
        { href: "/admin/sayfalar/popup", label: "Popup Bildirimi", icon: Bell },
      ],
    },
    {
      label: "Blog",
      icon: FileText,
      children: [
        { href: "/admin/yazilar", label: "Yazılar", icon: FileText },
        { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderOpen },
        { href: "/admin/etiketler", label: "Etiketler", icon: Tag },
      ],
    },
    { href: "/admin/uzmanlik-alanlari", label: "Uzmanlık Alanları", icon: Briefcase },
    { href: "/admin/ekip", label: "Ekip", icon: Users },
    { href: "/admin/sss", label: "SSS", icon: HelpCircle },
    { href: "/admin/mesajlar", label: "Mesajlar", icon: MessageSquare, badge: unreadCount },
    { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: UserCog },
    ...(isSuperAdmin ? [{ href: "/admin/aktivite-log", label: "Aktivite Logu", icon: History }] : []),
    { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
  ];

  if (!isEditor) return all;

  // Filter out SUPER_ADMIN-only items for editors
  return all.filter((item) => {
    if (isGroup(item)) return !SUPER_ADMIN_ONLY_GROUP_LABELS.has(item.label);
    return !SUPER_ADMIN_ONLY_HREFS.has(item.href);
  });
}

function SidebarLinkItem({ link, pathname }: { link: SidebarLink; pathname: string }) {
  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1">{link.label}</span>
      {link.badge != null && link.badge > 0 && (
        <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
          {link.badge}
        </span>
      )}
    </Link>
  );
}

function SidebarGroupItem({ group, pathname }: { group: SidebarGroup; pathname: string }) {
  const isChildActive = group.children.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + "/")
  );
  const [open, setOpen] = useState(isChildActive);
  const Icon = group.icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isChildActive
            ? "text-white"
            : "text-white/70 hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
          {group.children.map((child) => {
            const isActive = pathname === child.href || pathname.startsWith(child.href + "/");
            const ChildIcon = child.icon;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <ChildIcon className="h-4 w-4 shrink-0" />
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface AdminSidebarProps {
  unreadCount?: number;
  isSuperAdmin?: boolean;
  role?: string;
  userName?: string;
}

export function AdminSidebar({ unreadCount = 0, isSuperAdmin = false, role = "EDITOR", userName = "" }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isDark, toggle } = useDarkMode();

  const initial = userName ? userName.charAt(0).toUpperCase() : "A";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-primary-dark text-white">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <span className="text-base font-bold tracking-wide text-white">Admin Panel</span>
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          title={isDark ? "Açık Mod" : "Koyu Mod"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {buildSidebarItems(unreadCount, isSuperAdmin, role).map((item) => {
          if (isGroup(item)) {
            return <SidebarGroupItem key={item.label} group={item} pathname={pathname} />;
          }
          return <SidebarLinkItem key={item.href} link={item} pathname={pathname} />;
        })}
      </nav>

      {/* Footer — avatar + çıkış */}
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/giris" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white">
            {initial}
          </span>
          <span>Çıkış Yap</span>
          <LogOut className="ml-auto h-4 w-4 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
