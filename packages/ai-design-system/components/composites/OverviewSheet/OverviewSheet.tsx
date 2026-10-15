"use client";

import * as React from "react";
import { Icon } from "@/components/primitives/Icon";
import { SideSheet } from "@/components/composites/SideSheet";
import { cn } from "@/lib/utils";

export interface OverviewBadge {
  label: string;
  icon?: string;
  variant?: "default" | "success" | "neutral" | "warning";
}

export interface OverviewMetadataItem {
  label: string;
  value: React.ReactNode;
}

export interface NarrationData {
  /** The full raw markdown content. */
  raw?: string;
  /** Frontmatter key-value pairs. */
  frontmatter?: Record<string, string>;
  /** Optional structured config parsed from frontmatter or code block. */
  dataBlock?: Record<string, unknown>;
  /** The body script text without frontmatter. */
  body?: string;
  /** Whether the script content is present and valid. */
  isValid?: boolean;
}

export interface OverviewSheetProps {
  /** Controls open/close state */
  open: boolean;
  /** Callback fired when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Title displayed in the sheet header (default: "Overview") */
  title?: React.ReactNode;
  /** Optional subtitle/description displayed below the title */
  description?: React.ReactNode;
  /** Badges / pills shown below the header */
  badges?: OverviewBadge[];
  /** Card header label above the main content (default: "Content") */
  contentTitle?: string;
  /** Optional badge/counter in the content card header (e.g. "170 words") */
  contentBadge?: React.ReactNode;
  /** Main body content to display */
  content?: React.ReactNode;
  /** Optional structured key-value metadata list */
  metadata?: OverviewMetadataItem[];
  /** Optional empty state configuration */
  emptyState?: {
    title?: string;
    description?: string;
    icon?: string;
  };
  /**
   * Convenience adapter: pass narration data or raw markdown string directly.
   * Automatically populates title, description, badges, and content if not provided.
   */
  narration?: NarrationData | string | null;
  /** Custom children to render in addition to or instead of standard content */
  children?: React.ReactNode;
  /** Class name for the sheet panel */
  className?: string;
  /** Size on desktop (defaults to 'sm' matching standard shadcn sm:max-w-sm) */
  size?: "sm" | "md" | "lg" | "xl";
}

/** Parses raw markdown string into frontmatter and body if a string is passed. */
function parseRawContent(rawText: string): NarrationData {
  if (!rawText || !rawText.trim()) {
    return { raw: rawText, frontmatter: {}, body: "", isValid: false };
  }

  const fmMatch = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const frontmatter: Record<string, string> = {};
  let remaining = rawText;

  if (fmMatch) {
    const fmLines = fmMatch[1].split("\n");
    for (const line of fmLines) {
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (key) frontmatter[key] = val;
      }
    }
    remaining = fmMatch[2];
  }

  const dataBlockMatch = remaining.match(/```(?:yaml)?\r?\n([\s\S]*?)\r?\n```/);
  let dataBlock: Record<string, unknown> | undefined;
  let body = remaining;

  if (dataBlockMatch) {
    const dbLines = dataBlockMatch[1].split("\n");
    dataBlock = {};
    for (const line of dbLines) {
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (key) {
          const num = Number(val);
          dataBlock[key] = !isNaN(num) ? num : val;
        }
      }
    }
    body = remaining.replace(dataBlockMatch[0], "").trim();
  }

  body = body.trim();
  const isValid = body.length > 0 || rawText.trim().length > 0;

  return {
    raw: rawText,
    frontmatter,
    dataBlock,
    body,
    isValid,
  };
}

/**
 * OverviewSheet Composite
 *
 * A generic slide-out overview drawer for displaying structured documents,
 * narration scripts, project briefs, or specifications with status badges,
 * metadata summary, and scrollable content body.
 */
export function OverviewSheet({
  open,
  onOpenChange,
  title: titleProp,
  description: descriptionProp,
  badges: badgesProp,
  contentTitle: contentTitleProp,
  contentBadge: contentBadgeProp,
  content: contentProp,
  metadata,
  emptyState,
  narration,
  children,
  className,
  size,
}: OverviewSheetProps) {
  // Parse narration if provided
  const parsedNarration: NarrationData | null = React.useMemo(() => {
    if (!narration) return null;
    if (typeof narration === "string") return parseRawContent(narration);
    return narration;
  }, [narration]);

  // Resolve body content
  const bodyText = contentProp !== undefined
    ? contentProp
    : parsedNarration?.body || parsedNarration?.raw || null;

  const hasContent = Boolean(bodyText || children);

  // Derive word count & duration if narration data present
  const rawWordCount = parsedNarration?.dataBlock?.word_count;
  const wordCount: number | string | undefined =
    rawWordCount !== undefined
      ? (typeof rawWordCount === "number" || typeof rawWordCount === "string" ? rawWordCount : String(rawWordCount))
      : typeof bodyText === "string" && bodyText.trim()
        ? bodyText.trim().split(/\s+/).filter(Boolean).length
        : undefined;

  const rawDuration = parsedNarration?.dataBlock?.target_duration_seconds;
  const targetDuration: number | string | undefined =
    rawDuration !== undefined
      ? (typeof rawDuration === "number" || typeof rawDuration === "string" ? rawDuration : String(rawDuration))
      : undefined;

  // Resolve title
  const title =
    titleProp ||
    parsedNarration?.frontmatter?.title ||
    "Overview";

  // Resolve description
  const description =
    descriptionProp !== undefined
      ? descriptionProp
      : hasContent
        ? [
            wordCount !== undefined ? `${wordCount} words` : null,
            targetDuration !== undefined ? `${targetDuration}s target` : null,
          ]
            .filter(Boolean)
            .join(" · ") || parsedNarration?.frontmatter?.description
        : undefined;

  // Resolve badges
  const badges: OverviewBadge[] = React.useMemo(() => {
    if (badgesProp) return badgesProp;
    if (!parsedNarration) return [];

    const list: OverviewBadge[] = [];
    if (parsedNarration.frontmatter?.status) {
      list.push({
        label: parsedNarration.frontmatter.status,
        icon: "check-circle",
        variant: "success",
      });
    }
    if (parsedNarration.dataBlock?.content_style) {
      list.push({
        label: `${String(parsedNarration.dataBlock.content_style)} style`,
        variant: "neutral",
      });
    }
    if (parsedNarration.dataBlock?.speed) {
      list.push({
        label: `${String(parsedNarration.dataBlock.speed)}x speed`,
        variant: "neutral",
      });
    }
    if (targetDuration !== undefined && !description) {
      list.push({
        label: `${String(targetDuration)}s duration`,
        variant: "neutral",
      });
    }
    return list;
  }, [badgesProp, parsedNarration, targetDuration, description]);

  const contentTitle = contentTitleProp || (narration ? "Voice-over Script" : "Content");
  const contentBadge = contentBadgeProp || (wordCount !== undefined ? `${wordCount} words` : null);

  const emptyTitle = emptyState?.title || "No content yet";
  const emptyDescription = emptyState?.description || "The document or script has not been generated yet.";
  const emptyIcon = emptyState?.icon || "overview";

  return (
    <SideSheet
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      title={title}
      description={description}
      className={className}
      size={size}
    >
      <div className="space-y-4" data-testid="overview-sheet-panel">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
            <Icon name={emptyIcon} size="lg" className="text-muted-foreground/50 h-8 w-8" />
            <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
            <p className="max-w-[240px] text-xs">{emptyDescription}</p>
          </div>
        ) : (
          <>
            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                {badges.map((b, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      b.variant === "success" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                      b.variant === "warning" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                      (!b.variant || b.variant === "neutral" || b.variant === "default") &&
                        "bg-muted/60 border border-border/40 text-foreground/80"
                    )}
                  >
                    {b.icon && <Icon name={b.icon} size="xs" className="h-3 w-3" />}
                    {b.label}
                  </span>
                ))}
              </div>
            )}

            {/* Structured Metadata list if provided */}
            {metadata && metadata.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card p-3 divide-y divide-border/40 shadow-xs">
                {metadata.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0 text-xs">
                    <span className="text-muted-foreground font-medium">{item.label}</span>
                    <span className="text-foreground font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Children */}
            {children}

            {/* Main Content Card with Scroll Support */}
            {bodyText && (
              <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium border-b border-border/40 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Icon name="file-text" size="xs" className="text-muted-foreground/70" />
                    <span className="font-semibold text-foreground">{contentTitle}</span>
                  </div>
                  {contentBadge && (
                    <span className="text-xs text-muted-foreground font-medium">{contentBadge}</span>
                  )}
                </div>
                {typeof bodyText === "string" ? (
                  <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground font-normal select-text">
                    {bodyText}
                  </div>
                ) : (
                  <div className="text-sm text-foreground select-text">{bodyText}</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </SideSheet>
  );
}

// Backward-compatible alias
export const NarrationOverviewSheet = OverviewSheet;
export type NarrationOverviewSheetProps = OverviewSheetProps;
