import * as React from "react"
import { toast } from "sonner"
import {
  Printer,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/common/EmptyState"
import { BRANDING } from "@/config/branding"
import guLogo from "@/assets/gu-logo.png"

import { getSuppExamCard } from "@/api/specialExams"
import type { SuppExamCardData } from "@/mocks/specialExams"

export function SuppCardPage() {
  const [examCard, setExamCard] = React.useState<SuppExamCardData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getSuppExamCard()
        if (mounted) setExamCard(data)
      } catch {
        toast.error("Failed to load supplementary examination card.")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="space-y-4 w-full">
        <PageHeader
          title="Supplementary Exam Card"
          breadcrumbs={[
            { label: "Home", href: "/app/dashboard" },
            { label: "Special & Supp Exams" },
            { label: "Supplementary Exam Card" },
          ]}
        />
        <div className="h-96 rounded-xl bg-muted/30 animate-pulse border border-border/60" />
      </div>
    )
  }

  if (!examCard) {
    return (
      <div className="space-y-4 w-full">
        <PageHeader
          title="Supplementary Exam Card"
          breadcrumbs={[
            { label: "Home", href: "/app/dashboard" },
            { label: "Special & Supp Exams" },
            { label: "Supplementary Exam Card" },
          ]}
        />
        <EmptyState
          icon={FileText}
          title="No Supplementary Exam Card Available"
          description="You do not have any registered supplementary assessments or clearance is pending."
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Supplementary Exam Card"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Special & Supp Exams" },
          { label: "Supplementary Exam Card" },
        ]}
        description="Official university examination permit for registered supplementary candidate testing."
        actions={
          <Button
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Printer className="size-3.5" strokeWidth={1.75} />
            Print Supplementary Card
          </Button>
        }
      />

      {/* Printable Exam Card */}
      <Card className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden print:shadow-none print:border-none">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Card Header Branding */}
          <div className="border-b border-border/70 pb-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3.5">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-xs border border-border/40">
                  <img src={guLogo} alt={BRANDING.institutionName} className="size-full object-contain" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground tracking-tight">
                    {BRANDING.institutionName}
                  </h2>
                  <p className="text-xs text-muted-foreground">{BRANDING.tagline}</p>
                  <p className="text-xs font-semibold text-primary mt-0.5 uppercase tracking-wide">
                    Office of the Registrar (Academic Affairs)
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <Badge variant="outline" className="text-xs font-mono font-semibold">
                  {examCard.cardReference}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Issued: <span className="font-mono text-foreground font-medium">{examCard.issuedDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted/30 p-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider border border-border/40">
              {examCard.session} • {examCard.academicYear}
            </div>
          </div>

          {/* Student Profile Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs rounded-lg bg-muted/20 p-4 border border-border/40">
            <div>
              <span className="text-muted-foreground block text-[11px]">Candidate Name</span>
              <span className="font-semibold text-foreground text-sm">{examCard.studentName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Registration No</span>
              <span className="font-mono font-semibold text-foreground text-sm">{examCard.studentNumber}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground block text-[11px]">Programme & Faculty</span>
              <span className="font-medium text-foreground">{examCard.programme}</span>
            </div>
          </div>

          {/* Clearance Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-success font-medium rounded-md bg-success/10 px-2.5 py-1 border border-success/20">
              <CheckCircle2 className="size-3.5" strokeWidth={1.75} />
              Supplementary Fee Paid & Cleared
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success font-medium rounded-md bg-success/10 px-2.5 py-1 border border-success/20">
              <CheckCircle2 className="size-3.5" strokeWidth={1.75} />
              Dean Exam Registration Verified
            </div>
          </div>

          {/* Scheduled Papers Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Scheduled Supplementary Papers
            </h3>
            <div className="divide-y divide-border/60 rounded-lg border border-border/80 overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-muted/30 p-2.5 font-semibold text-muted-foreground text-[11px] uppercase">
                <div className="col-span-2 font-mono">Unit Code</div>
                <div className="col-span-4">Course Title</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Time</div>
                <div className="col-span-2 text-right">Venue & Seat</div>
              </div>

              {examCard.papers.map((paper) => (
                <div key={paper.code} className="grid grid-cols-12 p-3 items-center">
                  <div className="col-span-2 font-mono font-semibold text-foreground">
                    {paper.code}
                  </div>
                  <div className="col-span-4 font-medium text-foreground">
                    {paper.title}
                  </div>
                  <div className="col-span-2 text-muted-foreground flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="size-3" strokeWidth={1.75} />
                    {paper.date}
                  </div>
                  <div className="col-span-2 text-muted-foreground flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="size-3" strokeWidth={1.75} />
                    {paper.time}
                  </div>
                  <div className="col-span-2 text-right font-semibold text-foreground">
                    <span className="flex items-center justify-end gap-1">
                      <MapPin className="size-3 text-primary" strokeWidth={1.75} />
                      {paper.seatNumber}
                    </span>
                    <span className="text-[10px] text-muted-foreground block font-normal">
                      {paper.venue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Rules & Verification Line */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="rounded-lg bg-muted/20 p-3 text-[11px] text-muted-foreground space-y-1 border border-border/40">
              <div className="font-semibold text-foreground flex items-center gap-1">
                <AlertCircle className="size-3.5 text-warning" strokeWidth={1.75} />
                Supplementary Examination Instructions:
              </div>
              <p>
                1. Candidates must present this original card alongside their National ID or University Student ID to the Chief Invigilator.
              </p>
              <p>
                2. Entry into the examination room is prohibited 30 minutes after commencement. Unauthorized devices, smartwatches, and notes are strictly forbidden.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-1">
                <div className="h-9 border-b border-dashed border-border" />
                <span className="text-[11px] text-muted-foreground block text-center">Candidate Signature</span>
              </div>
              <div className="space-y-1">
                <div className="h-9 border-b border-dashed border-border" />
                <span className="text-[11px] text-muted-foreground block text-center">Chief Invigilator Stamp</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
