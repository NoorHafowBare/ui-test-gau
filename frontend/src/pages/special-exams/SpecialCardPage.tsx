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
  ShieldCheck,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/common/EmptyState"
import { BRANDING } from "@/config/branding"
import guLogo from "@/assets/gu-logo.png"

import { getSpecialExamCard } from "@/api/specialExams"
import type { SpecialExamCardData } from "@/mocks/specialExams"

export function SpecialCardPage() {
  const [examCard, setExamCard] = React.useState<SpecialExamCardData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getSpecialExamCard()
        if (mounted) setExamCard(data)
      } catch {
        toast.error("Failed to load special examination card.")
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
          title="Special Exam Card"
          breadcrumbs={[
            { label: "Home", href: "/app/dashboard" },
            { label: "Special & Supp Exams" },
            { label: "Special Exam Card" },
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
          title="Special Exam Card"
          breadcrumbs={[
            { label: "Home", href: "/app/dashboard" },
            { label: "Special & Supp Exams" },
            { label: "Special Exam Card" },
          ]}
        />
        <EmptyState
          icon={FileText}
          title="No Special Exam Card Released"
          description="You do not have any approved special examinations scheduled for this period."
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Special Exam Card"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Special & Supp Exams" },
          { label: "Special Exam Card" },
        ]}
        description="Official approval permit authorized by the Dean of School and Registrar for special exam sittings."
        actions={
          <Button
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Printer className="size-3.5" strokeWidth={1.75} />
            Print Special Exam Permit
          </Button>
        }
      />

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
                    Senate Committee on Special Examinations
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <Badge variant="outline" className="text-xs font-mono font-semibold">
                  {examCard.permitNumber}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Authorized: <span className="font-mono text-foreground font-medium">{examCard.issuedDate}</span>
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
              <span className="text-muted-foreground block text-[11px]">Candidate Full Name</span>
              <span className="font-semibold text-foreground text-sm">{examCard.studentName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Registration No</span>
              <span className="font-mono font-semibold text-foreground text-sm">{examCard.studentNumber}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground block text-[11px]">Degree Programme</span>
              <span className="font-medium text-foreground">{examCard.programme}</span>
            </div>
          </div>

          {/* Approvals Strip */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-success font-medium rounded-md bg-success/10 px-2.5 py-1 border border-success/20">
              <ShieldCheck className="size-3.5" strokeWidth={1.75} />
              Medical Board Verified
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success font-medium rounded-md bg-success/10 px-2.5 py-1 border border-success/20">
              <CheckCircle2 className="size-3.5" strokeWidth={1.75} />
              Dean of School Approved
            </div>
            <div className="flex items-center gap-1.5 text-xs text-info font-medium rounded-md bg-info/10 px-2.5 py-1 border border-info/20">
              <CheckCircle2 className="size-3.5" strokeWidth={1.75} />
              Regular Grading Standard
            </div>
          </div>

          {/* Approved Papers */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Authorized Special Examination Schedule
            </h3>
            <div className="divide-y divide-border/60 rounded-lg border border-border/80 overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-muted/30 p-2.5 font-semibold text-muted-foreground text-[11px] uppercase">
                <div className="col-span-2 font-mono">Unit Code</div>
                <div className="col-span-4">Course Title</div>
                <div className="col-span-2">Sitting Date</div>
                <div className="col-span-2">Time</div>
                <div className="col-span-2 text-right">Venue / Seat</div>
              </div>

              {examCard.approvedPapers.map((paper) => (
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

          {/* Regulations and Sign-off */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="rounded-lg bg-muted/20 p-3 text-[11px] text-muted-foreground space-y-1 border border-border/40">
              <div className="font-semibold text-foreground flex items-center gap-1">
                <AlertCircle className="size-3.5 text-warning" strokeWidth={1.75} />
                Important Special Examination Instructions:
              </div>
              <p>
                1. This card confers the right to sit the special examination. Grades awarded in special examinations are treated as regular first-attempt grades without penalization.
              </p>
              <p>
                2. Presentation of this printed card and student registration ID is mandatory at the exam center.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
              <div className="space-y-1">
                <div className="h-9 border-b border-dashed border-border" />
                <span className="text-[11px] text-muted-foreground block text-center">Dean's Seal & Signature</span>
              </div>
              <div className="space-y-1">
                <div className="h-9 border-b border-dashed border-border" />
                <span className="text-[11px] text-muted-foreground block text-center">Registrar (AA) Endorsement</span>
              </div>
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <div className="h-9 border-b border-dashed border-border" />
                <span className="text-[11px] text-muted-foreground block text-center">Candidate Signature</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
