"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { ImagePlusIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import {
  getApiErrorMessage,
  getPosters,
  type Poster,
} from "@/lib/api"
import { PosterPreview } from "@/components/workspace/poster-preview"
import { WorkspaceErrorState } from "@/components/workspace/workspace-error-state"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// helper function for formatting poster dates
function formatPosterDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

// component for rendering a poster card
function PosterCard({
  poster,
}: {
  poster: Poster
}) {
  return (
    <Link
      href={`/history/${poster.id}`}
      className="group rounded-lg border bg-background text-left transition hover:cursor-pointer hover:border-neutral-400 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
    >
      <div className="bg-muted/20 p-3">
        <PosterPreview poster={poster} compact className="mx-auto max-w-56" />
      </div>
      <div className="border-t p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-base font-semibold leading-snug">
              {poster.product_name}
            </h2>
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
              {poster.brand_name}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 capitalize">
            {poster.status}
          </Badge>
        </div>
        <Separator className="my-3" />
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {poster.product_description}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold">{poster.price}</span>
          <span className="text-muted-foreground">
            {formatPosterDate(poster.created_at)}
          </span>
        </div>
      </div>
    </Link>
  )
}

function HistorySkeleton() {
  return (
    <div className="grid gap-4 px-4 pb-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="rounded-lg">
          <CardContent className="p-0">
            <div className="bg-muted/20 p-3">
              <Skeleton className="mx-auto aspect-square max-w-56 rounded-lg" />
            </div>
            <div className="border-t p-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="mt-2 h-4 w-1/3" />
              <Separator className="my-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function HistoryClient() {
  const {
    data: posters = [],
    error: postersError,
    isLoading: isLoadingPosters,
  } = useQuery({
    queryKey: ["posters"],
    queryFn: getPosters,
    // polling
    refetchInterval: (query) => {
      const posters = query.state.data ?? []

      // only refetch if at any poster is processing
      return posters.some((poster) => poster.status === "processing")
        ? 1000
        : false
    },
  })

  useEffect(() => {
    if (postersError) {
      toast.error("Could not load history.", {
        description: getApiErrorMessage(
          postersError,
          "Poster history is unavailable."
        ),
      })
    }
  }, [postersError])

  if (isLoadingPosters) {
    return <HistorySkeleton />
  }

  if (postersError) {
    return (
      <WorkspaceErrorState
        title="Could not load history"
        description={getApiErrorMessage(
          postersError,
          "Poster history is unavailable."
        )}
      />
    )
  }

  if (posters.length === 0) {
    return (
      <div className="px-4 pb-6">
        <Card className="rounded-lg border-dashed">
          <CardHeader>
            <CardTitle>No posters yet</CardTitle>
            <CardDescription>
              Create your first poster to start building campaign history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/create-poster" className={buttonVariants()}>
              <ImagePlusIcon />
              Create poster
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 px-4 pb-6 md:grid-cols-2 lg:grid-cols-3">
        {posters.map((poster) => (
          <PosterCard key={poster.id} poster={poster} />
        ))}
      </div>
    </>
  )
}
