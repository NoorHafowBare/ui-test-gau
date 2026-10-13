import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import {
  FileText,
  Calendar,
  Send,
  Loader2,
  FileQuestion,
  Info,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { DataTable } from "@/components/common/DataTable"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  getSpecialExamApplications,
  createSpecialExamApplication,
} from "@/api/specialExams"
import type { SpecialExamApplicationRecord } from "@/mocks/specialExams"

const SEMESTER_UNITS = [
  { code: "STA 421", title: "Applied Multivariate Statistical Methods" },
  { code: "STA 422", title: "Time Series Analysis & Forecasting" },
  { code: "STA 423", title: "Stochastic Processes & Actuarial Models" },
  { code: "COM 424", title: "Machine Learning & Statistical Data Mining" },
  { code: "COM 425", title: "Cloud Computing & Distributed Systems" },
  { code: "STA 426", title: "Bio-Statistical Modelling & Epidemiological Data" },
]

export function SpecialApplicationPage() {
  const [applications, setApplications] = React.useState<SpecialExamApplicationRecord[]>([])
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  // Form states
  const [selectedUnitCode, setSelectedUnitCode] = React.useState("")
  const [reason, setReason] = React.useState<
    "Medical Emergency" | "Compassionate Grounds" | "Academic Clash" | "Official Representation" | ""
  >("")
  const [statement, setStatement] = React.useState("")
  const [fileName, setFileName] = React.useState("")

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getSpecialExamApplications()
        if (mounted) setApplications(data)
      } catch {
        toast.error("Failed to load special exam applications.")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUnitCode || !reason || !statement) {
      toast.error("Please fill in all required fields.")
      return
    }

    const unit = SEMESTER_UNITS.find((u) => u.code === selectedUnitCode)
    if (!unit) return

    setSubmitting(true)
    try {
      const created = await createSpecialExamApplication({
        unitCode: unit.code,
        unitTitle: unit.title,
        reason: reason as SpecialExamApplicationRecord["reason"],
        statement,
        documentName: fileName || "Verification_Attachment.pdf",
      })

      setApplications((prev) => [created, ...prev])
      toast.success("Special exam application submitted!", {
        description: `Your application for ${unit.code} has been submitted for Dean's Board review.`,
      })

      // Reset form
      setSelectedUnitCode("")
      setReason("")
      setStatement("")
      setFileName("")
    } catch {
      toast.error("Failed to submit special exam application.")
    } finally {
      setSubmitting(false)
    }
  }

  const columns = React.useMemo<ColumnDef<SpecialExamApplicationRecord>[]>(
    () => [
      {
        accessorKey: "unitCode",
        header: "Unit",
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <span className="font-mono text-xs font-semibold text-foreground">
              {row.original.unitCode}
            </span>
            <div className="text-xs text-muted-foreground">{row.original.unitTitle}</div>
          </div>
        ),
      },
      {
        accessorKey: "reason",
        header: "Grounds / Reason",
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-foreground">
              {row.original.reason}
            </span>
            {row.original.documentName && (
              <span className="text-[11px] text-muted-foreground block font-mono">
                📎 {row.original.documentName}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "appliedDate",
        header: "Applied Date",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Calendar className="size-3" strokeWidth={1.75} />
            {row.original.appliedDate}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "reviewerComments",
        header: "Board Remarks",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.reviewerComments || "—"}
          </span>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Special Exam Application"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Special & Supp Exams" },
          { label: "Special Exam Application" },
        ]}
        description="Submit formal petitions for missed end-semester examinations due to medical or compassionate circumstances."
      />

      {/* Policy Alert */}
      <Alert variant="info" className="border-info/30 bg-info/10 text-foreground">
        <Info className="size-4 text-info mt-0.5 shrink-0" strokeWidth={1.75} />
        <div className="space-y-1">
          <AlertTitle className="text-sm font-semibold text-foreground">
            Special Examination Statutory Regulations
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
            Special examinations are granted when a student is prevented from sitting regular examinations by illness, bereavement, or unavoidable calamity. Official supporting documentation (e.g. Hospital Discharge Letter, Medical Officer Certificate, Burial Permit) must be attached.
          </AlertDescription>
        </div>
      </Alert>

      {/* Application Form Card */}
      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-4 px-5 bg-muted/20">
          <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <FileQuestion className="size-4 text-primary" strokeWidth={1.75} />
            New Special Exam Petition
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Complete the petition form with verified academic and compassionate justifications.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unit Select */}
              <div className="space-y-1.5">
                <Label htmlFor="unit-select" className="text-xs font-medium">
                  Course Unit <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedUnitCode}
                  onValueChange={(val) => setSelectedUnitCode(val ?? "")}
                >
                  <SelectTrigger id="unit-select" className="h-9 text-xs">
                    <SelectValue placeholder="Select course unit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTER_UNITS.map((u) => (
                      <SelectItem key={u.code} value={u.code} className="text-xs">
                        <span className="font-mono font-semibold mr-1.5">{u.code}</span>
                        <span>{u.title}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason Select */}
              <div className="space-y-1.5">
                <Label htmlFor="reason-select" className="text-xs font-medium">
                  Grounds for Absence <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={reason}
                  onValueChange={(val) =>
                    setReason(
                      (val as SpecialExamApplicationRecord["reason"]) ?? ""
                    )
                  }
                >
                  <SelectTrigger id="reason-select" className="h-9 text-xs">
                    <SelectValue placeholder="Select primary reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medical Emergency" className="text-xs">
                      Medical Emergency / Illness (Hospitalized)
                    </SelectItem>
                    <SelectItem value="Compassionate Grounds" className="text-xs">
                      Compassionate Grounds / Family Bereavement
                    </SelectItem>
                    <SelectItem value="Academic Clash" className="text-xs">
                      Timetable Conflict / Academic Scheduling Clash
                    </SelectItem>
                    <SelectItem value="Official Representation" className="text-xs">
                      Official University Representation (Sports/Academic)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Statement Textarea */}
            <div className="space-y-1.5">
              <Label htmlFor="statement" className="text-xs font-medium">
                Detailed Statement & Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="statement"
                placeholder="Provide detailed facts explaining your absence during the scheduled exam date, including hospital details or family circumstances..."
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows={3}
                required
                className="text-xs resize-none"
              />
            </div>

            {/* Document Upload Input */}
            <div className="space-y-1.5">
              <Label htmlFor="doc-upload" className="text-xs font-medium">
                Supporting Evidence / Documentation (PDF / Scanned Certificate)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="doc-upload"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setFileName(file.name)
                  }}
                  className="h-9 text-xs file:mr-2 file:h-7 file:border-0 file:bg-muted file:text-xs file:font-medium hover:file:bg-muted/80 cursor-pointer"
                />
                {fileName && (
                  <span className="text-xs font-mono text-primary font-medium shrink-0">
                    {fileName}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Accepted formats: PDF, JPG, PNG (Max 5MB). Submissions without valid evidence will be rejected by the Academic Board.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="gap-1.5 text-xs font-semibold h-9 shadow-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" strokeWidth={1.75} />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* My Applications DataTable */}
      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-3.5 px-5 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <FileText className="size-4 text-primary" strokeWidth={1.75} />
              My Special Exam Applications
            </CardTitle>
            <span className="text-xs font-medium text-muted-foreground">
              {applications.length} Records
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <DataTable
            columns={columns}
            data={applications}
            loading={loading}
            searchPlaceholder="Search by unit code, reason, or status..."
            emptyIcon={FileQuestion}
            emptyTitle="No Special Exam Applications"
            emptyDescription="You have not submitted any special examination applications yet."
          />
        </CardContent>
      </Card>
    </div>
  )
}
