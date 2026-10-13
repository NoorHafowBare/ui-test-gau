import * as React from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Mail,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react"

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

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Student email is required")
    .email("Please enter a valid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [successEmail, setSuccessEmail] = React.useState<string | null>(null)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "collinsmainabosire@gmail.com",
    },
  })

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 350))
    setIsLoading(false)
    setSuccessEmail(values.email)
    toast.success("Instructions Dispatched", {
      description: `Reset link sent to ${values.email}`,
    })
  }

  return (
    <div className="w-full space-y-6">
      {/* Title & Description */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Reset password
        </h2>
        <p className="text-xs text-muted-foreground">
          Enter your student email address to receive password recovery instructions
        </p>
      </div>

      {successEmail ? (
        <div className="space-y-4">
          <Alert variant="success" className="py-3">
            <CheckCircle2 className="size-4" strokeWidth={1.75} />
            <AlertTitle className="text-xs font-semibold">
              Recovery Link Sent
            </AlertTitle>
            <AlertDescription className="text-xs mt-1">
              Instructions have been emailed to{" "}
              <span className="font-semibold text-foreground">{successEmail}</span>.
              Please check your inbox or spam folder.
            </AlertDescription>
          </Alert>

          <Button
            variant="outline"
            onClick={() => {
              setSuccessEmail(null)
              form.reset()
            }}
            className="w-full h-9 text-xs"
          >
            Send to another address
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="size-3.5" strokeWidth={1.75} />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-foreground">
                    Student Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none"
                        strokeWidth={1.75}
                      />
                      <Input
                        {...field}
                        type="email"
                        placeholder="e.g. student@gau.ac.ke"
                        autoComplete="email"
                        className="pl-9 h-9 text-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 gap-2 text-sm font-medium mt-1"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" strokeWidth={1.75} />
              )}
              <span>{isLoading ? "Dispatching link..." : "Send Reset Link"}</span>
            </Button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="text-xs text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="size-3.5" strokeWidth={1.75} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
