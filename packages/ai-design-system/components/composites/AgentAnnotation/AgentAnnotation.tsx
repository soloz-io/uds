"use client";

import { memo } from "react";
import { useStore, type NodeProps } from "@xyflow/react";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export type AgentAnnotationStatus = "active" | "completed" | "error";

export type AgentAnnotationNodeData = {
  type: "agentAnnotation";
  /** Sub-agent display name. Not rendered as text — it supplies the initials
   *  and the hover/screen-reader label. */
  agentName: string;
  status: AgentAnnotationStatus;
  /** Distinguishes concurrent pins from one another. */
  colorIndex?: number;
};

type AgentAnnotationProps = NodeProps & { data?: AgentAnnotationNodeData };

/** One accent per concurrent agent, so two pins on one region stay distinct. */
const ACCENTS = [
  { ring: "ring-indigo-500", pulse: "bg-indigo-500", fill: "bg-indigo-600", text: "text-indigo-50" },
  { ring: "ring-emerald-500", pulse: "bg-emerald-500", fill: "bg-emerald-600", text: "text-emerald-50" },
  { ring: "ring-amber-500", pulse: "bg-amber-500", fill: "bg-amber-600", text: "text-amber-50" },
  { ring: "ring-rose-500", pulse: "bg-rose-500", fill: "bg-rose-600", text: "text-rose-50" },
] as const;

function getInitials(name: string): string {
  const words = name.replace(/[_-]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "AI";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * A presence pin marking the screen an agent is working on.
 *
 * Deliberately wordless. It answers one question — *where* is work happening —
 * and the pulse answers *whether* it still is. What the agent is doing and
 * saying belongs in the chat panel; putting any of it on the canvas turned a
 * glanceable marker into a second thing to read, sitting on top of the very
 * screen the user was trying to look at. The name survives only as the hover
 * title and the accessible label, which cost no space.
 *
 * Two details make it read as presence, and both are easy to break:
 *
 * 1. The glide. The node's position changes as the agent moves between anchors,
 *    and the transform transition animating it is set as `style` on the node
 *    object (see the frontend's annotation-nodes builder), because React Flow
 *    owns the wrapper element that carries the transform. The node id must stay
 *    stable across anchor changes or React Flow remounts the element and the pin
 *    teleports instead of travelling.
 * 2. The counter-scale. React Flow scales node content with the viewport, so
 *    without this the pin would shrink to nothing when zoomed out. Reading zoom
 *    from the store and applying its inverse keeps the pin at a constant screen
 *    size — the anchor still tracks the node, only the chrome stops scaling.
 */
export const AgentAnnotation = memo(({ data }: AgentAnnotationProps) => {
  const zoom = useStore((s) => s.transform[2]);

  const agentName = data?.agentName ?? "agent";
  const status = data?.status ?? "active";
  const accent = ACCENTS[(data?.colorIndex ?? 0) % ACCENTS.length];
  const isActive = status === "active";

  const label =
    status === "active"
      ? `${agentName} is working on this screen`
      : status === "error"
        ? `${agentName} stopped on this screen`
        : `${agentName} finished on this screen`;

  return (
    <div
      className="nodrag nopan nowheel pointer-events-none"
      style={{
        // Inverse of the viewport zoom — constant screen size at any scale.
        transform: `scale(${1 / (zoom || 1)})`,
        transformOrigin: "top left",
      }}
    >
      <span
        role="img"
        aria-label={label}
        title={label}
        className={cn(
          "pointer-events-auto relative flex h-7 w-7 items-center justify-center rounded-full",
          "text-[10px] font-semibold tracking-tight shadow-md",
          "ring-2 ring-offset-2 ring-offset-background",
          accent.fill,
          accent.text,
          status === "completed" && "ring-emerald-500",
          status === "error" && "ring-rose-500",
          isActive && accent.ring,
          // A finished pin is a quiet record of where the work happened; it must
          // not compete with whatever is running now.
          !isActive && "opacity-70",
        )}
      >
        {status === "completed" ? (
          <Icon name="check" size="xs" aria-hidden />
        ) : status === "error" ? (
          <Icon name="alert-circle" size="xs" aria-hidden />
        ) : (
          getInitials(agentName)
        )}

        {/* The working indicator: an expanding halo, for as long as work runs.
            `motion-safe` keeps it out of the way for users who asked for
            reduced motion — for whom the solid ring alone carries the state. */}
        {isActive && (
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping",
              accent.pulse,
            )}
          />
        )}
      </span>
    </div>
  );
});

AgentAnnotation.displayName = "AgentAnnotation";
