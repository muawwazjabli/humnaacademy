import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/AdminContext";

export const metadata: Metadata = {
  title: "Admin Console | Humna Academy",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
