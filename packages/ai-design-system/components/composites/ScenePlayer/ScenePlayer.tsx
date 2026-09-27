"use client";

import * as React from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { PromptInput } from "@/components/composites/PromptInput";
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
      onBack,
      onClose,
      placeholder,
      promptValue,
      onPromptValueChange,
      onSubmit,
      loading = false,
      onStop,
      enableSpeech = true,
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

    const [isMuted, setIsMuted] = React.useState<boolean>(initialMuted);
    const videoRef = React.useRef<HTMLVideoElement | null>(null);

    const activeScene = scenes[currentSceneIndex] || scenes[0];

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
      setCurrentSceneIndex((prev) => {
        const nextIdx = prev > 0 ? prev - 1 : scenes.length - 1;
        onSceneChange?.(nextIdx, scenes[nextIdx]);
        return nextIdx;
      });
    }, [scenes, onSceneChange]);

    const handleNext = React.useCallback(() => {
      if (!scenes.length) return;
      setCurrentSceneIndex((prev) => {
        const nextIdx = prev < scenes.length - 1 ? prev + 1 : 0;
        onSceneChange?.(nextIdx, scenes[nextIdx]);
        return nextIdx;
      });
    }, [scenes, onSceneChange]);

    const handleSceneEnded = React.useCallback(() => {
      if (!scenes.length) return;
      setCurrentSceneIndex((prev) => {
        const nextIdx = prev < scenes.length - 1 ? prev + 1 : 0;
        onSceneChange?.(nextIdx, scenes[nextIdx]);
        return nextIdx;
      });
    }, [scenes, onSceneChange]);

    // Autoplay & mute handling
    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (!isMuted) {
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          }
        });
      }
    }, [activeScene?.scene_clip_url, isMuted]);

    // Keyboard navigation
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrev();
        } else if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
          handleNext();
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
    }, [handlePrev, handleNext, handleBack]);

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

            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 ring-1.5 ring-white/80 overflow-hidden",
                avatarColor
              )}
            >
              {avatarInitials}
            </div>
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
          </div>
        </div>

        {/* Main Scene Video Player Stage */}
        <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden min-h-0">
          <video
            ref={videoRef}
            key={activeScene?.scene_clip_url}
            src={activeScene?.scene_clip_url}
            autoPlay
            playsInline
            loop={false}
            muted={isMuted}
            onEnded={handleSceneEnded}
            className="w-full h-full object-contain bg-black"
          />

          {/* Invisible Interactive Tap Zones for Stepping Scenes */}
          <div className="absolute inset-x-0 top-[60px] bottom-[70px] flex z-10">
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
        <div className="p-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-4 z-20 shrink-0">
          <PromptInput
            placeholder={placeholder || publishPlaceholder}
            value={promptValue}
            onChange={onPromptValueChange}
            onSubmit={handlePromptSubmit}
            loading={loading}
            onStop={onStop}
            enableSpeech={enableSpeech}
            className="border border-border bg-background shadow-md overflow-hidden rounded-2xl"
          />
        </div>
      </div>
    );
  }
);

ScenePlayer.displayName = "ScenePlayer";
