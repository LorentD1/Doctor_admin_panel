"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Calendar, Download, Pencil, Trash } from "lucide-react"
import { AddVisitDialog } from "@/components/add-visit-dialog"
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ImageRun,
} from "docx"
import { saveAs } from "file-saver"

interface Visit {
  id: string
  patient_name: string
  patient_age: number | null
  patient_phone: string | null
  patient_address: string | null
  gender: string | null
  visit_date: string
  visit_type: string | null
  diagnosis: string | null
  treatment: string | null
  notes: string | null
  allergies: string | null
  symptoms: string | null
  examinimet: string | null
  cor: string | null
  pulmo: string | null
  created_at: string
}

function formatSq(dateStr: string | null | undefined) {
  if (!dateStr) return ""
  const ymd = dateStr.slice(0, 10)
  const [y, m, d] = ymd.split("-").map(Number)
  const dt = new Date(y || 0, (m || 1) - 1, d || 1)
  return dt.toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" })
}

export default function PatientDetailsPage({ params }: { params: { name: string } }) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [open, setOpen] = useState(false)
  const [editVisit, setEditVisit] = useState<Visit | null>(null)
  const name = decodeURIComponent(params.name)

  async function fetchVisits() {
    const res = await fetch(`/api/visits?patient=${encodeURIComponent(name)}`, { cache: "no-store" })
    const rows: Visit[] = res.ok ? await res.json() : []
    setVisits(rows)
  }

  useEffect(() => {
    fetchVisits()
  }, [name])

  async function exportToWord(visit: Visit) {
    const [logoAb, signAb] = await Promise.all([
      fetch("/Picture1.png").then(r => r.arrayBuffer()),
      fetch("/Picture2.jpg").then(r => r.arrayBuffer()),
    ])
    const logoBytes = new Uint8Array(logoAb)
    const signBytes = new Uint8Array(signAb)

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: logoBytes as any,
                  transformation: { width: 120, height: 60 },
                } as any),
              ],
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph({ text: "", spacing: { after: 200 } }),
            new Paragraph({
              children: [new TextRun({ text: "ORDINANCA INTERNISTIKE REUMATOLOGJIKE", bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: `"PRORHEUMA"`, italics: true, size: 26 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: "PRISHTINË", size: 24 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "Mob: 044 - 259 - 016       049 - 673 - 820", size: 20 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: "E-mail: dr.ismeti@hotmail.com", size: 20 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "Raport mjeksor", bold: true, size: 26 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Emri e mbiemri")] }),
                    new TableCell({ children: [new Paragraph("Viti i lindjes")] }),
                    new TableCell({ children: [new Paragraph("Vendbanimi")] }),
                    new TableCell({ children: [new Paragraph("Data e vizitës")] }),
                    new TableCell({ children: [new Paragraph("Alergjitë")] }),
                    new TableCell({ children: [new Paragraph("Tel")] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(visit.patient_name || "")] }),
                    new TableCell({ children: [new Paragraph(visit.patient_age != null ? String(visit.patient_age) : "")] }),
                    new TableCell({ children: [new Paragraph(visit.patient_address || "")] }),
                    new TableCell({ children: [new Paragraph(formatSq(visit.visit_date || ""))] }),
                    new TableCell({ children: [new Paragraph(visit.allergies || "/")] }),
                    new TableCell({ children: [new Paragraph(visit.patient_phone || "")] }),
                  ],
                }),
              ],
            }),

            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: `Gjinia: ${visit.gender || ""}`, size: 22 })] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: `Anamneza: ${visit.symptoms || ""}`, size: 22 })] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: `Examinimet: ${visit.examinimet || ""}`, size: 22 })] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: `Cor: ${visit.cor || ""}`, size: 22 })] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: `Pulmo: ${visit.pulmo || ""}`, size: 22 })] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: `Diagnoza: ${visit.diagnosis || ""}`, size: 22 })] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: `Therapia: ${visit.treatment || ""}`, size: 22 })] }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: `Shënime / Kontrollë: ${visit.notes || ""}`, size: 22 })] }),
            new Paragraph({ text: "" }),

            new Paragraph({
              children: [new TextRun({ text: "Prof.Asoc.Dr. Ismet H. Bajraktari", bold: true, size: 22 })],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [new TextRun({ text: "Internist-Reumatolog", size: 20 })],
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              children: [new TextRun({ text: "Nr i lic . KO-03342-01-04/4", size: 20 })],
              alignment: AlignmentType.RIGHT,
            }),

            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: signBytes as any,
                  transformation: { width: 150, height: 80 },
                } as any),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `Raport_${visit.patient_name}_${formatSq(visit.visit_date || "")}.docx`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("A je i sigurt që dëshiron ta fshish këtë vizitë?")) return
    const res = await fetch(`/api/visits/${id}`, { method: "DELETE" })
    if (res.ok) {
      fetchVisits()
    } else {
      alert("Gabim gjatë fshirjes")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => (window.location.href = "/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kthehu
        </Button>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Vizitë e re
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            <span>{name}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {visits.length} {visits.length === 1 ? "vizitë" : "vizita"} gjithsej
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="text-sm opacity-70">S’ka vizita për këtë pacient.</div>
          ) : (
            <div className="space-y-6">
              {/* Show first visit's personal info */}
              {visits[0] && (
                <div className="border rounded-lg p-4 bg-muted/10">
                  <p><b>Mosha:</b> {visits[0].patient_age ?? "-"}</p>
                  <p><b>Gjinia:</b> {visits[0].gender ?? "-"}</p>
                  <p><b>Telefoni:</b> {visits[0].patient_phone ?? "-"}</p>
                  <p><b>Adresa:</b> {visits[0].patient_address ?? "-"}</p>
                  <p><b>Alergjitë:</b> {visits[0].allergies ?? "-"}</p>
                </div>
              )}

              {visits.map(v => (
                <div key={v.id} className="border rounded-lg p-6 space-y-4 bg-muted/20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" /> {formatSq(v.visit_date)}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditVisit(v)}>
                        <Pencil className="h-4 w-4 mr-1" /> Edito
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(v.id)}>
                        <Trash className="h-4 w-4 mr-1" /> Fshij
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => exportToWord(v)}>
                        <Download className="h-4 w-4 mr-1" /> Eksporto
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div><b>Diagnoza:</b> {v.diagnosis}</div>
                    <div><b>Therapia:</b> {v.treatment}</div>
                    <div><b>Shënime:</b> {v.notes}</div>
                    <div><b>Anamneza:</b> {v.symptoms}</div>
                    <div><b>Examinimet:</b> {v.examinimet}</div>
                    <div><b>Cor:</b> {v.cor}</div>
                    <div><b>Pulmo:</b> {v.pulmo}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddVisitDialog
        open={open}
        onOpenChange={setOpen}
        prefilledPatient={{ patient_name: name }}
        onSaved={fetchVisits}
      />

      {editVisit && (
        <AddVisitDialog
          open={!!editVisit}
          onOpenChange={() => setEditVisit(null)}
          prefilledPatient={editVisit}
          editingVisit={editVisit}
          onSaved={fetchVisits}
        />
      )}
    </div>
  )
}
