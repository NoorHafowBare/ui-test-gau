import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import {
  Building2,
  Star,
  CheckCircle2,
  MapPin,
  Send,
  Loader2,
  FileQuestion,
  Layers,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { DataTable } from "@/components/common/DataTable"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  getServiceEvaluations,
  submitServiceEvaluation,
} from "@/api/evaluations"
import {
  SERVICE_EVALUATION_QUESTIONS,
  type ServiceEvaluationItem,
} from "@/mocks/evaluations"

const RATING_SCALE = [
  { value: "1", label: "Poor (1)" },
  { value: "2", label: "Fair (2)" },
  { value: "3", label: "Good (3)" },
  { value: "4", label: "Very Good (4)" },
  { value: "5", label: "Excellent (5)" },
]

export function OtherEvaluationPage() {
  const [services, setServices] = React.useState<ServiceEvaluationItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedService, setSelectedService] = React.useState<ServiceEvaluationItem | null>(null)

  // Form states
  const [ratings, setRatings] = React.useState<Record<string, number>>({})
  const [feedback, setFeedback] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getServiceEvaluations()
        if (mounted) setServices(data)
      } catch {
        toast.error("Failed to load service evaluations.")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleOpenEvaluation = (service: ServiceEvaluationItem) => {
    setSelectedService(service)
    const initialRatings: Record<string, number> = {}
    SERVICE_EVALUATION_QUESTIONS.forEach((q) => {
      initialRatings[q.id] = 4
    })
    setRatings(initialRatings)
    setFeedback(service.feedback || "")
  }

  const handleRatingChange = (qId: string, val: string) => {
    setRatings((prev) => ({ ...prev, [qId]: Number(val) }))
  }

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) return

    setSubmitting(true)
    try {
      const updated = await submitServiceEvaluation(selectedService.id, ratings, feedback)
      setServices((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      )
      toast.success("Institutional feedback submitted!", {
        description: `Feedback for ${selectedService.serviceName} has been recorded by Campus Quality Assurance.`,
      })
      setSelectedService(null)
    } catch {
      toast.error("Failed to submit service evaluation.")
    } finally {
      setSubmitting(false)
    }
  }

  const columns = React.useMemo<ColumnDef<ServiceEvaluationItem>[]>(
    () => [
      {
        accessorKey: "serviceName",
        header: "Facility & Institutional Service",
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <span className="font-semibold text-xs text-foreground block">
              {row.original.serviceName}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="size-3 text-muted-foreground shrink-0" strokeWidth={1.75} />
              {row.original.location}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-[10px] font-medium">
            {row.original.category}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const isDone = row.original.status === "completed"
          return (
            <Button
              variant={isDone ? "outline" : "default"}
              size="sm"
              onClick={() => handleOpenEvaluation(row.original)}
              className="h-7 text-xs gap-1 px-2.5 font-medium shadow-2xs"
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="size-3 text-success" strokeWidth={1.75} />
                  View Rating
                </>
              ) : (
                <>
                  <Star className="size-3" strokeWidth={1.75} />
                  Evaluate
                </>
              )}
            </Button>
          )
        },
      },
    ],
    []
  )

  const completedCount = services.filter((s) => s.status === "completed").length

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Other Evaluation"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Periodic Activities" },
          { label: "Other Evaluation" },
        ]}
        description="Institutional service evaluation regarding library, ICT network, student welfare, and campus amenities."
      />

      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-3.5 px-5 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Building2 className="size-4 text-primary" strokeWidth={1.75} />
              Campus Facilities & Welfare Services • Annual Audit
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono font-medium">
              {completedCount} of {services.length} Completed
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <DataTable
            columns={columns}
            data={services}
            loading={loading}
            searchPlaceholder="Search by facility name, category, or location..."
            emptyIcon={FileQuestion}
            emptyTitle="No Facilities Scheduled"
            emptyDescription="There are no pending service evaluation audits active at this time."
          />
        </CardContent>
      </Card>

      {/* Service Evaluation Dialog */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-card border border-border">
          {selectedService && (
            <form onSubmit={handleSubmitEvaluation}>
              <div className="p-6 space-y-6">
                <DialogHeader className="border-b border-border/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Layers className="size-4 text-primary" strokeWidth={1.75} />
                        Facility Appraisal: {selectedService.serviceName}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground mt-1">
                        {selectedService.category} • Location: {selectedService.location}
                      </DialogDescription>
                    </div>
                    <StatusBadge status={selectedService.status} />
                  </div>
                </DialogHeader>

                <div className="space-y-5 divide-y divide-border/40">
                  {SERVICE_EVALUATION_QUESTIONS.map((q, idx) => (
                    <div key={q.id} className={idx > 0 ? "pt-4 space-y-2.5" : "space-y-2.5"}>
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          {idx + 1}. {q.title}
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                          {q.description}
                        </p>
                      </div>

                      <RadioGroup
                        value={String(ratings[q.id] || 4)}
                        onValueChange={(val) => handleRatingChange(q.id, val)}
                        disabled={selectedService.status === "completed"}
                        className="flex flex-wrap gap-2 pt-1"
                      >
                        {RATING_SCALE.map((opt) => (
                          <div
                            key={opt.value}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer select-none ${
                              String(ratings[q.id] || 4) === opt.value
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border/60 hover:bg-muted/30 text-foreground"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} id={`${q.id}-${opt.value}`} />
                            <Label htmlFor={`${q.id}-${opt.value}`} className="cursor-pointer text-xs">
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label htmlFor="service-feedback" className="text-xs font-semibold text-foreground">
                    Recommendations for Departmental Improvement
                  </Label>
                  <Textarea
                    id="service-feedback"
                    placeholder="Provide specific recommendations to help the administration improve this service..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={selectedService.status === "completed"}
                    rows={3}
                    className="text-xs resize-none"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Feedback is aggregated anonymously and presented during university senate quarterly reviews.
                  </p>
                </div>

                <DialogFooter className="flex flex-row justify-end gap-2 pt-4 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedService(null)}
                    disabled={submitting}
                    className="h-8 text-xs"
                  >
                    Close
                  </Button>
                  {selectedService.status !== "completed" && (
                    <Button
                      type="submit"
                      size="sm"
                      disabled={submitting}
                      className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="size-3.5" strokeWidth={1.75} />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
