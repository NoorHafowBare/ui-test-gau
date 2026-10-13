import * as React from "react"
import { toast } from "sonner"
import {
  CheckCheck,
  Download,
  BookOpen,
  DollarSign,
  Building,
  Bed,
  Trophy,
  Laptop,
  GraduationCap,
  Calendar,
  UserCheck,
  MapPin,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  getClearanceStatus,
  toggleClearanceDemoMode,
  getClearanceDemoMode,
} from "@/api/clearance"
import type { ClearanceDepartment } from "@/mocks/clearance"

const ICON_MAP = {
  Library: BookOpen,
  Finance: DollarSign,
  Hostel: Bed,
  Department: Building,
  Sports: Trophy,
  ICT: Laptop,
  Dean: GraduationCap,
}

export function MyClearancePage() {
  const [departments, setDepartments] = React.useState<ClearanceDepartment[]>([])
  const [clearedCount, setClearedCount] = React.useState(0)
  const [totalCount, setTotalCount] = React.useState(7)
  const [percentage, setPercentage] = React.useState(0)
  const [isFullyCleared, setIsFullyCleared] = React.useState(false)
  const [isDemoComplete, setIsDemoComplete] = React.useState(getClearanceDemoMode())
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await getClearanceStatus()
        if (mounted) {
          setDepartments(data.departments)
          setClearedCount(data.clearedCount)
          setTotalCount(data.totalCount)
          setPercentage(data.percentage)
          setIsFullyCleared(data.isFullyCleared)
        }
      } catch {
        toast.error("Failed to load clearance records.")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [isDemoComplete])

  const handleToggleDemo = () => {
    const nextMode = toggleClearanceDemoMode()
    setIsDemoComplete(nextMode)
    toast.info(
      nextMode
        ? "Demo Mode: Set to 100% Cleared (All 7 Departments)"
        : "Demo Mode: Set to In-Progress (4 of 7 Departments Cleared)"
    )
  }

  const handleDownloadCertificate = () => {
    if (!isFullyCleared) return
    toast.success("Clearance Certificate Downloaded!", {
      description: "Official Garissa University Completion & Clearance Certificate (PDF) generated.",
    })
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="My Clearance"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Clearance" },
          { label: "My Clearance" },
        ]}
        description="Institutional clearance progress for graduation and academic completion across university departments."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleDemo}
              className="h-8 gap-1.5 text-xs font-medium"
              title="Toggle between in-progress and complete clearance states"
            >
              {isDemoComplete ? (
                <>
                  <ToggleRight className="size-4 text-primary" strokeWidth={1.75} />
                  Demo: 100% Cleared (Click to reset)
                </>
              ) : (
                <>
                  <ToggleLeft className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  Demo: In-Progress (Click for 100%)
                </>
              )}
            </Button>

            <Button
              size="sm"
              disabled={!isFullyCleared}
              onClick={handleDownloadCertificate}
              className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
            >
              <Download className="size-3.5" strokeWidth={1.75} />
              Download Clearance Certificate
            </Button>
          </div>
        }
      />

      {/* Clearance Progress Card */}
      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCheck className="size-4 text-primary" strokeWidth={1.75} />
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  University Exit Clearance Status
                </h3>
                <Badge
                  variant={isFullyCleared ? "default" : "secondary"}
                  className="text-xs font-mono font-medium"
                >
                  {clearedCount} of {totalCount} departments cleared
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {isFullyCleared
                  ? "All statutory institutional clearances have been verified and endorsed."
                  : "You must secure clearance from all 7 institutional offices prior to graduation certificate release."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="font-mono text-xl font-semibold text-foreground">
                  {percentage}%
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  Overall Completion
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <Progress value={percentage} className="h-2.5 w-full bg-muted/60" />
            <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
              <span>0% Start</span>
              <span>100% Full Clearance</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Notice when incomplete */}
      {!isFullyCleared && (
        <Alert variant="warning" className="border-warning/30 bg-warning/10 text-foreground">
          <div className="space-y-1">
            <AlertTitle className="text-xs font-semibold text-foreground">
              Clearance In Progress ({totalCount - clearedCount} Departments Pending)
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
              Please present required equipment, inventory items, or surveys to the pending department officers indicated below. The official Clearance Certificate will unlock automatically once all 7 offices mark your record as cleared.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {isFullyCleared && (
        <Alert variant="info" className="border-success/30 bg-success/10 text-foreground">
          <ShieldCheck className="size-4 text-success shrink-0 mt-0.5" strokeWidth={1.75} />
          <div className="space-y-1">
            <AlertTitle className="text-xs font-semibold text-foreground">
              Clearance Fully Verified
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
              Congratulations! All departments have verified your institutional exit. You can now download your official stamped Clearance Certificate.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Checklist-style Vertical Department Rows */}
      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-3.5 px-5 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight">
              Department Clearance Checklist
            </CardTitle>
            <span className="text-xs text-muted-foreground font-medium">
              Academic Year 2026/2027
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <div className="h-14 bg-muted/30 animate-pulse rounded-lg" />
              <div className="h-14 bg-muted/30 animate-pulse rounded-lg" />
              <div className="h-14 bg-muted/30 animate-pulse rounded-lg" />
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {departments.map((dept) => {
                const IconComponent = ICON_MAP[dept.iconName] || Building
                const isCleared = dept.status === "cleared"

                return (
                  <div
                    key={dept.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/15 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center shrink-0 border ${
                          isCleared
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }`}
                      >
                        <IconComponent className="size-4" strokeWidth={1.75} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-foreground">
                            {dept.name}
                          </h4>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {dept.code}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {dept.notes}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-0.5">
                          <span className="flex items-center gap-1">
                            <UserCheck className="size-3" strokeWidth={1.75} />
                            {dept.officer}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" strokeWidth={1.75} />
                            {dept.officeLocation}
                          </span>
                          {dept.dateCleared && (
                            <span className="flex items-center gap-1 font-mono text-foreground">
                              <Calendar className="size-3 text-muted-foreground" strokeWidth={1.75} />
                              Cleared: {dept.dateCleared}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 self-start sm:self-center pl-13 sm:pl-0">
                      <StatusBadge status={dept.status} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
