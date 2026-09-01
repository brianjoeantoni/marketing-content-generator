"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { getApiErrorMessage, register as registerUser } from "@/lib/api"
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

// zod schema
const registerSchema = z
  .object({
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match password.",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState("")

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  })

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      toast.success("Account created.", {
        description: "Redirecting to your dashboard.",
      })
      router.push("/dashboard")
    },
    onError: (mutationError) => {
      const message = getApiErrorMessage(
        mutationError,
        "Could not create account."
      )
      setError(message)
      toast.error("Registration failed.", {
        description: message,
      })
    },
  })

  function onSubmit(values: RegisterFormValues) {
    setError("")
    registerMutation.mutate(values)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-lg border-white/80 bg-white/95 shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Start saving generated poster drafts.
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
              <Field data-invalid={Boolean(errors.confirmPassword)}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  required
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                <FieldError>{errors.confirmPassword?.message}</FieldError>
              </Field>
              {error ? <FieldError>{error}</FieldError> : null}
              <Field>
                <Button type="submit" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? (
                    <Loader2Icon className="animate-spin" />
                  ) : null}
                  Create account
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Login</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
