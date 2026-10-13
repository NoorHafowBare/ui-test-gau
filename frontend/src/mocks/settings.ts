export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "At least one uppercase letter (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "At least one lowercase letter (a-z)", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "At least one number (0-9)", test: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "At least one special character (!@#$%^&*)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export function calculatePasswordStrength(password: string): {
  score: number // 0 to 100
  label: "Weak" | "Fair" | "Good" | "Strong"
  colorClass: string
} {
  if (!password) {
    return { score: 0, label: "Weak", colorClass: "text-muted-foreground" }
  }

  let passed = 0
  PASSWORD_RULES.forEach((r) => {
    if (r.test(password)) passed++
  })

  const score = Math.round((passed / PASSWORD_RULES.length) * 100)

  if (score <= 40) {
    return { score, label: "Weak", colorClass: "text-destructive" }
  } else if (score <= 60) {
    return { score, label: "Fair", colorClass: "text-warning" }
  } else if (score <= 80) {
    return { score, label: "Good", colorClass: "text-info" }
  } else {
    return { score, label: "Strong", colorClass: "text-success" }
  }
}
