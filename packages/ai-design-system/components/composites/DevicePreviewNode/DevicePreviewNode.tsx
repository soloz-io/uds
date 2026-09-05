"use client";

import { memo, useMemo, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ExpoAppPreview } from "@/components/ai-elements/ExpoAppPreview";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/primitives/Tooltip";
import { cn } from "@/lib/utils";
import { getPreset, type DevicePreviewNodeData } from "./interfaces";

type DevicePreviewNodeProps = NodeProps & {
  data?: DevicePreviewNodeData;
  id: string;
};

/**
 * DevicePreviewNode Composite
 *
 * An `@xyflow/react` canvas node that renders a sandboxed Expo/React Native
 * app inside a device bezel. Owns no app-URL or screenshot logic — the URL is
 * passed via `data.src` and the iframe element is exposed through
 * `data.registerIframe` so consumers can rasterize it (e.g. html-to-image).
 *
 * ## Controls
 * - Screenshot button — emits `onTakeScreenshot({ route, iframe })`.
 * - Reload button — remounts the iframe (or defers to `data.onReload`).
 * - No device-preset switcher here — that lives once, on the canvas
 *   toolbar (`DevicePreviewToolbar`), not duplicated per node.
 *
 * ## Accessibility
 * - All icon buttons carry accessible names (tooltips + titles).
 * - Route badge is rendered as text, not icon-only.
 */
export const DevicePreviewNode = memo(({ data, id }: DevicePreviewNodeProps) => {
  const preset = getPreset(data?.presetId);
  const [reloadKey, setReloadKey] = useState(0);
  const registeredRef = useRef<HTMLIFrameElement | null>(null);

  const effectiveSrc = useMemo(() => {
    if (!data?.src) return "";
    if (!data?.route) return data.src;
    try {
      const url = new URL(data.src, typeof window !== "undefined" ? window.location.href : "http://localhost");
      url.searchParams.set("route", data.route);
      return url.toString();
    } catch {
      const sep = data.src.includes("?") ? "&" : "?";
      return `${data.src}${sep}route=${encodeURIComponent(data.route)}`;
    }
  }, [data?.src, data?.route]);

  if (!data) {
    return null;
  }

  const handleReload = () => {
    if (data.onReload) {
      data.onReload();
      return;
    }
    setReloadKey((k) => k + 1);
  };

  const handleTakeScreenshot = () => {
    const iframe = registeredRef.current;
    if (!iframe) return;
    data.onTakeScreenshot?.({ route: data.route, iframe });
  };

  const scale = data.scale ?? (data.hideControls ? 0.45 : 1.0);
  const baseWidth = preset.isResponsive ? 420 : preset.width;
  const baseHeight = preset.isResponsive ? 780 : preset.height;

  const screenWidth = Math.round(baseWidth * scale);
  const screenHeight = Math.round(baseHeight * scale);
  const outerWidth = screenWidth + (data.hideControls ? 12 : 32);
  const outerHeight = screenHeight + (data.hideControls ? 12 : 88);

  return (
    <div
      className={cn(
        "relative rounded-[1.75rem] border-3 border-slate-300 dark:border-slate-700 bg-card p-1.5 shadow-2xl",
        "transition-all duration-150 ease-out",
        !data.hideControls && "p-2 rounded-[2.5rem] border-4"
      )}
      data-testid={`device-preview-node-${id}`}
      style={{
        width: preset.isResponsive ? undefined : outerWidth,
        height: preset.isResponsive ? undefined : outerHeight,
      }}
    >
      {/* Top eyebrow title above device frame */}
      {data.label && (
        <div className="absolute -top-6 left-0 right-0 text-center text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
          {data.label}
        </div>
      )}

      {/* Floating toolbar — rendered when controls not hidden.
          No device-preset select here: the canvas toolbar
          (DevicePreviewToolbar, rendered in the canvas panel slot) already
          owns that choice, and having a second one on the node itself was
          the same control twice. Screenshot/reload stay — those are
          per-node actions with no equivalent up there. */}
      {!data.hideControls && (
        <div className="pointer-events-auto flex items-center justify-end gap-2 px-1 pb-2">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={handleTakeScreenshot}
                  title="Take screenshot of preview"
                  aria-label="Take screenshot of preview"
                >
                  <Icon name="camera" size="sm" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Take screenshot of preview</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={handleReload}
                  title="Reload preview"
                  aria-label="Reload preview"
                >
                  <Icon name="refresh-cw" size="sm" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reload preview</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Device screen */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.25rem] border border-border/40 bg-background",
          data.interactive !== true && "pointer-events-none",
        )}
        style={{ width: screenWidth, height: screenHeight }}
      >
        <div
          style={{
            width: baseWidth,
            height: baseHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <ExpoAppPreview
            key={reloadKey}
            src={effectiveSrc}
            title={data.label ? `${data.label} preview` : "App preview"}
            loading={data.loading}
            isEmpty={data.isEmpty}
            error={data.error}
            registerIframe={(el) => {
              registeredRef.current = el;
              data.registerIframe?.(el);
            }}
          />
        </div>

        {data.showRouteBadge && data.route && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {data.route}
            </Badge>
          </div>
        )}

        {/* Canvas-owned transition triggers — deliberately rendered here,
            as siblings of the (always pointer-events-none) app iframe
            wrapper above, with pointer-events-auto explicitly set. A CSS
            pointer-events-none on an ancestor does not disable an
            auto-opting-back-in descendant, so these stay clickable even
            though the live app underneath never receives a single real
            tap in any view. */}
        {data.transitions && data.transitions.length > 0 && (
          <div className="pointer-events-auto absolute bottom-2 right-2 flex flex-col items-end gap-1">
            {data.transitions.map((t) => (
              <Button
                key={t.id}
                size="sm"
                variant="secondary"
                className="h-7 gap-1 px-2 text-xs shadow-md"
                onClick={t.onTrigger}
                title={t.label}
              >
                {t.label}
                <Icon name="arrow-right" size="xs" />
              </Button>
            ))}
          </div>
        )}
      </div>

      {!data.hideControls && data.label && (
        <div className="px-1 pt-2 text-center text-xs text-muted-foreground">
          {data.label}
        </div>
      )}

      {/* Standard target handles on all 4 edges */}
      <Handle id="target-left" position={Position.Left} type="target" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <Handle id="target" position={Position.Left} type="target" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <Handle id="target-top" position={Position.Top} type="target" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <Handle id="target-right" position={Position.Right} type="target" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <Handle id="target-bottom" position={Position.Bottom} type="target" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

      {/* Dynamic element-anchored source handles */}
      {data.actionPorts && data.actionPorts.length > 0 &&
        data.actionPorts.map((port) => (
          <Handle
            key={port.id}
            id={port.id}
            type="source"
            position={Position.Right}
            style={{ top: (data.hideControls ? 6 : 40) + port.top * scale }}
            className="!h-2.5 !w-2.5 !bg-blue-600 !border-2 !border-white shadow-sm"
          />
        ))}

      {/* Standard source handles on all 4 edges */}
      <Handle id="source-right" position={Position.Right} type="source" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <Handle id="source" position={Position.Right} type="source" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <Handle id="source-top" position={Position.Top} type="source" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <Handle id="source-bottom" position={Position.Bottom} type="source" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <Handle id="source-left" position={Position.Left} type="source" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
    </div>
  );
});

DevicePreviewNode.displayName = "DevicePreviewNode";