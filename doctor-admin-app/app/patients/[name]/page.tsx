"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Calendar, Download, Pencil, Trash, Phone, MapPin, User } from "lucide-react"
import { AddVisitDialog } from "@/components/add-visit-dialog"
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from "docx"
import { saveAs } from "file-saver"

type Nullable<T> = T | null

interface Visit {
  id: string
  report_number?: number
  patient_name: string
  patient_age: Nullable<number>        // stores year of birth in your DB
  patient_phone: Nullable<string>
  patient_address: Nullable<string>
  gender: Nullable<string>
  visit_date: string                   // YYYY-MM-DD
  visit_type: Nullable<string>         // "Vizitë" | "Rivizitë"
  diagnosis: Nullable<string>
  treatment: Nullable<string>
  notes: Nullable<string>
  allergies: Nullable<string>
  symptoms: Nullable<string>
  examinimet: Nullable<string>
  cor: Nullable<string>
  pulmo: Nullable<string>
  created_at: string
}

function formatSq(dateStr?: string | null) {
  if (!dateStr) return ""
  const ymd = dateStr.slice(0, 10)
  const [y, m, d] = ymd.split("-").map(Number)
  const dt = new Date(y, (m || 1) - 1, d || 1)
  return dt.toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" })
}

export default function PatientDetailsPage({ params }: { params: { name: string } }) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [open, setOpen] = useState(false)
  const [editVisit, setEditVisit] = useState<Visit | null>(null)
  const name = decodeURIComponent(params.name)

  const latestFirst = useMemo(() => {
    return [...visits].sort((a, b) => {
      const da = a.visit_date ?? a.created_at
      const db = b.visit_date ?? b.created_at
      return db.localeCompare(da)
    })
  }, [visits])

  const header = latestFirst[0] // use most recent visit to display personal info at the top

  async function fetchVisits() {
    const res = await fetch(`/api/visits?patient=${encodeURIComponent(name)}`, { cache: "no-store" })
    const rows: Visit[] = res.ok ? await res.json() : []
    setVisits(rows)
  }

  useEffect(() => {
    fetchVisits()
  }, [name])

  const exportToWord = (visit: Visit) => {
    // Qamile format: full clinic header, then table with personal info + date, then sections
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "ORDINANCA INTERNISTIKE REUMATOLOGJIKE", bold: true, size: 28 })],
              alignment: "center",
            }),
            new Paragraph({
              children: [new TextRun({ text: "\"PRORHEUMA\"", italics: true, size: 26 })],
              alignment: "center",
            }),
            new Paragraph({ children: [new TextRun({ text: "PRISHTINË", size: 24 })], alignment: "center" }),
            new Paragraph(""),
            new Paragraph({
              children: [new TextRun({ text: "Mob: 044 - 259 - 016       049 - 673 - 820", size: 20 })],
              alignment: "center",
            }),
            new Paragraph({ children: [new TextRun({ text: "E-mail: dr.ismeti@hotmail.com", size: 20 })], alignment: "center" }),
            new Paragraph(""),
            new Paragraph({
              children: [new TextRun({ text: "Raport mjeksor", bold: true, size: 24 })],
              alignment: "center",
            }),
            new Paragraph(""),

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
                    new TableCell({ children: [new Paragraph(visit.patient_name ?? "")] }),
                    new TableCell({ children: [new Paragraph(visit.patient_age?.toString() ?? "")] }),
                    new TableCell({ children: [new Paragraph(visit.patient_address ?? "")] }),
                    new TableCell({ children: [new Paragraph(formatSq(visit.visit_date))] }),
                    new TableCell({ children: [new Paragraph(visit.allergies ?? "/")] }),
                    new TableCell({ children: [new Paragraph(visit.patient_phone ?? "")] }),
                  ],
                }),
              ],
            }),

            new Paragraph(""),
            new Paragraph({ children: [new TextRun({ text: `Anamneza: ${visit.symptoms ?? ""}`, size: 22 })] }),
            new Paragraph(""),
            new Paragraph({ children: [new TextRun({ text: `Examinimet: ${visit.examinimet ?? ""}`, size: 22 })] }) ,
            new Paragraph(""),
            new Paragraph({ children: [new TextRun({ text: `Cor: ${visit.cor ?? ""}`, size: 22 })] }),
            new Paragraph(""),
            new Paragraph({ children: [new TextRun({ text: `Pulmo: ${visit.pulmo ?? ""}`, size: 22 })] }),
            new Paragraph(""),
            new Paragraph({ children: [new TextRun({ text: `Diagnoza: ${visit.diagnosis ?? ""}`, size: 22 })] }),
            new Paragraph(""),
            new Paragraph({ children: [new TextRun({ text: `Therapia: ${visit.treatment ?? ""}`, size: 22 })] }),
            new Paragraph(""),
            new Paragraph({ children: [new TextRun({ text: `Shënime / Kontrollë: ${visit.notes ?? ""}`, size: 22 })] }),
            new Paragraph(""),

            new Paragraph({ children: [new TextRun({ text: "Prof.Asoc.Dr. Ismet H. Bajraktari", bold: true, size: 22 })], alignment: "right" }),
            new Paragraph({ children: [new TextRun({ text: "Internist-Reumatolog", size: 20 })], alignment: "right" }),
            new Paragraph({ children: [new TextRun({ text: "Nr i lic . KO-03342-01-04/4", size: 20 })], alignment: "right" }),
          ],
        },
      ],
    })

    Packer.toBlob(doc).then((blob: Blob) => {
      saveAs(blob, `Raport_${visit.patient_name}_${formatSq(visit.visit_date)}.docx`)
    })
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

      {/* ====== Personal Info (top card) ====== */}
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
          {header ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2"><User className="h-4 w-4" /> <b>Viti i lindjes:</b> {header.patient_age ?? "-"}</div>
                <div className="flex items-center gap-2"><User className="h-4 w-4" /> <b>Gjinia:</b> {header.gender ?? "-"}</div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> <b>Data e fundit:</b> {formatSq(header.visit_date) || "-"}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> <b>Telefoni:</b> {header.patient_phone ?? "-"}</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <b>Adresa:</b> {header.patient_address ?? "-"}</div>
                <div className="flex items-center gap-2"><User className="h-4 w-4" /> <b>Alergjitë:</b> {header.allergies ?? "-"}</div>
              </div>
              <div className="space-y-1">
                <div><b>Lloji i fundit:</b> {header.visit_type ?? "-"}</div>
                <div><b>Krijuar më:</b> {formatSq(header.created_at)}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm opacity-70">S’ka ende të dhëna personale — shto një vizitë.</div>
          )}
        </CardContent>
      </Card>

      {/* ====== Visits list ====== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vizitat</CardTitle>
        </CardHeader>
        <CardContent>
          {latestFirst.length === 0 ? (
            <div className="text-sm opacity-70">S’ka vizita për këtë pacient.</div>
          ) : (
            <div className="space-y-6">
              {latestFirst.map(v => (
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
                        <Download className="h-4 w-4 mr-1" /> Eksporto Word
                      </Button>
                    </div>
                  </div>

                  {/* full info per visit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1">
                      <div><b>Lloji:</b> {v.visit_type ?? "-"}</div>
                      <div><b>Diagnoza:</b> {v.diagnosis ?? "-"}</div>
                      <div><b>Therapia:</b> {v.treatment ?? "-"}</div>
                      <div><b>Shënime / Kontrollë:</b> {v.notes ?? "-"}</div>
                    </div>
                    <div className="space-y-1">
                      <div><b>Anamneza:</b> {v.symptoms ?? "-"}</div>
                      <div><b>Examinimet:</b> {v.examinimet ?? "-"}</div>
                      <div><b>Cor:</b> {v.cor ?? "-"}</div>
                      <div><b>Pulmo:</b> {v.pulmo ?? "-"}</div>
                    </div>
                  </div>

                  {/* personal snapshot on each card too, if you want */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-3 border-t">
                    <div><b>Tel:</b> {v.patient_phone ?? "-"}</div>
                    <div><b>Adresa:</b> {v.patient_address ?? "-"}</div>
                    <div><b>Alergjitë:</b> {v.allergies ?? "-"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Visit */}
      <AddVisitDialog open={open} onOpenChange={setOpen} prefilledPatient={{ patient_name: name }} />

      {/* Edit Visit */}
      {editVisit && (
        <AddVisitDialog
          open={!!editVisit}
          onOpenChange={() => setEditVisit(null)}
          prefilledPatient={editVisit}
          editingVisit={editVisit}
        />
      )}
    </div>
  )
}
