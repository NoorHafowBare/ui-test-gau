import * as React from "react"
import { z } from "zod"
import { toast } from "sonner"
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  KeyRound,
  Loader2,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

import { changePassword } from "@/api/settings"
import { PASSWORD_RULES, calculatePasswordStrength } from "@/mocks/settings"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter (A-Z)")
      .regex(/[a-z]/, "Must include at least one lowercase letter (a-z)")
      .regex(/[0-9]/, "Must include at least one number (0-9)")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character (!@#$%^&*)"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmPassword"],
  })

export function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  const [showCurrent, setShowCurrent] = React.useState(false)
  const [showNew, setShowNew] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)

  const strength = React.useMemo(
    () => calculatePasswordStrength(newPassword),
    [newPassword]
  )

  const doPasswordsMatch = Boolean(
    newPassword && confirmPassword && newPassword === confirmPassword
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = passwordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    })

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error("Please resolve the validation errors.")
      return
    }

    setSubmitting(true)
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      toast.success(res.message)
      // Reset form on success
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setErrors({})
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update password."
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Change Password"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Settings" },
          { label: "Change Password" },
        ]}
        description="Update your portal authentication credentials to maintain campus account security."
      />

      <div className="flex justify-center pt-2">
        {/* Focused Card: max-w-[440px] */}
        <Card className="w-full max-w-[440px] rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <CardHeader className="border-b border-border/50 py-4 px-6 bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <KeyRound className="size-4.5" strokeWidth={1.75} />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground tracking-tight">
                  Update Password
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Enter your current and new credentials below
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* Current Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="current-pw" className="text-xs font-medium">
                  Current Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="current-pw"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-9 pr-9 text-xs"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showCurrent ? "Hide password" : "Show password"}
                  >
                    {showCurrent ? (
                      <EyeOff className="size-4" strokeWidth={1.75} />
                    ) : (
                      <Eye className="size-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-[11px] text-destructive">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="new-pw" className="text-xs font-medium">
                  New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="new-pw"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a strong new password"
                    className="h-9 pr-9 text-xs"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    {showNew ? (
                      <EyeOff className="size-4" strokeWidth={1.75} />
                    ) : (
                      <Eye className="size-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-[11px] text-destructive">{errors.newPassword}</p>
                )}

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground">Strength:</span>
                      <span className={`font-semibold ${strength.colorClass}`}>
                        {strength.label}
                      </span>
                    </div>
                    <Progress value={strength.score} className="h-1.5 w-full bg-muted/60" />
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm-pw" className="text-xs font-medium">
                  Confirm New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-pw"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="h-9 pr-9 text-xs"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" strokeWidth={1.75} />
                    ) : (
                      <Eye className="size-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Rule Checklist */}
              <div className="rounded-lg border border-border/60 bg-muted/15 p-3 space-y-2">
                <span className="text-[11px] font-semibold text-muted-foreground block uppercase tracking-wider">
                  Password Requirements
                </span>
                <div className="space-y-1.5 text-xs">
                  {PASSWORD_RULES.map((rule) => {
                    const isMet = rule.test(newPassword)
                    return (
                      <div
                        key={rule.id}
                        className={`flex items-center gap-2 transition-colors ${
                          isMet ? "text-success font-medium" : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`size-3.5 rounded-full flex items-center justify-center shrink-0 border ${
                            isMet
                              ? "bg-success text-success-foreground border-success"
                              : "border-border/80 bg-background"
                          }`}
                        >
                          {isMet && <Check className="size-2.5" strokeWidth={2.5} />}
                        </div>
                        <span className="text-[11px]">{rule.label}</span>
                      </div>
                    )
                  })}

                  {/* Passwords Match Rule */}
                  <div
                    className={`flex items-center gap-2 transition-colors ${
                      doPasswordsMatch ? "text-success font-medium" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`size-3.5 rounded-full flex items-center justify-center shrink-0 border ${
                        doPasswordsMatch
                          ? "bg-success text-success-foreground border-success"
                          : "border-border/80 bg-background"
                      }`}
                    >
                      {doPasswordsMatch && <Check className="size-2.5" strokeWidth={2.5} />}
                    </div>
                    <span className="text-[11px]">Both passwords match exactly</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-9 gap-1.5 text-xs font-semibold shadow-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="size-3.5" strokeWidth={1.75} />
                    Save & Update Password
                  </>
                )}
              </Button>

              <div className="text-center">
                <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheck className="size-3 text-muted-foreground" strokeWidth={1.75} />
                  Protected by Garissa University Identity Services
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
