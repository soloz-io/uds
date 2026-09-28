"use client";

import * as React from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { PromptInput, type PromptInputVariant } from "@/components/composites/PromptInput";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";

export interface SceneItem {
  id: string;
  sceneNumber?: number;
  totalScenes?: number;
  start_sec?: number;
  duration_sec?: number;
  templateId?: string;
  caption?: string;
  scene_clip_url: string;
  scene_audio_clip_url?: string;
  [key: string]: unknown;
}

export interface ScenePlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  scenes: SceneItem[];
  title?: string;
  avatarInitials?: string;
  avatarColor?: string;
  initialSceneIndex?: number;
  isMuted?: boolean;
  isPlaying?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
  videoUrl?: string;
  downloadUrl?: string;
  onDownload?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  placeholder?: string;
  promptValue?: string;
  onPromptValueChange?: (value: string) => void;
  onSubmit?: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
  loading?: boolean;
  onStop?: () => void;
  enableSpeech?: boolean;
  enableAttachments?: boolean;
  promptInputVariant?: PromptInputVariant;
  onPublish?: (currentScene: SceneItem, text?: string) => void;
  publishPlaceholder?: string;
  onSceneChange?: (sceneIndex: number, scene: SceneItem) => void;
}

export const ScenePlayer = React.forwardRef<HTMLDivElement, ScenePlayerProps>(
  (
    {
      scenes = [],
      title = "Devin for iOS",
      avatarInitials = "D",
      avatarColor = "bg-indigo-600",
      initialSceneIndex = 0,
      isMuted: initialMuted = false,
      isPlaying: isPlayingProp,
      onPlayingChange,
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
      onSceneChange,
      className,
      ...props
    },
    ref
  ) => {
    const handleBack = onBack || onClose;

    const [currentSceneIndex, setCurrentSceneIndex] = React.useState<number>(() => {
      if (initialSceneIndex >= 0 && initialSceneIndex < scenes.length) {
        return initialSceneIndex;
      }
      return 0;
    });

    // Dual-video buffer for gapless playback between scenes:
    // One slot actively plays the current scene, while the other slot preloads the next scene in the background.
    const [activeSlot, setActiveSlot] = React.useState<0 | 1>(0);
    const [slot0Index, setSlot0Index] = React.useState<number>(() => {
      if (initialSceneIndex >= 0 && initialSceneIndex < scenes.length) {
        return initialSceneIndex;
      }
      return 0;
    });
    const [slot1Index, setSlot1Index] = React.useState<number>(() => {
      if (scenes.length > 1) {
        const init = initialSceneIndex >= 0 && initialSceneIndex < scenes.length ? initialSceneIndex : 0;
        return (init + 1) % scenes.length;
      }
      return 0;
    });

    const videoRef0 = React.useRef<HTMLVideoElement | null>(null);
    const videoRef1 = React.useRef<HTMLVideoElement | null>(null);

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

    const togglePlay = React.useCallback(() => {
      setIsPlaying((prev) => !prev);
    }, [setIsPlaying]);

    const [isMuted, setIsMuted] = React.useState<boolean>(initialMuted);

    const activeScene = scenes[currentSceneIndex] || scenes[0];

    const goToScene = React.useCallback(
      (targetIdx: number) => {
        if (!scenes.length) return;
        const clampedIdx = (targetIdx + scenes.length) % scenes.length;
        onSceneChange?.(clampedIdx, scenes[clampedIdx]);
        setCurrentSceneIndex(clampedIdx);

        if (scenes.length <= 1) {
          setSlot0Index(clampedIdx);
          const v0 = videoRef0.current;
          if (v0) {
            v0.currentTime = 0;
            if (isPlaying) v0.play().catch(() => {});
          }
          return;
        }

        const nextActiveSlot: 0 | 1 = activeSlot === 0 ? 1 : 0;
        const targetVideo = nextActiveSlot === 0 ? videoRef0.current : videoRef1.current;
        if (targetVideo) {
          targetVideo.currentTime = 0;
        }
        const sceneAfterTarget = (clampedIdx + 1) % scenes.length;

        if (nextActiveSlot === 0) {
          setSlot0Index(clampedIdx);
          setSlot1Index(sceneAfterTarget);
        } else {
          setSlot1Index(clampedIdx);
          setSlot0Index(sceneAfterTarget);
        }

        setActiveSlot(nextActiveSlot);
      },
      [scenes, activeSlot, isPlaying, onSceneChange]
    );

    const handlePromptSubmit = React.useCallback(
      (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
        if (onSubmit) {
          onSubmit(message, event);
          return;
        }
        if (onPublish) {
          onPublish(activeScene, message.text);
        }
      },
      [onSubmit, onPublish, activeScene]
    );

    const handlePrev = React.useCallback(() => {
      if (!scenes.length) return;
      const prevIdx = currentSceneIndex > 0 ? currentSceneIndex - 1 : scenes.length - 1;
      goToScene(prevIdx);
    }, [scenes.length, currentSceneIndex, goToScene]);

    const handleNext = React.useCallback(() => {
      if (!scenes.length) return;
      const nextIdx = currentSceneIndex < scenes.length - 1 ? currentSceneIndex + 1 : 0;
      goToScene(nextIdx);
    }, [scenes.length, currentSceneIndex, goToScene]);

    const handleSceneEnded = React.useCallback(() => {
      if (!scenes.length || !isPlaying) return;
      handleNext();
    }, [scenes.length, isPlaying, handleNext]);

    const handleDownload = React.useCallback(async () => {
      if (onDownload) {
        onDownload();
        return;
      }
      const targetUrl = downloadUrl || videoUrl || activeScene?.scene_clip_url;
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
    }, [onDownload, downloadUrl, videoUrl, activeScene?.scene_clip_url]);

    // Playback & mute synchronization across dual slots
    React.useEffect(() => {
      const activeVideo = activeSlot === 0 ? videoRef0.current : videoRef1.current;
      const idleVideo = activeSlot === 0 ? videoRef1.current : videoRef0.current;

      if (idleVideo) {
        idleVideo.pause();
        idleVideo.muted = true;
      }

      if (!activeVideo) return;

      activeVideo.muted = isMuted;

      if (isPlaying) {
        if (activeVideo.ended) {
          activeVideo.currentTime = 0;
        }
        const playPromise = activeVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (!isMuted) {
              activeVideo.muted = true;
              setIsMuted(true);
              activeVideo.play().catch(() => {});
            }
          });
        }
      } else {
        activeVideo.pause();
      }
    }, [activeSlot, isPlaying, isMuted, slot0Index, slot1Index]);

    React.useEffect(() => {
      if (!scenes || scenes.length === 0) return;
      if (currentSceneIndex >= scenes.length) {
        setCurrentSceneIndex(0);
        setSlot0Index(0);
        setSlot1Index(scenes.length > 1 ? 1 : 0);
        setActiveSlot(0);
      }
    }, [scenes, currentSceneIndex]);

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
          setIsMuted((prev) => !prev);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handlePrev, handleNext, handleBack, togglePlay]);

    if (!scenes || scenes.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col items-center justify-center w-full h-full bg-black text-white p-6", className)}
          data-testid="screen-scenes"
          {...props}
        >
          <p className="text-white/70 text-sm">No scenes available</p>
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

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col w-full h-full min-h-full bg-black text-white relative select-none overflow-hidden",
          className
        )}
        data-testid="screen-scenes"
        {...props}
      >
        {/* Top Segmented Progress Bar */}
        <div className="flex items-center gap-[3px] px-2 pt-3 pb-1.5 z-20 shrink-0">
          {scenes.map((scene, idx) => {
            const isCompleted = idx < currentSceneIndex;
            const isCurrent = idx === currentSceneIndex;
            return (
              <div
                key={scene.id || `scene-${idx}`}
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
                Scene {activeScene?.sceneNumber ?? currentSceneIndex + 1} of {scenes.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Play/Pause Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              data-testid="btn-toggle-play"
              aria-label={isPlaying ? "Pause scene" : "Play scene"}
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
              onClick={() => setIsMuted((prev) => !prev)}
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
            src={scenes[slot0Index]?.scene_clip_url}
            preload="auto"
            playsInline
            muted={activeSlot === 0 ? isMuted : true}
            onEnded={activeSlot === 0 ? handleSceneEnded : undefined}
            data-testid="scene-video-0"
            className={cn(
              "w-full h-full object-contain bg-black absolute inset-0 transition-opacity duration-150",
              activeSlot === 0 ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            )}
          />

          {/* Slot 1 Video (preloads next scene in background for gapless playback) */}
          {scenes.length > 1 && (
            <video
              ref={videoRef1}
              src={scenes[slot1Index]?.scene_clip_url}
              preload="auto"
              playsInline
              muted={activeSlot === 1 ? isMuted : true}
              onEnded={activeSlot === 1 ? handleSceneEnded : undefined}
              data-testid="scene-video-1"
              className={cn(
                "w-full h-full object-contain bg-black absolute inset-0 transition-opacity duration-150",
                activeSlot === 1 ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
              )}
            />
          )}

          {/* Invisible Interactive Tap Zones for Stepping Scenes */}
          <div className="absolute inset-x-0 top-[60px] bottom-[70px] flex z-20">
            <Button
              variant="ghost"
              data-testid="btn-prev-scene"
              aria-label="Previous scene"
              onClick={handlePrev}
              className="flex-1 h-full cursor-pointer bg-transparent hover:bg-transparent p-0 rounded-none border-none focus-visible:ring-0 focus-visible:outline-none"
            />
            <Button
              variant="ghost"
              data-testid="btn-next-scene"
              aria-label="Next scene"
              onClick={handleNext}
              className="flex-1 h-full cursor-pointer bg-transparent hover:bg-transparent p-0 rounded-none border-none focus-visible:ring-0 focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Bottom PromptInput Composite from Design System */}
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
      </div>
    );
  }
);

ScenePlayer.displayName = "ScenePlayer";
