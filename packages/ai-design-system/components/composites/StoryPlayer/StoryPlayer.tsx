"use client";

import * as React from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/primitives/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu";
import { Icon } from "@/components/primitives/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/primitives/Tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select";
import { PromptInput } from "@/components/composites/PromptInput";
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
  onPublish?: (currentStory: StorySegment, text?: string) => void;
  publishPlaceholder?: string;
  onStoryChange?: (storyIndex: number, story: StorySegment) => void;
  onSceneChange?: (sceneIndex: number, scene: StorySegment) => void;
  commentCount?: number;
  onCommentClick?: () => void;
  isCommentsOpen?: boolean;
  showPromptInput?: boolean;
  /** Keeps the prompt visible but refuses sends, e.g. while a change is being made. */
  promptDisabled?: boolean;
  /** The segments are still being fetched: shows a loader instead of the empty state. */
  isLoading?: boolean;
  itemLabel?: string;
  /** Versions of the video the viewer can switch between, newest last. */
  versions?: Array<{ id: string; label?: string }>;
  /** The version playing (the one picked in the switcher). */
  currentVersion?: string;
  onVersionChange?: (versionId: string) => void;
  versionDisabled?: boolean;
  /** The version the video is set to; when another is playing, "Use" offers to switch to it. */
  activeVersion?: string;
  onUseVersion?: (versionId: string) => void;
  useVersionDisabled?: boolean;
  /**
   * How the piece plays: "video" plays `videoUrl` straight through, each segment
   * a span of it (`start_sec`, `duration_sec`); "scenes" plays each segment's own
   * clip in turn. The viewer switches with the icon in the story line.
   * Uncontrolled when omitted, starting at "video".
   */
  playbackMode?: StoryPlaybackMode;
  onPlaybackModeChange?: (mode: StoryPlaybackMode) => void;
  initialPlaybackMode?: StoryPlaybackMode;
  playbackModeDisabled?: boolean;
  playbackModeTooltips?: {
    video?: string;
    scenes?: string;
    disabled?: string;
  };
  renderScene?: (props: {
    index: number;
    scene: StorySegment;
    isPlaying: boolean;
    isMuted?: boolean;
    onEnded?: () => void;
    onProgress?: (progress: number) => void;
  }) => React.ReactNode;
}

export type StoryPlaybackMode = "video" | "scenes";

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
      onPublish,
      publishPlaceholder = "Ask a question or provide instructions...",
      onStoryChange,
      onSceneChange,
      commentCount,
      onCommentClick,
      isCommentsOpen,
      showPromptInput = true,
      promptDisabled = false,
      isLoading = false,
      itemLabel,
      versions,
      currentVersion,
      onVersionChange,
      versionDisabled = false,
      activeVersion,
      onUseVersion,
      useVersionDisabled = false,
      playbackMode: playbackModeProp,
      onPlaybackModeChange,
      initialPlaybackMode,
      playbackModeDisabled = false,
      playbackModeTooltips,
      renderScene,
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

    // ── Playback mode ─────────────────────────────────────────────────────
    //
    // "video": one stream, `videoUrl`, played straight through — no load between
    // segments; the current segment and its progress are read from the playhead.
    // "scenes": the dual-slot clip player above, one segment's clip at a time.
    const [modeState, setModeState] = React.useState<StoryPlaybackMode>(
      initialPlaybackMode ?? (videoUrl ? "video" : "scenes")
    );
    const mode = playbackModeProp ?? modeState;
    const isModeDisabled = Boolean(playbackModeDisabled || !videoUrl);
    const effectiveMode: StoryPlaybackMode = !videoUrl && renderScene ? "scenes" : mode;
    const videoFullRef = React.useRef<HTMLVideoElement | null>(null);
    const spans = React.useMemo(
      () =>
        items.map((item) => {
          const start = Number(item.start_sec ?? 0);
          return { start, end: start + Number(item.duration_sec ?? 0) };
        }),
      [items]
    );
    /** Where the playhead is within the current segment, 0..1 (video mode). */
    const [segmentProgress, setSegmentProgress] = React.useState(0);
    const [sceneProgress, setSceneProgress] = React.useState(0);

    React.useEffect(() => {
      setSceneProgress(0);
    }, [currentStoryIndex]);

    const currentIndexRef = React.useRef(currentStoryIndex);
    currentIndexRef.current = currentStoryIndex;
    /** Seconds into the current segment to resume at after a mode switch. */
    const resumeOffsetRef = React.useRef<number | null>(null);

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
        if (videoFullRef.current) videoFullRef.current.muted = next;
        return next;
      });
    }, []);

    const activeStory = items[currentStoryIndex] || items[0];

    const goToStory = React.useCallback(
      (targetIdx: number) => {
        if (!items.length) return;
        const clampedIdx = (targetIdx + items.length) % items.length;

        // Video mode: a segment is a span of the one stream — seek to its start.
        if (effectiveMode === "video") {
          const video = videoFullRef.current;
          if (video) video.currentTime = spans[clampedIdx]?.start ?? 0;
          currentIndexRef.current = clampedIdx;
          setCurrentStoryIndex(clampedIdx);
          setSegmentProgress(0);
          onStoryChange?.(clampedIdx, items[clampedIdx]);
          onSceneChange?.(clampedIdx, items[clampedIdx]);
          return;
        }
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
      [items, activeSlot, isPlaying, isMuted, onStoryChange, onSceneChange, effectiveMode, spans]
    );

    /** The segment the playhead is in: the last one starting at or before it. */
    const segmentAt = React.useCallback(
      (time: number) => {
        let index = 0;
        for (let i = 0; i < spans.length; i += 1) {
          if (spans[i].start <= time + 0.001) index = i;
        }
        return index;
      },
      [spans]
    );

    /** Video mode: follow the playhead — the current segment, its progress, the change callbacks. */
    const syncToPlayhead = React.useCallback(() => {
      const video = videoFullRef.current;
      if (!video || !spans.length) return;
      const index = segmentAt(video.currentTime);
      const { start, end } = spans[index];
      setSegmentProgress(end > start ? Math.min(1, Math.max(0, (video.currentTime - start) / (end - start))) : 0);
      if (index !== currentIndexRef.current) {
        currentIndexRef.current = index;
        setCurrentStoryIndex(index);
        onStoryChange?.(index, items[index]);
        onSceneChange?.(index, items[index]);
      }
    }, [spans, segmentAt, items, onStoryChange, onSceneChange]);

    /** Video mode: once the stream is loaded, resume at the current segment (and offset). */
    const handleFullLoaded = React.useCallback(() => {
      const video = videoFullRef.current;
      if (!video) return;
      video.currentTime = (spans[currentIndexRef.current]?.start ?? 0) + (resumeOffsetRef.current ?? 0);
      resumeOffsetRef.current = null;
      syncToPlayhead();
    }, [spans, syncToPlayhead]);

    /** Switch modes, keeping the segment on screen and the time into it. */
    const switchMode = React.useCallback(() => {
      if (isModeDisabled) return;
      const index = currentIndexRef.current;
      if (effectiveMode === "video") {
        const video = videoFullRef.current;
        resumeOffsetRef.current = video ? Math.max(0, video.currentTime - (spans[index]?.start ?? 0)) : 0;
        setSlot0Index(index);
        setSlot1Index(items.length > 1 ? (index + 1) % items.length : index);
        setActiveSlot(0);
      } else {
        const clip = activeSlot === 0 ? videoRef0.current : videoRef1.current;
        resumeOffsetRef.current = clip ? clip.currentTime : 0;
      }
      const next: StoryPlaybackMode = effectiveMode === "video" ? "scenes" : "video";
      setModeState(next);
      onPlaybackModeChange?.(next);
    }, [effectiveMode, isModeDisabled, spans, items.length, activeSlot, onPlaybackModeChange]);

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
      if (mode !== "scenes") return;
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
    }, [activeSlot, isPlaying, isMuted, mode]);

    // Scenes mode, just switched from video: resume the clip where the stream was.
    React.useEffect(() => {
      if (mode !== "scenes" || resumeOffsetRef.current === null) return;
      const clip = activeSlot === 0 ? videoRef0.current : videoRef1.current;
      if (!clip) return;
      const offset = resumeOffsetRef.current;
      const seek = () => {
        clip.currentTime = offset;
        resumeOffsetRef.current = null;
      };
      if (clip.readyState >= 1) seek();
      else clip.addEventListener("loadedmetadata", seek, { once: true });
    }, [mode, activeSlot]);

    // Video mode: play, pause and mute follow the controls.
    React.useEffect(() => {
      if (mode !== "video") return;
      const video = videoFullRef.current;
      if (!video) return;
      video.muted = isMuted;
      if (isPlaying) {
        video.play().catch((err) => {
          if (err?.name === "NotAllowedError") {
            video.muted = true;
            video.play().catch(() => {});
          }
        });
      } else {
        video.pause();
      }
    }, [mode, isPlaying, isMuted, videoUrl]);

    // Video mode: the progress bar follows the playhead every frame while
    // playing; timeupdate alone fires a few times a second and steps it.
    React.useEffect(() => {
      if (mode !== "video" || !isPlaying) return;
      let frame = 0;
      const tick = () => {
        syncToPlayhead();
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [mode, isPlaying, syncToPlayhead]);

    // The idle slot preloads the upcoming segment through its own <video src>,
    // which React owns: a changed src starts the browser loading it, with
    // preload="auto", and an unchanged one is left alone. Nothing further is
    // fetched ahead — <link rel="prefetch"> downloads whole files that a <video>,
    // reading by byte range, often cannot reuse, so clips were fetched twice.


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
          {isLoading ? (
            <div className="flex flex-col items-center gap-3" role="status" aria-live="polite" data-testid="story-player-loading">
              <Icon name="loader-2" className="h-8 w-8 animate-spin text-white/80" />
              <p className="text-white/70 text-sm">Loading video…</p>
            </div>
          ) : (
            <p className="text-white/70 text-sm">No stories available</p>
          )}
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
            // Video mode fills the current segment with the playhead; scenes mode
            // marks the segments reached or tracks sceneProgress when custom renderScene is provided.
            const fill =
              effectiveMode === "video"
                ? isCompleted ? 1 : isCurrent ? segmentProgress : 0
                : isCompleted ? 1 : isCurrent ? (renderScene ? sceneProgress : 1) : 0;
            return (
              <div
                key={item.id || `story-segment-${idx}`}
                className="flex-1 h-[2.5px] rounded-[2px] bg-white/35 overflow-hidden"
                data-testid={`story-progress-${idx}`}
              >
                <div className="h-full bg-white" style={{ width: `${fill * 100}%` }} />
              </div>
            );
          })}
          {/* The playback mode, switched from the story line itself */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={isModeDisabled ? undefined : switchMode}
                disabled={isModeDisabled}
                aria-label={
                  isModeDisabled
                    ? (playbackModeTooltips?.disabled ?? "Full render video pending")
                    : effectiveMode === "video"
                      ? (playbackModeTooltips?.video ?? "Switch to live preview")
                      : (playbackModeTooltips?.scenes ?? "Switch to full render video")
                }
                className={cn(
                  "ml-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/80 transition-opacity",
                  isModeDisabled
                    ? "opacity-35 cursor-not-allowed"
                    : "hover:bg-white/20 hover:text-white cursor-pointer"
                )}
                data-testid="btn-playback-mode"
              >
                <Icon name={effectiveMode === "video" ? "layers" : "film"} className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {isModeDisabled
                ? (playbackModeTooltips?.disabled ?? "Full render video pending")
                : effectiveMode === "video"
                  ? (playbackModeTooltips?.video ?? "Switch to live preview")
                  : (playbackModeTooltips?.scenes ?? "Switch to full render video")}
            </TooltipContent>
          </Tooltip>
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
                  ? `${itemLabel ?? (scenes ? "Scene" : "Segment")} ${currentLabel} of ${items.length}`
                  : `${currentLabel} of ${items.length}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Version Switcher */}
            {versions && versions.length > 0 && onVersionChange && (
              <Select
                value={currentVersion}
                onValueChange={onVersionChange}
                disabled={versionDisabled}
              >
                <SelectTrigger
                  aria-label="Video version"
                  data-testid="select-video-version"
                  className="h-8 w-auto gap-1 rounded-full border-white/20 bg-black/40 px-3 text-xs text-white hover:bg-white/20"
                >
                  {/* The top bar shows just the id; the list keeps each version's full label. */}
                  <SelectValue placeholder="Version">{currentVersion}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem
                      key={version.id}
                      value={version.id}
                      data-testid={`option-video-version-${version.id}`}
                    >
                      {version.label ?? version.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Use the version playing, when it is not the one the video is set to */}
            {onUseVersion && currentVersion && activeVersion && currentVersion !== activeVersion && (
              <Button
                variant="ghost"
                size="sm"
                data-testid="btn-use-version"
                disabled={useVersionDisabled}
                onClick={() => onUseVersion(currentVersion)}
                className="h-8 rounded-full bg-white/90 px-3 text-xs font-semibold text-black hover:bg-white"
              >
                Use {currentVersion}
              </Button>
            )}

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

            {/* Mute and download: buttons from md up; on mobile, in the more menu */}
            <div className="hidden md:flex items-center gap-2">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="btn-more"
                  aria-label="More options"
                  className="md:hidden h-8 w-8 rounded-full bg-black/40 hover:bg-white/20 text-white p-0 cursor-pointer"
                >
                  <Icon name="more-vertical" className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem data-testid="menu-toggle-mute" onSelect={toggleMute}>
                  <Icon name={isMuted ? "volume-x" : "volume-2"} className="w-4 h-4" />
                  {isMuted ? "Unmute" : "Mute"}
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-download" onSelect={handleDownload}>
                  <Icon name="download" className="w-4 h-4" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Scene Video Player Stage */}
        <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden min-h-0">
          {/* Video mode: the whole piece, the segments spans of it */}
          {effectiveMode === "video" && (
            videoUrl ? (
              <video
                ref={videoFullRef}
                src={videoUrl}
                preload="auto"
                playsInline
                muted={isMuted}
                onLoadedMetadata={handleFullLoaded}
                onSeeked={syncToPlayhead}
                onTimeUpdate={syncToPlayhead}
                onEnded={() => {
                  goToStory(0);
                  if (isPlaying) videoFullRef.current?.play().catch(() => {});
                }}
                data-testid="story-video-full"
                className="w-full h-full object-contain bg-black absolute inset-0 z-10"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 z-10" role="status" data-testid="story-player-no-video">
                <Icon name="loader-2" className="h-8 w-8 animate-spin text-white/80" />
                <p className="text-white/70 text-sm">Loading video…</p>
              </div>
            )
          )}

          {/* Scenes mode: Slot 0 Video or custom renderScene */}
          {effectiveMode === "scenes" && (
            renderScene ? (
              <div
                key={`custom-scene-${currentStoryIndex}`}
                className="w-full h-full object-contain bg-black absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
              >
                {renderScene({
                  index: currentStoryIndex,
                  scene: activeStory,
                  isPlaying,
                  isMuted,
                  onEnded: handleStoryEnded,
                  onProgress: setSceneProgress,
                })}
              </div>
            ) : (
              <>
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
              </>
            )
          )}

          {/* Invisible tap zones: left steps back, the middle plays and pauses, right steps on */}
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
              data-testid="btn-toggle-play"
              aria-label={isPlaying ? "Pause story" : "Play story"}
              onClick={togglePlay}
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
              placeholder={placeholder || publishPlaceholder}
              value={promptValue}
              onChange={onPromptValueChange}
              onSubmit={handlePromptSubmit}
              loading={loading}
              onStop={onStop}
              enableSpeech={enableSpeech}
              enableAttachments={enableAttachments}
              disabled={promptDisabled}
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
