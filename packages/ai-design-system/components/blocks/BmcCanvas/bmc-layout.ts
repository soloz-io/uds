import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas";
import type { SpatialContainerColorTheme, SpatialContainerVariant } from "@/components/composites/SpatialContainerNode";
import type { BmcBlock, BmcBlockId, BmcCanvasView, CompiledBmc } from "./interfaces";

interface BlockLayout {
  id: string;
  themeColor: SpatialContainerColorTheme;
  variant: SpatialContainerVariant;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  layout: 'column' | 'row';
}

const BLOCK_LAYOUTS: Record<BmcBlockId, BlockLayout> = {
  key_partnerships:       { id: 'cp',   themeColor: 'blue',    variant: 'extruded3d', icon: 'handshake', position: { x: 40, y: 40 },    size: { width: 280, height: 400 }, layout: 'column' },
  key_activities:         { id: 'ka',   themeColor: 'emerald', variant: 'extruded3d', icon: 'activity',  position: { x: 350, y: 40 },   size: { width: 280, height: 190 }, layout: 'column' },
  key_resources:          { id: 'kr',   themeColor: 'emerald', variant: 'extruded3d', icon: 'database',  position: { x: 350, y: 250 },  size: { width: 280, height: 190 }, layout: 'column' },
  value_propositions:     { id: 'vp',   themeColor: 'indigo',  variant: 'extruded3d', icon: 'box',       position: { x: 660, y: 40 },   size: { width: 300, height: 400 }, layout: 'column' },
  customer_relationships: { id: 'cr',   themeColor: 'purple',  variant: 'extruded3d', icon: 'heart',     position: { x: 990, y: 40 },   size: { width: 300, height: 190 }, layout: 'column' },
  channels:               { id: 'ch',   themeColor: 'amber',   variant: 'extruded3d', icon: 'truck',     position: { x: 990, y: 250 },  size: { width: 300, height: 190 }, layout: 'column' },
  customer_segments:      { id: 'cs',   themeColor: 'purple',  variant: 'extruded3d', icon: 'users',     position: { x: 1320, y: 40 },  size: { width: 280, height: 400 }, layout: 'column' },
  cost_structure:         { id: 'cost', themeColor: 'rose',    variant: 'extruded3d', icon: 'wallet',    position: { x: 40, y: 465 },   size: { width: 760, height: 180 }, layout: 'row' },
  revenue_streams:        { id: 'rev',  themeColor: 'cyan',    variant: 'extruded3d', icon: 'wallet',    position: { x: 840, y: 465 },  size: { width: 760, height: 180 }, layout: 'row' },
};

function blockEntries(bmc: CompiledBmc): Array<{ block: BmcBlock; layout: BlockLayout }> {
  return [
    { block: bmc.keyPartnerships, layout: BLOCK_LAYOUTS.key_partnerships },
    { block: bmc.keyActivities, layout: BLOCK_LAYOUTS.key_activities },
    { block: bmc.keyResources, layout: BLOCK_LAYOUTS.key_resources },
    { block: bmc.valuePropositions, layout: BLOCK_LAYOUTS.value_propositions },
    { block: bmc.customerRelationships, layout: BLOCK_LAYOUTS.customer_relationships },
    { block: bmc.channels, layout: BLOCK_LAYOUTS.channels },
    { block: bmc.customerSegments, layout: BLOCK_LAYOUTS.customer_segments },
    { block: bmc.costStructure, layout: BLOCK_LAYOUTS.cost_structure },
    { block: bmc.revenueStreams, layout: BLOCK_LAYOUTS.revenue_streams },
  ];
}

import { BMC_TOOLTIPS } from "./bmc-tooltips";

export function bmcToCanvas(bmc: CompiledBmc | null, message?: string): BmcCanvasView {
  if (!bmc) {
    return {
      canvasName: null,
      nodes: [],
      edges: [],
      emptyBlocks: [],
      message: message ?? 'No business model data available for this session',
    };
  }

  const nodes: WorkflowNode[] = [];

  for (const { block, layout } of blockEntries(bmc)) {
    const itemCount = block.items.length;
    const badgeText = block.empty || itemCount === 0 ? 'empty' : `${itemCount} item${itemCount === 1 ? '' : 's'}`;

    const items = block.items.map((item, idx) => ({
      id: `${layout.id}-${idx + 1}`,
      label: item.name,
      description: item.description,
    }));

    const blockId = layout.id === 'cp' ? 'key_partnerships'
      : layout.id === 'ka' ? 'key_activities'
      : layout.id === 'kr' ? 'key_resources'
      : layout.id === 'vp' ? 'value_propositions'
      : layout.id === 'cr' ? 'customer_relationships'
      : layout.id === 'ch' ? 'channels'
      : layout.id === 'cs' ? 'customer_segments'
      : layout.id === 'cost' ? 'cost_structure'
      : layout.id === 'rev' ? 'revenue_streams'
      : '';

    const tooltipInfo = BMC_TOOLTIPS[blockId];
    const description = tooltipInfo
      ? `${tooltipInfo.description}\n\nKey Question: "${tooltipInfo.question}"\n\nExamples: ${tooltipInfo.examples.join(', ')}`
      : block.name;

    nodes.push({
      id: layout.id,
      type: 'spatialContainer',
      position: layout.position,
      style: layout.size,
      data: {
        label: block.name,
        description,
        type: 'spatialContainer',
        themeColor: layout.themeColor,
        variant: layout.variant,
        icon: layout.icon,
        badgeText,
        items,
      },
    });
  }

  const edges: WorkflowEdge[] = [
    { id: 'e-ka-vp', source: 'ka', target: 'vp', type: 'animated' },
    { id: 'e-vp-cr', source: 'vp', target: 'cr', type: 'animated' },
    { id: 'e-cr-cs', source: 'cr', target: 'cs', type: 'animated' },
    { id: 'e-vp-ch', source: 'vp', target: 'ch', type: 'straight' },
    { id: 'e-ch-cs', source: 'ch', target: 'cs', type: 'animated' },
  ];

  return {
    canvasName: bmc.canvas.name,
    nodes,
    edges,
    emptyBlocks: bmc.emptyBlocks,
    message,
  };
}
