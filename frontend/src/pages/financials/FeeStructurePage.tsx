import * as React from "react"
import { toast } from "sonner"
import { Download, Printer, GraduationCap, Info } from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getFeeStructure,
  getProgrammeOptions,
} from "@/api/financials"
import type { FeeStructureProgramme } from "@/mocks/financials"

const formatKES = (amount: number) => {
  if (amount === 0) return "—"
  return `KES ${amount.toLocaleString("en-US")}`
}

export function FeeStructurePage() {
  const [programmes, setProgrammes] = React.useState<
    Array<{ id: string; label: string; code: string }>
  >([])
  const [selectedProgramme, setSelectedProgramme] = React.useState("bed-arts")
  const [selectedYear, setSelectedYear] = React.useState(1)
  const [structure, setStructure] = React.useState<FeeStructureProgramme | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    async function initOptions() {
      try {
        const opts = await getProgrammeOptions()
        if (isMounted) setProgrammes(opts)
      } catch {
        toast.error("Failed to load programmes.")
      }
    }
    initOptions()
    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true
    async function loadFeeStructure() {
      setLoading(true)
      try {
        const data = await getFeeStructure(selectedProgramme, selectedYear)
        if (isMounted) setStructure(data)
      } catch {
        toast.error("Failed to load fee structure breakdown.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadFeeStructure()
    return () => {
      isMounted = false
    }
  }, [selectedProgramme, selectedYear])

  const handleDownload = () => {
    toast.success("Downloading NFM Fee Schedule", {
      description: `${structure?.programmeName} (Year ${selectedYear}) schedule downloaded.`,
    })
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="NFM Fee Structure"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Financials" },
          { label: "NFM Fee Structure" },
        ]}
        description="Official university approved fee structures across undergraduate degree programmes and stages."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Printer className="size-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="size-3.5" strokeWidth={1.75} />
              <span>Download PDF</span>
            </Button>
          </div>
        }
      />

      {/* Filter and Selection Card */}
      <Card className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Select Academic Programme:
              </span>
              <Select
                value={selectedProgramme}
                onValueChange={(val) => val && setSelectedProgramme(val)}
              >
                <SelectTrigger className="w-[300px] h-9 text-xs font-medium bg-background">
                  <SelectValue placeholder="Choose programme" />
                </SelectTrigger>
                <SelectContent>
                  {programmes.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      {p.label} ({p.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Academic Stage Tabs */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Academic Year of Study:
            </span>
            <Tabs
              value={String(selectedYear)}
              onValueChange={(val) => setSelectedYear(Number(val))}
            >
              <TabsList className="h-9 bg-muted/60 p-1">
                <TabsTrigger value="1" className="text-xs font-medium px-3">
                  Year 1
                </TabsTrigger>
                <TabsTrigger value="2" className="text-xs font-medium px-3">
                  Year 2
                </TabsTrigger>
                <TabsTrigger value="3" className="text-xs font-medium px-3">
                  Year 3
                </TabsTrigger>
                <TabsTrigger value="4" className="text-xs font-medium px-3">
                  Year 4
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </Card>

      {/* Programme Context Banner */}
      {structure && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" strokeWidth={1.75} />
            <span className="font-semibold text-foreground">
              {structure.programmeName}
            </span>
            <Badge variant="outline" className="text-[11px] font-mono">
              Code: {structure.programmeCode}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <span>Faculty: <strong className="font-medium text-foreground">{structure.faculty}</strong></span>
            <span>•</span>
            <span>Session: <strong className="font-medium text-foreground">{structure.academicYear}</strong></span>
          </div>
        </div>
      )}

      {/* Breakdown Table */}
      <div className="relative w-full overflow-x-auto rounded-lg border border-border/70 bg-card shadow-xs">
        <Table className="w-full caption-bottom text-sm border-collapse">
          {/* Header Row: Muted tint, 12px/500 uppercase labels, no green text */}
          <TableHeader className="bg-muted/40 border-b border-border/70">
            <TableRow className="border-b border-border/70 hover:bg-transparent">
              <TableHead className="h-10 px-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-12">
                #
              </TableHead>
              <TableHead className="h-10 px-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Fee Category & Description
              </TableHead>
              <TableHead className="h-10 px-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-44">
                Semester 1 (KES)
              </TableHead>
              <TableHead className="h-10 px-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-44">
                Semester 2 (KES)
              </TableHead>
              <TableHead className="h-10 px-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-48">
                Annual Total (KES)
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <TableRow key={`skeleton-row-${idx}`} className="h-11 border-b border-border/40">
                  <TableCell className="px-4"><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell className="px-4"><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell className="px-4"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  <TableCell className="px-4"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  <TableCell className="px-4"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : structure?.items && structure.items.length > 0 ? (
              structure.items.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="h-11 border-b border-border/40 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="px-4 font-mono text-xs text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {item.item}
                      </span>
                      <Badge
                        variant="neutral"
                        className="text-[10px] py-0 px-1.5 font-normal"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 text-right font-mono text-sm tabular-nums text-foreground">
                    {formatKES(item.sem1)}
                  </TableCell>
                  <TableCell className="px-4 text-right font-mono text-sm tabular-nums text-foreground">
                    {formatKES(item.sem2)}
                  </TableCell>
                  <TableCell className="px-4 text-right font-mono text-sm font-semibold tabular-nums text-foreground">
                    {formatKES(item.total)}
                  </TableCell>
                </TableRow>
              ))
            ) : null}

            {/* Total Row with Bold/Semibold styling and highlighted background */}
            {!loading && structure && (
              <TableRow className="h-12 border-t-2 border-border/80 bg-muted/40 font-semibold hover:bg-muted/40">
                <TableCell className="px-4" />
                <TableCell className="px-4 text-sm font-semibold text-foreground uppercase tracking-wider">
                  Total Approved Fee Requirements
                </TableCell>
                <TableCell className="px-4 text-right font-mono text-base font-semibold tabular-nums text-foreground">
                  {formatKES(structure.totalSem1)}
                </TableCell>
                <TableCell className="px-4 text-right font-mono text-base font-semibold tabular-nums text-foreground">
                  {formatKES(structure.totalSem2)}
                </TableCell>
                <TableCell className="px-4 text-right font-mono text-base font-bold tabular-nums text-primary">
                  {formatKES(structure.grandTotal)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footnote / University Policy Box */}
      <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Info className="size-4 text-primary" strokeWidth={1.75} />
          Important University Fee Policies:
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li>
            All fees must be remitted directly through the official eCitizen PesaFlow gateway or approved university bank accounts.
          </li>
          <li>
            Students must clear at least 50% of semester tuition before course registration and 100% prior to sitting examination assessments.
          </li>
          <li>
            Caution money and student ID card charges are payable once upon initial admission into the university.
          </li>
        </ul>
      </div>
    </div>
  )
}
