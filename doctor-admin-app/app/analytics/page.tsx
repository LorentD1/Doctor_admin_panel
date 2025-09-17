"use client"

import useSWR from "swr"
import SidebarWrapper from "@/components/sidebar-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  LineChart, Line, CartesianGrid, ResponsiveContainer 
} from "recharts"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AnalyticsPage() {
  const { data, error } = useSWR("/api/analytics", fetcher)

  return (
    <SidebarWrapper>
      <div className="p-6 space-y-6 flex-1">
        <h1 className="text-2xl font-bold">Analitika</h1>

        {error && <div className="p-4 text-red-600">Gabim duke marrë të dhënat.</div>}
        {!data && !error && <div className="p-4">Duke ngarkuar...</div>}

        {data && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader><CardTitle>Pacientë gjithsej</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{data.totalPatients}</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Vizita gjithsej</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{data.totalVisits}</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Vizita sot</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{data.visitsToday}</p></CardContent>
              </Card>
            </div>

            {/* Visits per day */}
            <Card>
              <CardHeader><CardTitle>Vizita për ditë (7 ditët e fundit)</CardTitle></CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.visitsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#2563eb" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Visits per month */}
            <Card>
              <CardHeader><CardTitle>Vizita për muaj</CardTitle></CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.visitsPerMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* New patients per month */}
            <Card>
              <CardHeader><CardTitle>Pacientë të rinj për muaj</CardTitle></CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.patientsPerMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </SidebarWrapper>
  )
}
