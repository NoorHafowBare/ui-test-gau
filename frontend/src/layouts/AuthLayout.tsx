import { Outlet } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"

import { BRANDING } from "@/config/branding"
import guLogo from "@/assets/gu-logo.png"

export function AuthLayout() {
  const features = [
    "Fee payments & statements",
    "Academic records & transcripts",
    "Exam cards & results",
    "Hostel booking",
    "Student requests & clearance",
  ]

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-background text-foreground">
      {/* LEFT BRAND PANEL (~42% width, hidden below md) */}
      <aside
        style={{
          backgroundColor: "var(--sidebar)",
          backgroundImage: "var(--auth-brand-gradient)",
        }}
        className="hidden md:flex md:w-[42%] lg:w-[40%] xl:w-[42%] flex-col justify-between p-8 lg:p-12 relative overflow-hidden text-sidebar-foreground select-none shrink-0 border-r border-sidebar-border/40"
      >
        {/* 2 Low-opacity decorative background circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full border border-white/10 bg-white/[0.04]" />
        <div className="pointer-events-none absolute -left-24 bottom-6 size-96 rounded-full border border-white/10 bg-white/[0.04]" />

        {/* Top: Seal on a white rounded tile + real text */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-xs">
            <img
              src={guLogo}
              alt="Garissa University Seal"
              className="size-10 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-white leading-tight">
              {BRANDING.institutionName}
            </span>
            <span className="text-xs font-medium text-[var(--accent-gold)] italic leading-tight">
              {BRANDING.tagline}
            </span>
          </div>
        </div>

        {/* Middle: Headline with gold accent line + 5 feature rows */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div>
            {/* Short gold line above headline (only gold element here) */}
            <div className="h-0.5 w-10 bg-[var(--accent-gold)] rounded-full mb-3.5" />
            <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-snug">
              Student Self-Service Portal
            </h1>
            <p className="text-xs lg:text-sm text-sidebar-foreground/80 leading-relaxed mt-2.5 max-w-sm">
              Access academic transcripts, semester unit registrations, fee statements, and institutional requests in one unified portal.
            </p>
          </div>

          <ul className="space-y-3 pt-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-xs lg:text-sm text-sidebar-foreground/90">
                <CheckCircle2
                  className="size-4 shrink-0 text-[var(--accent-gold)]"
                  strokeWidth={1.75}
                />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: Institutional Attribution */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-sidebar-foreground/60 flex items-center justify-between">
          <span>{BRANDING.academicYear} Academic Year</span>
          <span>Garissa, Kenya</span>
        </div>
      </aside>

      {/* RIGHT PANEL: Form card max-width 400px, centered */}
      <main className="flex-1 flex flex-col justify-between items-center p-6 sm:p-8 h-full overflow-y-auto">
        {/* Mobile Header (displayed only below md) */}
        <div className="md:hidden flex items-center gap-3 pt-2 pb-4 self-center">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white p-1 border border-border shadow-xs">
            <img
              src={guLogo}
              alt="Garissa University"
              className="size-8 object-contain"
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground leading-tight">
              {BRANDING.institutionName}
            </div>
            <div className="text-[11px] text-[var(--accent-gold-text)] italic font-medium leading-tight">
              {BRANDING.tagline}
            </div>
          </div>
        </div>

        {/* Centered Form Viewport */}
        <div className="w-full max-w-[400px] my-auto">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="w-full text-center text-[11px] text-muted-foreground pt-4 space-y-0.5">
          <p>{BRANDING.copyright}</p>
          {BRANDING.showPoweredBy && (
            <p className="text-[10px] text-muted-foreground/80">
              {BRANDING.poweredBy}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
