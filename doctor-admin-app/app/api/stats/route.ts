import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    // Count total patients
    const [patients] = await db.query("SELECT COUNT(DISTINCT patient_name) as totalPatients FROM visits_rows")
    const totalPatients = (patients as any[])[0]?.totalPatients ?? 0

    // Count total visits
    const [visits] = await db.query("SELECT COUNT(*) as totalVisits FROM visits_rows")
    const totalVisits = (visits as any[])[0]?.totalVisits ?? 0

    // Count today's visits (match analytics logic: date only)
    const [today] = await db.query(
      "SELECT COUNT(*) as todayVisits FROM visits_rows WHERE DATE(visit_date) = CURDATE()"
    )
    const todayVisits = (today as any[])[0]?.todayVisits ?? 0

    return NextResponse.json({ totalPatients, totalVisits, todayVisits })
  } catch (err: any) {
    console.error("Stats error:", err)
    return NextResponse.json({ totalPatients: 0, totalVisits: 0, todayVisits: 0 })
  }
}
