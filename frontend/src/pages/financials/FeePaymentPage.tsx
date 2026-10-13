import * as React from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  CreditCard,
  Info,
  ShieldCheck,
  Wallet,
  Loader2,
  Lock,
  ArrowRight,
  FileText,
  CheckCircle2,
  Building2,
  Smartphone,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { getFeePaymentInfo, submitFeePayment } from "@/api/financials"
import type { FeePaymentInfo } from "@/mocks/financials"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"

const formatKES = (amount: number) => `KES ${amount.toLocaleString("en-US")}`

export function FeePaymentPage() {
  const [paymentInfo, setPaymentInfo] = React.useState<FeePaymentInfo | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const info = await getFeePaymentInfo()
        if (isMounted) {
          setPaymentInfo(info)
        }
      } catch {
        toast.error("Failed to load fee payment details.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // Dynamic Zod schema based on loaded balance
  const paymentSchema = React.useMemo(() => {
    const maxBalance = paymentInfo?.outstandingBalance ?? 30000
    const minAmount = paymentInfo?.minimumPayment ?? 51

    return z.object({
      amount: z
        .string()
        .min(1, "Please enter an amount to pay")
        .refine(
          (val) => {
            const num = Number(val)
            return !isNaN(num) && num >= minAmount
          },
          {
            message: `Minimum payment is KES ${minAmount}`,
          }
        )
        .refine(
          (val) => {
            const num = Number(val)
            return !isNaN(num) && num <= maxBalance
          },
          {
            message: `Amount cannot exceed outstanding balance (${formatKES(maxBalance)})`,
          }
        ),
    })
  }, [paymentInfo])

  type PaymentFormValues = z.infer<typeof paymentSchema>

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
    },
    mode: "onChange",
  })

  const onSubmit = async (values: PaymentFormValues) => {
    setSubmitting(true)
    try {
      const numAmount = Number(values.amount)
      const result = await submitFeePayment({ amount: numAmount })
      toast.success("Payment initiated successfully!", {
        description: `Redirecting to eCitizen/PesaFlow checkout. Ref: ${result.transactionRef} for ${formatKES(
          result.amount
        )}.`,
        duration: 5000,
      })
      form.reset({ amount: "" })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred."
      toast.error("Payment initiation failed", {
        description: message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSelectQuickAmount = (preset: number) => {
    form.setValue("amount", String(preset), { shouldValidate: true })
  }

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <PageHeader
          title={<Skeleton className="h-7 w-48" />}
          breadcrumbs={[
            { label: "Home", href: "/app/dashboard" },
            { label: "Financials" },
            { label: "Fee Payment" },
          ]}
        />
        <Skeleton className="h-16 w-full rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          <Skeleton className="lg:col-span-5 h-[420px] rounded-xl" />
          <Skeleton className="lg:col-span-7 h-[420px] rounded-xl" />
        </div>
      </div>
    )
  }

  const balance = paymentInfo?.outstandingBalance ?? 0

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Fee Payment"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Financials" },
          { label: "Fee Payment" },
        ]}
        description="Make student tuition and statutory fee payments securely via PesaFlow and eCitizen."
        actions={
          <Link
            to="/app/financials/statement"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "h-8 gap-1.5 text-xs font-medium",
            })}
          >
            <FileText className="size-3.5" strokeWidth={1.75} />
            View Fee Statement
          </Link>
        }
      />

      {/* Calm Informational Alert across full width */}
      <Alert variant="info" className="w-full border-info/30 bg-info/10 text-foreground py-2.5">
        <Info className="size-4 text-info mt-0.5 shrink-0" strokeWidth={1.75} />
        <div className="space-y-0.5">
          <AlertTitle className="text-xs sm:text-sm font-semibold text-foreground">
            PesaFlow Secure Checkout
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
            You will be redirected to the official eCitizen payment portal to complete
            your transaction securely using M-Pesa, Airtel Money, or direct bank payment.
          </AlertDescription>
        </div>
      </Alert>

      {/* Edge-to-Edge 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-start">
        {/* Left Column: Account & Balance Summary (5 of 12 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-xl border border-border/80 bg-card shadow-xs">
            <CardHeader className="border-b border-border/50 py-3 px-4.5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
                    <Wallet className="size-4 text-primary" strokeWidth={1.75} />
                    Account Balance Summary
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Official ledger balance for current semester
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {paymentInfo?.studentReg}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Prominent Read-Only Outstanding Balance Box */}
              <div className="rounded-lg border border-border/70 bg-muted/30 p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Current Outstanding Balance
                  </span>
                  <Badge
                    variant={balance > 0 ? "warning" : "success"}
                    className="text-[11px] font-medium"
                  >
                    {balance > 0 ? "Balance Due" : "Settled"}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <div className="text-3xl font-semibold tracking-tight text-foreground font-mono">
                    {formatKES(balance)}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {paymentInfo?.currency || "KES"}
                  </span>
                </div>
              </div>

              {/* Student & Session Overview */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider">
                    Student Name
                  </span>
                  <span className="font-semibold text-foreground">
                    {paymentInfo?.studentName}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider">
                    Registration No.
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {paymentInfo?.studentReg}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider">
                    Programme
                  </span>
                  <span className="font-medium text-foreground text-right max-w-[220px] truncate">
                    {paymentInfo?.programme}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider">
                    Academic Session
                  </span>
                  <span className="font-medium text-foreground">
                    {paymentInfo?.academicYear} • {paymentInfo?.semester}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider">
                    Total Billed / Paid
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {formatKES(paymentInfo?.totalBilled ?? 0)} / {formatKES(paymentInfo?.totalPaid ?? 0)}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-border/50 py-3 bg-muted/20">
              <Link
                to="/app/financials/statement"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
              >
                <span>View full itemized fees statement</span>
                <ArrowRight className="size-3.5" strokeWidth={1.75} />
              </Link>
            </CardFooter>
          </Card>

          {/* Payment Guidance Card */}
          <Card className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary" strokeWidth={1.75} />
              eCitizen Gateway Information
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Once you click <strong>Proceed to Pay</strong>, you will be redirected to the Government
              eCitizen gateway where you can authorize transaction via M-Pesa STK Push or standard
              bank transfer. Official receipts are issued automatically upon settlement.
            </p>
          </Card>
        </div>

        {/* Right Column: Payment Details & Checkout Form (7 of 12 columns) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="rounded-xl border border-border/80 bg-card shadow-xs">
            <CardHeader className="border-b border-border/50 py-3 px-4.5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
                    <CreditCard className="size-4.5 text-primary" strokeWidth={1.75} />
                    Payment Details
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Specify the amount to remit and proceed to payment gateway
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  eCitizen PesaFlow
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Payment Form via React Hook Form + Zod */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-xs sm:text-sm font-medium text-foreground">
                            Amount to Pay (KES)
                          </FormLabel>
                          <span className="text-[11px] text-muted-foreground">
                            Min: KES 51 • Max: {formatKES(balance)}
                          </span>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                              KES
                            </span>
                            <Input
                              type="number"
                              inputMode="numeric"
                              placeholder="Enter amount (min KES 51)"
                              className="pl-13 h-10 text-sm font-medium tabular-nums"
                              disabled={submitting || balance === 0}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <FormDescription className="text-[11px] text-muted-foreground mt-0.5">
                          {paymentInfo?.convenienceFeeNote}
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Quick Preset Buttons */}
                  {balance > 0 && (
                    <div className="space-y-1.5 pt-0.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        Quick Amount Selection:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={submitting}
                          onClick={() => handleSelectQuickAmount(balance)}
                          className="h-7.5 text-xs font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                        >
                          Full Balance ({formatKES(balance)})
                        </Button>
                        {balance > 100 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={submitting}
                            onClick={() => handleSelectQuickAmount(Math.round(balance / 2))}
                            className="h-7.5 text-xs font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                          >
                            50% ({formatKES(Math.round(balance / 2))})
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={submitting}
                          onClick={() => handleSelectQuickAmount(51)}
                          className="h-7.5 text-xs font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                        >
                          Min KES 51
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Payment Channel Badges */}
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1.5">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                      Supported Payment Methods:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <Badge variant="outline" className="gap-1 font-normal py-0.5 text-xs">
                        <Smartphone className="size-3 text-primary" /> M-Pesa Paybill
                      </Badge>
                      <Badge variant="outline" className="gap-1 font-normal py-0.5 text-xs">
                        <Smartphone className="size-3 text-primary" /> Airtel Money
                      </Badge>
                      <Badge variant="outline" className="gap-1 font-normal py-0.5 text-xs">
                        <Building2 className="size-3 text-primary" /> Direct Bank Deposit
                      </Badge>
                      <Badge variant="outline" className="gap-1 font-normal py-0.5 text-xs">
                        <CreditCard className="size-3 text-primary" /> Visa / Mastercard
                      </Badge>
                    </div>
                  </div>

                  {/* Full-Width Primary Proceed to Pay Button with Loading State */}
                  <div className="pt-1">
                    <Button
                      type="submit"
                      className="w-full h-10 text-xs sm:text-sm font-semibold tracking-wide"
                      disabled={submitting || balance === 0}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Connecting to PesaFlow...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 size-4" strokeWidth={1.75} />
                          Proceed to Pay
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>

            {/* Muted Shield Footer */}
            <CardFooter className="flex items-center justify-center border-t border-border/50 py-3.5 bg-muted/20">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <ShieldCheck className="size-4 text-primary shrink-0" strokeWidth={1.75} />
                <span>Secured by PesaFlow & eCitizen</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
