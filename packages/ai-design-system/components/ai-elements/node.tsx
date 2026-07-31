import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedBorder } from "@/components/ui/animated-border";
import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import type { ComponentProps } from "react";

export type NodeProps = ComponentProps<typeof Card> & {
  handles: {
    target: boolean;
    source: boolean;
  };
  status?: "idle" | "running" | "success" | "error";
};

export const Node = ({ handles, className, status, ...props }: NodeProps) => (
  <Card
    className={cn(
      "node-container group relative h-[52px] w-[180px] gap-0 overflow-hidden rounded-md bg-card p-0 transition-all duration-200",
      status === "success" && "border-green-500 border-2",
      status === "error" && "border-red-500 border-2",
      className
    )}
    {...props}
  >
    {status === "running" && <AnimatedBorder />}
    {handles.target && (
      <>
        <Handle id="target-top"    position={Position.Top}    type="target" className="opacity-0 group-hover:opacity-100 group-[.selected]:opacity-100 transition-opacity duration-150" />
        <Handle id="target-right"  position={Position.Right}  type="target" className="opacity-0 group-hover:opacity-100 group-[.selected]:opacity-100 transition-opacity duration-150" />
        <Handle id="target-bottom" position={Position.Bottom} type="target" className="opacity-0 group-hover:opacity-100 group-[.selected]:opacity-100 transition-opacity duration-150" />
        <Handle id="target-left"   position={Position.Left}   type="target" className="opacity-0 group-hover:opacity-100 group-[.selected]:opacity-100 transition-opacity duration-150" />
      </>
    )}
    {handles.source && (
      <>
        <Handle id="source-top"    position={Position.Top}    type="source" className="opacity-0 group-hover:opacity-100 group-[.selected]:opacity-100 transition-opacity duration-150" />
        <Handle id="source-right"  position={Position.Right}  type="source" className="opacity-0 group-hover:opacity-100 group-[.selected]:opacity-100 transition-opacity duration-150" />
        <Handle id="source-bottom" position={Position.Bottom} type="source" className="opacity-0 group-hover:opacity-100 group-[.selected]:opacity-100 transition-opacity duration-150" />
        <Handle id="source-left"   position={Position.Left}   type="source" className="opacity-0 group-hover:opacity-100 group-[.selected]:opacity-100 transition-opacity duration-150" />
      </>
    )}
    {props.children}
  </Card>
);

export type NodeHeaderProps = ComponentProps<typeof CardHeader>;

export const NodeHeader = ({ className, ...props }: NodeHeaderProps) => (
  <CardHeader
    className={cn("gap-0.5 rounded-t-md border-b bg-secondary p-3!", className)}
    {...props}
  />
);

export type NodeTitleProps = ComponentProps<typeof CardTitle>;

export const NodeTitle = (props: NodeTitleProps) => <CardTitle {...props} />;

export type NodeDescriptionProps = ComponentProps<typeof CardDescription>;

export const NodeDescription = (props: NodeDescriptionProps) => (
  <CardDescription {...props} />
);

export type NodeActionProps = ComponentProps<typeof CardAction>;

export const NodeAction = (props: NodeActionProps) => <CardAction {...props} />;

export type NodeContentProps = ComponentProps<typeof CardContent>;

export const NodeContent = ({ className, ...props }: NodeContentProps) => (
  <CardContent className={cn("p-3", className)} {...props} />
);

export type NodeFooterProps = ComponentProps<typeof CardFooter>;

export const NodeFooter = ({ className, ...props }: NodeFooterProps) => (
  <CardFooter
    className={cn("rounded-b-md border-t bg-secondary p-3!", className)}
    {...props}
  />
);

export function getHighlightIconColor(
  status?: string,
  highlightStatus?: string,
  defaultColorClass: string = "text-primary"
): string {
  const effectiveHighlight =
    highlightStatus ??
    (status === "success" || status === "completed" || status === "done"
      ? "done"
      : status === "pending_hitl" || status === "pending"
      ? "pending"
      : status === "running" || status === "active"
      ? "active"
      : status === "error" || status === "failed"
      ? "error"
      : undefined);

  switch (effectiveHighlight) {
    case "done":
      return "text-green-500";
    case "pending":
      return "text-amber-500";
    case "active":
      return "text-indigo-400";
    case "error":
      return "text-red-500";
    default:
      return defaultColorClass;
  }
}

