"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

export type PosterContent = {
  brand_name: string
  product_name: string
  product_description: string
  price: string
}

const fallbackPoster: PosterContent = {
  brand_name: "Sunshield",
  product_name: "Tropical Glow",
  product_description:
    "SPF 50+ Broad Spectrum, Water Resistant (80 Min), Lightweight, Non-Greasy Formula, Perfect for beach days!",
  price: "$14.99",
}

export function PosterPreview({
  poster,
  className,
  compact = false,
}: {
  poster?: Partial<PosterContent>
  className?: string
  compact?: boolean
}) {
  const content = {
    ...fallbackPoster,
    ...poster,
  }

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
            "break-words font-black uppercase leading-[0.95]",
            compact ? "text-[9px]" : "text-xl"
          )}
        >
          {content.brand_name}
        </p>
        <p
          className={cn(
            "mt-[3%] break-words font-extrabold uppercase leading-tight",
            compact ? "text-[7px]" : "text-base"
          )}
        >
          {content.product_name}
        </p>
        <p
          className={cn(
            "mt-[2.5%] overflow-hidden leading-tight",
            compact ? "text-[6px]" : "text-sm"
          )}
        >
          {content.product_description}
        </p>
        <p
          className={cn(
            "mt-auto break-words font-black leading-none",
            compact ? "text-[9px]" : "text-xl"
          )}
        >
          {content.price}
        </p>
      </div>
    </div>
  )
}
