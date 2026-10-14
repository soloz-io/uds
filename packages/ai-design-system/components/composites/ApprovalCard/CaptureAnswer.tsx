import * as React from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

/**
 * What a capture question asks for: audio, recorded here or picked from the
 * device, or an image picked from the device. Beside a carousel's options an
 * upload is the first tile, captioned `label`.
 */
export interface QuestionCapture {
  kind: "audio" | "image";
  source: "record" | "upload";
  /** For "record": what the user reads out loud while recording. */
  script?: string | null;
  /** The upload tile's caption among a carousel's options. */
  label?: string | null;
}

/**
 * Stores what was captured and answers with its address. Supplied by the app,
 * which knows where its attachments go; a card without it cannot take a
 * capture answer, and says so.
 */
export type StoreCapture = (file: File) => Promise<string>;

/** The audio and image types Waypoint accepts as an attachment, and its per-file limit (chat-attachments-validation.ts). */
export const CAPTURE_AUDIO_TYPES = ["audio/webm", "audio/wav", "audio/mp4", "audio/ogg", "audio/mpeg"];
export const CAPTURE_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export const CAPTURE_MAX_BYTES = 5 * 1024 * 1024;
/** Long enough for a two-minute script read at an easy pace. */
const MAX_RECORDING_MS = 4 * 60 * 1000;

const ACCEPTED: Record<QuestionCapture["kind"], { types: string[]; names: string; noun: string }> = {
  audio: { types: CAPTURE_AUDIO_TYPES, names: "WAV, MP3, M4A, WebM or OGG", noun: "recording" },
  image: { types: CAPTURE_IMAGE_TYPES, names: "PNG, JPEG, WebP or GIF", noun: "image" },
};

/** The `accept` list of a file picker for this kind. */
export const captureAccept = (kind: QuestionCapture["kind"]) => ACCEPTED[kind].types.join(",");

export type CapturePhase =
  | { at: "idle" }
  | { at: "recording"; startedAt: number }
  | { at: "storing"; previewUrl: string }
  | { at: "stored"; previewUrl: string; address: string }
  | { at: "failed"; message: string; previewUrl?: string };

type Phase = CapturePhase;

export interface CaptureAnswerProps {
  capture: QuestionCapture;
  store?: StoreCapture;
  /** The stored address, or null while there is none. */
  onAnswer: (address: string | null) => void;
  className?: string;
}

const baseType = (mime: string) => mime.split(";")[0].trim().toLowerCase();

const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * Checks a file against what this kind accepts, stores it, and reports the
 * address (null while there is none). Shared by the capture answer and the
 * carousel's upload tile.
 */
export function useStoredCapture(
  kind: QuestionCapture["kind"],
  store: StoreCapture | undefined,
  onAnswer: (address: string | null) => void,
  setPhase: (phase: CapturePhase) => void,
) {
  const keep = React.useCallback(
    async (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      const accepted = ACCEPTED[kind];
      if (!accepted.types.includes(baseType(file.type))) {
        setPhase({ at: "failed", previewUrl, message: `This file type (${file.type || "unknown"}) can't be used. Use ${accepted.names}.` });
        onAnswer(null);
        return;
      }
      if (file.size > CAPTURE_MAX_BYTES) {
        setPhase({
          at: "failed",
          previewUrl,
          message:
            kind === "audio"
              ? "This recording is over 5 MB. Use a shorter or compressed file (an MP3 or M4A of two minutes fits)."
              : "This image is over 5 MB. Use a smaller or compressed one.",
        });
        onAnswer(null);
        return;
      }
      if (!store) {
        setPhase({ at: "failed", previewUrl, message: `This chat can't take a ${accepted.noun} here.` });
        onAnswer(null);
        return;
      }
      setPhase({ at: "storing", previewUrl });
      onAnswer(null);
      try {
        const address = await store(file);
        setPhase({ at: "stored", previewUrl, address });
        onAnswer(address);
      } catch (err) {
        setPhase({ at: "failed", previewUrl, message: `It couldn't be saved: ${err instanceof Error ? err.message : String(err)}` });
      }
    },
    [kind, store, onAnswer, setPhase],
  );

  return { keep };
}

/**
 * A question answered with audio or an image: the card records audio (with the
 * script to read beside the controls) or takes a file, shows or plays it back,
 * and stores it as soon as it is made. The answer is the stored address; the
 * user can record again or pick another file until they submit.
 */
export function CaptureAnswer({ capture, store, onAnswer, className }: CaptureAnswerProps) {
  const [phase, setPhase] = React.useState<Phase>({ at: "idle" });
  // The clock for the recording timer: set when recording starts, ticked while it runs.
  const [now, setNow] = React.useState(0);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const stopTimerRef = React.useRef<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (phase.at !== "recording") return;
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, [phase.at]);

  React.useEffect(
    () => () => {
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    },
    [],
  );

  const { keep } = useStoredCapture(capture.kind, store, onAnswer, setPhase);

  const startRecording = async () => {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setPhase({ at: "failed", message: "The microphone isn't available. Allow access to it and try again." });
      return;
    }
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const type = baseType(recorder.mimeType || "audio/webm");
      const ext = type.split("/")[1] ?? "webm";
      void keep(new File(chunksRef.current, `voice.${ext}`, { type }));
    };
    recorderRef.current = recorder;
    recorder.start();
    onAnswer(null);
    setPhase({ at: "recording", startedAt: Date.now() });
    setNow(Date.now());
    stopTimerRef.current = window.setTimeout(() => recorder.state === "recording" && recorder.stop(), MAX_RECORDING_MS);
  };

  const stopRecording = () => {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const preview = "previewUrl" in phase ? phase.previewUrl : undefined;
  const busy = phase.at === "recording" || phase.at === "storing";

  return (
    <div className={cn("mb-2 space-y-3", className)} data-testid="approval-card-capture">
      {capture.source === "record" && capture.script && (
        <div
          className="max-h-56 overflow-y-auto rounded-lg border border-border bg-muted/20 p-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap"
          data-testid="approval-card-capture-script"
        >
          {capture.script}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {capture.source === "record" ? (
          phase.at === "recording" ? (
            <Button type="button" variant="destructive" size="sm" onClick={stopRecording} data-testid="approval-card-capture-stop">
              <Icon name="square" size="sm" className="mr-2" />
              Stop
            </Button>
          ) : (
            <Button type="button" variant={preview ? "outline" : "default"} size="sm" onClick={startRecording} disabled={phase.at === "storing"} data-testid="approval-card-capture-record">
              <Icon name={preview ? "refresh-cw" : "mic"} size="sm" className="mr-2" />
              {preview ? "Record again" : "Record"}
            </Button>
          )
        ) : (
          <>
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
              data-testid="approval-card-capture-file"
            />
            <Button type="button" variant={preview ? "outline" : "default"} size="sm" onClick={() => fileInputRef.current?.click()} disabled={busy} data-testid="approval-card-capture-pick">
              <Icon name="upload" size="sm" className="mr-2" />
              {capture.kind === "image"
                ? preview ? "Choose another image" : "Choose an image"
                : preview ? "Choose another file" : "Choose an audio file"}
            </Button>
          </>
        )}

        {phase.at === "recording" && (
          <span className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
            Recording {formatTime(now - phase.startedAt)} / {formatTime(MAX_RECORDING_MS)}
          </span>
        )}
        {phase.at === "storing" && (
          <span className="flex items-center text-sm text-muted-foreground">
            <Icon name="loader-2" size="sm" className="mr-2 animate-spin" />
            Saving…
          </span>
        )}
      </div>

      {preview && phase.at !== "recording" && (
        capture.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your upload" className="max-h-64 rounded-lg border border-border object-contain" data-testid="approval-card-capture-preview" />
        ) : (
          <audio controls src={preview} className="h-10 w-full" data-testid="approval-card-capture-preview" />
        )
      )}

      {phase.at === "failed" && (
        <p className="flex items-start text-sm text-destructive" data-testid="approval-card-capture-error">
          <Icon name="alert-circle" size="sm" className="mr-2 mt-0.5 flex-shrink-0" />
          {phase.message}
        </p>
      )}
    </div>
  );
}
