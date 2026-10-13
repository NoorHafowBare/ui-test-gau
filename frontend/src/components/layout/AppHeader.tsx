import * as React from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import {
  ChevronDown,
  User,
  KeyRound,
  LogOut,
  Sun,
  Moon,
  Slash,
} from "lucide-react"

import { NAVIGATION_CONFIG } from "@/config/navigation"
import { logout } from "@/api/auth"
import type { StudentProfile } from "@/mocks/user"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface AppHeaderProps {
  user: StudentProfile
}

export function AppHeader({ user }: AppHeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDark, setIsDark] = React.useState(() =>
    document.documentElement.classList.contains("dark")
  )

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

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  // Determine current active breadcrumb items
  let activePathInfo = { parent: null as string | null, current: "Portal" }
  for (const item of NAVIGATION_CONFIG) {
    if (item.path === location.pathname) {
      activePathInfo = { parent: null, current: item.title }
      break
    }
    if (item.children) {
      const found = item.children.find((c) => c.path === location.pathname)
      if (found) {
        activePathInfo = { parent: item.title, current: found.title }
        break
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-sm sm:px-6">
      {/* Left: Sidebar trigger + Breadcrumb slot */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9 text-foreground hover:bg-muted" />

        <div className="hidden sm:block">
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link to="/app/dashboard" />}>
                  Garissa University
                </BreadcrumbLink>
              </BreadcrumbItem>

              {activePathInfo.parent && (
                <>
                  <BreadcrumbSeparator>
                    <Slash className="size-3 text-muted-foreground/60" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <span className="text-muted-foreground font-medium">
                      {activePathInfo.parent}
                    </span>
                  </BreadcrumbItem>
                </>
              )}

              <BreadcrumbSeparator>
                <Slash className="size-3 text-muted-foreground/60" />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-foreground">
                  {activePathInfo.current}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Right: Theme Toggle & User DropdownMenu */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="size-8 text-muted-foreground hover:text-foreground"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="size-4 text-warning" strokeWidth={1.75} />
          ) : (
            <Moon className="size-4" strokeWidth={1.75} />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="ghost"
              className="h-9 gap-2 px-2 hover:bg-muted"
            />
          }>
            <Avatar className="size-7 border border-border">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold uppercase leading-tight text-foreground truncate max-w-[120px]">
                {user.fullName}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {user.admissionNo}
              </span>
            </div>
            <ChevronDown className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold leading-none text-foreground uppercase">
                  {user.fullName}
                </p>
                <p className="text-[11px] leading-none text-muted-foreground">
                  {user.email}
                </p>
                <p className="text-[11px] font-mono leading-none text-primary mt-0.5">
                  {user.admissionNo} • {user.stage}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/app/dashboard")}
              className="gap-2 cursor-pointer text-xs"
            >
              <User className="size-4 text-muted-foreground" strokeWidth={1.75} />
              <span>Student Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/app/settings/change-password")}
              className="gap-2 cursor-pointer text-xs"
            >
              <KeyRound className="size-4 text-muted-foreground" strokeWidth={1.75} />
              <span>Change Password</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              variant="destructive"
              className="gap-2 cursor-pointer text-xs text-destructive focus:bg-destructive/10"
            >
              <LogOut className="size-4 text-destructive" strokeWidth={1.75} />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
