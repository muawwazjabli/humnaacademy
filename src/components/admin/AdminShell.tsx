"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  CalendarClock,
  DollarSign,
  FileText,
  MessageSquareQuote,
  HelpCircle,
  Images,
  Mail,
  Settings,
  ShieldCheck,
  History,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import { NightVisionToggle } from "@/components/NightVisionToggle";

interface NavItem {
  href: string;
  label: string;
  permission: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", permission: "dashboard", icon: LayoutDashboard },
  { href: "/admin/trial-requests", label: "Trial Requests", permission: "trialRequests", icon: CalendarClock },
  { href: "/admin/students", label: "Students", permission: "students", icon: GraduationCap },
  { href: "/admin/teachers", label: "Teachers", permission: "teachers", icon: Users },
  { href: "/admin/courses", label: "Courses", permission: "courses", icon: BookOpen },
  { href: "/admin/pricing", label: "Pricing Plans", permission: "pricing", icon: DollarSign },
  { href: "/admin/blogs", label: "Blog CMS", permission: "blogs", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", permission: "testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", permission: "faqs", icon: HelpCircle },
  { href: "/admin/gallery", label: "Gallery", permission: "gallery", icon: Images },
  { href: "/admin/messages", label: "Messages", permission: "messages", icon: Mail },
  { href: "/admin/website-settings", label: "Content & Settings", permission: "websiteContent", icon: Settings },
  { href: "/admin/users", label: "Admin Users", permission: "users", icon: ShieldCheck },
  { href: "/admin/activity-logs", label: "Activity Logs", permission: "activityLogs", icon: History },
];

export const AdminShell = ({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) => {
  const {
    admin,
    loading,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    can,
    logout,
    globalSearch,
    setGlobalSearch,
  } = useAdmin();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F5] dark:bg-[#061912] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-300">
          Verifying administrator session...
        </p>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const visibleNavItems = ADMIN_NAV_ITEMS.filter((item) => can(item.permission));

  const searchMatches =
    globalSearch.trim().length > 0
      ? visibleNavItems.filter((item) =>
          item.label.toLowerCase().includes(globalSearch.toLowerCase())
        )
      : [];

  const roleBadgeLabel =
    admin.role === "super_admin"
      ? "Super Admin"
      : admin.role === "admin"
      ? "Administrator"
      : "Content Editor";

  return (
    <div className="min-h-screen bg-[#F4F6F5] dark:bg-[#061912] flex text-gray-900 dark:text-gray-100">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#123F32] text-white flex flex-col border-r border-brand-gold/20 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white shrink-0 ring-2 ring-brand-gold/40">
              <Image
                src="/logo.jpg"
                alt="Humna Academy"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <span className="font-serif font-bold text-sm text-white block">Humna Academy</span>
                <span className="text-[10px] uppercase tracking-wider text-brand-gold font-semibold">
                  Admin Console
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-deep font-bold shadow-md"
                    : "text-brand-cream/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-brand-deep" : "text-brand-gold"}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Logout */}
        <div className="p-3 border-t border-white/10 space-y-2 shrink-0">
          {!collapsed && (
            <div className="px-3 py-2 rounded-xl bg-black/25 border border-white/10">
              <p className="text-xs font-bold text-white truncate">{admin.name}</p>
              <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider">
                {roleBadgeLabel}
              </p>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-200 border border-red-400/20 text-xs font-semibold transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#091E16]/95 backdrop-blur-md border-b border-gray-200 dark:border-emerald-900/50 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-emerald-800 text-gray-700 dark:text-gray-200"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search admin modules or filter current table..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-[#061912] border border-gray-200 dark:border-emerald-900/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              />

              {searchFocused && searchMatches.length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 rounded-xl shadow-xl py-1.5 z-50">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase text-gray-400">
                    Jump to Section
                  </p>
                  {searchMatches.map((m) => (
                    <button
                      key={m.href}
                      type="button"
                      onClick={() => {
                        setGlobalSearch("");
                        router.push(m.href);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-brand-cream/60 dark:hover:bg-emerald-900/40 flex items-center gap-2"
                    >
                      <m.icon className="w-3.5 h-3.5 text-brand-emerald dark:text-brand-gold" />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <NightVisionToggle compact />

            {/* View Live Site */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-emerald-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-emerald dark:text-brand-gold" />
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl border border-gray-200 dark:border-emerald-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-emerald-950/40"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-800 shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-emerald-900 flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm">
                      Notifications ({unreadCount} unread)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-emerald dark:text-brand-gold hover:underline"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-emerald-900/50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 15).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={async () => {
                            if (!notif.read) await markNotificationRead(notif.id);
                            setNotifOpen(false);
                            if (notif.link) router.push(notif.link);
                          }}
                          className={`w-full text-left p-3.5 hover:bg-gray-50 dark:hover:bg-emerald-950/40 transition-colors flex items-start gap-2.5 ${
                            !notif.read ? "bg-emerald-50/50 dark:bg-emerald-900/20" : ""
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              !notif.read ? "bg-brand-emerald" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {notif.createdAt
                                ? new Date(notif.createdAt).toLocaleString()
                                : ""}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Avatar */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-emerald-900">
              <div className="w-8 h-8 rounded-full bg-brand-deep text-brand-gold font-bold text-xs flex items-center justify-center border border-brand-gold/40">
                {admin.name?.slice(0, 2).toUpperCase() || "HA"}
              </div>
              <div className="text-left leading-tight">
                <p className="text-xs font-bold truncate max-w-[110px]">{admin.name}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{roleBadgeLabel}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                {title && (
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
};
