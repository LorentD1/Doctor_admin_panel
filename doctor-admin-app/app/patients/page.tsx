"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { AddVisitDialog } from "@/components/add-visit-dialog"

type Patient = {
  id: string
  patient_name: string
  patient_age: number | null
  patient_phone: string | null
  patient_address: string | null
  gender: string | null
  allergies: string | null
  total_visits: number
  last_visit: string | null
}

function formatSq(dateStr: string | null) {
  if (!dateStr) return "-"
  const ymd = dateStr.slice(0, 10)
  const [y, m, d] = ymd.split("-").map(Number)
  const dt = new Date(y, (m || 1) - 1, d || 1)
  return dt.toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState("")
  const [openAddVisit, setOpenAddVisit] = useState(false)

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/patients", { cache: "no-store" })
      if (res.ok) {
        const rows: Patient[] = await res.json()

        // sort by last visit date (recent first)
        rows.sort((a, b) => {
          const da = a.last_visit ? new Date(a.last_visit).getTime() : 0
          const db = b.last_visit ? new Date(b.last_visit).getTime() : 0
          return db - da
        })

        setPatients(rows)
      }
    })()
  }, [])

  const filtered = patients.filter((p) =>
    p.patient_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Pacientët</h1>
          <Button onClick={() => setOpenAddVisit(true)}>
            <Plus className="mr-2 h-4 w-4" /> Shto vizitë
          </Button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Kërko pacient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left text-sm font-medium">
              <tr>
                <th className="py-2 px-3">Emri</th>
                <th className="py-2 px-3">Mosha</th>
                <th className="py-2 px-3">Telefoni</th>
                <th className="py-2 px-3">Adresa</th>
                <th className="py-2 px-3">Gjithsej vizita</th>
                <th className="py-2 px-3">Vizita e fundit</th>
                <th className="py-2 px-3">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-4 text-sm text-muted-foreground"
                  >
                    Nuk ka pacientë.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2 px-3">{p.patient_name}</td>
                    <td className="py-2 px-3">{p.patient_age ?? "-"}</td>
                    <td className="py-2 px-3">{p.patient_phone ?? "-"}</td>
                    <td className="py-2 px-3">{p.patient_address ?? "-"}</td>
                    <td className="py-2 px-3">{p.total_visits ?? 0}</td>
                    <td className="py-2 px-3">{formatSq(p.last_visit)}</td>
                    <td className="py-2 px-3">
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={`/patients/${encodeURIComponent(
                            p.patient_name
                          )}`}
                        >
                          Detaje
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Visit Dialog */}
      <AddVisitDialog open={openAddVisit} onOpenChange={setOpenAddVisit} />
    </div>
  )
}
