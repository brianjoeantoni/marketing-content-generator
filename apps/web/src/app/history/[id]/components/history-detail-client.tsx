"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { getApiErrorMessage, getPoster } from "@/lib/api";
import { PosterPreview } from "@/components/workspace/poster-preview";
import { WorkspaceErrorState } from "@/components/workspace/workspace-error-state";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function formatPosterDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function HistoryDetailSkeleton() {
  return (
    <div className="grid gap-4 px-4 pb-6 xl:grid-cols-[minmax(340px,1fr)_minmax(300px,420px)]">
      <Card className="rounded-lg">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="mx-auto aspect-square w-full max-w-[680px] rounded-lg" />
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Separator />
          <Skeleton className="h-12 w-full" />
          <Separator />
          <Skeleton className="h-24 w-full" />
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Separator />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function HistoryDetailClient({ posterId }: { posterId: string }) {
  const {
    data: poster,
    error: posterError,
    isLoading: isLoadingPoster,
  } = useQuery({
    queryKey: ["poster", posterId],
    queryFn: () => getPoster(posterId),
    refetchInterval: (query) =>
      query.state.data?.status === "processing" ? 1000 : false,
  });

  useEffect(() => {
    if (posterError) {
      toast.error("Could not load poster.", {
        description: getApiErrorMessage(
          posterError,
          "Poster details are unavailable.",
        ),
      });
    }
  }, [posterError]);

  if (isLoadingPoster) {
    return <HistoryDetailSkeleton />;
  }

  if (posterError || !poster) {
    return (
      <WorkspaceErrorState
        title="Could not load poster"
        description={getApiErrorMessage(
          posterError,
          "Poster details are unavailable.",
        )}
      />
    );
  }

  return (
    <div className="grid gap-4 px-4 pb-6 xl:grid-cols-[minmax(340px,1fr)_minmax(300px,420px)]">
      <Card className="rounded-lg">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>{poster.product_name}</CardTitle>
              <CardDescription>{poster.brand_name}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link
                href="/history"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <ArrowLeftIcon />
                Back
              </Link>
              {/* <Button size="sm" type="button">
                <DownloadIcon />
                Download
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mx-auto w-full max-w-[680px]">
            <PosterPreview poster={poster} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Brand</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {poster.brand_name}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">Product</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {poster.product_name}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {poster.product_description}
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Price</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {poster.price}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {poster.status}
              </p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">Created</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatPosterDate(poster.created_at)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
