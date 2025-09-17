import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.query(`DELETE FROM visits_rows WHERE id = ?`, [params.id])
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Database error (DELETE /api/visits/[id]):", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
