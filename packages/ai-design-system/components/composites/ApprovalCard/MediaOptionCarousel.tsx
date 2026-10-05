"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/primitives/Icon";
import { Badge } from "@/components/primitives/Badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/primitives/Carousel";
import { cn } from "@/lib/utils";

export type MediaKind = "image" | "audio" | "video";
export type MediaAspect = "square" | "portrait" | "landscape" | "vertical";

export interface OptionMedia {
  kind: MediaKind;
  url: string;
  /** Preview shape: square 1:1, portrait 3:4, landscape 16:9, vertical 9:16. */
  aspect?: MediaAspect;
  /** A still frame shown for a video until it is played. */
  poster?: string | null;
}

export interface MediaOption {
  /** What the card is called — also the answer when it is chosen. */
  label: string;
  badge?: string | null;
  description?: string | null;
  media: OptionMedia;
}

export interface MediaOptionCarouselProps {
  options: MediaOption[];
  /** Whether each option is chosen, by index. */
  isSelected: (index: number) => boolean;
  onSelect: (index: number) => void;
  className?: string;
}

// Each shape gets a card width; the preview takes its height from the aspect ratio.
const SHAPE: Record<MediaAspect, { width: string; ratio: string }> = {
  square: { width: "w-40", ratio: "1 / 1" },
  portrait: { width: "w-36", ratio: "3 / 4" },
  landscape: { width: "w-64", ratio: "16 / 9" },
  vertical: { width: "w-32", ratio: "9 / 16" },
};

interface PreviewProps {
  media: OptionMedia;
  label: string;
  playing: boolean;
  onTogglePlay: () => void;
  onEnded: () => void;
}

function PlayButton({ playing, onClick, label }: { playing: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={`${playing ? "Pause" : "Play"} ${label}`}
      data-testid="media-option-play"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm ring-1 ring-border transition-transform hover:scale-105"
    >
      <Icon name={playing ? "pause" : "play"} size="sm" />
    </button>
  );
}

/** Plays when `playing`, pauses otherwise, and reports progress 0–1. */
function usePlayback<T extends HTMLMediaElement>(playing: boolean) {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [playing]);
  const onTimeUpdate = () => {
    const el = ref.current;
    if (el && el.duration) setProgress(el.currentTime / el.duration);
  };
  return { ref, progress, onTimeUpdate };
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-foreground/15">
      <div className="h-full bg-primary" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

function AudioPreview({ media, label, playing, onTogglePlay, onEnded }: PreviewProps) {
  const { ref, progress, onTimeUpdate } = usePlayback<HTMLAudioElement>(playing);
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/40">
      <Icon name="music" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <PlayButton playing={playing} onClick={onTogglePlay} label={label} />
      <audio ref={ref} src={media.url} preload="metadata" onTimeUpdate={onTimeUpdate} onEnded={onEnded} />
      <ProgressBar progress={progress} />
    </div>
  );
}

function VideoPreview({ media, label, playing, onTogglePlay, onEnded }: PreviewProps) {
  const { ref, progress, onTimeUpdate } = usePlayback<HTMLVideoElement>(playing);
  return (
    <div className="relative h-full w-full bg-muted">
      <video
        ref={ref}
        // Without a poster the browser shows the clip's first frame.
        src={media.poster ? media.url : `${media.url}#t=0.1`}
        poster={media.poster ?? undefined}
        preload={media.poster ? "none" : "metadata"}
        muted
        playsInline
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        className="h-full w-full object-cover"
      />
      <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity", playing && "opacity-0 hover:opacity-100")}>
        <PlayButton playing={playing} onClick={onTogglePlay} label={label} />
      </div>
      <ProgressBar progress={progress} />
    </div>
  );
}

function ImagePreview({ media, label }: PreviewProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={media.url} alt={label} loading="lazy" className="h-full w-full object-cover" />;
}

const PREVIEW: Record<MediaKind, React.FC<PreviewProps>> = {
  image: ImagePreview,
  audio: AudioPreview,
  video: VideoPreview,
};

/**
 * Options shown as a row of preview cards — images, clips or audio the user can
 * see or play before choosing. Only one clip or track plays at a time.
 */
export function MediaOptionCarousel({ options, isSelected, onSelect, className }: MediaOptionCarouselProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <Carousel opts={{ align: "start", dragFree: true }} className={cn("w-full", className)} data-testid="media-option-carousel">
      <CarouselContent className="-ml-3 py-1">
        {options.map((option, index) => {
          const shape = SHAPE[option.media.aspect ?? "square"];
          const selected = isSelected(index);
          const Preview = PREVIEW[option.media.kind];
          return (
            <CarouselItem key={index} className={cn("basis-auto pl-3", shape.width)}>
              <div
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                data-testid={`media-option-${index}`}
                onClick={() => onSelect(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(index);
                  }
                }}
                className={cn(
                  "group cursor-pointer select-none rounded-xl border p-1.5 transition-all",
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border bg-muted/20 hover:bg-muted/40"
                )}
              >
                <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: shape.ratio }}>
                  <Preview
                    media={option.media}
                    label={option.label}
                    playing={playingIndex === index}
                    onTogglePlay={() => setPlayingIndex((cur) => (cur === index ? null : index))}
                    onEnded={() => setPlayingIndex((cur) => (cur === index ? null : cur))}
                  />
                  <div
                    className={cn(
                      "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded text-xs font-semibold shadow-sm transition-colors",
                      selected ? "bg-primary text-primary-foreground" : "bg-background/90 text-muted-foreground"
                    )}
                  >
                    {selected ? <Icon name="check" size="sm" /> : index + 1}
                  </div>
                </div>
                <div className="px-1 pb-0.5 pt-2">
                  <div className="text-sm font-medium leading-snug text-foreground break-words">{option.label}</div>
                  {option.badge && (
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      {option.badge}
                    </Badge>
                  )}
                  {option.description && (
                    <p className="mt-1 text-xs leading-snug text-muted-foreground break-words">{option.description}</p>
                  )}
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-1 hidden sm:flex disabled:opacity-0" />
      <CarouselNext className="right-1 hidden sm:flex disabled:opacity-0" />
    </Carousel>
  );
}
