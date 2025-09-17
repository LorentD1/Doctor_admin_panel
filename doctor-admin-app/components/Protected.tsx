"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    // allow login page itself
    if (pathname === "/login") {
      setOk(true)
      return
    }
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login")
      return
    }
    // verify token with API
    fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.ok) setOk(true)
        else router.replace("/login")
      })
      .catch(() => router.replace("/login"))
  }, [router, pathname])

  if (!ok) return null
  return <>{children}</>
}
