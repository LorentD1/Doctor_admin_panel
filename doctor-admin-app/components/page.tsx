"use client"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ballina</h1>
      <p className="text-muted-foreground">
        Mirësevini në panelin administrativ për menaxhimin e vizitave mjekësore.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Pacientë</h2>
          <p className="text-sm text-muted-foreground">
            Shiko dhe menaxho pacientët.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Vizita</h2>
          <p className="text-sm text-muted-foreground">
            Regjistro vizita të reja dhe shiko historinë.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Analitika</h2>
          <p className="text-sm text-muted-foreground">
            Raporte dhe statistika të përgjithshme.
          </p>
        </div>
      </div>
    </div>
  )
}
