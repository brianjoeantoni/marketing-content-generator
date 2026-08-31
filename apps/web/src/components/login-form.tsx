"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  mode = "login",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  mode?: "login" | "register"
}) {
  const router = useRouter()
  const [error, setError] = useState("")
  const isRegister = mode === "register"

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "")
    const password = String(form.get("password") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")

    if (!email.includes("@")) {
      setError("Enter a valid email address.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (isRegister && password !== confirmPassword) {
      setError("Confirm password must match password.")
      return
    }

    setError("")
    router.push("/dashboard")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-lg border-white/80 bg-white/95 shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {isRegister ? "Create your account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Start saving generated poster drafts."
              : "Sign in to continue building campaign posters."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="owner@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {!isRegister ? (
                    <a
                      href="/login"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </a>
                  ) : null}
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              {isRegister ? (
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </Field>
              ) : null}
              {error ? <FieldError>{error}</FieldError> : null}
              <Field>
                <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800">
                  {isRegister ? "Create account" : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  {isRegister ? (
                    <>
                      Already have an account? <a href="/login">Login</a>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <a href="/register">Sign up</a>
                    </>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Frontend-only prototype. Auth will connect to Express and httpOnly JWT
        cookies during the backend phase.
      </FieldDescription>
    </div>
  )
}
