"use client";

import * as React from "react";
import { Icon } from "@/components/primitives/Icon";
import { CarouselItem } from "@/components/primitives/Carousel";
import { cn } from "@/lib/utils";
import { captureAccept, useStoredCapture, type CapturePhase, type QuestionCapture, type StoreCapture } from "./CaptureAnswer";
import { MEDIA_SHAPE, type MediaAspect } from "./MediaOptionCarousel";

export interface UploadTileProps {
  capture: QuestionCapture;
  store?: StoreCapture;
  /** The options' shape, so the tile lines up with them. */
  aspect: MediaAspect;
  selected: boolean;
  /** The stored address, or null while there is none. Called with the address once a file is stored. */
  onAnswer: (address: string | null) => void;
  /** Choose the stored upload again, after an option was picked. */
  onSelect: () => void;
}

/**
 * The first tile of a carousel question with an upload: a placeholder that
 * opens a file picker. The picked file is stored, shown in the tile and chosen
 * at once; picking an option chooses that instead, and tapping the tile again
 * chooses the upload back. "Replace" picks another file.
 */
export function UploadTile({ capture, store, aspect, selected, onAnswer, onSelect }: UploadTileProps) {
  const [phase, setPhase] = React.useState<CapturePhase>({ at: "idle" });
  const { keep } = useStoredCapture(capture.kind, store, onAnswer, setPhase);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const shape = MEDIA_SHAPE[aspect];
  const preview = "previewUrl" in phase ? phase.previewUrl : undefined;
  const stored = phase.at === "stored";
  const pick = () => fileInputRef.current?.click();
  const label = capture.label ?? "";

  return (
    <CarouselItem className={cn("basis-auto pl-3", shape.width)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={captureAccept(capture.kind)}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void keep(file);
        }}
        data-testid="approval-card-upload-file"
      />
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-label={stored ? label : `Upload: ${label}`}
        data-testid="approval-card-upload-tile"
        onClick={() => (stored ? onSelect() : phase.at !== "storing" && pick())}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (stored) onSelect();
            else if (phase.at !== "storing") pick();
          }
        }}
        className={cn(
          "group cursor-pointer select-none rounded-xl border p-1.5 transition-all",
          selected
            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
            : "border-dashed border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40",
        )}
      >
        <div className="relative overflow-hidden rounded-lg bg-muted/40" style={{ aspectRatio: shape.ratio }}>
          {preview && capture.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={label} className="h-full w-full object-cover" data-testid="approval-card-upload-preview" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <Icon name="upload" size="sm" />
              <span className="px-2 text-center text-xs">Upload</span>
            </div>
          )}
          {phase.at === "storing" && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Icon name="loader-2" size="sm" className="animate-spin" />
            </div>
          )}
          {stored && (
            <div
              className={cn(
                "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-all",
                selected
                  ? "border-2 border-primary bg-primary text-primary-foreground ring-2 ring-background"
                  : "border-2 border-white/70 bg-black/40 backdrop-blur-sm",
              )}
              aria-hidden="true"
            >
              {selected && <Icon name="check" size="xs" />}
            </div>
          )}
        </div>
        <div className="px-1 pb-0.5 pt-2">
          <div className="text-sm font-medium leading-snug text-foreground break-words">{label}</div>
          {stored && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                pick();
              }}
              className="mt-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              data-testid="approval-card-upload-replace"
            >
              Replace
            </button>
          )}
          {phase.at === "failed" && (
            <p className="mt-1 text-xs leading-snug text-destructive break-words" data-testid="approval-card-upload-error">
              {phase.message}
            </p>
          )}
        </div>
      </div>
    </CarouselItem>
  );
}
