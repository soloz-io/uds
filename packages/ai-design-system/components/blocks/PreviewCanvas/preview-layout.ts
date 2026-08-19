import { getLayoutedElements } from '../WorkflowCanvas/layout-engine';
import { DEVICE_PRESETS } from '../../composites/DevicePreviewNode/interfaces';
import type { WorkflowEdge, WorkflowNode } from '../WorkflowCanvas/interfaces';
import type { AppRouteManifest } from './interfaces';

export interface PreviewLayoutOptions {
  presetId?: string;
  loading?: boolean;
  isEmpty?: boolean;
  error?: string | null;
  interactive?: boolean;
  hideControls?: boolean;
}

/**
 * Compute the canvas-space pixel size of a DevicePreviewNode for a given preset.
 * Matches the inline style logic in DevicePreviewNode.tsx:
 *   width  = preset.width  + (hideControls ? 16 : 32)
 *   height = preset.height + (hideControls ? 16 : 88)
 */
export function deviceNodeSize(
  presetId: string,
  hideControls = true,
): { width: number; height: number } {
  const preset =
    DEVICE_PRESETS.find((p) => p.id === presetId) ??
    DEVICE_PRESETS.find((p) => p.id === 'iphone-16-pro') ??
    DEVICE_PRESETS[0];

  if (preset.isResponsive) {
    return { width: 420, height: 780 };
  }
  return {
    width:  preset.width  + (hideControls ? 16 : 32),
    height: preset.height + (hideControls ? 16 : 88),
  };
}

/** ELK canvas-space size of a transition/diamond condition node. */
export const TRANSITION_NODE_SIZE = { width: 180, height: 52 };

/**
 * Build unpositioned nodes + edges from a manifest, then run them through the
 * same ELK `layered` engine the builder uses — but with correct per-node
 * dimensions for `devicePreview` vs `transition` nodes.
 *
 * Direction is RIGHT (left-to-right) to match the Bookgeek reference UX.
 */
export async function routesToPreviewCanvas(
  manifest: AppRouteManifest,
  src: string,
  options: PreviewLayoutOptions = {},
): Promise<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }> {
  const {
    presetId = 'iphone-16-pro',
    loading = false,
    isEmpty = false,
    error = null,
    interactive = false,
    hideControls = true,
  } = options;

  const devSize = deviceNodeSize(presetId, hideControls);

  const routes = manifest.routes || [];
  const links  = manifest.links  || [];

  // Build unlaid-out nodes (positions will be overwritten by ELK)
  const nodes: WorkflowNode[] = routes.map((r) => ({
    id: `preview-${r.id}`,
    type: 'devicePreview',
    position: { x: 0, y: 0 }, // placeholder – ELK will override
    data: {
      type: 'devicePreview',
      src,
      route: r.path,
      label: r.label,
      presetId,
      isInitial: r.isInitial,
      interactive,
      hideControls,
      loading,
      isEmpty,
      error,
    },
  }));

  const edges: WorkflowEdge[] = links.map((link, idx) => ({
    id: `e-${link.fromRouteId}-${link.toRouteId}-${idx}`,
    source: `preview-${link.fromRouteId}`,
    target: `preview-${link.toRouteId}`,
    // preserve explicit handle IDs so action-port handles route correctly
    sourceHandle: link.sourceHandle ?? null,
    label: link.label,
    type: 'straight',
  }));

  return getLayoutedElements(nodes, edges, {
    direction: 'RIGHT',
    // generous horizontal gap so device bezels don't crowd each other
    nodeSpacingX: devSize.width * 0.4,
    // generous vertical gap so branching rows have breathing room
    nodeSpacingY: devSize.height * 0.3,
    nodeSizeResolver: (node) => {
      if (node.type === 'devicePreview') return devSize;
      if (node.type === 'transition') return TRANSITION_NODE_SIZE;
      return null; // fall back to ELK defaults (180×52)
    },
  });
}
