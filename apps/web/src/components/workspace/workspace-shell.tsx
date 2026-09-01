"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { AppSidebar } from "./app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from "@/hooks/use-current-user"

function WorkspaceShellSkeleton() {
  return (
    <div className="px-4 pb-6 pt-2">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-4 h-7 w-full max-w-xl" />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    </div>
  )
}

export function WorkspaceShell({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  // 
  const {
    data: currentUser,
    error: currentUserError,
    isLoading: isCheckingUser,
  } = useCurrentUser()

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!isCheckingUser && currentUserError) {
      router.replace("/login")
    }
  }, [currentUserError, isCheckingUser, router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Workspace</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {isCheckingUser ? (
          <WorkspaceShellSkeleton />
        ) : currentUserError || !currentUser ? null : (
          children
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
