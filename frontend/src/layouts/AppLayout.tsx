import * as React from "react"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { getCurrentUser, isAuthenticated } from "@/api/auth"
import type { StudentProfile } from "@/mocks/user"
import { BRANDING } from "@/config/branding"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { AppHeader } from "@/components/layout/AppHeader"
import { Skeleton } from "@/components/ui/skeleton"

export function AppLayout() {
  const [user, setUser] = React.useState<StudentProfile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const location = useLocation()

  React.useEffect(() => {
    let isMounted = true
    async function checkAuth() {
      if (!isAuthenticated()) {
        if (isMounted) {
          setUser(null)
          setLoading(false)
        }
        return
      }
      const currentUser = await getCurrentUser()
      if (isMounted) {
        setUser(currentUser)
        setLoading(false)
      }
    }
    checkAuth()
    return () => {
      isMounted = false
    }
  }, [location.pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-3 w-64">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar user={user} />
        <SidebarInset className="flex flex-1 flex-col min-w-0 bg-background">
          <AppHeader user={user} />

          {/* Main Content Area: Responsive container with balanced density */}
          <main className="flex-1 w-full px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-4 transition-all duration-200">
            <div className="w-full max-w-[1440px] mx-auto">
              <Outlet />
            </div>
          </main>

          {/* Portal Footer */}
          <footer className="border-t border-border bg-card/60 px-4 sm:px-6 py-2.5 text-xs text-muted-foreground">
            <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center justify-between gap-1 sm:flex-row">
              <span>{BRANDING.copyright}</span>
              {BRANDING.showPoweredBy && (
                <span className="text-[11px] text-muted-foreground/80">
                  {BRANDING.poweredBy}
                </span>
              )}
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
