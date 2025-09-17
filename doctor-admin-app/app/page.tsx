// app/page.tsx
"use client"

import { useEffect, useState } from "react"
import SidebarWrapper from "@/components/sidebar-wrapper"
import { Button } from "@/components/ui/button"

type Visit = {
  id: string
  patient_name: string
  visit_date: string
}

function formatSq(dateStr: string | null | undefined) {
  if (!dateStr) return ""
  const ymd = dateStr.slice(0, 10)
  const [y, m, d] = ymd.split("-").map(Number)
  const dt = new Date(y, (m || 1) - 1, d || 1)
  return dt.toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function HomePage() {
  const [stats, setStats] = useState<{ totalPatients: number; totalVisits: number; todayVisits: number }>({
    totalPatients: 0,
    totalVisits: 0,
    todayVisits: 0,
  })
  const [latest, setLatest] = useState<Visit[]>([])

  useEffect(() => {
    ;(async () => {
      const s = await fetch("/api/stats", { cache: "no-store" }).then(r => r.json())
      setStats(s)
      const v = await fetch("/api/visits?limit=10", { cache: "no-store" }).then(r => r.json())
      setLatest(v)
    })().catch(console.error)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <SidebarWrapper>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Ballina</h1>
          <p className="text-muted-foreground">Mirësevini Dr. Ismet Bajraktari</p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          Dil (Logout)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Pacientë gjithsej</h2>
          <p className="text-2xl font-bold">{stats.totalPatients ?? 0}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Vizita gjithsej</h2>
          <p className="text-2xl font-bold">{stats.totalVisits ?? 0}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Vizita sot</h2>
          <p className="text-2xl font-bold">{stats.todayVisits ?? 0}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Vizitat e fundit</h2>
        {latest.length === 0 ? (
          <div className="text-sm text-muted-foreground">S’ka vizita.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-sm text-muted-foreground border-b">
                <th className="text-left py-2">Emri</th>
                <th className="text-left py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {latest.map(v => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="py-2">{v.patient_name}</td>
                  <td className="py-2">{formatSq(v.visit_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SidebarWrapper>
  )
}
