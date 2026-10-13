import * as React from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  BookOpen,
  Calendar,
  Loader2,
  FileText,
  DollarSign,
  Receipt,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  getSuppEligibleUnits,
  getSuppBookings,
  bookSupplementaryUnits,
} from "@/api/specialExams"
import type { SuppEligibleUnit, SuppBookingRecord } from "@/mocks/specialExams"

export function SuppBookingPage() {
  const [eligibleUnits, setEligibleUnits] = React.useState<SuppEligibleUnit[]>([])
  const [bookings, setBookings] = React.useState<SuppBookingRecord[]>([])
  const [selectedUnitIds, setSelectedUnitIds] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false)
  const [bookingInProgress, setBookingInProgress] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const [units, currentBookings] = await Promise.all([
          getSuppEligibleUnits(),
          getSuppBookings(),
        ])
        if (mounted) {
          setEligibleUnits(units)
          setBookings(currentBookings)
        }
      } catch {
        toast.error("Failed to load supplementary examination data.")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const selectedUnits = eligibleUnits.filter((u) => selectedUnitIds.includes(u.id))
  const totalFee = selectedUnits.reduce((acc, u) => acc + u.fee, 0)

  const toggleUnit = (id: string) => {
    setSelectedUnitIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleConfirmBooking = async () => {
    setBookingInProgress(true)
    try {
      const newBooking = await bookSupplementaryUnits(selectedUnitIds)
      setBookings((prev) => [newBooking, ...prev])
      toast.success("Supplementary booking confirmed!", {
        description: `Booking Ref ${newBooking.bookingReference} for ${selectedUnitIds.length} unit(s) has been submitted.`,
      })
      setSelectedUnitIds([])
      setConfirmModalOpen(false)
    } catch {
      toast.error("Failed to submit supplementary booking.")
    } finally {
      setBookingInProgress(false)
    }
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Supplementary Booking"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Special & Supp Exams" },
          { label: "Supplementary Booking" },
        ]}
        description="Register and clear statutory examination fees for re-sitting failed or referred curriculum units."
      />

      {/* Official Guidelines Alert */}
      <Alert variant="warning" className="border-warning/30 bg-warning/10 text-foreground">
        <AlertTriangle className="size-4 text-warning mt-0.5 shrink-0" strokeWidth={1.75} />
        <div className="space-y-1">
          <AlertTitle className="text-sm font-semibold text-foreground">
            Supplementary Assessment Policy & Fee Notice
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
            The statutory fee for each supplementary paper is <strong>KES 1,000.00</strong>. Candidates must clear their semester tuition fee balance prior to sitting supplementary examinations. Unpaid bookings will not be issued an examination permit card.
          </AlertDescription>
        </div>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form Card (2 Columns) */}
        <Card className="lg:col-span-2 rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <CardHeader className="border-b border-border/50 py-4 px-5 bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
                  <BookOpen className="size-4 text-primary" strokeWidth={1.75} />
                  Referred Units Available for Supplementary
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Select the course units you wish to register for this sitting session.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono font-medium">
                {eligibleUnits.length} Units Eligible
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {loading ? (
              <div className="space-y-3 py-4">
                <div className="h-14 bg-muted/30 animate-pulse rounded-lg" />
                <div className="h-14 bg-muted/30 animate-pulse rounded-lg" />
              </div>
            ) : eligibleUnits.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="size-8 text-success" strokeWidth={1.75} />
                <p className="font-semibold text-foreground">No Pending Supplementary Units</p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  You have cleared all course units. No referred grades require supplementary testing at this time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50 rounded-lg border border-border/60 overflow-hidden">
                {eligibleUnits.map((unit) => {
                  const isChecked = selectedUnitIds.includes(unit.id)
                  return (
                    <div
                      key={unit.id}
                      onClick={() => toggleUnit(unit.id)}
                      className={`flex items-start justify-between p-3.5 transition-colors cursor-pointer select-none ${
                        isChecked ? "bg-primary/5" : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleUnit(unit.id)}
                          className="mt-0.5"
                          aria-label={`Select ${unit.code}`}
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-foreground">
                              {unit.code}
                            </span>
                            <Badge variant="destructive" className="text-[10px] font-medium">
                              {unit.previousGrade}
                            </Badge>
                          </div>
                          <p className="text-xs font-medium text-foreground">
                            {unit.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {unit.academicYear} • {unit.semester}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          KES {unit.fee.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-muted-foreground">Per Paper</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fee Summary & Payment Card (1 Column) */}
        <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-border/50 py-4 px-5 bg-muted/20">
              <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
                <DollarSign className="size-4 text-primary" strokeWidth={1.75} />
                Supplementary Fee Summary
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Breakdown of units and payment calculation
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Selected Papers:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {selectedUnits.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Fee Rate Per Unit:</span>
                  <span className="font-semibold text-foreground font-mono">
                    KES 1,000.00
                  </span>
                </div>

                <div className="pt-2 border-t border-border/50 flex justify-between items-center text-sm font-semibold">
                  <span className="text-foreground">Total Fee Payable:</span>
                  <span className="font-mono text-base text-primary">
                    KES {totalFee.toLocaleString()}.00
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 p-3 text-xs space-y-1.5 border border-border/40">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <CreditCard className="size-3.5 text-primary" strokeWidth={1.75} />
                  Payment Instructions
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Pay via M-PESA Paybill <strong>522522</strong>, Account <strong>1149912000</strong> or Equity Bank counter using your Student Reg Number.
                </p>
              </div>
            </CardContent>
          </div>

          <div className="p-5 pt-0">
            <Button
              className="w-full gap-2 text-xs font-semibold h-9 shadow-xs"
              disabled={selectedUnitIds.length === 0}
              onClick={() => setConfirmModalOpen(true)}
            >
              <Receipt className="size-3.5" strokeWidth={1.75} />
              Book Selected Units ({selectedUnitIds.length})
            </Button>
          </div>
        </Card>
      </div>

      {/* Booked Units History */}
      <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/50 py-3.5 px-5 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <FileText className="size-4 text-primary" strokeWidth={1.75} />
              Recent Supplementary Bookings
            </CardTitle>
            <Badge variant="outline" className="text-xs font-medium">
              {bookings.length} Bookings Logged
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          {bookings.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-xs">
              No previous supplementary bookings recorded.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {bookings.map((booking) => (
                <div key={booking.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {booking.bookingReference}
                      </span>
                      <StatusBadge status={booking.paymentStatus} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Units: {booking.units.map((u) => `${u.code} (${u.title})`).join(", ")}
                    </div>
                  </div>

                  <div className="text-right sm:self-center flex sm:flex-col items-center sm:items-end justify-between gap-1 text-xs">
                    <span className="font-mono font-semibold text-foreground">
                      KES {booking.totalFee.toLocaleString()}.00
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" strokeWidth={1.75} />
                      {booking.bookedDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-card border border-border">
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <Receipt className="size-4 text-primary" strokeWidth={1.75} />
                Confirm Supplementary Booking
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                You are booking {selectedUnits.length} paper(s) for the upcoming supplementary examination session.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 rounded-lg border border-border/60 p-3 text-xs bg-muted/20">
              {selectedUnits.map((u) => (
                <div key={u.id} className="flex justify-between items-center py-1">
                  <span className="font-medium text-foreground">{u.code} - {u.title}</span>
                  <span className="font-mono font-semibold text-foreground">KES {u.fee.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-border/50 flex justify-between font-semibold text-foreground text-sm">
                <span>Total Fee:</span>
                <span className="font-mono text-primary">KES {totalFee.toLocaleString()}.00</span>
              </div>
            </div>

            <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmModalOpen(false)}
                disabled={bookingInProgress}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmBooking}
                disabled={bookingInProgress}
                className="h-8 gap-1.5 text-xs font-semibold"
              >
                {bookingInProgress ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
