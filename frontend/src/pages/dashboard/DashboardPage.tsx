import * as React from "react"
import { Link } from "react-router-dom"
import {
  Receipt,
  CheckCircle2,
  Scale,
  ArrowRight,
  User,
  Hash,
  CreditCard,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AtSign,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  CalendarDays,
  FileText,
  DollarSign,
} from "lucide-react"

import { getStudentProfile } from "@/api/student"
import { getBillingSummary } from "@/api/billing"
import type { StudentProfile } from "@/mocks/user"
import type { BillingSummary } from "@/mocks/billing"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export function DashboardPage() {
  const [student, setStudent] = React.useState<StudentProfile | null>(null)
  const [billing, setBilling] = React.useState<BillingSummary | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [showEmailPassword, setShowEmailPassword] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true
    async function loadData() {
      setLoading(true)
      try {
        const [studentData, billingData] = await Promise.all([
          getStudentProfile(),
          getBillingSummary(),
        ])
        if (isMounted) {
          setStudent(studentData)
          setBilling(billingData)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const formatKES = (amount: number) => {
    return `KES ${amount.toLocaleString("en-US")}`
  }

  // SKELETON LOADING STATE (matches exact layout shapes)
  if (loading || !student || !billing) {
    return (
      <div className="space-y-4 sm:space-y-4.5">
        {/* Page Header Skeleton */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-40 rounded-lg" />
        </div>

        {/* 3 Summary Cards Skeleton */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-none ring-0 bg-card rounded-xl p-3.5 sm:p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-24 pt-1" />
            </Card>
          ))}
        </div>

        {/* 2-Column Section Skeleton */}
        <div className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-12 items-start">
          {/* Profile Card Skeleton */}
          <Card className="border-0 shadow-none ring-0 bg-card rounded-xl p-4 lg:col-span-4 space-y-3">
            <Skeleton className="size-14 sm:size-16 rounded-full mx-auto" />
            <div className="space-y-1.5 text-center">
              <Skeleton className="h-4.5 w-36 mx-auto" />
              <Skeleton className="h-3 w-48 mx-auto" />
            </div>
            <div className="flex justify-between items-center py-2 border-t border-border/40">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4.5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-8 w-full rounded-lg" />
          </Card>

          {/* Personal Info Skeleton */}
          <Card className="border-0 shadow-none ring-0 bg-card rounded-xl p-4 lg:col-span-8 space-y-2.5">
            <Skeleton className="h-4.5 w-40" />
            <div className="divide-y divide-border/40 pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-8.5 sm:h-9 flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-4.5">
      {/* 1. PageHeader at the top */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbPage className="text-muted-foreground font-normal">
                  Home
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mt-0.5">
            Dashboard
          </h1>
        </div>

        {/* Profile button on right */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 rounded-lg border-border bg-card hover:bg-muted"
          >
            <Avatar className="size-5.5 border border-border">
              <AvatarImage src={student.avatarUrl} alt={student.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                {student.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
              {student.fullName}
            </span>
          </Button>
        </div>
      </div>

      {/* 2. Row of 3 Summary Cards (Flat, white, NO border, NO shadow, rounded-xl) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {/* TOTAL BILLED: Neutral/Primary Tint */}
        <Card className="border-0 shadow-none ring-0 bg-card rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Billed
              </span>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Receipt className="size-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-foreground tabular-nums tracking-tight mt-1">
              {formatKES(billing.totalBilled)}
            </div>
          </div>
          <div className="pt-2 mt-1.5 border-t border-border/40">
            <Link
              to="/app/financials/statement"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors"
            >
              <span>View statement</span>
              <ArrowRight className="size-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </Card>

        {/* TOTAL PAID: Success Tint */}
        <Card className="border-0 shadow-none ring-0 bg-card rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Paid
              </span>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                <CheckCircle2 className="size-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-foreground tabular-nums tracking-tight mt-1">
              {formatKES(billing.totalPaid)}
            </div>
          </div>
          <div className="pt-2 mt-1.5 border-t border-border/40">
            <Link
              to="/app/financials/receipts"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors"
            >
              <span>View receipts</span>
              <ArrowRight className="size-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </Card>

        {/* BALANCE DUE: Warning Tint */}
        <Card className="border-0 shadow-none ring-0 bg-card rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Balance Due
              </span>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Scale className="size-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-foreground tabular-nums tracking-tight mt-1">
              {formatKES(billing.balanceDue)}
            </div>
          </div>
          <div className="pt-2 mt-1.5 border-t border-border/40">
            <Link
              to="/app/financials/fee-payment"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors"
            >
              <span>Pay now</span>
              <ArrowRight className="size-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions (clean outline buttons) */}
      <div className="flex flex-wrap items-center gap-2 py-0.5">
        <span className="text-xs font-medium text-muted-foreground mr-1">
          Quick Actions:
        </span>
        <Button
          variant="outline"
          size="sm"
          render={<Link to="/app/financials/fee-payment" className="gap-1.5 text-xs h-8" />}
        >
          <DollarSign className="size-3.5 text-primary" strokeWidth={1.75} />
          <span>Pay Fees</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link to="/app/financials/statement" className="gap-1.5 text-xs h-8" />}
        >
          <FileText className="size-3.5 text-primary" strokeWidth={1.75} />
          <span>Download Statement</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={<Link to="/app/academics/timetable" className="gap-1.5 text-xs h-8" />}
        >
          <CalendarDays className="size-3.5 text-primary" strokeWidth={1.75} />
          <span>View Timetable</span>
        </Button>
      </div>

      {/* 3. Two columns: Student Profile (~1/3) & Personal Information (~2/3) */}
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-12 items-start">
        {/* Student Profile Card (~1/3) */}
        <Card className="border-0 shadow-none ring-0 bg-card rounded-xl p-4 lg:col-span-4 flex flex-col justify-between space-y-3.5">
          <CardHeader className="p-0 space-y-0 pb-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Student Profile
              </span>
              <Badge variant="success" className="text-[11px] gap-1 py-0.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>{student.status}</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col items-center text-center space-y-2.5">
            {/* Centered Avatar */}
            <div className="relative">
              <Avatar className="size-14 sm:size-16 border-2 border-primary/20 bg-primary/10">
                <AvatarImage src={student.avatarUrl} alt={student.fullName} />
                <AvatarFallback className="bg-primary/15 text-primary font-semibold text-lg">
                  {student.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Student Name & Degree */}
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                {student.fullName}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xs leading-relaxed">
                {student.programme}
              </p>
            </div>

            {/* Current Stage Badge */}
            <div className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/40 border border-border/50 text-xs">
              <span className="text-muted-foreground font-medium">Current Stage</span>
              <Badge variant="neutral" className="font-semibold text-xs px-2 py-0.5">
                {student.stage}
              </Badge>
            </div>
          </CardContent>

          {/* Secondary-outline Update Profile Button */}
          <Button
            variant="outline"
            className="w-full h-8 rounded-lg gap-2 text-xs font-medium border-border hover:bg-muted"
          >
            <UserCheck className="size-3.5" strokeWidth={1.75} />
            <span>Update Profile</span>
          </Button>
        </Card>

        {/* Personal Information Card (~2/3) */}
        <Card className="border-0 shadow-none ring-0 bg-card rounded-xl p-4 lg:col-span-8 space-y-2.5">
          <CardHeader className="p-0 pb-0.5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base font-semibold text-foreground">
                Personal Information
              </CardTitle>
              <span className="text-xs text-muted-foreground font-mono">
                {student.admissionNo}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* 2-column description-list layout, compact 34-36px rows, hairline separators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-0 divide-y md:divide-y-0 divide-border/40">
              {/* Column 1 */}
              <div className="divide-y divide-border/50">
                {/* 1. Admission No */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Hash className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>Admission No</span>
                  </div>
                  <span className="font-mono font-medium text-foreground">
                    {student.admissionNo || "—"}
                  </span>
                </div>

                {/* 2. ID / Passport */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <CreditCard className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>ID / Passport</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {student.nationalId || "—"}
                  </span>
                </div>

                {/* 3. Full Name */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <User className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>Full Name</span>
                  </div>
                  <span className="font-medium text-foreground uppercase truncate max-w-[170px]">
                    {student.fullName || "—"}
                  </span>
                </div>

                {/* 4. Gender */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Users className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>Gender</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {student.gender || "—"}
                  </span>
                </div>

                {/* 5. Date of Birth */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Calendar className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>Date of Birth</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {student.dob || "—"}
                  </span>
                </div>
              </div>

              {/* Column 2 */}
              <div className="divide-y divide-border/50">
                {/* 6. Phone Number */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Phone className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>Phone Number</span>
                  </div>
                  <span className="text-muted-foreground">
                    {student.phone || "—"}
                  </span>
                </div>

                {/* 7. Email Address */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Mail className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>Email Address</span>
                  </div>
                  <span className="font-medium text-foreground truncate max-w-[170px]">
                    {student.email || "—"}
                  </span>
                </div>

                {/* 8. Postal Address */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <MapPin className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>Postal Address</span>
                  </div>
                  <span className="font-medium text-foreground truncate max-w-[170px]">
                    {student.postalAddress || "—"}
                  </span>
                </div>

                {/* 9. University Email */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <AtSign className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>University Email</span>
                  </div>
                  <span className="font-medium text-foreground truncate max-w-[170px]">
                    {student.universityEmail || "—"}
                  </span>
                </div>

                {/* 10. University Email Password (Masked with reveal button) */}
                <div className="h-8.5 sm:h-9 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <KeyRound className="size-3.5 text-muted-foreground/75" strokeWidth={1.75} />
                    <span>Email Password</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">
                      {showEmailPassword
                        ? student.universityEmailPassword || "—"
                        : "••••••••"}
                    </span>
                    {student.universityEmailPassword && (
                      <button
                        type="button"
                        onClick={() => setShowEmailPassword((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        aria-label={showEmailPassword ? "Hide email password" : "Show email password"}
                      >
                        {showEmailPassword ? (
                          <EyeOff className="size-3.5" strokeWidth={1.75} />
                        ) : (
                          <Eye className="size-3.5" strokeWidth={1.75} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
