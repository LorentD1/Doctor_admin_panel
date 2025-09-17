"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type VisitForm = {
  id?: string
  patient_name: string
  patient_age: number | null
  patient_phone: string | null
  patient_address: string | null
  gender: string | null
  visit_date: string
  visit_type: string | null
  diagnosis: string | null
  symptoms: string | null
  treatment: string | null
  notes: string | null
  allergies: string | null
  examinimet: string | null
  cor: string | null
  pulmo: string | null
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  prefilledPatient?: Partial<VisitForm>
  editingVisit?: VisitForm | null
  onSaved?: () => Promise<void> | void
}

export function AddVisitDialog({ open, onOpenChange, prefilledPatient, editingVisit, onSaved }: Props) {
  const [form, setForm] = useState<VisitForm>({
    id: editingVisit?.id,
    patient_name: editingVisit?.patient_name || prefilledPatient?.patient_name || "",
    patient_age: editingVisit?.patient_age ?? prefilledPatient?.patient_age ?? null,
    patient_phone: editingVisit?.patient_phone ?? prefilledPatient?.patient_phone ?? null,
    patient_address: editingVisit?.patient_address ?? prefilledPatient?.patient_address ?? null,
    gender: editingVisit?.gender ?? prefilledPatient?.gender ?? null,
    visit_date: editingVisit?.visit_date || new Date().toISOString().slice(0, 10),
    visit_type: editingVisit?.visit_type ?? "Vizitë",
    diagnosis: editingVisit?.diagnosis ?? null,
    symptoms: editingVisit?.symptoms ?? null,
    treatment: editingVisit?.treatment ?? null,
    notes: editingVisit?.notes ?? null,
    allergies: editingVisit?.allergies ?? prefilledPatient?.allergies ?? null,
    examinimet: editingVisit?.examinimet ?? null,
    cor: editingVisit?.cor ?? null,
    pulmo: editingVisit?.pulmo ?? null,
  })

  const set = (k: keyof VisitForm, v: any) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async () => {
    if (!form.patient_name.trim()) {
      alert("Shkruaj emrin e pacientit.")
      return
    }
    if (!form.visit_date) {
      alert("Zgjedh datën e vizitës.")
      return
    }

    const res = await fetch("/api/visits", {
      method: editingVisit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const e = await res.json().catch(() => ({} as any))
      console.error("Failed to save visit:", e)
      alert("S’u ruajt vizita. Shiko konsolën.")
      return
    }

    onOpenChange(false)
    if (onSaved) await onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingVisit ? "Përditëso vizitën" : "Vizitë e re"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Emri i pacientit *</Label>
              <Input
                value={form.patient_name}
                onChange={e => set("patient_name", e.target.value)}
              />
            </div>
            <div>
              <Label>Mosha</Label>
              <Input
                type="number"
                value={form.patient_age ?? ""}
                onChange={e =>
                  set("patient_age", e.target.value ? parseInt(e.target.value) : null)
                }
              />
            </div>
            <div>
              <Label>Telefoni</Label>
              <Input
                value={form.patient_phone ?? ""}
                onChange={e => set("patient_phone", e.target.value)}
              />
            </div>
            <div>
              <Label>Adresa</Label>
              <Input
                value={form.patient_address ?? ""}
                onChange={e => set("patient_address", e.target.value)}
              />
            </div>
            <div>
              <Label>Gjinia</Label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.gender ?? ""}
                onChange={e => set("gender", e.target.value)}
              >
                <option value="">—</option>
                <option value="Mashkull">Mashkull</option>
                <option value="Femër">Femër</option>
              </select>
            </div>
          </div>

          {/* Visit Basics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data e vizitës *</Label>
              <Input
                type="date"
                value={form.visit_date}
                onChange={e => set("visit_date", e.target.value)}
              />
            </div>
            <div>
              <Label>Lloji i vizitës *</Label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.visit_type ?? ""}
                onChange={e => set("visit_type", e.target.value)}
              >
                <option value="Vizitë">Vizitë</option>
                <option value="Rivizitë">Rivizitë</option>
              </select>
            </div>
          </div>

          {/* Medical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Alergjitë</Label>
              <Textarea
                value={form.allergies ?? ""}
                onChange={e => set("allergies", e.target.value)}
              />
            </div>
            <div>
              <Label>Simptomat (Anamneza)</Label>
              <Textarea
                value={form.symptoms ?? ""}
                onChange={e => set("symptoms", e.target.value)}
              />
            </div>
            <div>
              <Label>Ekzaminimet</Label>
              <Textarea
                value={form.examinimet ?? ""}
                onChange={e => set("examinimet", e.target.value)}
              />
            </div>
            <div>
              <Label>Diagnoza</Label>
              <Textarea
                value={form.diagnosis ?? ""}
                onChange={e => set("diagnosis", e.target.value)}
              />
            </div>
            <div>
              <Label>Terapia</Label>
              <Textarea
                value={form.treatment ?? ""}
                onChange={e => set("treatment", e.target.value)}
              />
            </div>
            <div>
              <Label>Shënime / Kontrollë</Label>
              <Textarea
                value={form.notes ?? ""}
                onChange={e => set("notes", e.target.value)}
              />
            </div>
          </div>

          {/* Extra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cor</Label>
              <Input
                value={form.cor ?? ""}
                onChange={e => set("cor", e.target.value)}
              />
            </div>
            <div>
              <Label>Pulmo</Label>
              <Input
                value={form.pulmo ?? ""}
                onChange={e => set("pulmo", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={submit}>{editingVisit ? "Përditëso" : "Ruaj"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
