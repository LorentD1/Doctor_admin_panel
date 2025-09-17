"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Users, Calendar, FileText, DollarSign, Download } from "lucide-react"

// Mock data for charts
const visitTrendsData = [
  { month: "Jan", visits: 65, revenue: 3250 },
  { month: "Shk", visits: 78, revenue: 3900 },
  { month: "Mar", visits: 90, revenue: 4500 },
  { month: "Pri", visits: 81, revenue: 4050 },
  { month: "Maj", visits: 95, revenue: 4750 },
  { month: "Qer", visits: 88, revenue: 4400 },
  { month: "Kor", visits: 102, revenue: 5100 },
  { month: "Gus", visits: 87, revenue: 4350 },
  { month: "Sht", visits: 94, revenue: 4700 },
  { month: "Tet", visits: 89, revenue: 4450 },
  { month: "Nën", visits: 76, revenue: 3800 },
  { month: "Dhj", visits: 83, revenue: 4150 },
]

const ageGroupData = [
  { group: "0-18", count: 45, percentage: 12 },
  { group: "19-35", count: 128, percentage: 34 },
  { group: "36-50", count: 95, percentage: 25 },
  { group: "51-65", count: 78, percentage: 21 },
  { group: "65+", count: 30, percentage: 8 },
]

const conditionsData = [
  { condition: "Hipertension", count: 45, color: "#8884d8" },
  { condition: "Diabetes", count: 32, color: "#82ca9d" },
  { condition: "Alergji", count: 28, color: "#ffc658" },
  { condition: "Kontroll rutinor", count: 67, color: "#ff7300" },
  { condition: "Konsultim", count: 89, color: "#00ff88" },
  { condition: "Të tjera", count: 23, color: "#ff8888" },
]

const weeklyData = [
  { day: "Hën", visits: 12, avg: 10 },
  { day: "Mar", visits: 15, avg: 12 },
  { day: "Mër", visits: 18, avg: 14 },
  { day: "Enj", visits: 14, avg: 13 },
  { day: "Pre", visits: 16, avg: 15 },
  { day: "Sht", visits: 8, avg: 6 },
  { day: "Die", visits: 4, avg: 3 },
]

export function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analitika</h1>
            <p className="text-muted-foreground">Statistikat dhe trendet e praktikës mjekësore</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="12months">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 ditët e fundit</SelectItem>
                <SelectItem value="30days">30 ditët e fundit</SelectItem>
                <SelectItem value="3months">3 muajt e fundit</SelectItem>
                <SelectItem value="12months">12 muajt e fundit</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Eksporto
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vizita totale</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,045</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% nga muaji i kaluar
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacientë aktivë</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">376</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% nga muaji i kaluar
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Raporte të krijuara</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">892</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2.1% nga muaji i kaluar
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Të ardhurat</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€52,250</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.3% nga muaji i kaluar
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trendet e vizitave</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    visits: {
                      label: "Vizita",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visitTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="visits"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vizitat sipas ditëve të javës</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    visits: {
                      label: "Vizita",
                      color: "hsl(var(--chart-2))",
                    },
                    avg: {
                      label: "Mesatarja",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="visits" fill="hsl(var(--chart-2))" />
                      <Bar dataKey="avg" fill="hsl(var(--chart-3))" opacity={0.6} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grupet e moshave</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "Numri",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageGroupData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="group" type="category" width={60} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="hsl(var(--chart-4))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kushtet më të shpeshta</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "Numri",
                      color: "hsl(var(--chart-5))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conditionsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ condition, percentage }) => `${condition}: ${percentage}%`}
                      >
                        {conditionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Të ardhurat mujore</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Të ardhurat (€)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
