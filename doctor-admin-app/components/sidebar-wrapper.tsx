// components/sidebar-wrapper.tsx
"use client"

import Sidebar from "@/components/sidebar"

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-background">{children}</main>
    </div>
  )
}
