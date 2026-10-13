import * as React from "react"
import { toast } from "sonner"
import {
  Clock,
  MapPin,
  User,
  Printer,
  Download,
  Coffee,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { getTimetableClasses } from "@/api/academics"
import type { TimetableClass } from "@/mocks/academics"

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const
type Weekday = (typeof WEEKDAYS)[number]

export function TimetablePage() {
  const [classes, setClasses] = React.useState<TimetableClass[]>([])
  const [selectedDay, setSelectedDay] = React.useState<Weekday>("Monday")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    async function loadData() {
      setLoading(true)
      try {
        const data = await getTimetableClasses()
        if (isMounted) setClasses(data)
      } catch {
        toast.error("Failed to load semester timetable.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const handlePrint = () => {
    toast.info("Preparing printable weekly timetable...")
    window.print()
  }

  const handleDownload = () => {
    toast.success("Timetable Downloaded", {
      description: "Weekly_Lecture_Timetable_Y4S2.pdf is ready.",
    })
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="My Timetable"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Academics" },
          { label: "My Timetable" },
        ]}
        description="Weekly lecture schedule, practical laboratory sessions, and venue allocations."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Printer className="size-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="size-3.5" strokeWidth={1.75} />
              <span>Download PDF</span>
            </Button>
          </div>
        }
      />

      {/* Weekday Tabs */}
      <Tabs
        value={selectedDay}
        onValueChange={(val) => setSelectedDay(val as Weekday)}
        className="space-y-3.5 w-full"
      >
        <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
          <TabsList className="bg-muted/60 p-0.5 h-9">
            {WEEKDAYS.map((day) => {
              const count = classes.filter((c) => c.day === day).length
              return (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="text-xs font-medium px-3 gap-1.5 data-[state=active]:font-semibold"
                >
                  <span>{day}</span>
                  <span className="text-[10px] rounded-full bg-muted px-1.5 py-0.2 text-muted-foreground">
                    {count}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <span className="text-xs text-muted-foreground hidden md:inline">
            Semester 2 • 2026/2027 Session
          </span>
        </div>

        {/* Tab Content Display */}
        {WEEKDAYS.map((day) => {
          const classesForDay = classes.filter((c) => c.day === day)

          return (
            <TabsContent key={day} value={day} className="space-y-3.5 mt-0">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-28 w-full rounded-xl" />
                ))
              ) : classesForDay.length > 0 ? (
                <div className="grid grid-cols-1 gap-3.5">
                  {classesForDay.map((item) => (
                    <Card
                      key={item.id}
                      className="rounded-xl border border-border/70 bg-card p-4 shadow-xs hover:border-primary/40 transition-colors"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left: Time and Unit info */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                              {item.code}
                            </span>
                            <Badge
                              variant={
                                item.type === "Practical"
                                  ? "secondary"
                                  : item.type === "Tutorial"
                                  ? "outline"
                                  : "default"
                              }
                              className="text-[11px] font-medium"
                            >
                              {item.type}
                            </Badge>
                          </div>

                          <h3 className="text-base font-semibold text-foreground tracking-tight">
                            {item.unitName}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                            <div className="flex items-center gap-1.5">
                              <Clock className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                              <span className="font-mono">{item.time}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <MapPin className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                              <span>{item.room}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <User className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                              <span>{item.lecturer}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Status / Stage Badge */}
                        <div className="shrink-0 sm:text-right">
                          <Badge variant="neutral" className="text-xs">
                            Active Session
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                /* One Empty Day (Friday) displaying the built-in EmptyState */
                <Card className="rounded-xl border border-border/60 bg-card shadow-xs">
                  <EmptyState
                    icon={Coffee}
                    title={`No scheduled classes for ${day}`}
                    description={`You have no lectures or practical sessions timetabled on ${day}. Use this time for personal study, research, or library assignments.`}
                    action={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDay("Monday")}
                        className="h-8 text-xs font-medium"
                      >
                        View Monday Schedule
                      </Button>
                    }
                  />
                </Card>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
