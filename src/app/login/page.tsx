"use client"

import { LoginForm } from "@/components/login-form"
import { WavesIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[linear-gradient(135deg,#e5fbff_0%,#fff7e8_58%,#ffe8df_100%)] p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/dashboard" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-700 text-white">
            <WavesIcon className="size-4" />
          </div>
          Marketing Content Generator
        </a>
        <LoginForm mode="login" />
      </div>
    </div>
  )
}
