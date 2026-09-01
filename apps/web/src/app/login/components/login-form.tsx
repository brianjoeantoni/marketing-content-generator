"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { getApiErrorMessage, login } from "@/lib/api"
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

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  })

  const authMutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      toast.success("Logged in successfully.", {
        description: "Redirecting to your dashboard.",
      })
      router.push("/dashboard")
    },
    onError: (mutationError) => {
      const message = getApiErrorMessage(
        mutationError,
        "Could not log in."
      )
      setError(message)
      toast.error("Login failed.", {
        description: message,
      })
    },
  })

  function onSubmit(values: LoginFormValues) {
    setError("")
    authMutation.mutate(values)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-lg border-white/80 bg-white/95 shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in to continue building campaign posters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@example.com"
                  {...register("email")}
                  required
                  aria-invalid={Boolean(errors.email)}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>
              <Field data-invalid={Boolean(errors.password)}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  required
                  aria-invalid={Boolean(errors.password)}
                />
                <FieldError>{errors.password?.message}</FieldError>
              </Field>
              {error ? <FieldError>{error}</FieldError> : null}
              <Field>
                <Button type="submit" disabled={authMutation.isPending}>
                  {authMutation.isPending ? (
                    <Loader2Icon className="animate-spin" />
                  ) : null}
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/register">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
