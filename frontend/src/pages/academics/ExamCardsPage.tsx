import * as React from "react"
import { toast } from "sonner"
import { Printer, Calendar, ShieldCheck, FileX2 } from "lucide-react"

import guLogo from "@/assets/gu-logo.png"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { DescriptionList } from "@/components/common/DescriptionList"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { getExamCard, getExamSemesterOptions } from "@/api/academics"
import type { ExamCardData } from "@/mocks/academics"

export function ExamCardsPage() {
  const [semesterOptions, setSemesterOptions] = React.useState<
    Array<{ id: string; label: string }>
  >([])
  const [selectedSemester, setSelectedSemester] = React.useState("2026-sem2")
  const [cardData, setCardData] = React.useState<ExamCardData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    async function initOptions() {
      try {
        const opts = await getExamSemesterOptions()
        if (isMounted) setSemesterOptions(opts)
      } catch {
        toast.error("Failed to load semester options.")
      }
    }
    initOptions()
    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true
    async function loadCard() {
      setLoading(true)
      try {
        const card = await getExamCard(selectedSemester)
        if (isMounted) setCardData(card)
      } catch {
        toast.error("Failed to load examination card.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadCard()
    return () => {
      isMounted = false
    }
  }, [selectedSemester])

  const handlePrint = () => {
    toast.info("Preparing printable examination card...")
    window.print()
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Exam Cards"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Academics" },
          { label: "Exam Cards" },
        ]}
        description="Official university examination attendance permit and clearance verification card."
        actions={
          cardData && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handlePrint}
                className="h-8 gap-1.5 text-xs font-semibold"
              >
                <Printer className="size-3.5" strokeWidth={1.75} />
                <span>Print Exam Card</span>
              </Button>
            </div>
          )
        }
      />

      {/* Semester Selection Toolbar */}
      <Card className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Select Examination Session:
            </span>
            <Select
              value={selectedSemester}
              onValueChange={(val) => val && setSelectedSemester(val)}
            >
              <SelectTrigger className="w-[320px] h-9 text-xs font-medium bg-background">
                <SelectValue placeholder="Choose session" />
              </SelectTrigger>
              <SelectContent>
                {semesterOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-xs text-muted-foreground">
            {cardData ? "Card Status: Verified & Cleared" : "No active card for selected session"}
          </span>
        </div>
      </Card>

      {/* Loading Skeleton */}
      {loading ? (
        <Skeleton className="h-[520px] w-full rounded-xl" />
      ) : cardData ? (
        /* Printable Official Examination Permit Card */
        <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden printable-exam-card">
          {/* Card Header with University Branding */}
          <CardHeader className="border-b border-border/70 bg-muted/20 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-xl bg-white p-1.5 shadow-xs border border-border/60 shrink-0">
                  <img
                    src={guLogo}
                    alt="Garissa University Seal"
                    className="size-13 object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    GARISSA UNIVERSITY
                  </h2>
                  <p className="text-xs text-muted-foreground italic">
                    Oasis of Innovation
                  </p>
                  <p className="text-xs font-semibold text-primary mt-0.5 uppercase tracking-wider">
                    Official Examination Clearance Card
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1">
                <Badge variant="success" className="text-xs font-semibold px-2.5 py-0.5">
                  CLEARED FOR EXAMS
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  Card Ref: {cardData.id.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground">
                  Issued: {cardData.issuedDate}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Student Details & Departmental Clearance Strips */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* Left: Student Profile info (8 cols) */}
              <div className="lg:col-span-8 rounded-lg bg-muted/30 p-4 border border-border/60">
                <DescriptionList
                  columns={2}
                  items={[
                    {
                      label: "Student Name",
                      value: <span className="font-semibold">{cardData.studentName}</span>,
                    },
                    {
                      label: "Registration No.",
                      value: <span className="font-mono font-semibold">{cardData.studentNumber}</span>,
                    },
                    {
                      label: "Programme",
                      value: cardData.programme,
                    },
                    {
                      label: "School / Faculty",
                      value: cardData.faculty,
                    },
                    {
                      label: "Stage & Semester",
                      value: `${cardData.stage} • ${cardData.semester}`,
                    },
                    {
                      label: "Academic Session",
                      value: cardData.academicYear,
                    },
                  ]}
                />
              </div>

              {/* Right: Institutional Clearance Badges (4 cols) */}
              <div className="lg:col-span-4 rounded-lg bg-muted/30 p-4 border border-border/60 space-y-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block border-b border-border/50 pb-1.5">
                  Departmental Verifications
                </span>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-muted-foreground font-medium">Finance Clearance:</span>
                  <Badge variant="success" className="text-[11px]">100% Cleared</Badge>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-muted-foreground font-medium">Library Clearance:</span>
                  <Badge variant="success" className="text-[11px]">Cleared</Badge>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-muted-foreground font-medium">Class Attendance:</span>
                  <Badge variant="default" className="text-[11px] font-mono">{cardData.attendancePercentage}%</Badge>
                </div>
              </div>
            </div>

            {/* Examination Schedule Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" strokeWidth={1.75} />
                Authorized Examination Papers
              </h3>

              <div className="rounded-lg border border-border/70 overflow-hidden">
                <Table className="w-full text-sm">
                  <TableHeader className="bg-muted/40 border-b border-border/70">
                    <TableRow className="border-b border-border/70">
                      <TableHead className="h-9 px-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-28">
                        Unit Code
                      </TableHead>
                      <TableHead className="h-9 px-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Unit Title
                      </TableHead>
                      <TableHead className="h-9 px-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-32">
                        Exam Date
                      </TableHead>
                      <TableHead className="h-9 px-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-40">
                        Time
                      </TableHead>
                      <TableHead className="h-9 px-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-44">
                        Venue
                      </TableHead>
                      <TableHead className="h-9 px-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground w-28">
                        Seat No.
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {cardData.examUnits.map((unit) => (
                      <TableRow
                        key={unit.code}
                        className="h-11 border-b border-border/40 hover:bg-muted/20"
                      >
                        <TableCell className="px-4 font-mono text-xs font-bold text-foreground">
                          {unit.code}
                        </TableCell>
                        <TableCell className="px-4 font-medium text-foreground">
                          {unit.title}
                        </TableCell>
                        <TableCell className="px-4 font-mono text-xs text-foreground">
                          {unit.date}
                        </TableCell>
                        <TableCell className="px-4 font-mono text-xs text-muted-foreground">
                          {unit.time}
                        </TableCell>
                        <TableCell className="px-4 text-xs font-medium text-foreground">
                          {unit.venue}
                        </TableCell>
                        <TableCell className="px-4 text-center font-mono text-xs font-semibold text-primary">
                          {unit.seatNumber}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Candidate Rules and Sign-off */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="size-4 text-primary" strokeWidth={1.75} />
                Examination Instructions to Candidates:
              </div>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>Candidates MUST present this printed clearance card along with their valid Student ID at every session.</li>
                <li>No unauthorized materials, electronic devices, or mobile phones are permitted inside the examination room.</li>
                <li>Entry into the examination room is strictly prohibited after 30 minutes from commencement.</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Empty State when no card is available */
        <Card className="rounded-xl border border-border/60 bg-card p-6 shadow-xs">
          <EmptyState
            icon={FileX2}
            title="No Examination Card Available"
            description="An examination clearance card has not been released yet for this session, or departmental clearance remains pending."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSemester("2026-sem2")}
                className="h-8 text-xs font-medium"
              >
                Switch to Current Semester Card
              </Button>
            }
          />
        </Card>
      )}
    </div>
  )
}
