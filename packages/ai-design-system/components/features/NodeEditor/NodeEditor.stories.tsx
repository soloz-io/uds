import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/primitives/Button";
import { DevicePreviewToolbar, type DevicePreviewViewMode } from "@/components/composites/DevicePreviewToolbar";
import type { DeviceScreenshotRequest } from "@/components/composites/DevicePreviewNode";
import { NodeEditor } from "./NodeEditor";
import { useNodeEditorMock } from "./useNodeEditor.mock";
import { mockVersions, mockNodes, mockEdges, mockSpatialNodes, mockSpatialEdges } from "./NodeEditor.mocks";
import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas";
import type { ToolbarAction } from "@/components/composites/WorkflowToolbar";

/**
 * NodeEditor Feature
 *
 * Complete workflow editing experience combining a floating toolbar
 * with a ReactFlow canvas for building state machine workflows.
 *
 * ## Features
 * - Workflow name display with version selector
 * - Undo / Redo / Save / Cancel action buttons
 * - ReactFlow canvas with state and transition nodes
 * - Interactive edge creation and node dragging
 * - Minimap support
 *
 * ## Usage
 * Pass individual props directly or wire up via `useNodeEditor` hook
 * in the consuming application.
 *
 * ## Accessibility
 * - All toolbar buttons have `title` attributes for tooltips
 * - Keyboard navigation supported
 */
const meta = {
  title: "Features/NodeEditor",
  component: NodeEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof NodeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ─── Shared preview URL ─── */
const DEVICE_PREVIEW_SRC = "http://localhost:8081";

import bookgeekWorkflow from "./bookgeek.preview.json";

function NodeEditorWithDevicePreviewStory() {
  const [viewMode, setViewMode] = React.useState<DevicePreviewViewMode>("grid");
  const [activeRoute, setActiveRoute] = React.useState<string | undefined>(undefined);
  const [presetId, setPresetId] = React.useState("iphone-16-pro");
  const [nodeState, setNodeState] = React.useState<"ready" | "loading" | "empty" | "error">("ready");
  const [layoutNodes, setLayoutNodes] = React.useState<WorkflowNode[]>([]);
  const [layoutEdges, setLayoutEdges] = React.useState<WorkflowEdge[]>([]);

  const states = {
    loading: nodeState === "loading",
    isEmpty: nodeState === "empty",
    error: nodeState === "error" ? "The Metro dev server is unreachable." : undefined,
  };

  const previewRoutes = React.useMemo(() => {
    return (bookgeekWorkflow.nodes as WorkflowNode[])
      .filter((n) => n.type === "devicePreview")
      .map((n) => ({
        id: n.id.replace(/^preview-/, ""),
        label: (n.data?.label as string) || n.id,
        path: (n.data?.route as string) || `/${n.id}`,
        isInitial: !!n.data?.isInitial,
      }));
  }, []);

  // Run ELK layout whenever view mode or preset changes — loading directly from compiled bookgeek.preview.json
  React.useEffect(() => {
    if (viewMode !== "grid" && viewMode !== "play") {
      // Single / interactive: one node, no layout needed
      const resolved = activeRoute ?? previewRoutes.find((r) => r.isInitial)?.id ?? previewRoutes[0]?.id;
      const route = previewRoutes.find((r) => r.id === resolved);
      setLayoutNodes([{
        id: "preview-active",
        type: "devicePreview",
        position: { x: 0, y: 80 },
        data: {
          type: "devicePreview",
          src: DEVICE_PREVIEW_SRC,
          route: route?.path,
          label: route?.label ?? "App Preview",
          presetId,
          interactive: viewMode === "interactive",
          ...states,
        },
      }]);
      setLayoutEdges([]);
      return;
    }

    // Grid / play: full Bookgeek flow loaded from compiled bookgeek.preview.json
    import("@/components/blocks/PreviewCanvas/preview-layout").then(({ deviceNodeSize }) => {
      import("@/components/blocks/WorkflowCanvas/layout-engine").then(({ getLayoutedElements }) => {
        const devSize = deviceNodeSize(presetId, true);

        // Inject runtime states + preview src into JSON nodes
        const rawNodes = (bookgeekWorkflow.nodes as WorkflowNode[]).map((n) => {
          if (n.type === "devicePreview") {
            return {
              ...n,
              data: {
                ...n.data,
                src: DEVICE_PREVIEW_SRC,
                presetId,
                hideControls: true,
                ...states,
              },
            };
          }
          return n;
        });

        const rawEdges = bookgeekWorkflow.edges as WorkflowEdge[];

        return getLayoutedElements(rawNodes, rawEdges, {
          direction: "RIGHT",
          nodeSpacingX: devSize.width * 0.4,
          nodeSpacingY: devSize.height * 0.3,
          nodeSizeResolver: (node) => {
            if (node.type === "devicePreview") return devSize;
            if (node.type === "transition")    return { width: 180, height: 52 };
            return null;
          },
        });
      }).then(({ nodes, edges }) => {
        setLayoutNodes(nodes);
        setLayoutEdges(edges);
      });
    }).catch((err) => {
      console.error("[BookgeekStory] ELK layout failed, falling back to simple row:", err);
      const fallback = previewRoutes.map((r, i) => ({
        id: `preview-${r.id}`,
        type: "devicePreview" as const,
        position: { x: i * 560, y: 200 },
        data: { type: "devicePreview" as const, src: DEVICE_PREVIEW_SRC, route: r.path, label: r.label, presetId, hideControls: true, ...states },
      }));
      setLayoutNodes(fallback);
      setLayoutEdges([]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, presetId, nodeState, previewRoutes]);

  const handleTakeScreenshot = (request: DeviceScreenshotRequest) => {
    console.log("screenshot requested for", request.route);
  };

  const previewNodes = layoutNodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      onPresetChange: setPresetId,
      onTakeScreenshot: handleTakeScreenshot,
      onReload: () => console.log("preview reload requested"),
      registerIframe: (el: HTMLIFrameElement | null) => console.log("iframe registered", !!el),
    },
  })) as WorkflowNode[];

  const nodeStates = ["ready", "loading", "empty", "error"] as const;
  const viewModes: DevicePreviewViewMode[] = ["play", "single", "interactive", "grid"];

  return (
    <div className="h-screen w-full">
      <div className="flex flex-wrap items-center gap-2 border-b bg-background px-3 py-2 text-xs">
        <span className="font-medium text-muted-foreground">Node state</span>
        {nodeStates.map((state) => (
          <Button
            key={state}
            size="sm"
            variant={nodeState === state ? "default" : "secondary"}
            onClick={() => setNodeState(state)}
          >
            {state}
          </Button>
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        <span className="font-medium text-muted-foreground">View mode</span>
        {viewModes.map((mode) => (
          <Button
            key={mode}
            size="sm"
            variant={viewMode === mode ? "default" : "secondary"}
            onClick={() => setViewMode(mode)}
          >
            {mode}
          </Button>
        ))}
      </div>
      <div className="h-[calc(100%-41px)]">
        <NodeEditor
          className="h-full"
          hideWorkflowName
          hideDefaultActions
          interactive={false}
          nodes={previewNodes}
          edges={layoutEdges}
          topCenter={
            <DevicePreviewToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              routes={previewRoutes.map((r) => ({ id: r.id, label: r.label }))}
              activeRoute={activeRoute}
              onRouteChange={setActiveRoute}
              devicePresetId={presetId}
              onDevicePresetChange={setPresetId}
            />
          }
        />
      </div>
    </div>
  );
}

/* ─── Multi-route hub story helpers (one screen branching to several) ─────── */

const HUB_ROUTES = [
  { id: "hub", path: "/", label: "Dashboard", isInitial: true },
  { id: "orders", path: "/orders", label: "Orders" },
  { id: "profile", path: "/profile", label: "Profile" },
  { id: "settings", path: "/settings", label: "Settings" },
];

const HUB_LINKS = HUB_ROUTES.filter((r) => r.id !== "hub").map((r) => ({
  fromRouteId: "hub",
  toRouteId: r.id,
}));

function buildHubPreviewNodes(
  src: string,
  presetId: string,
  states: { loading: boolean; isEmpty: boolean; error?: string },
): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
  const nodes: WorkflowNode[] = HUB_ROUTES.map((r, i) => ({
    id: `preview-${r.id}`,
    type: "devicePreview",
    position: { x: i === 0 ? 0 : 560 + (i - 1) * 560, y: 200 },
    data: {
      type: "devicePreview",
      src,
      route: r.path,
      label: r.label,
      presetId,
      showRouteBadge: true,
      ...states,
    },
  }));
  const edges: WorkflowEdge[] = HUB_LINKS.map((l) => ({
    id: `e-${l.fromRouteId}-${l.toRouteId}`,
    source: `preview-${l.fromRouteId}`,
    target: `preview-${l.toRouteId}`,
    type: "straight",
  }));
  return { nodes, edges };
}

function NodeEditorWithMultiRouteNavigationStory() {
  const [presetId, setPresetId] = React.useState("iphone-16-pro");
  const [nodeState, setNodeState] = React.useState<"ready" | "loading" | "empty" | "error">("ready");

  const { nodes, edges } = buildHubPreviewNodes(DEVICE_PREVIEW_SRC, presetId, {
    loading: nodeState === "loading",
    isEmpty: nodeState === "empty",
    error: nodeState === "error" ? "The Metro dev server is unreachable." : undefined,
  });

  const handleTakeScreenshot = (request: DeviceScreenshotRequest) => {
    console.log("screenshot requested for", request.route);
  };

  const previewNodes = nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      onPresetChange: setPresetId,
      onTakeScreenshot: handleTakeScreenshot,
      onReload: () => console.log("preview reload requested"),
      registerIframe: (el: HTMLIFrameElement | null) => console.log("iframe registered", !!el),
    },
  })) as WorkflowNode[];

  const nodeStates = ["ready", "loading", "empty", "error"] as const;

  return (
    <div className="h-screen w-full">
      <div className="flex flex-wrap items-center gap-2 border-b bg-background px-3 py-2 text-xs">
        <span className="font-medium text-muted-foreground">Node state</span>
        {nodeStates.map((state) => (
          <Button
            key={state}
            size="sm"
            variant={nodeState === state ? "default" : "secondary"}
            onClick={() => setNodeState(state)}
          >
            {state}
          </Button>
        ))}
      </div>
      <div className="h-[calc(100%-41px)]">
        <NodeEditor
          className="h-full"
          hideWorkflowName
          hideDefaultActions
          interactive={false}
          nodes={previewNodes}
          edges={edges}
        />
      </div>
    </div>
  );
}

/* ─── All-routes-as-tabs story helpers (tab bar where every route is a peer) ─── */

const TAB_ROUTES = [
  { id: "home", path: "/home", label: "Home", isInitial: true },
  { id: "orders", path: "/orders", label: "Orders" },
  { id: "profile", path: "/profile", label: "Profile" },
  { id: "settings", path: "/settings", label: "Settings" },
  { id: "notifications", path: "/notifications", label: "Notifications" },
];

const TAB_LINKS = TAB_ROUTES.flatMap((from) =>
  TAB_ROUTES.filter((to) => to.id !== from.id).map((to) => ({
    fromRouteId: from.id,
    toRouteId: to.id,
  })),
);

function buildTabPreviewNodes(
  src: string,
  presetId: string,
  states: { loading: boolean; isEmpty: boolean; error?: string },
): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
  const nodes: WorkflowNode[] = TAB_ROUTES.map((r, i) => ({
    id: `preview-${r.id}`,
    type: "devicePreview",
    position: { x: i * 560, y: 200 },
    data: {
      type: "devicePreview",
      src,
      route: r.path,
      label: r.label,
      presetId,
      showRouteBadge: true,
      ...states,
    },
  }));
  const edges: WorkflowEdge[] = TAB_LINKS.map((l) => ({
    id: `e-${l.fromRouteId}-${l.toRouteId}`,
    source: `preview-${l.fromRouteId}`,
    target: `preview-${l.toRouteId}`,
    type: "straight",
  }));
  return { nodes, edges };
}

function NodeEditorWithAllRoutesAsTabsStory() {
  const [presetId, setPresetId] = React.useState("iphone-16-pro");
  const [nodeState, setNodeState] = React.useState<"ready" | "loading" | "empty" | "error">("ready");

  const { nodes, edges } = buildTabPreviewNodes(DEVICE_PREVIEW_SRC, presetId, {
    loading: nodeState === "loading",
    isEmpty: nodeState === "empty",
    error: nodeState === "error" ? "The Metro dev server is unreachable." : undefined,
  });

  const handleTakeScreenshot = (request: DeviceScreenshotRequest) => {
    console.log("screenshot requested for", request.route);
  };

  const previewNodes = nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      onPresetChange: setPresetId,
      onTakeScreenshot: handleTakeScreenshot,
      onReload: () => console.log("preview reload requested"),
      registerIframe: (el: HTMLIFrameElement | null) => console.log("iframe registered", !!el),
    },
  })) as WorkflowNode[];

  const nodeStates = ["ready", "loading", "empty", "error"] as const;

  return (
    <div className="h-screen w-full">
      <div className="flex flex-wrap items-center gap-2 border-b bg-background px-3 py-2 text-xs">
        <span className="font-medium text-muted-foreground">Node state</span>
        {nodeStates.map((state) => (
          <Button
            key={state}
            size="sm"
            variant={nodeState === state ? "default" : "secondary"}
            onClick={() => setNodeState(state)}
          >
            {state}
          </Button>
        ))}
      </div>
      <div className="h-[calc(100%-41px)]">
        <NodeEditor
          className="h-full"
          hideWorkflowName
          hideDefaultActions
          interactive={false}
          nodes={previewNodes}
          edges={edges}
        />
      </div>
    </div>
  );
}

function NodeEditorStateManagementStory() {
  const hook = useNodeEditorMock("wf-1");

  return (
    <NodeEditor
      workflowName={hook.workflowName}
      versions={hook.versions}
      currentVersionId={hook.currentVersionId}
      onVersionSelect={hook.onVersionSelect}
      nodes={hook.nodes}
      edges={hook.edges}
      onNodesChange={hook.onNodesChange}
      onEdgesChange={hook.onEdgesChange}
      onConnect={hook.onConnect}
      isSaving={hook.isSaving}
      hasUnsavedChanges={hook.hasUnsavedChanges}
      canUndo={hook.canUndo}
      canRedo={hook.canRedo}
      onSave={hook.onSave}
      onCancel={hook.onCancel}
      onUndo={hook.onUndo}
      onRedo={hook.onRedo}
      interactive={true}
    />
  );
}

function NodeEditorWithMinimapStory() {
  const hook = useNodeEditorMock("wf-1");

  return (
    <NodeEditor
      workflowName={hook.workflowName}
      versions={hook.versions}
      currentVersionId={hook.currentVersionId}
      onVersionSelect={hook.onVersionSelect}
      nodes={hook.nodes}
      edges={hook.edges}
      showMinimap={true}
    />
  );
}

/**
 * Default — read-only canvas with mock data
 */
export const Default: Story = {
  args: {
    workflowName: "Order Processing Workflow",
    versions: mockVersions,
    currentVersionId: "v4",
    nodes: mockNodes,
    edges: mockEdges,
    canUndo: false,
    canRedo: false,
    isSaving: false,
    hasUnsavedChanges: false,
  },
};

/**
 * WithStateManagement — full interactive mock hook wired up
 */
export const WithStateManagement: Story = {
  render: () => <NodeEditorStateManagementStory />,
};

/**
 * Empty — no nodes
 */
export const Empty: Story = {
  args: {
    workflowName: "New Workflow",
    versions: [{ id: "v1", label: "v1" }],
    currentVersionId: "v1",
    nodes: [],
    edges: [],
  },
};

/**
 * WithMinimap — canvas with minimap enabled
 */
export const WithMinimap: Story = {
  render: () => <NodeEditorWithMinimapStory />,
};

/**
 * Saving — save in progress state
 */
export const Saving: Story = {
  args: {
    workflowName: "Order Processing Workflow",
    versions: mockVersions,
    currentVersionId: "v4",
    nodes: mockNodes,
    edges: [],
    isSaving: true,
    hasUnsavedChanges: true,
    canUndo: true,
    canRedo: false,
  },
};

/**
 * WithHITLApproval — single HITL transition node with a floating DefaultSwitcher
 * containing workflow-defined approval options beside the node.
 */
function NodeEditorWithHITLApprovalStory() {
  const [selectedValue, setSelectedValue] = React.useState("");

  const hitlNode: WorkflowNode = {
    id: "hitl-1",
    type: "transition",
    position: { x: 300, y: 100 },
    data: {
      label: "Human Approval",
      description: "Manager review required",
      type: "transition",
      status: "idle",
    },
  };

  const nodeActions: Record<string, ToolbarAction[]> = {
    "hitl-1": [
      {
        id: "switcher-hitl-1",
        icon: "chevrons-up-down",
        title: "Select approval decision",
        switcher: {
          items: [
            { label: "Approve", value: "approve" },
            { label: "Reject", value: "reject" },
          ],
          value: selectedValue,
          onValueChange: setSelectedValue,
          placeholder: "Do you approve this evaluation?",
        },
      },
    ],
  };

  return (
    <NodeEditor
      workflowName="HITL Approval"
      versions={[{ id: "v1", label: "v1" }]}
      currentVersionId="v1"
      nodes={[hitlNode]}
      edges={[]}
      nodeActions={nodeActions}
      interactive={false}
      hideDefaultActions={true}
      showMinimap={false}
    />
  );
}

export const WithHITLApproval: Story = {
  render: () => <NodeEditorWithHITLApprovalStory />,
};

/**
 * SpatialGridLayout — 2.5D visual container grid layout (Business Model Canvas / Spatial Architecture)
 *
 * Showcases NodeEditor with Spatial Container parent nodes (`spatialContainer`), 2.5D extrusion styling,
 * nested child nodes (`parentId`), and spatial ribbon connections.
 */
export const SpatialGridLayout: Story = {
  args: {
    hideWorkflowName: true,
    versions: mockVersions,
    currentVersionId: "v4",
    nodes: mockSpatialNodes,
    edges: mockSpatialEdges,
    interactive: true,
    showMinimap: true,
    canUndo: true,
    canRedo: true,
  },
};

/**
 * WithDevicePreviewNode — a `devicePreview` WorkflowNode rendered by NodeEditor
 * purely through the node-type registry (no editor preview logic). The toolbar
 * and preview state are injected by the consumer via the generic `topCenter`
 * slot. View modes: play / single / interactive (tap-through) / grid (one
 * device per route, edges from nav links). Node-state buttons drive the
 * loading / empty / error overlays on the device frames.
 */
export const WithDevicePreviewNode: Story = {
  render: () => <NodeEditorWithDevicePreviewStory />,
};

/**
 * WithAllRoutesAsTabs — every route is a default tab (peer), like a tab-bar
 * navigator. All five screens sit in a row and each tab connects to every
 * other tab, so the editor shows the full tab connectivity graph.
 */
export const WithAllRoutesAsTabs: Story = {
  render: () => <NodeEditorWithAllRoutesAsTabsStory />,
};

/**
 * WithMultiRouteNavigation — one "hub" screen (Dashboard) with several
 * navigation buttons. Each destination (Orders, Profile, Settings) is its own
 * `devicePreview` frame with a straight edge from the hub's source handle,
 * showing two+ navigation routes emanating from a single screen.
 */
export const WithMultiRouteNavigation: Story = {
  render: () => <NodeEditorWithMultiRouteNavigationStory />,
};

