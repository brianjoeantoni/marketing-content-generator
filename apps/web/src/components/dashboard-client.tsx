"use client"

import { FormEvent, useMemo, useState } from "react"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  Clock3Icon,
  DownloadIcon,
  Loader2Icon,
  SendIcon,
} from "lucide-react"

import { PosterContent, PosterPreview } from "@/components/poster-preview"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

type PosterRecord = PosterContent & {
  id: string
  status: "completed"
  createdAt: string
}

type Draft = PosterContent

const starterDraft: Draft = {
  brandName: "Sunshield",
  productName: "Tropical Glow",
  productDescription:
    "SPF 50+ Broad Spectrum, Water Resistant (80 Min), Lightweight, Non-Greasy Formula, Perfect for beach days!",
  price: "$14.99",
}

const starterHistory: PosterRecord[] = [
  {
    id: "poster-001",
    ...starterDraft,
    status: "completed",
    createdAt: "Today, 10:42 AM",
  },
  {
    id: "poster-002",
    brandName: "Beach Bean Co.",
    productName: "Cold Brew Pack",
    productDescription:
      "Smooth ready-to-drink coffee cans for resort shops, beach kiosks, and sunny afternoon campaigns.",
    price: "$24.00",
    status: "completed",
    createdAt: "Yesterday, 4:18 PM",
  },
]

function validateDraft(draft: Draft) {
  const errors: Partial<Record<keyof Draft, string>> = {}

  if (!draft.brandName.trim()) {
    errors.brandName = "Brand name is required."
  }

  if (!draft.productName.trim()) {
    errors.productName = "Product name is required."
  }

  if (!draft.productDescription.trim()) {
    errors.productDescription = "Product description is required."
  } else if (draft.productDescription.length > 180) {
    errors.productDescription = "Keep the description under 180 characters."
  }

  if (!draft.price.trim()) {
    errors.price = "Price is required."
  }

  return errors
}

export function DashboardClient() {
  const [draft, setDraft] = useState<Draft>(starterDraft)
  const [history, setHistory] = useState<PosterRecord[]>(starterHistory)
  const [selectedPoster, setSelectedPoster] = useState<PosterRecord>(starterHistory[0])
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle")

  const characterCount = useMemo(
    () => draft.productDescription.length,
    [draft.productDescription]
  )

  function updateDraft(field: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateDraft(draft)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus("failed")
      return
    }

    setStatus("processing")

    window.setTimeout(() => {
      const generated: PosterRecord = {
        id: `poster-${Date.now()}`,
        ...draft,
        status: "completed",
        createdAt: "Just now",
      }

      setHistory((current) => [generated, ...current])
      setSelectedPoster(generated)
      setStatus("completed")
    }, 850)
  }

  return (
    <div className="grid gap-4 p-4 pt-0 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <Card className="rounded-lg">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Create poster</CardTitle>
                <CardDescription>
                  Fill the fixed beach template with campaign copy.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-cyan-200 bg-cyan-50 text-cyan-800">
                Frontend mock
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.brandName)}>
                  <FieldLabel htmlFor="brandName">Brand name</FieldLabel>
                  <Input
                    id="brandName"
                    value={draft.brandName}
                    onChange={(event) => updateDraft("brandName", event.target.value)}
                    aria-invalid={Boolean(errors.brandName)}
                  />
                  <FieldError>{errors.brandName}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.productName)}>
                  <FieldLabel htmlFor="productName">Product name</FieldLabel>
                  <Input
                    id="productName"
                    value={draft.productName}
                    onChange={(event) => updateDraft("productName", event.target.value)}
                    aria-invalid={Boolean(errors.productName)}
                  />
                  <FieldError>{errors.productName}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.productDescription)}>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="productDescription">
                      Product description
                    </FieldLabel>
                    <span className="text-xs text-muted-foreground">
                      {characterCount}/180
                    </span>
                  </div>
                  <Textarea
                    id="productDescription"
                    value={draft.productDescription}
                    rows={5}
                    maxLength={220}
                    onChange={(event) =>
                      updateDraft("productDescription", event.target.value)
                    }
                    aria-invalid={Boolean(errors.productDescription)}
                  />
                  <FieldDescription>
                    Shorter text will fit the poster card more reliably.
                  </FieldDescription>
                  <FieldError>{errors.productDescription}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.price)}>
                  <FieldLabel htmlFor="price">Price</FieldLabel>
                  <Input
                    id="price"
                    value={draft.price}
                    onChange={(event) => updateDraft("price", event.target.value)}
                    aria-invalid={Boolean(errors.price)}
                  />
                  <FieldError>{errors.price}</FieldError>
                </Field>
                <Button
                  type="submit"
                  disabled={status === "processing"}
                  className="bg-cyan-700 hover:bg-cyan-800"
                >
                  {status === "processing" ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <SendIcon />
                  )}
                  Generate poster
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>
              Mirrors the backend state the Express API will return later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "processing" ? (
              <Alert className="border-cyan-200 bg-cyan-50 text-cyan-950">
                <Loader2Icon className="animate-spin" />
                <AlertTitle>Processing poster</AlertTitle>
                <AlertDescription>
                  Generating image preview from the submitted fields.
                </AlertDescription>
              </Alert>
            ) : status === "failed" ? (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Check the form</AlertTitle>
                <AlertDescription>
                  Fix the highlighted fields before generating a poster.
                </AlertDescription>
              </Alert>
            ) : status === "completed" ? (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
                <CheckCircle2Icon />
                <AlertTitle>Poster generated</AlertTitle>
                <AlertDescription>
                  The latest poster was added to the top of history.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <Clock3Icon />
                <AlertTitle>Ready</AlertTitle>
                <AlertDescription>
                  Submit valid product details to preview the generation flow.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="rounded-lg">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Template preview</CardTitle>
                <CardDescription>
                  Frontend overlay on the fixed beach poster template.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" type="button">
                <DownloadIcon />
                Export later
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mx-auto w-full max-w-[620px]">
              <PosterPreview poster={selectedPoster ?? draft} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Previous generations</CardTitle>
            <CardDescription>
              Mock records until PostgreSQL is added.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[520px] pr-3">
              <div className="flex flex-col gap-3">
                {history.map((poster, index) => (
                  <button
                    key={poster.id}
                    type="button"
                    onClick={() => setSelectedPoster(poster)}
                    className="rounded-lg border bg-background p-3 text-left transition hover:border-cyan-300 hover:bg-cyan-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                  >
                    <div className="flex gap-3">
                      <PosterPreview poster={poster} compact className="w-20 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {poster.productName}
                          </p>
                          {index === 0 ? (
                            <Badge className="bg-[#df6b57] text-white">
                              New
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {poster.brandName}
                        </p>
                        <Separator className="my-2" />
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          {poster.productDescription}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold">{poster.price}</span>
                          <span className="text-muted-foreground">
                            {poster.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
