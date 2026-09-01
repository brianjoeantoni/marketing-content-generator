"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import {
  Loader2Icon,
  SendIcon,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import {
  type CreatePosterInput,
  createPoster,
  getApiErrorMessage,
  getPoster,
  type Poster,
} from "@/lib/api";
import {
  PosterContent,
  PosterPreview,
} from "@/components/workspace/poster-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Draft = PosterContent;
const descriptionMaxLength = 180;

const starterDraft: Draft = {
  brand_name: "",
  product_name: "",
  product_description: "",
  price: "",
};

function formatPrice(value: string) {
  return `$${value}`;
}

function sanitizePrice(value: string) {
  return value.replace(/[^0-9.,]/g, "");
}

const createPosterSchema = z.object({
  brand_name: z
    .string()
    .refine((value) => value.trim().length > 0, "Brand name is required."),
  product_name: z
    .string()
    .refine((value) => value.trim().length > 0, "Product name is required."),
  product_description: z
    .string()
    .refine(
      (value) => value.trim().length > 0,
      "Product description is required.",
    )
    .max(
      descriptionMaxLength,
      `Keep the description under ${descriptionMaxLength} characters.`,
    ),
  price: z
    .string()
    .min(1, "Price is required.")
    .regex(/^[0-9.,]+$/, "Enter a price using numbers, commas, or dots.")
    .refine(
      (value) => /\d/.test(value),
      "Enter a price using numbers, commas, or dots.",
    ),
});

export function CreatePosterClient() {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Draft>({
    defaultValues: starterDraft,
    resolver: zodResolver(createPosterSchema),
  });
  const watchedDraft = useWatch({ control });
  const [generatedPoster, setGeneratedPoster] = useState<Poster | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "completed" | "failed"
  >("idle");

  const createPosterMutation = useMutation({
    mutationFn: createPoster,
    onSuccess: async (poster) => {
      await queryClient.invalidateQueries({ queryKey: ["posters"] });
      setGeneratedPoster(poster);
      setStatus(poster.status);
      reset(starterDraft);
      toast.success("Poster is processing.", {
        description: "You can track the generated poster in history.",
      });
    },
    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Something went wrong while creating the poster.",
      );
      toast.error("Poster was not created.", {
        description: message,
      });
      setStatus("failed");
    },
  });
  const generatedPosterId = generatedPoster?.id;
  const shouldPollGeneratedPoster =
    Boolean(generatedPosterId) && status === "processing";
  const { data: latestGeneratedPoster } = useQuery({
    queryKey: ["poster", generatedPosterId],
    queryFn: () => getPoster(generatedPosterId ?? ""),
    enabled: shouldPollGeneratedPoster,
    refetchInterval: shouldPollGeneratedPoster ? 1000 : false,
  });

  const draft: Draft = useMemo(
    () => ({
      brand_name: watchedDraft.brand_name ?? "",
      product_name: watchedDraft.product_name ?? "",
      product_description: watchedDraft.product_description ?? "",
      price: watchedDraft.price ?? "",
    }),
    [watchedDraft],
  );
  const characterCount = useMemo(
    () => draft.product_description.length,
    [draft.product_description],
  );
  const previewDraft = useMemo(
    () => ({
      ...draft,
      price: draft.price ? formatPrice(draft.price) : "",
    }),
    [draft],
  );

  useEffect(() => {
    if (!latestGeneratedPoster) {
      return;
    }

    setGeneratedPoster(latestGeneratedPoster);
    queryClient.setQueryData<Poster[]>(["posters"], (currentPosters) =>
      (currentPosters ?? []).map((currentPoster) =>
        currentPoster.id === latestGeneratedPoster.id
          ? latestGeneratedPoster
          : currentPoster,
      ),
    );

    if (latestGeneratedPoster.status === "completed") {
      setStatus("completed");
      toast.success("Poster created.", {
        description: "Your poster has been saved to history.",
      });
    }

    if (latestGeneratedPoster.status === "failed") {
      setStatus("failed");
      toast.error("Poster was not created.", {
        description: "Poster generation failed.",
      });
    }
  }, [latestGeneratedPoster, queryClient]);

  function updateDraft(field: keyof Draft, value: string) {
    setValue(field, value, {
      shouldDirty: true,
      shouldValidate: Boolean(errors[field]),
    });
  }

  function updateDescription(value: string) {
    updateDraft("product_description", value.slice(0, descriptionMaxLength));
  }

  function updatePrice(value: string) {
    updateDraft("price", sanitizePrice(value));
  }

  function onSubmit(values: Draft) {
    setStatus("processing");
    const posterInput: CreatePosterInput = {
      ...values,
      price: formatPrice(values.price),
    };

    createPosterMutation.mutate(posterInput);
  }

  function onInvalid() {
    setStatus("failed");
  }

  return (
    <div className="grid gap-4 px-4 pb-6 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
      <div>
        <Card className="rounded-lg">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Create poster</CardTitle>
                <CardDescription>
                  Fill the fixed beach template with campaign copy.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-neutral-300 bg-white text-neutral-900"
              >
                Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.brand_name)}>
                  <FieldLabel htmlFor="brand_name">Brand name</FieldLabel>
                  <Input
                    id="brand_name"
                    placeholder="Sunshield"
                    {...register("brand_name")}
                    onChange={(event) =>
                      updateDraft("brand_name", event.target.value)
                    }
                    aria-invalid={Boolean(errors.brand_name)}
                  />
                  <FieldError>{errors.brand_name?.message}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.product_name)}>
                  <FieldLabel htmlFor="product_name">Product name</FieldLabel>
                  <Input
                    id="product_name"
                    placeholder="Tropical Glow"
                    {...register("product_name")}
                    onChange={(event) =>
                      updateDraft("product_name", event.target.value)
                    }
                    aria-invalid={Boolean(errors.product_name)}
                  />
                  <FieldError>{errors.product_name?.message}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.product_description)}>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="product_description">
                      Product description
                    </FieldLabel>
                    <span className="text-xs text-muted-foreground">
                      {characterCount}/{descriptionMaxLength}
                    </span>
                  </div>
                  <Textarea
                    id="product_description"
                    rows={5}
                    maxLength={descriptionMaxLength}
                    placeholder="SPF 50+ Broad Spectrum, Water Resistant, Lightweight, Non-Greasy Formula."
                    {...register("product_description")}
                    onChange={(event) => updateDescription(event.target.value)}
                    aria-invalid={Boolean(errors.product_description)}
                  />
                  <FieldDescription>
                    Shorter text will fit the poster card more reliably.
                  </FieldDescription>
                  <FieldError>{errors.product_description?.message}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.price)}>
                  <FieldLabel htmlFor="price">Price</FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="price"
                      inputMode="decimal"
                      pattern="[0-9.,]*"
                      className="pl-7"
                      placeholder="14.99"
                      {...register("price")}
                      onChange={(event) => updatePrice(event.target.value)}
                      aria-invalid={Boolean(errors.price)}
                    />
                  </div>
                  <FieldError>{errors.price?.message}</FieldError>
                </Field>
                <Button type="submit" disabled={status === "processing"}>
                  {status === "processing" ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <SendIcon />
                  )}
                  {status === "processing" ? "Generating..." : "Generate poster"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Template preview</CardTitle>
            <CardDescription>
              Preview of the selected poster fields on the beach template.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto w-full max-w-[620px]">
              <PosterPreview poster={previewDraft} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
