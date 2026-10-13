import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import {
  GraduationCap,
  Star,
  CheckCircle2,
  UserCheck,
  Send,
  Loader2,
  FileQuestion,
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
  getLecturerEvaluations,
  submitLecturerEvaluation,
} from "@/api/evaluations"
import {
  LECTURER_EVALUATION_QUESTIONS,
  type LecturerEvaluationItem,
} from "@/mocks/evaluations"

const RATING_SCALE = [
  { value: "1", label: "Poor (1)" },
  { value: "2", label: "Fair (2)" },
  { value: "3", label: "Good (3)" },
  { value: "4", label: "Very Good (4)" },
  { value: "5", label: "Excellent (5)" },
]

export function LecturerEvaluationPage() {
  const [evaluations, setEvaluations] = React.useState<LecturerEvaluationItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedItem, setSelectedItem] = React.useState<LecturerEvaluationItem | null>(null)

  // Evaluation modal form states
  const [ratings, setRatings] = React.useState<Record<string, number>>({})
  const [feedback, setFeedback] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getLecturerEvaluations()
        if (mounted) setEvaluations(data)
      } catch {
        toast.error("Failed to load lecturer evaluations.")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleOpenEvaluation = (item: LecturerEvaluationItem) => {
    setSelectedItem(item)
    // Default ratings to 4 for all questions
    const initialRatings: Record<string, number> = {}
    LECTURER_EVALUATION_QUESTIONS.forEach((q) => {
      initialRatings[q.id] = 4
    })
    setRatings(initialRatings)
    setFeedback(item.feedback || "")
  }

  const handleRatingChange = (questionId: string, val: string) => {
    setRatings((prev) => ({ ...prev, [questionId]: Number(val) }))
  }

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return

    setSubmitting(true)
    try {
      const updated = await submitLecturerEvaluation(selectedItem.id, ratings, feedback)
      setEvaluations((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      )
      toast.success("Evaluation submitted successfully!", {
        description: `Feedback for ${selectedItem.lecturerName} (${selectedItem.unitCode}) has been recorded confidentially.`,
      })
      setSelectedItem(null)
    } catch {
      toast.error("Failed to submit lecturer evaluation.")
    } finally {
      setSubmitting(false)
    }
  }

  const columns = React.useMemo<ColumnDef<LecturerEvaluationItem>[]>(
    () => [
      {
        accessorKey: "unitCode",
        header: "Unit Code",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-foreground">
            {row.original.unitCode}
          </span>
        ),
      },
      {
        accessorKey: "unitTitle",
        header: "Course Unit Title",
        cell: ({ row }) => (
          <span className="font-medium text-xs text-foreground">
            {row.original.unitTitle}
          </span>
        ),
      },
      {
        accessorKey: "lecturerName",
        header: "Instructor",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <UserCheck className="size-3.5 text-muted-foreground shrink-0" strokeWidth={1.75} />
            <span>{row.original.lecturerName}</span>
          </div>
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
                  View Score
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

  const completedCount = evaluations.filter((e) => e.status === "completed").length

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Lecturer Evaluation"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Periodic Activities" },
          { label: "Lecturer Evaluation" },
        ]}
        description="Confidential end-of-semester faculty appraisal and curriculum delivery assessment."
      />

      {/* Summary Tracker Card */}
      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-3.5 px-5 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" strokeWidth={1.75} />
              Enrolled Course Evaluations • Semester 2 2026/2027
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono font-medium">
              {completedCount} of {evaluations.length} Completed
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <DataTable
            columns={columns}
            data={evaluations}
            loading={loading}
            searchPlaceholder="Search by course code, unit title, or instructor..."
            emptyIcon={FileQuestion}
            emptyTitle="No Course Units Scheduled"
            emptyDescription="There are no pending course units registered for evaluation this semester."
          />
        </CardContent>
      </Card>

      {/* Evaluation Questions Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-card border border-border">
          {selectedItem && (
            <form onSubmit={handleSubmitEvaluation}>
              <div className="p-6 space-y-6">
                <DialogHeader className="border-b border-border/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                        <GraduationCap className="size-4 text-primary" strokeWidth={1.75} />
                        Faculty Appraisal: {selectedItem.lecturerName}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground mt-1">
                        {selectedItem.unitCode} • {selectedItem.unitTitle} ({selectedItem.semester})
                      </DialogDescription>
                    </div>
                    <StatusBadge status={selectedItem.status} />
                  </div>
                </DialogHeader>

                {/* Rating Questions */}
                <div className="space-y-5 divide-y divide-border/40">
                  {LECTURER_EVALUATION_QUESTIONS.map((q, idx) => (
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
                        disabled={selectedItem.status === "completed"}
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

                {/* Comments Textarea */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label htmlFor="lecturer-feedback" className="text-xs font-semibold text-foreground">
                    Constructive Comments & Suggestions
                  </Label>
                  <Textarea
                    id="lecturer-feedback"
                    placeholder="Provide constructive feedback regarding lecture delivery, practical tutorials, or course pacing..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={selectedItem.status === "completed"}
                    rows={3}
                    className="text-xs resize-none"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Your evaluation is completely anonymous. Aggregate feedback is reviewed by the Dean and Senate Quality Assurance Directorate.
                  </p>
                </div>

                <DialogFooter className="flex flex-row justify-end gap-2 pt-4 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItem(null)}
                    disabled={submitting}
                    className="h-8 text-xs"
                  >
                    Close
                  </Button>
                  {selectedItem.status !== "completed" && (
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
                          Submit Appraisal
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
