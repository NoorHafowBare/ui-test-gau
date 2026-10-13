import { Link } from "react-router-dom"
import { ArrowLeft, Clock, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PagePlaceholderProps {
  title: string
  module: string
  description?: string
  status?: string
}

export function PagePlaceholder({
  title,
  module,
  description = "This module is configured and ready for implementation in the next phase.",
  status = "Phase 1 Shell Active",
}: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {module}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <Badge variant="outline" className="text-xs border-border">
              {status}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" render={<Link to="/app/dashboard" className="gap-1.5" />}>
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            <span>Dashboard</span>
          </Button>
        </div>
      </div>

      {/* Empty Card Container */}
      <Card className="rounded-xl border border-border">
        <CardHeader className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {description}
              </CardDescription>
            </div>
            <Badge variant="neutral" className="gap-1">
              <Clock className="size-3" strokeWidth={1.75} />
              <span>Standby</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="rounded-lg border border-dashed border-border p-8 text-center bg-muted/20">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info className="size-5" strokeWidth={1.75} />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {title} Page Shell
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
              Navigation is connected to the application shell. Full interactive data tables, forms,
              and workflows will be built in subsequent phases.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-border p-4 bg-muted/10">
          <span className="text-xs text-muted-foreground">
            Academic Period: 2026/2027 Semester 2
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Path: {window.location.pathname}
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
