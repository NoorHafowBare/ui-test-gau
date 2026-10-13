import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  Mail,
} from "lucide-react"

import { login } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const loginSchema = z.object({
  studentNumber: z
    .string()
    .trim()
    .min(1, "Student number is required")
    .regex(
      /^[A-Za-z0-9/-]{4,24}$/,
      "Please enter a valid student number format (e.g. GU/2021/001 or BSC/G0001/23)"
    ),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [authError, setAuthError] = React.useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      studentNumber: "BSC/G0001/23",
      password: "password123",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const student = await login(values.studentNumber, values.password)
      toast.success("Welcome back!", {
        description: `Signed in as ${student.fullName} (${student.admissionNo})`,
      })
      navigate("/app/dashboard")
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Invalid student credentials. Please verify your student number and password."
      setAuthError(errorMessage)
      toast.error("Sign In Failed", {
        description: "Incorrect password. For demonstration access, use: password123",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Title & Exactly ONE supporting line */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="text-xs text-muted-foreground">
          Sign in to access your student portal
        </p>
      </div>

      {/* Inline Alert Error */}
      {authError && (
        <Alert variant="destructive" className="py-2.5">
          <AlertCircle className="size-4" strokeWidth={1.75} />
          <AlertTitle className="text-xs font-semibold">Sign In Failed</AlertTitle>
          <AlertDescription className="text-xs">
            {authError}
          </AlertDescription>
        </Alert>
      )}

      {/* Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Student Number */}
          <FormField
            control={form.control}
            name="studentNumber"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-foreground">
                  Student Number
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none"
                      strokeWidth={1.75}
                    />
                    <Input
                      {...field}
                      placeholder="e.g. GU/2021/001"
                      autoComplete="username"
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-foreground">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none"
                      strokeWidth={1.75}
                    />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="pl-9 pr-9 h-9 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" strokeWidth={1.75} />
                      ) : (
                        <Eye className="size-4" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 gap-2 text-sm font-medium mt-1"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogIn className="size-4" strokeWidth={1.75} />
            )}
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
          </Button>

          {/* Forgot password low-emphasis link */}
          <div className="text-center pt-1">
            <Link
              to="/forgot-password"
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1.5 py-1"
            >
              <Mail className="size-3.5" strokeWidth={1.75} />
              <span>Forgot password? Send to my email</span>
            </Link>
          </div>
        </form>
      </Form>

      {/* Demo Credentials Helper Card */}
      <div className="rounded-lg border border-border bg-muted/40 p-3 text-center text-[11px] text-muted-foreground space-y-1">
        <div>
          <span className="font-semibold text-foreground">Demo Access:</span> Any valid student ID with password{" "}
          <code className="bg-background px-1.5 py-0.5 rounded font-mono font-medium text-foreground border border-border">
            password123
          </code>
        </div>
        <p className="text-[10px] text-muted-foreground/80">
          Entering any other password will trigger the inline error alert &amp; toast.
        </p>
      </div>
    </div>
  )
}
