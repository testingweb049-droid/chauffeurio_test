import { AdminLayout } from "@/component/admin/AdminLayout";
import { ProtectedRoute } from "@/component/admin/ProtectedRoute";
import { AdminLayoutWrapper } from "@/component/admin/AdminLayoutWrapper";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}

