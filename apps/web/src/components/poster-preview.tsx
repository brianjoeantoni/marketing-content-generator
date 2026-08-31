"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

export type PosterContent = {
  brandName: string
  productName: string
  productDescription: string
  price: string
}

const fallbackPoster: PosterContent = {
  brandName: "Sunshield",
  productName: "Tropical Glow",
  productDescription:
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
        src="/beach-poster-template.png"
        alt=""
        fill
        sizes={compact ? "180px" : "(max-width: 768px) 92vw, 520px"}
        className="object-cover"
        priority={!compact}
      />
      <div className="absolute left-[17%] right-[11%] top-[12%] text-center">
        <div className="rotate-[-1deg] text-balance font-black uppercase leading-[0.9] text-white drop-shadow-[0_3px_0_rgba(8,96,128,0.88)] [text-shadow:_0_0_1px_#07576e]">
          <div className={compact ? "text-[12px]" : "text-[clamp(1.35rem,4vw,2.9rem)]"}>
            Ocean Breeze
          </div>
          <div className={compact ? "text-[12px]" : "text-[clamp(1.2rem,3.5vw,2.4rem)]"}>
            Supplies
          </div>
        </div>
      </div>
      <div className="absolute bottom-[14%] left-[8%] right-[8%] top-[43%] flex flex-col overflow-hidden px-[4.5%] py-[4%] text-neutral-950">
        <p
          className={cn(
            "truncate font-black uppercase leading-none",
            compact ? "text-[10px]" : "text-[clamp(1rem,2.7vw,2rem)]"
          )}
        >
          {content.brandName}
        </p>
        <p
          className={cn(
            "mt-[3%] truncate font-extrabold uppercase leading-none",
            compact ? "text-[8px]" : "text-[clamp(0.8rem,2vw,1.35rem)]"
          )}
        >
          {content.productName}
        </p>
        <p
          className={cn(
            "mt-[2.5%] overflow-hidden leading-tight",
            compact ? "max-h-9 text-[7px]" : "max-h-28 text-[clamp(0.72rem,1.65vw,1.15rem)]"
          )}
        >
          {content.productDescription}
        </p>
        <p
          className={cn(
            "mt-auto truncate font-black leading-none",
            compact ? "text-[10px]" : "text-[clamp(1.05rem,2.8vw,2rem)]"
          )}
        >
          {content.price}
        </p>
      </div>
    </div>
  )
}
