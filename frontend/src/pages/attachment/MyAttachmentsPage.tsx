import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import {
  Briefcase,
  Plus,
  Building2,
  Calendar,
  MapPin,
  UserCheck,
  FileCheck2,
  Loader2,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { DataTable } from "@/components/common/DataTable"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { getAttachments, createAttachment } from "@/api/attachment"
import type { AttachmentRecord } from "@/mocks/attachment"

export function MyAttachmentsPage() {
  const [attachments, setAttachments] = React.useState<AttachmentRecord[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // Form states
  const [organization, setOrganization] = React.useState("")
  const [supervisor, setSupervisor] = React.useState("")
  const [role, setRole] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getAttachments()
        if (mounted) setAttachments(data)
      } catch {
        toast.error("Failed to load industrial attachment records.")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const resetForm = () => {
    setOrganization("")
    setSupervisor("")
    setRole("")
    setLocation("")
    setStartDate("")
    setEndDate("")
    setNotes("")
  }

  const handleCreateAttachment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!organization || !supervisor || !startDate || !endDate || !location) {
      toast.error("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    try {
      const formatPeriod = (start: string, end: string) => {
        const s = new Date(start).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        const eDate = new Date(end).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        return `${s} - ${eDate}`
      }

      const created = await createAttachment({
        organization,
        supervisor,
        role: role || "Industrial Attachment Intern",
        location,
        startDate,
        endDate,
        period: formatPeriod(startDate, endDate),
        notes,
      })

      setAttachments((prev) => [created, ...prev])
      toast.success("Attachment application submitted!", {
        description: `Application for placement at ${organization} is now under coordinator review.`,
      })
      resetForm()
      setDialogOpen(false)
    } catch {
      toast.error("Failed to submit attachment application.")
    } finally {
      setSubmitting(false)
    }
  }

  const columns = React.useMemo<ColumnDef<AttachmentRecord>[]>(
    () => [
      {
        accessorKey: "period",
        header: "Period",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-muted-foreground shrink-0" strokeWidth={1.75} />
            <span className="font-medium text-xs text-foreground">
              {row.original.period}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "organization",
        header: "Organization & Placement",
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary shrink-0" strokeWidth={1.75} />
              {row.original.organization}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground shrink-0" strokeWidth={1.75} />
              {row.original.location} • <span className="text-foreground/80 font-medium">{row.original.role}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "supervisor",
        header: "Supervisor",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <UserCheck className="size-3.5 text-muted-foreground shrink-0" strokeWidth={1.75} />
            <span className="text-xs font-medium text-foreground">
              {row.original.supervisor}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
    ],
    []
  )

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Industrial Attachment"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Industrial Attachment" },
          { label: "My Attachments" },
        ]}
        description="Manage practical workplace training, enterprise supervisor assignments, and faculty assessment reports."
        actions={
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-3.5" strokeWidth={1.75} />
            New Attachment
          </Button>
        }
      />

      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-4 px-5 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
                <FileCheck2 className="size-4 text-primary" strokeWidth={1.75} />
                My Attachment Records
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                History of approved field placements, logbooks, and supervisor assessments.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <DataTable
            columns={columns}
            data={attachments}
            loading={loading}
            searchPlaceholder="Search by organization, supervisor, or location..."
            emptyIcon={Briefcase}
            emptyTitle="No industrial attachments found"
            emptyDescription="You have not submitted any workplace attachment placements yet."
            emptyAction={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="size-3.5" strokeWidth={1.75} />
                Submit New Attachment
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* New Attachment Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-card border border-border">
          <form onSubmit={handleCreateAttachment}>
            <div className="p-6 space-y-4">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-primary" strokeWidth={1.75} />
                  Submit New Industrial Attachment
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  Enter host enterprise details and workplace supervisor contacts for university placement accreditation.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="att-org" className="text-xs font-medium">
                    Host Organization / Company <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="att-org"
                    placeholder="e.g. Kenya Commercial Bank (KCB) or Safaricom PLC"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="att-supervisor" className="text-xs font-medium">
                      Supervisor Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="att-supervisor"
                      placeholder="e.g. Eng. David Mwangi"
                      value={supervisor}
                      onChange={(e) => setSupervisor(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="att-role" className="text-xs font-medium">
                      Designation / Role
                    </Label>
                    <Input
                      id="att-role"
                      placeholder="e.g. Junior Data Analyst Intern"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="att-location" className="text-xs font-medium">
                    Workplace Location / Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="att-location"
                    placeholder="e.g. Upper Hill Commercial Center, Nairobi"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="att-start" className="text-xs font-medium">
                      Commencement Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="att-start"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="att-end" className="text-xs font-medium">
                      Completion Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="att-end"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="att-notes" className="text-xs font-medium">
                    Department or Scope Notes
                  </Label>
                  <Textarea
                    id="att-notes"
                    placeholder="Brief description of primary duties, assigned branch, or technical stack..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
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
                    "Submit Application"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
