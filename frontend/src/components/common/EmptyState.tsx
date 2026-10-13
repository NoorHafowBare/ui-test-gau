import * as React from "react"
import { cn } from "cn"
import { Inbox, type LucideIcon } from "lucide-react"

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[260px] flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-200",
        className
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-muted/70 text-muted-foreground ring-1 ring-border/50 mb-3.5">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground leading-normal">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
