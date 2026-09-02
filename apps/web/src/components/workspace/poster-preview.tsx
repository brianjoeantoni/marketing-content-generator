"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

export type PosterContent = {
  brand_name: string
  product_name: string
  product_description: string
  price: string
}

export function PosterPreview({
  poster,
  className,
  compact = false,
}: {
  poster: PosterContent
  className?: string
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-lg border bg-white shadow-sm",
        className
      )}
      aria-label="Generated marketing poster preview"
    >
      <Image
        src="/beach-poster-template.webp"
        alt=""
        fill
        sizes={compact ? "180px" : "(max-width: 768px) 92vw, 520px"}
        className="object-cover"
        priority={!compact}
      />
      <div className="absolute bottom-[17%] left-[8%] right-[8%] top-[43%] flex flex-col overflow-hidden px-[4.5%] py-[4%] text-neutral-950">
        <p
          className={cn(
            "wrap-break-word font-black uppercase leading-[0.95]",
            compact ? "text-[9px]" : "text-xl"
          )}
        >
          {poster.brand_name}
        </p>
        <p
          className={cn(
            "mt-[3%] wrap-break-word font-extrabold uppercase leading-tight",
            compact ? "text-[7px]" : "text-base"
          )}
        >
          {poster.product_name}
        </p>
        <p
          className={cn(
            "mt-[2.5%] overflow-hidden leading-tight",
            compact ? "text-[6px]" : "text-sm"
          )}
        >
          {poster.product_description}
        </p>
        <p
          className={cn(
            "mt-auto wrap-break-word font-black leading-none",
            compact ? "text-[9px]" : "text-xl"
          )}
        >
          {poster.price}
        </p>
      </div>
    </div>
  )
}
