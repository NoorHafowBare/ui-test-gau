import * as React from "react"
import { toast } from "sonner"
import {
  Download,
  Printer,
  Award,
  CheckCircle2,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { getTranscripts } from "@/api/academics"
import type { SemesterTranscript } from "@/mocks/academics"

const ACADEMIC_YEARS = [
  { id: "all", label: "All Academic Years (Cumulative)" },
  { id: "2026/2027", label: "2026/2027 (Year 4)" },
  { id: "2025/2026", label: "2025/2026 (Year 3)" },
  { id: "2024/2025", label: "2024/2025 (Year 2)" },
  { id: "2023/2024", label: "2023/2024 (Year 1)" },
]

export function TranscriptPage() {
  const [transcripts, setTranscripts] = React.useState<SemesterTranscript[]>([])
  const [yearFilter, setYearFilter] = React.useState("all")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    async function loadData() {
      setLoading(true)
      try {
        const data = await getTranscripts(yearFilter)
        if (isMounted) setTranscripts(data)
      } catch {
        toast.error("Failed to load provisional transcript.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [yearFilter])

  const handleDownload = () => {
    toast.success("Downloading Provisional Transcript", {
      description: "Official transcript for BSC/G0001/23 generated.",
    })
  }

  // Calculate cumulative GPA across loaded semesters
  const totalCredits = React.useMemo(() => {
    return transcripts.reduce((sum, s) => sum + s.totalCreditHours, 0)
  }, [transcripts])

  const cumulativeGPA = React.useMemo(() => {
    if (transcripts.length === 0) return 0
    const totalWeighted = transcripts.reduce(
      (sum, s) => sum + s.gpa * s.totalCreditHours,
      0
    )
    return Number((totalWeighted / (totalCredits || 1)).toFixed(2))
  }, [transcripts, totalCredits])

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Provisional Transcript"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Academics" },
          { label: "Provisional Transcript" },
        ]}
        description="Official provisional statement of semester examination results, grade points, and GPA progression."
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

      {/* Cumulative Performance Summary Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <Card className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-xs">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Cumulative GPA (CGPA)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-foreground font-mono">
              {cumulativeGPA.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground font-medium">/ 4.00</span>
          </div>
          <span className="text-[11px] text-success font-medium mt-1 flex items-center gap-1">
            <Award className="size-3.5" /> First Class Equivalent
          </span>
        </Card>

        <Card className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-xs">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Total Credit Hours Earned
          </span>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground font-mono">
            {totalCredits} <span className="text-xs font-normal text-muted-foreground">CH</span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Across {transcripts.length} completed semesters
          </span>
        </Card>

        <Card className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-xs">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Academic Standing
          </span>
          <div className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-4 text-success" strokeWidth={1.75} />
            <span>Pass / Proceed</span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Cleared to Y4S2 graduation track
          </span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="rounded-xl border border-border/70 bg-card p-3 sm:p-3.5 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Filter by Academic Session:
            </span>
            <Select value={yearFilter} onValueChange={(val) => val && setYearFilter(val)}>
              <SelectTrigger className="w-[280px] h-9 text-xs font-medium bg-background">
                <SelectValue placeholder="Choose academic session" />
              </SelectTrigger>
              <SelectContent>
                {ACADEMIC_YEARS.map((y) => (
                  <SelectItem key={y.id} value={y.id} className="text-xs">
                    {y.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-xs text-muted-foreground">
            Showing {transcripts.length} semester records
          </span>
        </div>
      </Card>

      {/* Accordion-Style Stacked Semester Cards */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-44 w-full rounded-xl" />
          ))
        ) : transcripts.length > 0 ? (
          transcripts.map((semester) => (
            <Card
              key={semester.id}
              className="rounded-xl border border-border/70 bg-card shadow-xs overflow-hidden"
            >
              {/* Semester Header */}
              <CardHeader className="border-b border-border/60 bg-muted/20 py-3.5 px-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground tracking-tight">
                      {semester.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Session: {semester.academicYear} • Units: {semester.units.length} • Credits: {semester.totalCreditHours}.0 CH
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">Semester GPA</span>
                      <span className="text-base font-bold text-foreground font-mono">
                        {semester.gpa.toFixed(2)}
                      </span>
                    </div>
                    <Badge variant="success" className="text-xs font-medium">
                      {semester.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {/* Units Table */}
              <CardContent className="p-0">
                <Table className="w-full text-sm">
                  <TableHeader className="bg-muted/40 border-b border-border/70">
                    <TableRow className="border-b border-border/70">
                      <TableHead className="h-9 px-5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-28">
                        Unit Code
                      </TableHead>
                      <TableHead className="h-9 px-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Unit Title
                      </TableHead>
                      <TableHead className="h-9 px-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground w-32">
                        Credit Hours
                      </TableHead>
                      <TableHead className="h-9 px-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground w-28">
                        Grade
                      </TableHead>
                      <TableHead className="h-9 px-5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-28">
                        Points
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {semester.units.map((unit) => (
                      <TableRow
                        key={unit.code}
                        className="h-10 border-b border-border/40 hover:bg-muted/30"
                      >
                        <TableCell className="px-5 font-mono text-xs font-semibold text-foreground">
                          {unit.code}
                        </TableCell>
                        <TableCell className="px-4 text-sm font-medium text-foreground">
                          {unit.name}
                        </TableCell>
                        <TableCell className="px-4 text-center font-mono text-xs text-foreground">
                          {unit.creditHours}.0
                        </TableCell>
                        <TableCell className="px-4 text-center">
                          <Badge
                            variant={unit.grade === "A" ? "default" : "secondary"}
                            className="font-mono text-xs font-semibold px-2"
                          >
                            {unit.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 text-right font-mono text-xs font-medium text-foreground">
                          {unit.points}.0
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Semester Summary Row */}
                    <TableRow className="border-t-2 border-border/80 bg-muted/30 font-semibold hover:bg-muted/30">
                      <TableCell colSpan={2} className="px-5 text-xs uppercase tracking-wider text-muted-foreground">
                        Semester Total Performance
                      </TableCell>
                      <TableCell className="px-4 text-center font-mono text-xs text-foreground">
                        {semester.totalCreditHours}.0 CH
                      </TableCell>
                      <TableCell className="px-4 text-center text-xs text-muted-foreground">
                        GPA: <strong className="text-foreground">{semester.gpa.toFixed(2)}</strong>
                      </TableCell>
                      <TableCell className="px-5 text-right font-mono text-xs font-bold text-primary">
                        {semester.units.reduce((s, u) => s + u.points, 0)}.0 Pts
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        ) : null}
      </div>
    </div>
  )
}
