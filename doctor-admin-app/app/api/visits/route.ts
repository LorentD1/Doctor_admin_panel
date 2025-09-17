import { NextResponse } from "next/server"
import db from "@/lib/db"
import crypto from "crypto"

function uuid() {
  return crypto.randomUUID()
}

// GET /api/visits?patient=NAME&limit=10
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patient = searchParams.get("patient")
    const limit = Number(searchParams.get("limit") || 0)

    let sql = `
      SELECT *
      FROM visits_rows
    `
    const params: any[] = []

    if (patient) {
      sql += ` WHERE patient_name = ?`
      params.push(patient)
    }

    sql += ` ORDER BY COALESCE(visit_date, created_at) DESC, updated_at DESC`

    if (!patient && limit > 0) {
      sql += ` LIMIT ?`
      params.push(limit)
    }

    const [rows] = await db.query(sql, params)
    return NextResponse.json(rows)
  } catch (err: any) {
    console.error("Database error (GET /api/visits):", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/visits
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const data = {
      id: uuid(),
      patient_name: (body.patient_name || "").trim(),
      patient_age: body.patient_age ?? null,
      patient_phone: body.patient_phone ?? "",
      patient_address: body.patient_address ?? "",
      gender: body.gender ?? "",
      visit_date: body.visit_date || null,
      visit_type: body.visit_type || "Vizitë",
      diagnosis: body.diagnosis ?? "",
      symptoms: body.symptoms ?? "",
      treatment: body.treatment ?? "",
      notes: body.notes ?? "",
      allergies: body.allergies ?? "",
      examinimet: body.examinimet ?? "",
      cor: body.cor ?? "",
      pulmo: body.pulmo ?? "",
    }

    const sql = `
      INSERT INTO visits_rows
      (
        id, patient_name, patient_age, patient_phone, patient_address, gender,
        visit_date, visit_type, diagnosis, symptoms, treatment,
        notes, allergies, examinimet, cor, pulmo, created_at, updated_at
      )
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `

    const params = [
      data.id, data.patient_name, data.patient_age, data.patient_phone, data.patient_address, data.gender,
      data.visit_date, data.visit_type, data.diagnosis, data.symptoms, data.treatment,
      data.notes, data.allergies, data.examinimet, data.cor, data.pulmo
    ]

    await db.query(sql, params)
    return NextResponse.json({ ok: true, id: data.id })
  } catch (err: any) {
    console.error("Database error (POST /api/visits):", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/visits  (expects { id, ...fieldsToUpdate })
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...rest } = body || {}
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const allowed = [
      "patient_name","patient_age","patient_phone","patient_address","gender",
      "visit_date","visit_type","diagnosis","symptoms","treatment",
      "notes","allergies","examinimet","cor","pulmo"
    ] as const

    const sets: string[] = []
    const params: any[] = []
    for (const k of allowed) {
      if (k in rest) {
        sets.push(`${k} = ?`)
        params.push((rest as any)[k])
      }
    }
    if (sets.length === 0) return NextResponse.json({ ok: true }) // nothing to update

    const sql = `UPDATE visits_rows SET ${sets.join(", ")}, updated_at = NOW() WHERE id = ?`
    params.push(id)

    await db.query(sql, params)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Database error (PUT /api/visits):", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
