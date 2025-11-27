"use client";

import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

