"use client";

import { memo, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ExpoAppPreview } from "@/components/ai-elements/ExpoAppPreview";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/primitives/Tooltip";
import { cn } from "@/lib/utils";
import {
  DEVICE_PRESETS,
  getPreset,
  type DevicePreviewNodeData,
} from "./interfaces";

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
 * - Device preset switcher (curated `DEVICE_PRESETS` table — Expo exposes no
 *   device-dimension catalog, so presets are hardcoded like Storybook).
 * - Screenshot button — emits `onTakeScreenshot({ route, iframe })`.
 * - Reload button — remounts the iframe (or defers to `data.onReload`).
 *
 * ## Accessibility
 * - All icon buttons carry accessible names (tooltips + titles).
 * - Route badge is rendered as text, not icon-only.
 */
export const DevicePreviewNode = memo(({ data, id }: DevicePreviewNodeProps) => {
  const preset = getPreset(data?.presetId);
  const [reloadKey, setReloadKey] = useState(0);
  const registeredRef = useRef<HTMLIFrameElement | null>(null);

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

  const screenWidth = preset.isResponsive ? "100%" : preset.width;
  const screenHeight = preset.isResponsive ? "100%" : preset.height;

  return (
    <div
      className={cn(
        "relative rounded-[2.5rem] border-4 border-slate-300 dark:border-slate-700 bg-card p-2 shadow-2xl",
        "transition-all duration-150 ease-out",
        data.hideControls && "p-1.5 rounded-[2.25rem] border-[3px]"
      )}
      data-testid={`device-preview-node-${id}`}
      style={{
        width: preset.isResponsive ? undefined : preset.width + (data.hideControls ? 16 : 32),
        height: preset.isResponsive ? undefined : preset.height + (data.hideControls ? 16 : 88),
      }}
    >
      {/* Top eyebrow title above device frame */}
      {data.label && (
        <div className="absolute -top-7 left-0 right-0 text-center text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          {data.label}
        </div>
      )}

      {/* Floating toolbar — rendered when controls not hidden */}
      {!data.hideControls && (
        <div className="pointer-events-auto flex items-center justify-between gap-2 px-1 pb-2">
          <Select
            value={data.presetId ?? preset.id}
            onValueChange={data.onPresetChange}
          >
            <SelectTrigger
              className="h-8 w-[150px] text-xs"
              aria-label="Device preset"
            >
              <SelectValue placeholder="Device" />
            </SelectTrigger>
            <SelectContent>
              {DEVICE_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
          "relative overflow-hidden rounded-[1.75rem] border border-border/40 bg-background",
          data.interactive !== true && "pointer-events-none",
        )}
        style={{ width: screenWidth, height: screenHeight }}
      >
        <ExpoAppPreview
          key={reloadKey}
          src={data.src}
          title={data.label ? `${data.label} preview` : "App preview"}
          loading={data.loading}
          isEmpty={data.isEmpty}
          error={data.error}
          registerIframe={(el) => {
            registeredRef.current = el;
            data.registerIframe?.(el);
          }}
        />

        {data.showRouteBadge && data.route && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {data.route}
            </Badge>
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
            style={{ top: port.top }}
            className="!h-3 !w-3 !bg-blue-600 !border-2 !border-white shadow-sm"
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