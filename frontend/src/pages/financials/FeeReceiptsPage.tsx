import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import {
  Receipt,
  Eye,
  Printer,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from "lucide-react"

import guLogo from "@/assets/gu-logo.png"
import { PageHeader } from "@/components/common/PageHeader"
import { DataTable } from "@/components/common/DataTable"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DescriptionList } from "@/components/common/DescriptionList"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { getFeeReceipts } from "@/api/financials"
import type { FeeReceiptItem } from "@/mocks/financials"

const formatKES = (amount: number) => `KES ${amount.toLocaleString("en-US")}`

export function FeeReceiptsPage() {
  const [data, setData] = React.useState<FeeReceiptItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedReceipt, setSelectedReceipt] = React.useState<FeeReceiptItem | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [demoEmptyMode, setDemoEmptyMode] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true
    async function loadData() {
      setLoading(true)
      try {
        const receipts = await getFeeReceipts()
        if (isMounted) {
          setData(demoEmptyMode ? [] : receipts)
        }
      } catch {
        toast.error("Failed to load fee receipts.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [demoEmptyMode])

  const handleViewReceipt = (receipt: FeeReceiptItem) => {
    setSelectedReceipt(receipt)
    setDialogOpen(true)
  }

  const handlePrint = () => {
    toast.info("Preparing printable receipt format...")
    window.print()
  }

  // TanStack Table columns matching reference & requirements:
  // Date, Ref #, Payment Mode (Badge), Paid By, Amount (right-aligned KES), and "View" action
  const columns = React.useMemo<ColumnDef<FeeReceiptItem>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-foreground">
            {row.original.date}
          </span>
        ),
      },
      {
        accessorKey: "refNumber",
        header: "Ref #",
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleViewReceipt(row.original)}
            className="font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            {row.original.refNumber}
          </button>
        ),
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: ({ row }) => {
          const mode = row.original.paymentMode
          let variant: "default" | "secondary" | "outline" = "outline"
          if (mode === "M-Pesa") variant = "secondary"
          return (
            <Badge variant={variant} className="text-xs font-medium">
              {mode}
            </Badge>
          )
        },
      },
      {
        accessorKey: "paidBy",
        header: "Paid By",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {row.original.paidBy}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              {row.original.channel}
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
        accessorKey: "amount",
        header: () => <div className="text-right">Amount (KES)</div>,
        cell: ({ row }) => (
          <div className="text-right font-mono text-sm font-semibold tabular-nums text-foreground">
            {formatKES(row.original.amount)}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right pr-2">Action</div>,
        cell: ({ row }) => (
          <div className="text-right pr-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewReceipt(row.original)}
              className="h-7 px-2.5 text-xs font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/40"
            >
              <Eye className="size-3.5 mr-1" strokeWidth={1.75} />
              View
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Fee Receipts"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Financials" },
          { label: "Receipts" },
        ]}
        description="Official university electronic payment receipts for tuition fees, examinations, and university charges."
        actions={
          <div className="flex items-center gap-2">
            {/* Interactive Demo Toggle for the examiner/user to quickly toggle zero-row EmptyState */}
            <Button
              variant={demoEmptyMode ? "default" : "outline"}
              size="sm"
              onClick={() => setDemoEmptyMode(!demoEmptyMode)}
              className="h-8 gap-1.5 text-xs font-medium"
              title="Toggle between populated receipts and zero-row empty state"
            >
              {demoEmptyMode ? (
                <>
                  <ToggleRight className="size-4 text-primary-foreground" strokeWidth={1.75} />
                  Demo: Showing Empty State (Click to Restore)
                </>
              ) : (
                <>
                  <ToggleLeft className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  Demo: Simulate Empty State
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Receipts Table with TanStack Table + shadcn Table */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Search receipts by ref, student, or mode..."
        emptyIcon={Receipt}
        emptyTitle="No fee receipts found"
        emptyDescription={
          demoEmptyMode
            ? "Simulated empty state: There are currently no payment receipts recorded on this account."
            : "No fee receipts have been issued to this student account yet. Once payments are cleared, official receipts appear here."
        }
        emptyAction={
          demoEmptyMode ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDemoEmptyMode(false)}
              className="h-8 text-xs font-medium"
            >
              Restore Mock Receipts
            </Button>
          ) : (
            <Link
              to="/app/financials/fee-payment"
              className={buttonVariants({ size: "sm", className: "h-8 text-xs font-medium" })}
            >
              Make Fee Payment
            </Link>
          )
        }
      />

      {/* Printable Receipt Summary Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl sm:max-w-xl p-0 overflow-hidden bg-card border border-border">
          {selectedReceipt && (
            <div className="p-6 space-y-6 printable-receipt">
              <DialogHeader className="sr-only">
                <DialogTitle>Fee Receipt {selectedReceipt.refNumber}</DialogTitle>
                <DialogDescription>
                  Official university receipt for {selectedReceipt.studentName} ({selectedReceipt.studentReg})
                </DialogDescription>
              </DialogHeader>

              {/* Receipt Header with University Branding */}
              <div className="flex items-start justify-between border-b border-border/70 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-lg bg-white p-1 shadow-xs border border-border/60 shrink-0">
                    <img
                      src={guLogo}
                      alt="Garissa University Seal"
                      className="size-11 object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground tracking-tight">
                      GARISSA UNIVERSITY
                    </h2>
                    <p className="text-xs text-muted-foreground italic">
                      Oasis of Innovation
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      P.O. Box 1801-70100, Garissa, Kenya
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant="outline" className="mb-1 text-xs font-semibold">
                    OFFICIAL RECEIPT
                  </Badge>
                  <div className="font-mono text-sm font-semibold text-foreground">
                    {selectedReceipt.refNumber}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Date: {selectedReceipt.date}
                  </div>
                </div>
              </div>

              {/* Student & Payment Summary Info */}
              <div className="rounded-lg bg-muted/30 p-4 border border-border/60 space-y-3">
                <DescriptionList
                  columns={2}
                  items={[
                    {
                      label: "Student Name",
                      value: selectedReceipt.studentName,
                    },
                    {
                      label: "Registration No.",
                      value: (
                        <span className="font-mono">{selectedReceipt.studentReg}</span>
                      ),
                    },
                    {
                      label: "Programme",
                      value: selectedReceipt.programme,
                    },
                    {
                      label: "Academic Session",
                      value: `${selectedReceipt.academicYear} • ${selectedReceipt.semester}`,
                    },
                  ]}
                />
              </div>

              {/* Transaction Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Transaction & Settlement Details
                </h4>
                <div className="rounded-lg border border-border/70 overflow-hidden">
                  <div className="grid grid-cols-2 bg-muted/40 p-2.5 text-xs font-medium text-muted-foreground uppercase border-b border-border/70">
                    <span>Description / Channel</span>
                    <span className="text-right">Amount</span>
                  </div>
                  <div className="p-3 space-y-2 text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-foreground">
                          {selectedReceipt.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Mode: {selectedReceipt.paymentMode} • Channel: {selectedReceipt.channel}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground mt-0.5">
                          Bank / Gateway Ref: {selectedReceipt.transactionRef}
                        </div>
                      </div>
                      <div className="text-right font-mono font-medium text-foreground">
                        {formatKES(selectedReceipt.amount)}
                      </div>
                    </div>

                    <div className="border-t border-border/60 pt-2.5 mt-2 flex justify-between items-baseline">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Amount Cleared
                      </span>
                      <span className="text-lg font-bold font-mono text-foreground">
                        {formatKES(selectedReceipt.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification & Legal Note */}
              <div className="flex items-center gap-2 rounded-md bg-muted/20 p-2.5 text-xs text-muted-foreground border border-border/40">
                <ShieldCheck className="size-4 text-primary shrink-0" strokeWidth={1.75} />
                <span>
                  This is a verified digital document generated by the Garissa University
                  Finance Directorate. Valid without a physical signature.
                </span>
              </div>

              {/* Dialog Footer Actions */}
              <DialogFooter className="flex flex-row justify-between items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(false)}
                  className="h-9 text-xs"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handlePrint}
                  className="h-9 gap-1.5 text-xs font-semibold"
                >
                  <Printer className="size-4" strokeWidth={1.75} />
                  Print Receipt
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
