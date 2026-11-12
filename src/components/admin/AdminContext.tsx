"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminRole, AdminUser, NotificationRecord } from "@/types";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  loading: boolean;
  notifications: NotificationRecord[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  can: (moduleName: string) => boolean;
  logout: () => Promise<void>;
  showToast: (type: ToastType, message: string) => void;
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
}

const ROLE_MODULES: Record<AdminRole, string[]> = {
  super_admin: [
    "dashboard",
    "courses",
    "students",
    "teachers",
    "trialRequests",
    "pricing",
    "blogs",
    "testimonials",
    "faqs",
    "gallery",
    "messages",
    "websiteContent",
    "settings",
    "users",
    "activityLogs",
    "notifications",
    "upload",
  ],
  admin: [
    "dashboard",
    "courses",
    "students",
    "teachers",
    "trialRequests",
    "pricing",
    "blogs",
    "testimonials",
    "faqs",
    "gallery",
    "messages",
    "websiteContent",
    "notifications",
    "activityLogs",
    "upload",
  ],
  editor: [
    "dashboard",
    "blogs",
    "testimonials",
    "faqs",
    "gallery",
    "websiteContent",
    "notifications",
    "upload",
  ],
};

const AdminContext = createContext<AdminContextType>({
  admin: null,
  loading: true,
  notifications: [],
  unreadCount: 0,
  refreshNotifications: async () => {},
  markNotificationRead: async () => {},
  markAllNotificationsRead: async () => {},
  can: () => false,
  logout: async () => {},
  showToast: () => {},
  globalSearch: "",
  setGlobalSearch: () => {},
});

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/resource/notifications", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.items || []);
      }
    } catch {
      // ignore polling hiccups
    }
  }, []);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/auth/me", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) {
            setAdmin(null);
            router.replace(`/admin/login?redirect=${encodeURIComponent(pathname || "/admin/dashboard")}`);
          }
          return;
        }
        const data = await res.json();
        if (!cancelled && data.admin) {
          setAdmin(data.admin);
          refreshNotifications();
        }
      } catch {
        if (!cancelled) {
          router.replace("/admin/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, refreshNotifications]);

  // Poll notifications every 30s while authenticated
  useEffect(() => {
    if (!admin) return;
    const timer = setInterval(refreshNotifications, 30000);
    return () => clearInterval(timer);
  }, [admin, refreshNotifications]);

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await fetch("/api/admin/resource/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/admin/resource/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markAllRead" }),
    });
    showToast("success", "All notifications marked as read.");
  };

  const can = useCallback(
    (moduleName: string) => {
      if (!admin || !admin.active) return false;
      if (admin.role === "super_admin") return true;
      if (moduleName === "users" || moduleName === "settings") return false;
      if (admin.permissions && admin.permissions.length > 0) {
        return (
          admin.permissions.includes(moduleName) ||
          moduleName === "dashboard" ||
          moduleName === "notifications"
        );
      }
      return (ROLE_MODULES[admin.role] || []).includes(moduleName);
    },
    [admin]
  );

  const logout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      setAdmin(null);
      router.replace("/admin/login");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        notifications,
        unreadCount,
        refreshNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        can,
        logout,
        showToast,
        globalSearch,
        setGlobalSearch,
      }}
    >
      {children}

      {/* Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-fadeIn ${
              toast.type === "success"
                ? "bg-emerald-950/95 border-emerald-500/40 text-emerald-50"
                : toast.type === "error"
                ? "bg-red-950/95 border-red-500/40 text-red-50"
                : "bg-gray-900/95 border-brand-gold/40 text-white"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            )}
            <p className="text-xs sm:text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-white/60 hover:text-white shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
