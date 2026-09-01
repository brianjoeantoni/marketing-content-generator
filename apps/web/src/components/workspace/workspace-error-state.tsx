"use client"

import Link from "next/link"
import { AlertCircleIcon, LayoutDashboardIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function WorkspaceErrorState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex h-full items-center justify-center px-4 pb-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex size-10 items-center justify-center rounded-full border bg-background">
          <AlertCircleIcon className="size-5" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <Link
          href="/dashboard"
          className={buttonVariants({ className: "mt-5" })}
        >
          <LayoutDashboardIcon />
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
