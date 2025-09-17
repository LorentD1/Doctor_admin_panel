import { NextResponse } from "next/server"
import db from "@/lib/db"

// GET /api/patients
export async function GET() {
  try {
    const sql = `
      SELECT 
        MIN(id) as id,
        patient_name,
        MIN(patient_age) as patient_age,
        MIN(patient_phone) as patient_phone,
        MIN(patient_address) as patient_address,
        MIN(gender) as gender,
        MIN(allergies) as allergies,
        COUNT(*) as total_visits,
        MAX(visit_date) as last_visit
      FROM visits_rows
      GROUP BY patient_name
      ORDER BY patient_name
    `
    const [rows]: any = await db.query(sql)
    return NextResponse.json(rows)
  } catch (err: any) {
    console.error("Database error (GET /api/patients):", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
