// components/patient-details-page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { AddVisitDialog } from "@/components/add-visit-dialog"

interface Visit {
  id: number
  patient_name: string
  patient_age: number | null
  patient_phone: string | null
  patient_address: string | null
  gender: string | null
  visit_date: string
  visit_type: string | null
  allergies: string | null
  symptoms: string | null
  examinimet: string | null
  diagnosis: string | null
  treatment: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export default function PatientDetailsPage({ params }: { params: { name: string } }) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [open, setOpen] = useState(false)
  const patientName = decodeURIComponent(params.name)

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/visits", { cache: "no-store" })
      const rows: Visit[] = res.ok ? await res.json() : []
      setVisits(rows.filter(r => r.patient_name === patientName))
    }
    load()
  }, [patientName])

  const latest = useMemo(
    () => visits.toSorted((a, b) => +new Date(b.created_at) - +new Date(a.created_at))[0],
    [visits]
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => (window.location.href = "/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kthehu
        </Button>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Vizitë e re</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>{patientName}</CardTitle></CardHeader>
        <CardContent>
          {latest ? (
            <div className="space-y-2 text-sm">
              <div><b>Data:</b> {latest.visit_date}</div>
              {latest.diagnosis && <div><b>Diagnoza:</b> {latest.diagnosis}</div>}
              {latest.treatment && <div><b>Terapia:</b> {latest.treatment}</div>}
              {latest.notes && <div><b>Shënime:</b> {latest.notes}</div>}
            </div>
          ) : (
            <div className="text-sm opacity-70">S’ka vizita për këtë pacient.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historiku i vizitave</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {visits.length === 0 && <div className="text-sm opacity-70">Asgjë për të shfaqur.</div>}
          {visits.map(v => (
            <div key={v.id} className="border rounded-lg p-3">
              <div className="text-sm"><b>{v.visit_date}</b> — {v.visit_type ?? "Vizitë"}</div>
              {v.symptoms && <div className="text-xs opacity-80 mt-1">{v.symptoms}</div>}
            </div>
          ))}
        </CardContent>
      </Card>

      <AddVisitDialog
        open={open}
        onOpenChange={setOpen}
        prefilledPatient={
          latest
            ? {
                id: String(latest.id),
                patient_name: latest.patient_name,
                patient_age: latest.patient_age,
                patient_phone: latest.patient_phone,
                patient_address: latest.patient_address,
                patient_gender: latest.gender, // ✅ mapped correctly
                visit_date: latest.visit_date,
                total_visits_for_patient: 0,
                diagnosis: null,
                status: "ok",
                created_at: latest.created_at,
              }
            : undefined
        }
      />
    </div>
  )
}
