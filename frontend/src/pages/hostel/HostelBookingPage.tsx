import * as React from "react"
import { toast } from "sonner"
import {
  Bed,
  CheckCircle2,
  Users,
  AlertTriangle,
  Loader2,
  Calendar,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  MapPin,
  Sparkles,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  getHostels,
  getRoomsForHostel,
  getCurrentHostelBooking,
  bookHostelRoom,
  cancelHostelBooking,
  resetDemoBooking,
} from "@/api/hostel"
import type {
  Hostel,
  HostelRoom,
  ExistingHostelBooking,
} from "@/mocks/hostel"

export function HostelBookingPage() {
  const [hostels, setHostels] = React.useState<Hostel[]>([])
  const [selectedHostelId, setSelectedHostelId] = React.useState<string>("h-hall1")
  const [rooms, setRooms] = React.useState<HostelRoom[]>([])
  const [selectedRoom, setSelectedRoom] = React.useState<HostelRoom | null>(null)
  const [existingBooking, setExistingBooking] = React.useState<ExistingHostelBooking | null>(null)

  // Booking confirmation Dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [bookingInProgress, setBookingInProgress] = React.useState(false)

  // Cancellation AlertDialog
  const [cancelAlertOpen, setCancelAlertOpen] = React.useState(false)
  const [cancelInProgress, setCancelInProgress] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [hostelList, booking] = await Promise.all([
          getHostels(),
          getCurrentHostelBooking(),
        ])
        if (mounted) {
          setHostels(hostelList)
          setExistingBooking(booking)
        }
      } catch {
        toast.error("Failed to load hostel data.")
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Load rooms when selected hostel changes
  React.useEffect(() => {
    let mounted = true
    async function loadRooms() {
      if (!selectedHostelId) return
      try {
        const roomList = await getRoomsForHostel(selectedHostelId)
        if (mounted) {
          setRooms(roomList)
          setSelectedRoom(null)
        }
      } catch {
        toast.error("Failed to load hostel rooms.")
      }
    }
    loadRooms()
    return () => {
      mounted = false
    }
  }, [selectedHostelId])

  const selectedHostel = hostels.find((h) => h.id === selectedHostelId)

  const handleConfirmBooking = async () => {
    if (!selectedRoom || !selectedHostelId) return
    setBookingInProgress(true)
    try {
      const newBooking = await bookHostelRoom(selectedHostelId, selectedRoom.id)
      setExistingBooking(newBooking)
      toast.success("Hostel room allocated successfully!", {
        description: `You have been allocated ${selectedRoom.roomNumber} in ${newBooking.hostelName}.`,
      })
      setConfirmDialogOpen(false)
      setSelectedRoom(null)
    } catch {
      toast.error("Failed to book hostel room.")
    } finally {
      setBookingInProgress(false)
    }
  }

  const handleConfirmCancel = async () => {
    setCancelInProgress(true)
    try {
      await cancelHostelBooking()
      setExistingBooking(null)
      toast.info("Hostel reservation cancelled.", {
        description: "Your allocated room has been released to the general student accommodation pool.",
      })
      setCancelAlertOpen(false)
    } catch {
      toast.error("Failed to cancel hostel booking.")
    } finally {
      setCancelInProgress(false)
    }
  }

  const handleToggleDemoState = () => {
    if (existingBooking) {
      setExistingBooking(null)
      toast.info("Switched to: New Room Reservation Mode (Step 1-3)")
    } else {
      resetDemoBooking()
      getCurrentHostelBooking().then((b) => setExistingBooking(b))
      toast.info("Switched to: Existing Allocated Room Summary Mode")
    }
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Hostel Booking"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Periodic Activities" },
          { label: "Hostel Booking" },
        ]}
        description="On-campus hall reservation, bed allocation, and semester accommodation fee clearance."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleDemoState}
              className="h-8 gap-1.5 text-xs font-medium"
              title="Toggle between existing allocated room and new booking steps"
            >
              {existingBooking ? (
                <>
                  <ToggleRight className="size-4 text-primary" strokeWidth={1.75} />
                  Demo: View New Booking Flow
                </>
              ) : (
                <>
                  <ToggleLeft className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  Demo: View Existing Allocation
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Existing Booking State */}
      {existingBooking ? (
        <div className="space-y-6">
          <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/50 py-4 px-5 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bed className="size-4 text-primary" strokeWidth={1.75} />
                    <CardTitle className="text-base font-semibold text-foreground tracking-tight">
                      Current Room Allocation Summary
                    </CardTitle>
                    <Badge variant="default" className="text-xs bg-success/10 text-success border-success/20">
                      Confirmed & Cleared
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground">
                    Booking Reference: <strong className="font-mono text-foreground">{existingBooking.bookingReference}</strong> • {existingBooking.semester} {existingBooking.academicYear}
                  </CardDescription>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCancelAlertOpen(true)}
                  className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 self-start sm:self-auto"
                >
                  <XCircle className="size-3.5" strokeWidth={1.75} />
                  Cancel Room Booking
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Hall of Residence</span>
                  <span className="font-semibold text-foreground text-sm block">
                    {existingBooking.hostelName}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Code: {existingBooking.hostelCode}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Room & Bed Details</span>
                  <span className="font-semibold text-foreground text-sm block">
                    {existingBooking.roomNumber}
                  </span>
                  <span className="text-[11px] text-primary font-medium block">
                    {existingBooking.bedNumber} ({existingBooking.floor})
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Accommodation Fee</span>
                  <span className="font-mono font-semibold text-foreground text-sm block">
                    KES {existingBooking.feePerSemester.toLocaleString()}.00
                  </span>
                  <span className="text-[10px] text-success font-medium flex items-center gap-1">
                    <CheckCircle2 className="size-3" strokeWidth={1.75} />
                    Fee Billed & Settled
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-muted/20 border border-border/40 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">Allocation Date</span>
                  <span className="font-mono font-medium text-foreground text-sm flex items-center gap-1">
                    <Calendar className="size-3 text-muted-foreground" strokeWidth={1.75} />
                    {existingBooking.allocatedDate}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Valid for Full Semester
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3.5 text-xs space-y-1 text-muted-foreground">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <ShieldCheck className="size-4 text-primary" strokeWidth={1.75} />
                  Hostel Key Collection Instructions:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Present this allocation slip and your student ID to the <strong>Hall Warden Desk (Block B, Ground Floor)</strong> to complete the room inventory check and receive your door key. Room keys must not be duplicated.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* New Booking Flow: Steps 1 to 3 */
        <div className="space-y-6">
          {/* Step 1: Select Hostel */}
          <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/50 py-3.5 px-5 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                    1
                  </div>
                  <CardTitle className="text-base font-semibold text-foreground tracking-tight">
                    Step 1: Select Hall of Residence
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs font-medium">
                  {hostels.length} Halls Available
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="max-w-md space-y-1.5">
                <Select value={selectedHostelId} onValueChange={(val) => setSelectedHostelId(val ?? "")}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Choose a hall of residence..." />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels.map((h) => (
                      <SelectItem key={h.id} value={h.id} className="text-xs">
                        <span className="font-semibold text-foreground mr-1.5">{h.name}</span>
                        <span className="text-muted-foreground">({h.gender})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedHostel && (
                  <div className="pt-2 text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <MapPin className="size-3 text-primary shrink-0" strokeWidth={1.75} />
                      {selectedHostel.location}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedHostel.amenities.map((a) => (
                        <span key={a} className="rounded bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground border border-border/40">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Room List as Selectable Cards */}
          <Card className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
            <CardHeader className="border-b border-border/50 py-3.5 px-5 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground tracking-tight">
                      Step 2: Select an Available Room
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Click a room card to select your preference for {selectedHostel?.name}
                    </CardDescription>
                  </div>
                </div>

                {selectedRoom && (
                  <Badge variant="default" className="text-xs font-mono self-start sm:self-auto">
                    Selected: {selectedRoom.roomNumber} (KES {selectedRoom.feePerSemester.toLocaleString()})
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => {
                  const isAvailable = room.status === "Available"
                  const isSelected = selectedRoom?.id === room.id

                  return (
                    <div
                      key={room.id}
                      onClick={() => isAvailable && setSelectedRoom(room)}
                      className={`rounded-xl border p-4 transition-all flex flex-col justify-between gap-3 ${
                        !isAvailable
                          ? "opacity-60 bg-muted/10 border-border/40 cursor-not-allowed"
                          : isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/25 cursor-pointer shadow-xs"
                          : "border-border/70 hover:border-border hover:bg-muted/20 cursor-pointer shadow-2xs"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                            <Bed className="size-3.5 text-primary" strokeWidth={1.75} />
                            {room.roomNumber}
                          </h4>
                          <Badge
                            variant={isAvailable ? "default" : "secondary"}
                            className="text-[10px] font-medium"
                          >
                            {room.status}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Floor:</span>
                            <span className="font-medium text-foreground">{room.floor}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Users className="size-3" strokeWidth={1.75} />
                              Capacity:
                            </span>
                            <span className="font-medium text-foreground">
                              {room.occupied}/{room.capacity} beds occupied
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {room.amenities.map((am) => (
                            <span key={am} className="text-[10px] rounded bg-muted/40 px-1.5 py-0.5 text-muted-foreground border border-border/30">
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Semester Fee</span>
                          <span className="font-mono text-xs font-semibold text-foreground">
                            KES {room.feePerSemester.toLocaleString()}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          disabled={!isAvailable}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isAvailable) setSelectedRoom(room)
                          }}
                          className="h-7 text-xs font-medium px-2.5"
                        >
                          {isSelected ? "Selected" : isAvailable ? "Select Room" : "Full"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Reservation Action Strip */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-card shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" strokeWidth={1.75} />
                Step 3: Confirm Room Reservation
              </span>
              <p className="text-xs text-muted-foreground">
                {selectedRoom
                  ? `Selected ${selectedRoom.roomNumber} in ${selectedHostel?.name}. Click proceed to review booking details.`
                  : "Please select an available room in Step 2 above to proceed with booking."}
              </p>
            </div>

            <Button
              disabled={!selectedRoom}
              onClick={() => setConfirmDialogOpen(true)}
              className="gap-1.5 text-xs font-semibold h-9 shadow-xs"
            >
              <Bed className="size-3.5" strokeWidth={1.75} />
              Proceed to Booking ({selectedRoom ? selectedRoom.roomNumber : "None"})
            </Button>
          </div>

          {/* Step 3 Confirmation Dialog */}
          <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-card border border-border">
              {selectedRoom && (
                <div className="p-6 space-y-4">
                  <DialogHeader>
                    <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                      <Bed className="size-4 text-primary" strokeWidth={1.75} />
                      Confirm Hostel Room Allocation
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1">
                      Review room allocation summary and statutory accommodation charges.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="rounded-lg border border-border/60 bg-muted/15 p-3.5 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Hall of Residence:</span>
                      <span className="font-semibold text-foreground">{selectedHostel?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Room & Floor:</span>
                      <span className="font-semibold text-foreground">{selectedRoom.roomNumber} ({selectedRoom.floor})</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Room Capacity:</span>
                      <span className="font-semibold text-foreground">{selectedRoom.capacity} Bed Unit</span>
                    </div>
                    <div className="pt-2 border-t border-border/50 flex justify-between items-center font-semibold text-foreground text-sm">
                      <span>Accommodation Fee:</span>
                      <span className="font-mono text-primary">KES {selectedRoom.feePerSemester.toLocaleString()}.00</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    By confirming, the accommodation fee will be posted to your student fee statement. You will have 14 days to clear statutory charges.
                  </p>

                  <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDialogOpen(false)}
                      disabled={bookingInProgress}
                      className="h-8 text-xs"
                    >
                      Back
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
                          Allocating Room...
                        </>
                      ) : (
                        "Confirm Allocation"
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Cancellation AlertDialog */}
      <AlertDialog open={cancelAlertOpen} onOpenChange={setCancelAlertOpen}>
        <AlertDialogContent className="max-w-md bg-card border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive" strokeWidth={1.75} />
              Cancel Hostel Room Reservation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
              Are you sure you want to cancel your allocated room ({existingBooking?.roomNumber} in {existingBooking?.hostelName})? This bed space will immediately be returned to the general allocation pool for other students.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-row justify-end gap-2 pt-3">
            <AlertDialogCancel
              disabled={cancelInProgress}
              className="h-8 text-xs"
            >
              Keep My Room
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelInProgress}
              className="h-8 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelInProgress ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Booking"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
