import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import {
  FileText,
  Plus,
  Calendar,
  Send,
  Loader2,
  Inbox,
  Eye,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { getStudentRequests, createStudentRequest } from "@/api/requests"
import { REQUEST_TYPES, type StudentRequestRecord } from "@/mocks/requests"

export function MyRequestsPage() {
  const [requests, setRequests] = React.useState<StudentRequestRecord[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // View details modal
  const [viewRequest, setViewRequest] = React.useState<StudentRequestRecord | null>(null)

  // Form states
  const [type, setType] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [details, setDetails] = React.useState("")

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getStudentRequests()
        if (mounted) setRequests(data)
      } catch {
        toast.error("Failed to load student requests.")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!type || !subject || !details) {
      toast.error("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    try {
      const created = await createStudentRequest({
        type,
        subject,
        details,
      })

      setRequests((prev) => [created, ...prev])
      toast.success("Student request submitted!", {
        description: `Request ${created.referenceNumber} has been received and routed to the Academic Registrar.`,
      })

      // Reset
      setType("")
      setSubject("")
      setDetails("")
      setDialogOpen(false)
    } catch {
      toast.error("Failed to submit student request.")
    } finally {
      setSubmitting(false)
    }
  }

  const columns = React.useMemo<ColumnDef<StudentRequestRecord>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Calendar className="size-3" strokeWidth={1.75} />
            {row.original.date}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Request Category",
        cell: ({ row }) => (
          <span className="text-xs font-semibold text-foreground">
            {row.original.type}
          </span>
        ),
      },
      {
        accessorKey: "subject",
        header: "Subject & Description",
        cell: ({ row }) => (
          <div className="space-y-0.5 max-w-md">
            <span className="text-xs font-medium text-foreground block truncate">
              {row.original.subject}
            </span>
            <span className="text-[11px] text-muted-foreground block truncate">
              {row.original.details}
            </span>
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
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewRequest(row.original)}
            className="h-7 text-xs gap-1 px-2 text-primary"
          >
            <Eye className="size-3" strokeWidth={1.75} />
            View
          </Button>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Student Requests"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Student Requests" },
          { label: "My Requests" },
        ]}
        description="Official petitions, bonafide letters, exam remarking appeals, and university administrative inquiries."
        actions={
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-3.5" strokeWidth={1.75} />
            New Request
          </Button>
        }
      />

      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-4 px-5 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
                <FileText className="size-4 text-primary" strokeWidth={1.75} />
                My Submitted Requests
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Track formal ticket progress and registrar board determinations.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <DataTable
            columns={columns}
            data={requests}
            loading={loading}
            searchPlaceholder="Search by type, subject, or description..."
            emptyIcon={Inbox}
            emptyTitle="No Student Requests"
            emptyDescription="You have not submitted any administrative requests or petitions yet."
            emptyAction={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="size-3.5" strokeWidth={1.75} />
                Create First Request
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* New Request Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-card border border-border">
          <form onSubmit={handleCreateRequest}>
            <div className="p-6 space-y-4">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <FileText className="size-4 text-primary" strokeWidth={1.75} />
                  Submit New Student Request
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  Select the category and provide clear documentation so university officers can address your request efficiently.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 pt-1">
                {/* Type Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="req-type" className="text-xs font-medium">
                    Request Category <span className="text-destructive">*</span>
                  </Label>
                  <Select value={type} onValueChange={(val) => setType(val ?? "")}>
                    <SelectTrigger id="req-type" className="h-9 text-xs">
                      <SelectValue placeholder="Select request category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {REQUEST_TYPES.map((t) => (
                        <SelectItem key={t} value={t} className="text-xs">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="req-subject" className="text-xs font-medium">
                    Subject / Purpose <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="req-subject"
                    placeholder="Brief summary of your request..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                {/* Details Textarea */}
                <div className="space-y-1.5">
                  <Label htmlFor="req-details" className="text-xs font-medium">
                    Full Details & Justification <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="req-details"
                    placeholder="Describe your request thoroughly, citing relevant academic terms, specific dates, or external requirements..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                    rows={4}
                    className="text-xs resize-none"
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-row justify-end gap-2 pt-3 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="h-8 gap-1.5 text-xs font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" strokeWidth={1.75} />
                      Submit Request
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Request Details Modal */}
      <Dialog open={!!viewRequest} onOpenChange={(open) => !open && setViewRequest(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-card border border-border">
          {viewRequest && (
            <div className="p-6 space-y-4">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-base font-semibold text-foreground">
                    {viewRequest.referenceNumber}
                  </DialogTitle>
                  <StatusBadge status={viewRequest.status} />
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  Submitted on {viewRequest.date}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Category</span>
                  <span className="font-semibold text-foreground">{viewRequest.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Subject</span>
                  <span className="font-medium text-foreground">{viewRequest.subject}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Full Description</span>
                  <p className="mt-1 p-2.5 rounded-lg bg-muted/30 text-foreground leading-relaxed border border-border/40">
                    {viewRequest.details}
                  </p>
                </div>
                {viewRequest.responseRemarks && (
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Administrative Remarks</span>
                    <p className="mt-1 p-2.5 rounded-lg bg-primary/5 text-foreground leading-relaxed border border-primary/20">
                      {viewRequest.responseRemarks}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="pt-2 border-t border-border/50">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewRequest(null)}
                  className="h-8 text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
