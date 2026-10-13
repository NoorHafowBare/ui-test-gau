import * as React from "react"
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Sun,
  Moon,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  ShieldAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import guLogo from "@/assets/gu-logo.png"

export function DesignSystemPreview() {
  const [isDark, setIsDark] = React.useState(false)

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Top Banner / Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={guLogo} alt="Garissa University Seal" className="h-9 w-9 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-foreground">
                  Garissa University
                </span>
                <Badge variant="outline" className="border-border text-xs text-muted-foreground">
                  Design System v1.0
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Student Self-Service Portal • UI Spec &amp; Theme Tokens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-9 gap-1.5"
            >
              {isDark ? (
                <>
                  <Sun className="size-4 text-warning" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="size-4 text-muted-foreground" />
                  <span>Dark Mode</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content: Max-width 1280px container, screen-independent scaling */}
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
        {/* Intro Banner */}
        <section className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">
              Design System Preview
            </h1>
            <Badge variant="success">All Tokens Active</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for 1280x720 baseline (150% scaling compatible). Primary olive green (<code>#4f7a16</code>),
            accent mustard gold (<code>#e3b23c</code>), flat cards, 14px body text, 44px table rows, h-9 controls.
          </p>
        </section>

        {/* Section 1: Palette Swatches */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Layers className="size-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">1. Palette Swatches &amp; Theme Tokens</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {/* Primary */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="h-12 w-full rounded-lg bg-primary" />
              <div className="mt-2 text-xs font-semibold text-foreground">Primary Olive</div>
              <div className="text-xs text-muted-foreground">#4f7a16</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--primary</div>
            </div>

            {/* Accent Gold */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-[var(--accent-gold)] font-medium text-[var(--foreground)]">
                Accent Gold
              </div>
              <div className="mt-2 text-xs font-semibold text-foreground">Mustard Gold</div>
              <div className="text-xs text-[var(--accent-gold-text)] font-medium">#e3b23c (Accent only)</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--accent-gold</div>
            </div>

            {/* Background */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="h-12 w-full rounded-lg border border-border bg-background" />
              <div className="mt-2 text-xs font-semibold text-foreground">Background</div>
              <div className="text-xs text-muted-foreground">#f5f6f4 neutral</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--background</div>
            </div>

            {/* Card Surface */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="h-12 w-full rounded-lg border border-border bg-card" />
              <div className="mt-2 text-xs font-semibold text-foreground">Card Surface</div>
              <div className="text-xs text-muted-foreground">#ffffff flat</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--card</div>
            </div>

            {/* Soft Grey-Green Border */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex h-12 w-full items-center justify-center rounded-lg border-2 border-border bg-muted text-xs text-muted-foreground">
                border
              </div>
              <div className="mt-2 text-xs font-semibold text-foreground">Border</div>
              <div className="text-xs text-muted-foreground">#dfe4dc</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--border</div>
            </div>

            {/* Deep Green Sidebar */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex h-12 w-full items-center justify-center rounded-lg bg-[var(--sidebar)] text-xs text-[var(--sidebar-foreground)]">
                Sidebar
              </div>
              <div className="mt-2 text-xs font-semibold text-foreground">Deep Green Sidebar</div>
              <div className="text-xs text-muted-foreground">#1a2c0c</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--sidebar</div>
            </div>

            {/* Success */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="h-12 w-full rounded-lg bg-success" />
              <div className="mt-2 text-xs font-semibold text-foreground">Success Status</div>
              <div className="text-xs text-muted-foreground">#16803d emerald</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--success</div>
            </div>

            {/* Warning */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="h-12 w-full rounded-lg bg-warning" />
              <div className="mt-2 text-xs font-semibold text-foreground">Warning Status</div>
              <div className="text-xs text-muted-foreground">#b45309 gold/amber</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--warning</div>
            </div>

            {/* Destructive */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="h-12 w-full rounded-lg bg-destructive" />
              <div className="mt-2 text-xs font-semibold text-foreground">Destructive Status</div>
              <div className="text-xs text-muted-foreground">#dc2626 red</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--destructive</div>
            </div>

            {/* Info */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="h-12 w-full rounded-lg bg-info" />
              <div className="mt-2 text-xs font-semibold text-foreground">Info Status</div>
              <div className="text-xs text-muted-foreground">#1d4ed8 blue</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--info</div>
            </div>

            {/* Muted Text */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex h-12 w-full items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground font-medium">
                4.5:1 Contrast
              </div>
              <div className="mt-2 text-xs font-semibold text-foreground">Muted Text</div>
              <div className="text-xs text-muted-foreground">#546152</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--muted-foreground</div>
            </div>

            {/* Gold Accent Text */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex h-12 w-full items-center justify-center rounded-lg bg-card text-xs font-semibold text-[var(--accent-gold-text)]">
                Readable Gold
              </div>
              <div className="mt-2 text-xs font-semibold text-foreground">Accent Gold Text</div>
              <div className="text-xs text-muted-foreground">#8c6205 (&gt;4.5:1)</div>
              <div className="mt-1 text-[11px] text-muted-foreground">--accent-gold-text</div>
            </div>
          </div>
        </section>

        {/* Section 2: Type Scale */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">2. Type Scale (Inter • 400, 500, 600 only)</h2>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <div>
                <div className="text-2xl font-semibold text-foreground">Page Title Heading (24px)</div>
                <div className="text-xs text-muted-foreground">text-2xl font-semibold (max 24px)</div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">24px / 1.5</span>
            </div>

            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <div>
                <div className="text-2xl font-semibold text-primary">KSh 30,000.00</div>
                <div className="text-xs text-muted-foreground">Large Stat Number (24px)</div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">24px / 1.5</span>
            </div>

            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <div>
                <div className="text-lg font-semibold text-foreground">Section Title (18px)</div>
                <div className="text-xs text-muted-foreground">text-lg font-semibold</div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">18px / 1.5</span>
            </div>

            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <div>
                <div className="text-sm font-normal text-foreground">
                  Base body text (14px). Student personal information, fee statements, and announcements are rendered at this baseline size.
                </div>
                <div className="text-xs text-muted-foreground">text-sm font-normal</div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">14px / 1.5</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Captions, Table Headers, Micro-labels &amp; Meta info (12px)
                </div>
                <div className="text-[11px] text-muted-foreground">text-xs font-medium</div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">12px / 1.4</span>
            </div>
          </div>
        </section>

        {/* Section 3: Buttons (All Variants) & Inputs & Select */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-foreground">3. Buttons, Inputs &amp; Controls (h-9 Compact Standard)</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Buttons Card */}
            <Card className="rounded-xl border border-border">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold">Button Variants</CardTitle>
                <CardDescription className="text-xs">
                  All variants with h-9 default height and rounded-lg radius
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="default">Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link Style</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Sizes:</span>
                  <Button size="sm">Small (h-8)</Button>
                  <Button size="default">Default (h-9)</Button>
                  <Button size="lg">Large (h-10)</Button>
                  <Button size="icon" aria-label="Search">
                    <Search className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Inputs & Select Card */}
            <Card className="rounded-xl border border-border">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold">Inputs &amp; Select</CardTitle>
                <CardDescription className="text-xs">
                  Compact form controls with h-9 height
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="student-id" className="text-xs font-medium text-foreground">
                    Student Number
                  </Label>
                  <Input id="student-id" placeholder="e.g. GU/2021/001" className="h-9" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-foreground">
                    Academic Semester
                  </Label>
                  <Select defaultValue="sem2">
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sem1">SEM 1 2026/2027</SelectItem>
                      <SelectItem value="sem2">SEM 2 2026/2027</SelectItem>
                      <SelectItem value="supp">Special / Supp Exams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: Badge Set */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-foreground">4. Badge Set (Consistent Status Tokens)</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="size-3" />
              Success (Paid / Cleared)
            </Badge>

            <Badge variant="warning" className="gap-1">
              <AlertTriangle className="size-3" />
              Warning (Pending / Due)
            </Badge>

            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="size-3" />
              Destructive (Closed / Overdue)
            </Badge>

            <Badge variant="info" className="gap-1">
              <Info className="size-3" />
              Info (Enrolled)
            </Badge>

            <Badge variant="neutral">
              Neutral (Draft / Y4S2)
            </Badge>

            <Badge variant="outline">
              Outline Badge
            </Badge>
          </div>
        </section>

        {/* Section 5: Cards, Dialog & Tabs */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-foreground">5. Cards, Tabs &amp; Dialog Layer</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Flat Card 1: Stat Card */}
            <Card className="rounded-xl border border-border">
              <CardHeader className="p-4 pb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Outstanding Balance
                </span>
                <CardTitle className="text-2xl font-semibold text-primary">
                  KSh 30,000
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Academic Year 2026/2027
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-1.5 text-xs text-warning">
                  <AlertTriangle className="size-3.5" />
                  <span>Payment deadline in 14 days</span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-border p-4 py-2.5">
                <span className="text-xs text-muted-foreground">PesaFlow Checkout</span>
                <Button size="sm" variant="default" className="h-8">
                  Pay Now
                </Button>
              </CardFooter>
            </Card>

            {/* Flat Card 2: Interactive Tabs */}
            <Card className="rounded-xl border border-border lg:col-span-2">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Student Portal Modules</CardTitle>
                  <Dialog>
                    <DialogTrigger render={<Button size="sm" variant="outline" className="h-8 gap-1" />}>
                      <ExternalLink className="size-3.5" />
                      <span>Open Dialog</span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-base font-semibold">
                          Confirm Course Registration
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                          You are about to register for 6 course units for Semester 2 (2026/2027).
                        </DialogDescription>
                      </DialogHeader>
                      <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Programme:</span>
                          <span className="font-medium text-foreground">BSc Applied Statistics</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stage:</span>
                          <span className="font-medium text-foreground">Y4S2</span>
                        </div>
                      </div>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose render={<Button variant="outline" size="sm" />}>
                          Cancel
                        </DialogClose>
                        <Button size="sm" variant="default">
                          Confirm Registration
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Tabs defaultValue="overview">
                  <TabsList className="h-9 w-full justify-start border-b border-border rounded-none bg-transparent p-0">
                    <TabsTrigger value="overview" className="h-9 rounded-none border-b-2 border-transparent px-3 text-xs data-[state=active]:border-primary data-[state=active]:text-primary">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="financials" className="h-9 rounded-none border-b-2 border-transparent px-3 text-xs data-[state=active]:border-primary data-[state=active]:text-primary">
                      Financials
                    </TabsTrigger>
                    <TabsTrigger value="academics" className="h-9 rounded-none border-b-2 border-transparent px-3 text-xs data-[state=active]:border-primary data-[state=active]:text-primary">
                      Academics
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="pt-3 text-xs text-muted-foreground">
                    Student ID: <span className="font-medium text-foreground">BSC/G0001/23</span> • Full Name: <span className="font-medium text-foreground">ESIPILA GABRIEL</span> • Portal status online.
                  </TabsContent>
                  <TabsContent value="financials" className="pt-3 text-xs text-muted-foreground">
                    Total Billed: KSh 30,000 • Total Paid: KSh 0 • Balance Due: KSh 30,000.
                  </TabsContent>
                  <TabsContent value="academics" className="pt-3 text-xs text-muted-foreground">
                    Unit Registration: SEM 2 2026/2027 • Stage: Y4S2 • BSc Applied Statistics with Computing.
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 6: Table & Alert & Skeleton */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-foreground">6. Table (44px Row Height), Alert &amp; Skeleton</h2>
          </div>

          {/* Reference Alert */}
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
            <ShieldAlert className="size-4 text-destructive" />
            <AlertTitle className="text-xs font-semibold text-destructive">
              Unit Registration Notice
            </AlertTitle>
            <AlertDescription className="text-xs text-destructive/90">
              Unit registration is closed. Unit registration deadline has passed for SEM 2 2026/2027.
            </AlertDescription>
          </Alert>

          {/* Table with 3 rows */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="h-10 border-b border-border">
                  <TableHead className="text-xs font-medium text-muted-foreground">Unit Code</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Unit Name</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Stage</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Credits</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="h-11 border-b border-border">
                  <TableCell className="font-mono text-xs font-medium text-foreground">
                    STA 4210
                  </TableCell>
                  <TableCell className="text-xs text-foreground font-medium">
                    Time Series Analysis II
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">Y4S2</TableCell>
                  <TableCell className="text-xs text-muted-foreground">3.0</TableCell>
                  <TableCell>
                    <Badge variant="success">Approved</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="h-11 border-b border-border">
                  <TableCell className="font-mono text-xs font-medium text-foreground">
                    COM 4205
                  </TableCell>
                  <TableCell className="text-xs text-foreground font-medium">
                    Machine Learning &amp; AI
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">Y4S2</TableCell>
                  <TableCell className="text-xs text-muted-foreground">3.0</TableCell>
                  <TableCell>
                    <Badge variant="success">Approved</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="h-11">
                  <TableCell className="font-mono text-xs font-medium text-foreground">
                    STA 4290
                  </TableCell>
                  <TableCell className="text-xs text-foreground font-medium">
                    Research Project
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">Y4S2</TableCell>
                  <TableCell className="text-xs text-muted-foreground">6.0</TableCell>
                  <TableCell>
                    <Badge variant="warning">In Review</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Skeleton Loading Card */}
          <Card className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Skeleton Loading State Preview
              </span>
              <Badge variant="neutral">Loading</Badge>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </Card>
        </section>

        {/* Footer info */}
        <footer className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          Garissa University Student Self-Service Portal Redesign • Oasis of Innovation
        </footer>
      </main>
    </div>
  )
}
