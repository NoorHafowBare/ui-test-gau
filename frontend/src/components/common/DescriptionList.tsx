import * as React from "react"
import { cn } from "cn"

export interface DescriptionListItem {
  label: React.ReactNode
  value: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export interface DescriptionListProps {
  items: DescriptionListItem[]
  columns?: 1 | 2 | 3
  compact?: boolean
  className?: string
}

export function DescriptionList({
  items,
  columns = 2,
  compact = false,
  className,
}: DescriptionListProps) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-3.5",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={cn(
            "flex flex-col gap-0.5 border-b border-border/40 pb-2.5 last:border-b-0",
            compact ? "py-1 border-border/20" : "",
            item.className
          )}
        >
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {item.icon}
            <span>{item.label}</span>
          </dt>
          <dd className="text-sm font-medium text-foreground tracking-tight break-words mt-0.5">
            {item.value || <span className="text-muted-foreground">—</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
