// app/api/analytics/route.ts
import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    // Total counts
    const [patients]: any = await db.query(
      `SELECT COUNT(DISTINCT patient_name) AS total_patients FROM visits_rows`
    )
    const [visits]: any = await db.query(
      `SELECT COUNT(*) AS total_visits FROM visits_rows`
    )
    const [today]: any = await db.query(
      `SELECT COUNT(*) AS visits_today FROM visits_rows WHERE DATE(visit_date) = CURDATE()`
    )

    // Visits per day (last 7 days)
    const [visitsPerDay]: any = await db.query(
      `SELECT DATE(visit_date) AS day, COUNT(*) AS count
       FROM visits_rows
       WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY day
       ORDER BY day ASC`
    )

    // Visits per month
    const [visitsPerMonth]: any = await db.query(
      `SELECT DATE_FORMAT(visit_date, '%Y-%m') AS month, COUNT(*) AS count
       FROM visits_rows
       GROUP BY month
       ORDER BY month ASC`
    )

    // New patients per month
    const [patientsPerMonth]: any = await db.query(
      `SELECT DATE_FORMAT(MIN(visit_date), '%Y-%m') AS month, patient_name
       FROM visits_rows
       GROUP BY patient_name
       ORDER BY month ASC`
    )

    // Count unique patients per month
    const groupedPatients: Record<string, number> = {}
    for (const row of patientsPerMonth) {
      if (!row.month) continue
      groupedPatients[row.month] = (groupedPatients[row.month] || 0) + 1
    }

    return NextResponse.json({
      totalPatients: patients[0].total_patients,
      totalVisits: visits[0].total_visits,
      visitsToday: today[0].visits_today,
      visitsPerDay,
      visitsPerMonth,
      patientsPerMonth: Object.entries(groupedPatients).map(([month, count]) => ({
        month,
        count,
      })),
    })
  } catch (err: any) {
    console.error("Database error (GET /api/analytics):", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
