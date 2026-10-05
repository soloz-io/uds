"use client";

import * as React from "react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { SideSheet } from "@/components/composites/SideSheet";
import { cn } from "@/lib/utils";

/** Where a comment stands: a local draft, or a step in the agents' work on it. */
export type SceneCommentStatus = "draft" | "pending" | "in-progress" | "completed";

export interface SceneCommentHistoryStep {
  status: SceneCommentStatus;
  /** ISO timestamp. */
  at: string;
  /** Who moved it, e.g. "agent:motion-graphics". */
  by?: string;
  note?: string;
  /** The version that holds the change, once completed. */
  version?: string;
}

export interface SceneReviewComment {
  id: string;
  /** The scene the comment is about, e.g. "Scene 3". */
  sceneLabel?: string;
  authorName: string;
  /** ISO timestamp. */
  createdAt: string;
  content: string;
  status: SceneCommentStatus;
  history?: SceneCommentHistoryStep[];
  /** The version that holds the change, once completed. */
  resultVersion?: string;
}

export interface SceneReviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** e.g. "5 comments across 3 scenes". */
  description?: React.ReactNode;
  /** Every comment on the video, in scene order; each names its scene. */
  comments: SceneReviewComment[];
  /** Removes a draft; drafts are the only comments the user can take back. */
  onRemoveDraft?: (id: string) => void;
  /** Drafts across every scene, waiting to be sent. */
  draftCount: number;
  /** Sends every draft, as one batch, for the agents to act on. */
  onApply?: () => void;
  applyDisabled?: boolean;
  /** Why sending is unavailable, e.g. while a version is being made. */
  applyDisabledReason?: string;
  className?: string;
}

/**
 * Each status as a neutral badge with its icon, coloured by the theme's status
 * tokens (success, warning, info), so every theme sets its own shades.
 */
const STATUS_CONFIG: Record<SceneCommentStatus, { label: string; icon: string; colorClass: string; spin?: boolean }> = {
  draft: { label: "Draft", icon: "pencil", colorClass: "text-muted-foreground" },
  pending: { label: "Pending", icon: "clock", colorClass: "text-warning" },
  "in-progress": { label: "In progress", icon: "loader-2", colorClass: "text-info", spin: true },
  completed: { label: "Completed", icon: "check-circle", colorClass: "text-success" },
};

function StatusBadge({ comment }: { comment: SceneReviewComment }) {
  const config = STATUS_CONFIG[comment.status];
  return (
    <Badge
      variant="secondary"
      className="shrink-0 gap-1.5 rounded-full text-xs"
      data-testid={`scene-comment-status-${comment.id}`}
    >
      <Icon name={config.icon} size="xs" className={cn(config.colorClass, config.spin && "animate-spin")} aria-hidden="true" />
      <span className={config.colorClass}>
        {config.label}
        {comment.status === "completed" && comment.resultVersion ? ` · ${comment.resultVersion}` : ""}
      </span>
    </Badge>
  );
}

const relativeTime = (iso: string): string => {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return iso;
  const seconds = Math.round((then - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const steps: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(seconds, "second");
};

function CommentItem({
  comment,
  onRemoveDraft,
}: {
  comment: SceneReviewComment;
  onRemoveDraft?: (id: string) => void;
}) {
  const [showHistory, setShowHistory] = React.useState(false);
  const history = comment.history ?? [];
  const canDelete = comment.status === "draft" && Boolean(onRemoveDraft);

  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-border/60 bg-card px-4 py-3"
      data-testid={`scene-comment-${comment.id}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Title row: the scene, and where the comment stands */}
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="truncate text-sm font-semibold text-foreground"
            data-testid={`scene-comment-scene-${comment.id}`}
          >
            {comment.sceneLabel ?? "Comment"}
          </span>
          <StatusBadge comment={comment} />
        </div>

        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
          {comment.content}
        </p>

        {/* Meta row: who and when, and the history toggle */}
        <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">{comment.authorName}</span>
          <span aria-hidden>·</span>
          <time dateTime={comment.createdAt} title={comment.createdAt} className="shrink-0">
            {relativeTime(comment.createdAt)}
          </time>
          {history.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <button
                type="button"
                className="shrink-0 underline-offset-2 hover:underline"
                onClick={() => setShowHistory((v) => !v)}
                data-testid={`btn-comment-history-${comment.id}`}
              >
                {showHistory ? "Hide history" : `History (${history.length})`}
              </button>
            </>
          )}
        </div>

        {showHistory && (
          <ol className="mt-1 space-y-1 border-l border-border/60 pl-3" data-testid={`comment-history-${comment.id}`}>
            {history.map((step, index) => (
              <li key={`${step.status}-${step.at}-${index}`} className="text-xs text-muted-foreground">
                <span className={cn("font-medium", STATUS_CONFIG[step.status].colorClass)}>{STATUS_CONFIG[step.status].label}</span>
                {step.version ? ` · ${step.version}` : ""}
                {step.by ? ` · ${step.by}` : ""}
                {" · "}
                <time dateTime={step.at} title={step.at}>
                  {relativeTime(step.at)}
                </time>
                {step.note ? <span className="block text-foreground/70">{step.note}</span> : null}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Right-side control: drafts can be deleted; sent comments are kept with their history */}
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete comment"
          className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:text-destructive"
          onClick={() => onRemoveDraft?.(comment.id)}
          data-testid={`btn-delete-comment-${comment.id}`}
        >
          <Icon name="trash-2" className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * The review drawer of a rendered video: every comment on its scenes, each
 * naming its scene and where it stands, and the action that sends all the
 * user's drafts as one batch.
 */
export function SceneReviewSheet({
  open,
  onOpenChange,
  description,
  comments,
  onRemoveDraft,
  draftCount,
  onApply,
  applyDisabled = false,
  applyDisabledReason,
  className,
}: SceneReviewSheetProps) {
  const canApply = Boolean(onApply) && draftCount > 0 && !applyDisabled;

  const footer = onApply ? (
    <div className="flex w-full flex-col gap-2">
      {applyDisabled && applyDisabledReason ? (
        <p className="text-xs text-muted-foreground" data-testid="scene-review-apply-reason">
          {applyDisabledReason}
        </p>
      ) : null}
      <Button
        className="w-full"
        disabled={!canApply}
        onClick={() => onApply?.()}
        data-testid="btn-apply-scene-changes"
      >
        {draftCount > 0 ? `Apply changes (${draftCount})` : "Apply changes"}
      </Button>
    </div>
  ) : undefined;

  return (
    <SideSheet
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      title="Scene comments"
      description={description}
      footer={footer}
      className={className}
    >
      <div className="space-y-3" data-testid="scene-comments-panel">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
            <p className="text-sm font-medium text-foreground">No comments yet</p>
            <p className="max-w-[240px] text-xs">
              Describe a change to any scene below. Comments wait here until you apply them together.
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onRemoveDraft={onRemoveDraft} />
          ))
        )}
      </div>
    </SideSheet>
  );
}
