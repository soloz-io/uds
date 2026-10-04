"use client";

import * as React from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { PromptInput, type PromptInputVariant } from "@/components/composites/PromptInput";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";

export interface StorySegment {
  id?: string;
  sceneNumber?: number;
  storyNumber?: number;
  segmentNumber?: number;
  totalScenes?: number;
  totalStories?: number;
  totalSegments?: number;
  start_sec?: number;
  duration_sec?: number;
  templateId?: string;
  caption?: string;
  clip_url?: string;
  story_clip_url?: string;
  scene_clip_url?: string;
  video_url?: string;
  scene_audio_clip_url?: string;
  [key: string]: unknown;
}

export type SceneItem = StorySegment;

export interface StoryPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  stories?: StorySegment[];
  scenes?: StorySegment[];
  segments?: StorySegment[];
  title?: string;
  initialStoryIndex?: number;
  initialSceneIndex?: number;
  isPlaying?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
  initialMuted?: boolean;
  videoUrl?: string;
  downloadUrl?: string;
  onDownload?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  placeholder?: string;
  promptValue?: string;
  onPromptValueChange?: (value: string) => void;
  onSubmit?: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  onStop?: () => void;
  enableSpeech?: boolean;
  enableAttachments?: boolean;
  promptInputVariant?: PromptInputVariant;
  onPublish?: (currentStory: StorySegment, text?: string) => void;
  publishPlaceholder?: string;
  onStoryChange?: (storyIndex: number, story: StorySegment) => void;
  onSceneChange?: (sceneIndex: number, scene: StorySegment) => void;
  commentCount?: number;
  onCommentClick?: () => void;
  isCommentsOpen?: boolean;
  showPromptInput?: boolean;
  itemLabel?: string;
}

export type ScenePlayerProps = StoryPlayerProps;

function getClipUrl(item?: StorySegment): string | undefined {
  if (!item) return undefined;
  return item.clip_url || item.scene_clip_url || item.story_clip_url || item.video_url;
}

export const StoryPlayer = React.forwardRef<HTMLDivElement, StoryPlayerProps>(
  (
    {
      stories,
      scenes,
      segments,
      title = "Story Player",
      initialStoryIndex,
      initialSceneIndex = 0,
      isPlaying: isPlayingProp,
      onPlayingChange,
      initialMuted = false,
      videoUrl,
      downloadUrl,
      onDownload,
      onBack,
      onClose,
      placeholder,
      promptValue,
      onPromptValueChange,
      onSubmit,
      loading = false,
      onStop,
      enableSpeech = false,
      enableAttachments = false,
      promptInputVariant = "row",
      onPublish,
      publishPlaceholder = "Ask a question or provide instructions...",
      onStoryChange,
      onSceneChange,
      commentCount,
      onCommentClick,
      isCommentsOpen,
      showPromptInput = true,
      itemLabel,
      className,
      ...props
    },
    ref
  ) => {
    const handleBack = onBack || onClose;
    const items = React.useMemo(
      () => stories || scenes || segments || [],
      [stories, scenes, segments]
    );
    const startingIndex = initialStoryIndex ?? initialSceneIndex ?? 0;

    const [currentStoryIndex, setCurrentStoryIndex] = React.useState<number>(() => {
      if (startingIndex >= 0 && startingIndex < items.length) {
        return startingIndex;
      }
      return 0;
    });

    const initialReportedRef = React.useRef(false);
    React.useEffect(() => {
      if (!initialReportedRef.current && items.length > 0 && items[currentStoryIndex]) {
        initialReportedRef.current = true;
        onStoryChange?.(currentStoryIndex, items[currentStoryIndex]);
        onSceneChange?.(currentStoryIndex, items[currentStoryIndex]);
      }
    }, [items, currentStoryIndex, onStoryChange, onSceneChange]);

    // Dual-video buffer for gapless playback between story segments:
    // One slot actively plays the current story segment, while the other slot preloads the upcoming segment in the background.
    const [activeSlot, setActiveSlot] = React.useState<0 | 1>(0);
    const [slot0Index, setSlot0Index] = React.useState<number>(() => {
      if (startingIndex >= 0 && startingIndex < items.length) {
        return startingIndex;
      }
      return 0;
    });
    const [slot1Index, setSlot1Index] = React.useState<number>(() => {
      if (items.length > 1) {
        const init = startingIndex >= 0 && startingIndex < items.length ? startingIndex : 0;
        return (init + 1) % items.length;
      }
      return 0;
    });

    const videoRef0 = React.useRef<HTMLVideoElement | null>(null);
    const videoRef1 = React.useRef<HTMLVideoElement | null>(null);
    const isTransitioningRef = React.useRef<boolean>(false);

    const [isPlayingState, setIsPlayingState] = React.useState<boolean>(isPlayingProp ?? true);
    const isPlaying = isPlayingProp !== undefined ? isPlayingProp : isPlayingState;

    const setIsPlaying = React.useCallback(
      (value: boolean | ((prev: boolean) => boolean)) => {
        const nextVal = typeof value === "function" ? value(isPlaying) : value;
        setIsPlayingState(nextVal);
        onPlayingChange?.(nextVal);
      },
      [isPlaying, onPlayingChange]
    );

    // Stop playback automatically when comments sidesheet is open
    React.useEffect(() => {
      if (isCommentsOpen) {
        setIsPlaying(false);
      }
    }, [isCommentsOpen, setIsPlaying]);

    const togglePlay = React.useCallback(() => {
      setIsPlaying((prev) => !prev);
    }, [setIsPlaying]);

    const [isMuted, setIsMuted] = React.useState<boolean>(initialMuted);

    const toggleMute = React.useCallback(() => {
      setIsMuted((prev) => {
        const next = !prev;
        if (videoRef0.current) videoRef0.current.muted = next;
        if (videoRef1.current) videoRef1.current.muted = next;
        return next;
      });
    }, []);

    const activeStory = items[currentStoryIndex] || items[0];

    const goToStory = React.useCallback(
      (targetIdx: number) => {
        if (!items.length) return;
        const clampedIdx = (targetIdx + items.length) % items.length;
        onStoryChange?.(clampedIdx, items[clampedIdx]);
        onSceneChange?.(clampedIdx, items[clampedIdx]);
        setCurrentStoryIndex(clampedIdx);
        isTransitioningRef.current = false;

        if (items.length <= 1) {
          setSlot0Index(clampedIdx);
          const v0 = videoRef0.current;
          if (v0) {
            v0.currentTime = 0;
            v0.muted = isMuted;
            if (isPlaying) {
              v0.play().catch((err) => {
                if (err?.name === "NotAllowedError") {
                  v0.muted = true;
                  v0.play().catch(() => {});
                }
              });
            }
          }
          return;
        }

        const nextActiveSlot: 0 | 1 = activeSlot === 0 ? 1 : 0;
        const nextVideo = nextActiveSlot === 0 ? videoRef0.current : videoRef1.current;
        const currentVideo = activeSlot === 0 ? videoRef0.current : videoRef1.current;
        const segmentAfterTarget = (clampedIdx + 1) % items.length;

        // 1. Immediately start next video synchronously (0ms transition gap)
        if (nextVideo) {
          nextVideo.currentTime = 0;
          nextVideo.muted = isMuted;
          if (isPlaying) {
            nextVideo.play().catch((err) => {
              if (err?.name === "NotAllowedError") {
                nextVideo.muted = true;
                nextVideo.play().catch(() => {});
              }
            });
          }
        }

        // 2. Pause previous video
        if (currentVideo) {
          currentVideo.pause();
        }

        // 3. Swap slots and prepare idle slot to preload upcoming segment
        if (nextActiveSlot === 0) {
          setSlot0Index(clampedIdx);
          setSlot1Index(segmentAfterTarget);
        } else {
          setSlot1Index(clampedIdx);
          setSlot0Index(segmentAfterTarget);
        }

        setActiveSlot(nextActiveSlot);
      },
      [items, activeSlot, isPlaying, isMuted, onStoryChange, onSceneChange]
    );

    const handlePromptSubmit = React.useCallback(
      (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
        if (onSubmit) {
          onSubmit(message, event);
          return;
        }
        if (onPublish) {
          onPublish(activeStory, message.text);
        }
      },
      [onSubmit, onPublish, activeStory]
    );

    const handlePrev = React.useCallback(() => {
      if (!items.length) return;
      const prevIdx = currentStoryIndex > 0 ? currentStoryIndex - 1 : items.length - 1;
      goToStory(prevIdx);
    }, [items.length, currentStoryIndex, goToStory]);

    const handleNext = React.useCallback(() => {
      if (!items.length) return;
      const nextIdx = currentStoryIndex < items.length - 1 ? currentStoryIndex + 1 : 0;
      goToStory(nextIdx);
    }, [items.length, currentStoryIndex, goToStory]);

    const handleStoryEnded = React.useCallback(() => {
      if (!items.length || !isPlaying || isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      handleNext();
    }, [items.length, isPlaying, handleNext]);

    const handleTimeUpdate = React.useCallback(
      (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;
        if (!items.length || !isPlaying || isTransitioningRef.current) return;
        // Trigger next segment 60ms before end so decoder starts seamlessly with zero gap
        if (video.duration > 0.1 && video.currentTime >= video.duration - 0.06) {
          isTransitioningRef.current = true;
          handleNext();
        }
      },
      [items.length, isPlaying, handleNext]
    );

    const handleDownload = React.useCallback(async () => {
      if (onDownload) {
        onDownload();
        return;
      }
      const targetUrl = downloadUrl || videoUrl || getClipUrl(activeStory);
      if (!targetUrl) return;

      try {
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error("Fetch failed");
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = targetUrl.split("/").pop()?.split("?")[0] || "video.mp4";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } catch {
        const link = document.createElement("a");
        link.href = targetUrl;
        link.download = targetUrl.split("/").pop()?.split("?")[0] || "video.mp4";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, [onDownload, downloadUrl, videoUrl, activeStory]);

    // Playback & mute synchronization across dual slots
    React.useEffect(() => {
      const activeVideo = activeSlot === 0 ? videoRef0.current : videoRef1.current;
      const idleVideo = activeSlot === 0 ? videoRef1.current : videoRef0.current;

      if (idleVideo) {
        idleVideo.pause();
      }

      if (!activeVideo) return;

      activeVideo.muted = isMuted;

      if (isPlaying) {
        if (activeVideo.ended) {
          activeVideo.currentTime = 0;
        }
        const playPromise = activeVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            if (err?.name === "NotAllowedError") {
              activeVideo.muted = true;
              activeVideo.play().catch(() => {});
            }
          });
        }
      } else {
        activeVideo.pause();
      }
    }, [activeSlot, isPlaying, isMuted]);

    // Ensure idle video element actively loads and buffers upcoming segment
    React.useEffect(() => {
      if (items.length <= 1) return;
      const idleVideo = activeSlot === 0 ? videoRef1.current : videoRef0.current;
      const idleIndex = activeSlot === 0 ? slot1Index : slot0Index;
      const idleUrl = getClipUrl(items[idleIndex]);

      if (idleVideo && idleUrl) {
        if (idleVideo.src !== idleUrl) {
          idleVideo.src = idleUrl;
        }
        idleVideo.preload = "auto";
        idleVideo.load();
      }
    }, [activeSlot, slot0Index, slot1Index, items]);

    // Prefetch upcoming clips into browser HTTP cache
    React.useEffect(() => {
      if (!items || items.length <= 2) return;
      const toPrefetch = [
        (currentStoryIndex + 2) % items.length,
        (currentStoryIndex + 3) % items.length,
      ];

      toPrefetch.forEach((idx) => {
        const url = getClipUrl(items[idx]);
        if (url) {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = url;
          document.head.appendChild(link);
          setTimeout(() => {
            if (link.parentNode) link.parentNode.removeChild(link);
          }, 15000);
        }
      });
    }, [currentStoryIndex, items]);

    React.useEffect(() => {
      if (!items || items.length === 0) return;
      if (currentStoryIndex >= items.length) {
        setCurrentStoryIndex(0);
        setSlot0Index(0);
        setSlot1Index(items.length > 1 ? 1 : 0);
        setActiveSlot(0);
      }
    }, [items, currentStoryIndex]);

    // Keyboard navigation & playback controls
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          return;
        }

        if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          handleNext();
        } else if (e.key === " " || e.key === "k" || e.key === "K") {
          e.preventDefault();
          togglePlay();
        } else if (e.key === "Escape") {
          e.preventDefault();
          handleBack?.();
        } else if (e.key === "m" || e.key === "M") {
          e.preventDefault();
          toggleMute();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handlePrev, handleNext, handleBack, togglePlay, toggleMute]);

    if (!items || items.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col items-center justify-center w-full h-full bg-black text-white p-6", className)}
          data-testid="story-player"
          {...props}
        >
          <p className="text-white/70 text-sm">No stories available</p>
          {handleBack && (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mt-4 text-white hover:bg-white/20"
              data-testid="btn-back"
            >
              Back
            </Button>
          )}
        </div>
      );
    }

    const currentLabel =
      activeStory?.sceneNumber ??
      activeStory?.storyNumber ??
      activeStory?.segmentNumber ??
      currentStoryIndex + 1;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col w-full h-full min-h-full bg-black text-white relative select-none overflow-hidden",
          className
        )}
        data-testid="story-player"
        {...props}
      >
        {/* Top Segmented Progress Bar */}
        <div className="flex items-center gap-[3px] px-2 pt-3 pb-1.5 z-20 shrink-0">
          {items.map((item, idx) => {
            const isCompleted = idx < currentStoryIndex;
            const isCurrent = idx === currentStoryIndex;
            return (
              <div
                key={item.id || `story-segment-${idx}`}
                className="flex-1 h-[2.5px] rounded-[2px] bg-white/35 overflow-hidden"
              >
                <div
                  className={cn(
                    "h-full w-full transition-all duration-150",
                    isCompleted || isCurrent ? "bg-white" : "bg-transparent"
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Story Header Overlay */}
        <div className="flex items-center justify-between px-3 py-2.5 z-20 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {/* Back Button */}
            {handleBack && (
              <Button
                variant="ghost"
                size="icon"
                data-testid="btn-back"
                aria-label="Back"
                onClick={handleBack}
                className="h-8 w-8 rounded-full bg-black/40 hover:bg-white/20 text-white p-0 cursor-pointer shrink-0"
              >
                <Icon name="arrow-left" className="w-5 h-5 text-white" />
              </Button>
            )}

            <div className="flex flex-col min-w-0 justify-center">
              <span className="font-bold text-sm text-white truncate max-w-[200px]">
                {title}
              </span>
              <span className="text-xs text-white/75 truncate">
                {typeof currentLabel === "number"
                  ? `${itemLabel ?? (scenes ? "Frame" : "Segment")} ${currentLabel} of ${items.length}`
                  : `${currentLabel} of ${items.length}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Comments Toggle Button */}
            {onCommentClick && (
              <Button
                variant="ghost"
                size="icon"
                data-testid="btn-toggle-comments"
                aria-label="View comments"
                onClick={onCommentClick}
                className={cn(
                  "h-8 w-8 rounded-full bg-black/40 hover:bg-white/20 text-white p-0 cursor-pointer relative",
                  isCommentsOpen && "bg-white/25 text-white ring-1 ring-white/40"
                )}
              >
                <Icon name="message-square" className="w-4 h-4" />
                {commentCount !== undefined && commentCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center bg-primary text-primary-foreground leading-none shadow-sm"
                    data-testid="badge-comment-count"
                  >
                    {commentCount}
                  </span>
                )}
              </Button>
            )}

            {/* Play/Pause Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              data-testid="btn-toggle-play"
              aria-label={isPlaying ? "Pause story" : "Play story"}
              onClick={togglePlay}
              className="h-8 w-8 rounded-full bg-black/40 hover:bg-white/20 text-white p-0 cursor-pointer"
            >
              <Icon name={isPlaying ? "pause" : "play"} className="w-4 h-4" />
            </Button>

            {/* Mute/Unmute Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              data-testid="btn-toggle-mute"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              onClick={toggleMute}
              className="h-8 w-8 rounded-full bg-black/40 hover:bg-white/20 text-white p-0 cursor-pointer"
            >
              <Icon name={isMuted ? "volume-x" : "volume-2"} className="w-4 h-4" />
            </Button>

            {/* Download Video Button */}
            <Button
              variant="ghost"
              size="icon"
              data-testid="btn-download"
              aria-label="Download video"
              onClick={handleDownload}
              className="h-8 w-8 rounded-full bg-black/40 hover:bg-white/20 text-white p-0 cursor-pointer"
            >
              <Icon name="download" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Scene Video Player Stage */}
        <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden min-h-0">
          {/* Slot 0 Video */}
          <video
            ref={videoRef0}
            src={getClipUrl(items[slot0Index])}
            preload="auto"
            playsInline
            muted={isMuted}
            onEnded={activeSlot === 0 ? handleStoryEnded : undefined}
            onTimeUpdate={activeSlot === 0 ? handleTimeUpdate : undefined}
            data-testid="story-video-0"
            className={cn(
              "w-full h-full object-contain bg-black absolute inset-0 transition-opacity duration-75",
              activeSlot === 0 ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            )}
          />

          {/* Slot 1 Video (preloads next scene in background for gapless playback) */}
          {items.length > 1 && (
            <video
              ref={videoRef1}
              src={getClipUrl(items[slot1Index])}
              preload="auto"
              playsInline
              muted={isMuted}
              onEnded={activeSlot === 1 ? handleStoryEnded : undefined}
              onTimeUpdate={activeSlot === 1 ? handleTimeUpdate : undefined}
              data-testid="story-video-1"
              className={cn(
                "w-full h-full object-contain bg-black absolute inset-0 transition-opacity duration-75",
                activeSlot === 1 ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
              )}
            />
          )}

          {/* Invisible Interactive Tap Zones for Stepping Stories */}
          <div className="absolute inset-x-0 top-[60px] bottom-[70px] flex z-20">
            <Button
              variant="ghost"
              data-testid="btn-prev-story"
              aria-label="Previous story"
              onClick={handlePrev}
              className="flex-1 h-full cursor-pointer bg-transparent hover:!bg-transparent p-0 rounded-none border-none focus-visible:ring-0 focus-visible:outline-none"
            />
            <Button
              variant="ghost"
              data-testid="btn-next-story"
              aria-label="Next story"
              onClick={handleNext}
              className="flex-1 h-full cursor-pointer bg-transparent hover:!bg-transparent p-0 rounded-none border-none focus-visible:ring-0 focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Bottom PromptInput Composite from Design System */}
        {showPromptInput && (
          <div
            className="p-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-4 z-20 shrink-0"
            onFocusCapture={() => {
              setIsPlaying(false);
            }}
            onClickCapture={() => {
              setIsPlaying(false);
            }}
            onTouchStartCapture={() => {
              setIsPlaying(false);
            }}
          >
            <PromptInput
              variant={promptInputVariant}
              placeholder={placeholder || publishPlaceholder}
              value={promptValue}
              onChange={onPromptValueChange}
              onSubmit={handlePromptSubmit}
              loading={loading}
              onStop={onStop}
              enableSpeech={enableSpeech}
              enableAttachments={enableAttachments}
              className="border border-border bg-background shadow-md overflow-hidden rounded-2xl"
            />
          </div>
        )}
      </div>
    );
  }
);

StoryPlayer.displayName = "StoryPlayer";

// Backwards-compatible aliases
export const ScenePlayer = StoryPlayer;
