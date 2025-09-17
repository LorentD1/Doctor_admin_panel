import { NextResponse } from "next/server"

// hardcoded admin creds
const ADMIN_USER = "admin"
const ADMIN_PASS = "IsmetB12."

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // success → set cookie
      const res = NextResponse.json({ success: true })
      res.cookies.set("auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      return res
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    )
  } catch (err: any) {
    console.error("Login error:", err)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
