import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "dev_secret"

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization") || ""
    const [, token] = auth.split(" ")

    if (!token) return NextResponse.json({ ok: false }, { status: 401 })
    jwt.verify(token, SECRET)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}
