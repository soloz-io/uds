"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { MicIcon } from "lucide-react";
import { useOptionalPromptInputAttachments } from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";

/** Hard cap on a single recording, so a voice note stays far under the 5MB chat-attachment limit. */
const MAX_RECORDING_MS = 5_000;
/** Mirrors the SDK's per-attachment cap (chat-attachments.ts). UX-only; the SDK re-checks. */
const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

export interface SpeechInputProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Receives the recording only when no attachments context is available.
   * Inside a PromptInput the recording attaches to the composer as a chip
   * instead — that is the default path.
   */
  onAudioRecorded?: (blob: Blob) => void;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

/**
 * SpeechInput — voice-note recorder.
 *
 * Records up to MAX_RECORDING_MS from the microphone with MediaRecorder and
 * attaches the result (audio/webm in Chrome/Firefox, audio/mp4 in Safari) to
 * the composer's attachments, where it uploads to S3 with the rest of the
 * message's chat attachments. No live transcription: the message text is typed.
 */
export const SpeechInput = React.memo<SpeechInputProps>(
  ({
    onAudioRecorded,
    variant = "ghost",
    size = "icon",
    disabled = false,
    className,
    ...props
  }) => {
    const [isRecording, setIsRecording] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const streamRef = React.useRef<MediaStream | null>(null);
    const chunksRef = React.useRef<Blob[]>([]);
    const timerRef = React.useRef<number | null>(null);
    const disposedRef = React.useRef(false);
    const attachments = useOptionalPromptInputAttachments();

    const clearTimer = React.useCallback(() => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const releaseStream = React.useCallback(() => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }, []);

    const finalize = React.useCallback(
      (blob: Blob) => {
        if (blob.size === 0) return;
        if (blob.size > MAX_AUDIO_BYTES) {
          setError("Recording is too large — record again.");
          if (process.env.NODE_ENV === "development") {
            console.warn("[SpeechInput] recording exceeds 5MB after encoding");
          }
          return;
        }
        // Strip codec parameters: MediaRecorder reports
        // `audio/webm;codecs=opus`, and every downstream allowlist
        // (frontend + SDK) matches on the base type.
        const baseType = (blob.type || "audio/webm").split(";")[0];
        const subtype = baseType.split("/")[1] ?? "webm";
        const file = new File([blob], `voice-${Date.now()}.${subtype}`, {
          type: baseType,
        });
        if (attachments) {
          attachments.add([file]);
        } else {
          onAudioRecorded?.(blob);
        }
      },
      [attachments, onAudioRecorded]
    );

    const stopRecording = React.useCallback(() => {
      clearTimer();
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    }, [clearTimer]);

    const startRecording = React.useCallback(async () => {
      if (
        typeof MediaRecorder === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setError("Voice notes are not supported in this browser.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (disposedRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        chunksRef.current = [];

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            // Base type only — recorder.mimeType carries `;codecs=…`.
            type: (recorder.mimeType || "audio/webm").split(";")[0],
          });
          chunksRef.current = [];
          releaseStream();
          if (disposedRef.current) return;
          mediaRecorderRef.current = null;
          setIsRecording(false);
          finalize(blob);
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setError(null);
        setIsRecording(true);
        timerRef.current = window.setTimeout(
          () => stopRecording(),
          MAX_RECORDING_MS
        );
      } catch (err) {
        releaseStream();
        mediaRecorderRef.current = null;
        setIsRecording(false);
        setError("Microphone access denied.");
        if (process.env.NODE_ENV === "development") {
          console.warn("[SpeechInput] failed to start recording:", err);
        }
      }
    }, [finalize, releaseStream, stopRecording]);

    const toggleListening = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isRecording) {
          stopRecording();
        } else {
          void startRecording();
        }
      },
      [isRecording, startRecording, stopRecording]
    );

    React.useEffect(() => {
      return () => {
        disposedRef.current = true;
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state !== "inactive") {
          try {
            recorder.stop();
          } catch {
            // already stopped
          }
        }
        releaseStream();
      };
    }, [releaseStream]);

    const status = error
      ? error
      : isRecording
        ? `Recording\u2026 (5s max)`
        : "Record a 5-second voice note";

    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={toggleListening}
        className={cn(
          "relative h-8 w-8 rounded-full text-muted-foreground hover:text-foreground transition-all duration-200",
          isRecording &&
            "bg-red-500/15 text-red-500 hover:bg-red-500/20 animate-pulse",
          error && "text-red-500",
          className
        )}
        aria-label={isRecording ? "Stop recording" : status}
        title={status}
        {...props}
      >
        <MicIcon
          className={cn("h-4 w-4", isRecording && "text-red-500")}
        />
        {isRecording && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </Button>
    );
  }
);

SpeechInput.displayName = "SpeechInput";
