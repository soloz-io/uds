import type { WorkflowEdge, WorkflowNode } from "@/components/blocks/WorkflowCanvas";

export type BmcBlockId =
  | 'customer_segments'
  | 'value_propositions'
  | 'channels'
  | 'customer_relationships'
  | 'revenue_streams'
  | 'key_resources'
  | 'key_activities'
  | 'key_partnerships'
  | 'cost_structure';

export interface BmcItem {
  id: string;
  name: string;
  description?: string;
  sourceRefs: string[];
  [k: string]: unknown;
}

export interface BmcBlock {
  key: BmcBlockId;
  name: string;
  items: BmcItem[];
  empty: boolean;
  derived: boolean;
  sourceRefs: string[];
}

export interface CompiledBmc {
  canvas: {
    id: string;
    name: string;
    description: string;
    derived: boolean;
    source: { businessDocId?: string; productDocId?: string };
    generatedAt: string;
  };
  customerSegments: BmcBlock;
  valuePropositions: BmcBlock;
  channels: BmcBlock;
  customerRelationships: BmcBlock;
  revenueStreams: BmcBlock;
  keyResources: BmcBlock;
  keyActivities: BmcBlock;
  keyPartnerships: BmcBlock;
  costStructure: BmcBlock & { strategicFocus?: string; drivers: string[] };
  emptyBlocks: BmcBlockId[];
}

export interface BmcCanvasView {
  canvasName: string | null;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  emptyBlocks: BmcBlockId[];
  message?: string;
}
