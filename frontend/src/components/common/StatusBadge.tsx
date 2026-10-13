import { Badge } from "@/components/ui/badge"
import { cn } from "cn"

export type StatusCategory =
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "neutral"

export interface StatusBadgeProps {
  status: string
  label?: string
  showDot?: boolean
  className?: string
}

function resolveStatusCategory(status: string): StatusCategory {
  const normalized = status.trim().toLowerCase()

  switch (normalized) {
    // Success: paid, cleared, approved, completed, active
    case "paid":
    case "cleared":
    case "approved":
    case "completed":
    case "active":
    case "settled":
    case "success":
      return "success"

    // Warning: pending, in review, processing
    case "pending":
    case "in review":
    case "processing":
    case "review":
    case "warning":
    case "awaiting approval":
      return "warning"

    // Destructive: rejected, overdue, failed, unpaid, cancelled
    case "rejected":
    case "overdue":
    case "failed":
    case "unpaid":
    case "destructive":
    case "cancelled":
    case "dropped":
      return "destructive"

    // Info: in progress, enrolled, partial, submitted
    case "in progress":
    case "enrolled":
    case "partial":
    case "submitted":
    case "ongoing":
    case "info":
      return "info"

    // Neutral: closed, draft, archived, na
    case "closed":
    case "draft":
    case "archived":
    case "na":
    case "n/a":
    case "inactive":
    case "neutral":
    default:
      return "neutral"
  }
}

const DOT_COLOR_MAP: Record<StatusCategory, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  neutral: "bg-muted-foreground",
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const category = resolveStatusCategory(status)
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <Badge
      variant={category}
      className={cn("gap-1.5 font-medium tracking-wide", className)}
    >
      {showDot && (
        <span
          className={cn(
            "size-1.5 rounded-full shrink-0",
            DOT_COLOR_MAP[category]
          )}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
    </Badge>
  )
}
