import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ChevronDown, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { NAVIGATION_CONFIG, type NavItem } from "@/config/navigation"
import { BRANDING } from "@/config/branding"
import { logout } from "@/api/auth"
import type { StudentProfile } from "@/mocks/user"
import guLogo from "@/assets/gu-logo.png"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface AppSidebarProps {
  user: StudentProfile
}

export function AppSidebar({ user }: AppSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobile, setOpenMobile } = useSidebar()

  // Track expanded state of parent groups
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    NAVIGATION_CONFIG.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => child.path === location.pathname
        )
        // Auto-expand parent group if child route matches or default open important ones
        if (isChildActive || item.title === "Financials" || item.title === "Academics") {
          initial[item.title] = true
        }
      }
    })
    return initial
  })

  // Whenever location changes, ensure active item's parent group stays open and close mobile sidebar
  React.useEffect(() => {
    NAVIGATION_CONFIG.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => child.path === location.pathname
        )
        if (isChildActive) {
          setOpenGroups((prev) => ({ ...prev, [item.title]: true }))
        }
      }
    })

    if (isMobile) {
      setOpenMobile(false)
    }
  }, [location.pathname, isMobile, setOpenMobile])

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const handleLogout = async () => {
    await logout()
    if (isMobile) {
      setOpenMobile(false)
    }
    navigate("/login")
  }

  const mainNavItems = NAVIGATION_CONFIG.filter(
    (item) => item.group === "MAIN NAVIGATION"
  )
  const periodicItems = NAVIGATION_CONFIG.filter(
    (item) => item.group === "PERIODIC ACTIVITIES"
  )

  const renderNavGroup = (items: NavItem[], groupTitle: string) => (
    <div className="space-y-1">
      <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60 select-none">
        {groupTitle}
      </div>

      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon

          // Item with sub-routes
          if (item.children && item.children.length > 0) {
            const isGroupActive = item.children.some(
              (child) => child.path === location.pathname
            )
            const isOpen = !!openGroups[item.title]

            return (
              <Collapsible
                key={item.title}
                open={isOpen}
                onOpenChange={() => toggleGroup(item.title)}
                className="w-full"
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors outline-none",
                    "hover:bg-sidebar-accent/60 hover:text-white focus-visible:ring-1 focus-visible:ring-sidebar-ring",
                    isGroupActive
                      ? "text-white font-medium bg-sidebar-accent/40"
                      : "text-sidebar-foreground/80"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 transition-transform duration-200 text-sidebar-foreground/60",
                      isOpen && "rotate-180 text-white"
                    )}
                    strokeWidth={1.75}
                  />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="relative my-0.5 ml-5 space-y-0.5 border-l border-white/10 pl-2.5">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.path
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={cn(
                            "group flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-all outline-none",
                            "hover:bg-white/5 hover:text-white focus-visible:ring-1 focus-visible:ring-sidebar-ring",
                            isChildActive
                              ? "bg-white/10 text-white font-medium border-l-[3px] border-[var(--accent-gold)] -ml-[13px] pl-[10px]"
                              : "text-sidebar-foreground/75"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                              isChildActive
                                ? "bg-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]/25"
                                : "bg-white/30 group-hover:bg-white/60"
                            )}
                          />
                          <span className="truncate">{child.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          }

          // Single top-level item without children (e.g. Dashboard)
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.title}
              to={item.path || "#"}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all outline-none",
                "hover:bg-sidebar-accent/60 hover:text-white focus-visible:ring-1 focus-visible:ring-sidebar-ring",
                isActive
                  ? "bg-white/10 text-white font-medium border-l-[3px] border-[var(--accent-gold)] pl-[9px]"
                  : "text-sidebar-foreground/80"
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="truncate">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <Sidebar className="w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Top: Institution Seal on rounded white tile + Real HTML typography */}
      <SidebarHeader className="border-b border-sidebar-border/60 p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-xs">
            <img
              src={guLogo}
              alt="Garissa University Seal"
              className="size-8 object-contain"
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold tracking-tight text-white leading-tight">
              {BRANDING.institutionName}
            </span>
            <span className="truncate text-[11px] font-medium text-sidebar-primary italic leading-tight">
              {BRANDING.tagline}
            </span>
          </div>
        </div>

        {/* User Block: Avatar, Name, Online Indicator */}
        <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2">
          <Avatar className="size-8 border border-white/20 bg-primary/30">
            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
            <AvatarFallback className="bg-primary text-xs font-semibold text-white">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-semibold uppercase tracking-wider text-white">
              {user.fullName}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
              <span className="text-[11px] font-medium text-emerald-300">
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* Middle: ScrollArea with Groups */}
      <SidebarContent className="p-2">
        <ScrollArea className="h-full pr-1">
          <div className="space-y-4 pb-4">
            {renderNavGroup(mainNavItems, "MAIN NAVIGATION")}
            {renderNavGroup(periodicItems, "PERIODIC ACTIVITIES")}
          </div>
        </ScrollArea>
      </SidebarContent>

      {/* Bottom: Pinned Logout Item */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-2">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none",
            "text-red-300 hover:bg-red-500/15 hover:text-red-200 focus-visible:ring-1 focus-visible:ring-red-400"
          )}
        >
          <LogOut className="size-4 shrink-0 text-red-400" strokeWidth={1.75} />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
