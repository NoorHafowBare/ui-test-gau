import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import {
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { DataTable } from "@/components/common/DataTable"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DescriptionList } from "@/components/common/DescriptionList"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

import {
  getAcademicStudentSummary,
  getUnitRegistrationStatus,
  getAvailableUnits,
  getRegisteredUnits,
  registerSelectedUnits,
} from "@/api/academics"
import type {
  AcademicStudentSummary,
  AvailableCourseUnit,
  RegisteredCourseUnit,
} from "@/mocks/academics"
import { REGISTRATION_OPEN } from "@/mocks/academics"

export function RegisterUnitsPage() {
  const [student, setStudent] = React.useState<AcademicStudentSummary | null>(null)
  const [availableUnits, setAvailableUnits] = React.useState<AvailableCourseUnit[]>([])
  const [registeredUnits, setRegisteredUnits] = React.useState<RegisteredCourseUnit[]>([])
  const [isRegistrationOpen, setIsRegistrationOpen] = React.useState<boolean>(REGISTRATION_OPEN)
  const [loading, setLoading] = React.useState(true)

  // Selection state for available units
  const [selectedUnitIds, setSelectedUnitIds] = React.useState<string[]>([])
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [registering, setRegistering] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true
    async function loadData() {
      setLoading(true)
      try {
        const [studentData, statusData, availData, regData] = await Promise.all([
          getAcademicStudentSummary(),
          getUnitRegistrationStatus(),
          getAvailableUnits(),
          getRegisteredUnits(),
        ])
        if (isMounted) {
          setStudent(studentData)
          setIsRegistrationOpen(statusData.isOpen)
          setAvailableUnits(availData)
          setRegisteredUnits(regData)
        }
      } catch {
        toast.error("Failed to load unit registration details.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // Calculate selected total credits
  const selectedCredits = React.useMemo(() => {
    return availableUnits
      .filter((u) => selectedUnitIds.includes(u.id))
      .reduce((sum, u) => sum + u.creditHours, 0)
  }, [availableUnits, selectedUnitIds])

  const toggleSelectUnit = React.useCallback((unitId: string) => {
    setSelectedUnitIds((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    )
  }, [])

  const toggleSelectAll = React.useCallback(() => {
    if (selectedUnitIds.length === availableUnits.length) {
      setSelectedUnitIds([])
    } else {
      setSelectedUnitIds(availableUnits.map((u) => u.id))
    }
  }, [availableUnits, selectedUnitIds.length])

  const selectAllCore = React.useCallback(() => {
    const coreIds = availableUnits.filter((u) => u.type === "Core").map((u) => u.id)
    setSelectedUnitIds(coreIds)
  }, [availableUnits])

  const handleConfirmRegistration = async () => {
    setRegistering(true)
    try {
      const updated = await registerSelectedUnits(selectedUnitIds)
      setRegisteredUnits(updated)
      setAvailableUnits((prev) => prev.filter((u) => !selectedUnitIds.includes(u.id)))
      toast.success("Units registered successfully!", {
        description: `${selectedUnitIds.length} course units have been registered for ${student?.semester}.`,
      })
      setSelectedUnitIds([])
      setConfirmDialogOpen(false)
    } catch {
      toast.error("Failed to register course units.")
    } finally {
      setRegistering(false)
    }
  }

  // Columns for Available Units Table (OPEN State)
  const availableColumns = React.useMemo<ColumnDef<AvailableCourseUnit>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <div className="flex items-center pl-1">
            <Checkbox
              checked={
                availableUnits.length > 0 &&
                selectedUnitIds.length === availableUnits.length
              }
              onCheckedChange={toggleSelectAll}
              aria-label="Select all units"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center pl-1">
            <Checkbox
              checked={selectedUnitIds.includes(row.original.id)}
              onCheckedChange={() => toggleSelectUnit(row.original.id)}
              aria-label={`Select ${row.original.code}`}
            />
          </div>
        ),
      },
      {
        accessorKey: "code",
        header: "Unit Code",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-foreground">
            {row.original.code}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: "Unit Title",
        cell: ({ row }) => (
          <span className="font-medium text-foreground text-sm">
            {row.original.title}
          </span>
        ),
      },
      {
        accessorKey: "creditHours",
        header: "Credit Hours",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium text-foreground">
            {row.original.creditHours}.0
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Classification",
        cell: ({ row }) => (
          <Badge
            variant={row.original.type === "Core" ? "default" : "secondary"}
            className="text-[11px] font-medium"
          >
            {row.original.type}
          </Badge>
        ),
      },
      {
        accessorKey: "lecturer",
        header: "Instructor",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium">
            {row.original.lecturer}
          </span>
        ),
      },
    ],
    [availableUnits, selectedUnitIds, toggleSelectAll, toggleSelectUnit]
  )

  // Columns for Registered Units Table
  const registeredColumns = React.useMemo<ColumnDef<RegisteredCourseUnit>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Unit Code",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-foreground">
            {row.original.code}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: "Unit Title",
        cell: ({ row }) => (
          <span className="font-medium text-foreground text-sm">
            {row.original.title}
          </span>
        ),
      },
      {
        accessorKey: "creditHours",
        header: "Credit Hours",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium text-foreground">
            {row.original.creditHours}.0
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge
            variant={row.original.type === "Core" ? "default" : "secondary"}
            className="text-[11px] font-medium"
          >
            {row.original.type}
          </Badge>
        ),
      },
      {
        accessorKey: "registeredDate",
        header: "Date Registered",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.registeredDate}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Approval Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
    ],
    []
  )

  if (loading || !student) {
    return (
      <div className="space-y-6 w-full">
        <PageHeader
          title={<Skeleton className="h-7 w-48" />}
          breadcrumbs={[
            { label: "Home", href: "/app/dashboard" },
            { label: "Academics" },
            { label: "Register Units" },
          ]}
        />
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Units Registration"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Academics" },
          { label: "Register Units" },
        ]}
        description="Select and confirm course unit enrollment for current semester curriculum validation."
        actions={
          <div className="flex items-center gap-2">
            {/* Demo Toggle to switch between Closed and Open registration states */}
            <Button
              variant={isRegistrationOpen ? "default" : "outline"}
              size="sm"
              onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}
              className="h-8 gap-1.5 text-xs font-medium"
              title="Toggle between closed and open registration periods"
            >
              {isRegistrationOpen ? (
                <>
                  <ToggleRight className="size-4 text-primary-foreground" strokeWidth={1.75} />
                  Demo: Registration OPEN (Click to Close)
                </>
              ) : (
                <>
                  <ToggleLeft className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  Demo: Registration CLOSED (Click to Open)
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Student Summary Card: Values in normal foreground color (NOT green text) */}
      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-2.5 px-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs sm:text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" strokeWidth={1.75} />
              Student Registration Profile
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono font-medium">
              {student.stage}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-4">
          <DescriptionList
            columns={2}
            compact
            items={[
              {
                label: "Student No",
                value: <span className="font-mono text-foreground font-semibold">{student.studentNumber}</span>,
              },
              {
                label: "Semester",
                value: <span className="text-foreground font-semibold">{student.semester}</span>,
              },
              {
                label: "Names",
                value: <span className="text-foreground font-semibold">{student.names}</span>,
              },
              {
                label: "E-mail",
                value: <span className="text-foreground font-normal">{student.email}</span>,
              },
              {
                label: "Programme",
                value: <span className="text-foreground font-semibold">{student.programme}</span>,
              },
              {
                label: "Stage",
                value: <span className="font-mono text-foreground font-semibold">{student.stage}</span>,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Registration Period Alert: Warning styling (NOT alarming red) when closed */}
      {!isRegistrationOpen ? (
        <Alert variant="warning" className="w-full border-warning/30 bg-warning/10 text-foreground py-2.5">
          <AlertTriangle className="size-4 text-warning mt-0.5 shrink-0" strokeWidth={1.75} />
          <div className="space-y-0.5">
            <AlertTitle className="text-xs sm:text-sm font-semibold text-foreground">
              Unit registration is closed. The deadline has passed.
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
              Official semester unit enrollment for {student.semester} closed on Friday, 16th January 2027.
              To request late registration approval, submit a petition via Student Requests or contact your Academic Dean.
            </AlertDescription>
          </div>
        </Alert>
      ) : (
        <Alert variant="info" className="w-full border-info/30 bg-info/10 text-foreground py-2.5">
          <CheckCircle2 className="size-4 text-info mt-0.5 shrink-0" strokeWidth={1.75} />
          <div className="space-y-0.5">
            <AlertTitle className="text-xs sm:text-sm font-semibold text-foreground">
              Unit Registration Window is Currently Active
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
              Select your required core and elective units below and click <strong>Register Selected Units</strong> to submit your course enrollment.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Unit Registration Form (shown when Registration is OPEN) */}
      {isRegistrationOpen && (
        <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <CardHeader className="border-b border-border/50 py-3 px-4 bg-muted/20">
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 text-primary" strokeWidth={1.75} />
                  <CardTitle className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                    Unit Registration Form
                  </CardTitle>
                  <Badge variant="default" className="text-[10px] font-medium bg-primary/10 text-primary border-primary/20">
                    Registration Open
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Select your approved course units for {student.stage} • {student.semester}. A minimum of 12.0 credit hours (maximum 18.0) is required.
                </CardDescription>
              </div>

              {/* Form Action Controls & Credit Load Counter */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs">
                  <span className="text-muted-foreground">Selected:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {selectedCredits}.0 / 18.0 CH
                  </span>
                  <Badge
                    variant={selectedCredits >= 12 && selectedCredits <= 18 ? "default" : "outline"}
                    className="text-[10px] font-medium"
                  >
                    {selectedCredits === 0
                      ? "0 Units"
                      : selectedCredits < 12
                      ? "Below Minimum"
                      : "Normal Load"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllCore}
                    className="h-8 text-xs font-medium"
                    disabled={availableUnits.length === 0}
                  >
                    Select All Core
                  </Button>
                  <Button
                    size="sm"
                    disabled={selectedUnitIds.length === 0}
                    onClick={() => setConfirmDialogOpen(true)}
                    className="h-8 gap-1.5 text-xs font-semibold"
                  >
                    <BookOpen className="size-3.5" strokeWidth={1.75} />
                    Register Selected Units ({selectedUnitIds.length})
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            {availableUnits.length > 0 ? (
              <DataTable
                columns={availableColumns}
                data={availableUnits}
                searchPlaceholder="Filter course units by code, title, or instructor..."
              />
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="size-8 text-primary" strokeWidth={1.75} />
                <p className="font-semibold text-foreground">All Course Units Registered</p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  You have enrolled in all available course units for this semester. Review your confirmed units in the section below.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* My Registered Units Section */}
      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-3.5 px-5 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" strokeWidth={1.75} />
              <CardTitle className="text-base font-semibold text-foreground tracking-tight">
                My Registered Units
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              {registeredUnits.length} Units Enrolled
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <DataTable
            columns={registeredColumns}
            data={registeredUnits}
            searchPlaceholder="Search enrolled units..."
            emptyIcon={BookOpen}
            emptyTitle="No units registered yet for this semester"
            emptyDescription="You have not yet completed unit registration for this academic semester."
          />
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Registering Selected Units */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-card border border-border">
          <div className="p-6 space-y-5">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="size-4 text-primary" strokeWidth={1.75} />
                Confirm Semester Unit Registration
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                You are about to register the following {selectedUnitIds.length} course units ({selectedCredits}.0 total credit hours) for {student.stage} {student.semester}.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-border/60 overflow-hidden">
              <div className="max-h-48 overflow-y-auto divide-y divide-border/40 text-xs">
                {availableUnits
                  .filter((u) => selectedUnitIds.includes(u.id))
                  .map((unit) => (
                    <div key={unit.id} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-semibold text-foreground mr-2">
                          {unit.code}
                        </span>
                        <span className="text-foreground">{unit.title}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {unit.creditHours}.0 CH
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-md bg-muted/20 p-2.5 text-xs text-muted-foreground border border-border/40">
              Please ensure your curriculum requirements are met. You will not be able to drop core units after submission without Dean approval.
            </div>

            <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDialogOpen(false)}
                disabled={registering}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmRegistration}
                disabled={registering}
                className="h-9 gap-1.5 text-xs font-semibold"
              >
                {registering ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" strokeWidth={1.75} />
                    Confirm Registration
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
