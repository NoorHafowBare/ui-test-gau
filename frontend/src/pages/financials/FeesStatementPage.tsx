import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { Download, FileText, Printer } from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { DataTable } from "@/components/common/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getFeeStatements } from "@/api/financials"
import type { FeeStatementItem } from "@/mocks/financials"

const formatKES = (amount: number) => {
  if (amount === 0) return "—"
  return `KES ${amount.toLocaleString("en-US")}`
}

export function FeesStatementPage() {
  const [data, setData] = React.useState<FeeStatementItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [downloading, setDownloading] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const statements = await getFeeStatements()
        if (isMounted) setData(statements)
      } catch {
        toast.error("Failed to load fee statement.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const handleDownloadPDF = () => {
    setDownloading(true)
    toast.info("Generating Fees Statement PDF...", {
      description: "Compiling official ledger records for EDS/0001/26.",
    })

    setTimeout(() => {
      setDownloading(false)
      toast.success("Fees Statement Downloaded", {
        description: "GAU_Fee_Statement_2026_2027.pdf is ready.",
      })
    }, 1200)
  }

  // Summary figures
  const totalDebit = React.useMemo(
    () => data.reduce((acc, row) => acc + row.debit, 0),
    [data]
  )
  const totalCredit = React.useMemo(
    () => data.reduce((acc, row) => acc + row.credit, 0),
    [data]
  )
  const currentBalance = totalDebit - totalCredit

  // TanStack Table columns
  const columns = React.useMemo<ColumnDef<FeeStatementItem>[]>(
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
        accessorKey: "reference",
        header: "Ref / Voucher",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.reference}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground text-sm">
              {row.original.description}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.academicYear} • {row.original.semester}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "debit",
        header: () => <div className="text-right">Debit (KES)</div>,
        cell: ({ row }) => {
          const debit = row.original.debit
          return (
            <div className="text-right font-mono text-sm tabular-nums">
              {debit > 0 ? (
                <span className="font-medium text-foreground">{formatKES(debit)}</span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "credit",
        header: () => <div className="text-right">Credit (KES)</div>,
        cell: ({ row }) => {
          const credit = row.original.credit
          return (
            <div className="text-right font-mono text-sm tabular-nums">
              {credit > 0 ? (
                <span className="font-medium text-success">{formatKES(credit)}</span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "balance",
        header: () => <div className="text-right">Balance (KES)</div>,
        cell: ({ row }) => {
          const bal = row.original.balance
          return (
            <div className="text-right font-mono text-sm font-semibold tabular-nums text-foreground">
              {formatKES(bal)}
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Fees Statement (PDF)"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Financials" },
          { label: "Fees Statement (PDF)" },
        ]}
        description="Comprehensive official accounting ledger detailing semester invoices, payments, and running balance."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Printer className="size-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="size-3.5" strokeWidth={1.75} />
              <span>{downloading ? "Generating..." : "Download PDF"}</span>
            </Button>
          </div>
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <Card className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-xs">
          <CardContent className="p-0">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Total Billed (Debits)
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-mono">
              KES {totalDebit.toLocaleString("en-US")}
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              Cumulative semester fees
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-xs">
          <CardContent className="p-0">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Total Paid (Credits)
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-success font-mono">
              KES {totalCredit.toLocaleString("en-US")}
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              Receipted remittances
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-xs">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Current Net Balance
              </span>
              <Badge
                variant={currentBalance > 0 ? "warning" : "success"}
                className="text-[10px] py-0.5 px-2"
              >
                {currentBalance > 0 ? "Due" : "Cleared"}
              </Badge>
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-mono">
              KES {currentBalance.toLocaleString("en-US")}
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              As of {new Date().toLocaleDateString("en-GB")}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Statements Table */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Search statement transactions..."
        emptyIcon={FileText}
        emptyTitle="No statement records available"
        emptyDescription="There are no billing or payment entries on your ledger for this academic session."
      />
    </div>
  )
}
