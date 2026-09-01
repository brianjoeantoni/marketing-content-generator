"use client"

import { RegisterForm } from "./components/register-form"
import { WavesIcon } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/dashboard" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-8 items-center justify-center rounded-lg bg-black text-white">
            <WavesIcon className="size-4" />
          </div>
          Marketing Content Generator
        </a>
        <RegisterForm />
      </div>
    </div>
  )
}
