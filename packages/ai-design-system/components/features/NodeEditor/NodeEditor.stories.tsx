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

/** Canonical app flow graph — topology only, no positions (ELK assigns those). */
const BOOKGEEK_MANIFEST = {
  appId: 'bookgeek',
  routes: [
    { id: 'welcome',          path: '/welcome',          label: 'Welcome',              isInitial: true },
    { id: 'signin',           path: '/signin',           label: 'Sign In' },
    { id: 'signup',           path: '/signup',           label: 'Sign Up' },
    { id: 'google-signup',    path: '/google-signup',    label: 'Sign Up with Google' },
    { id: 'categories',       path: '/categories',       label: 'Select genres' },
    { id: 'authors',          path: '/authors',          label: 'Authors' },
    { id: 'subscribe',        path: '/subscribe',        label: 'Subscribe' },
    { id: 'discount',         path: '/discount',         label: 'My Discount' },
    { id: 'checkout',         path: '/checkout',         label: 'Checkout' },
    { id: 'checkout-voucher', path: '/checkout-voucher', label: 'Checkout with Voucher' },
    { id: 'otp',              path: '/otp',              label: 'OTP Verification' },
    { id: 'payment-success',  path: '/payment-success',  label: 'Payment Success' },
    { id: 'payment-declined', path: '/payment-declined', label: 'Payment Declined' },
  ],
  links: [
    // Welcome → Sign In (yes) / Sign Up (no)
    { fromRouteId: 'welcome',          toRouteId: 'signin',           sourceHandle: 'btn-get-started', label: 'Yes' },
    { fromRouteId: 'welcome',          toRouteId: 'signup',           sourceHandle: 'btn-get-started', label: 'No' },
    // Sign In → content
    { fromRouteId: 'signin',           toRouteId: 'subscribe',        sourceHandle: 'btn-signin-submit', label: 'To content' },
    // Sign Up → onboarding / Google
    { fromRouteId: 'signup',           toRouteId: 'categories',       sourceHandle: 'btn-signup-submit', label: 'To onboarding' },
    { fromRouteId: 'signup',           toRouteId: 'google-signup',    sourceHandle: 'btn-signup-google', label: 'Google sign up' },
    // Google Sign Up → content
    { fromRouteId: 'google-signup',    toRouteId: 'subscribe',        sourceHandle: 'btn-google-continue', label: 'To content' },
    // Onboarding chain
    { fromRouteId: 'categories',       toRouteId: 'authors',          sourceHandle: 'btn-cat-next',    label: 'Next step' },
    { fromRouteId: 'authors',          toRouteId: 'subscribe',        sourceHandle: 'btn-authors-done', label: 'To content' },
    // Subscribe → voucher / direct checkout
    { fromRouteId: 'subscribe',        toRouteId: 'discount',         sourceHandle: 'btn-add-voucher',  label: 'Add voucher' },
    { fromRouteId: 'subscribe',        toRouteId: 'checkout',         sourceHandle: 'btn-activate-now', label: 'Checkout without voucher' },
    // Discount → checkout with voucher
    { fromRouteId: 'discount',         toRouteId: 'checkout-voucher', sourceHandle: 'btn-apply-voucher', label: 'Checkout with voucher' },
    // Both checkouts → OTP
    { fromRouteId: 'checkout',         toRouteId: 'otp',              sourceHandle: 'btn-pay-otp',      label: 'To OTP' },
    { fromRouteId: 'checkout-voucher', toRouteId: 'otp',              sourceHandle: 'btn-pay-voucher-otp', label: 'To OTP' },
    // OTP → success / declined
    { fromRouteId: 'otp', toRouteId: 'payment-success',  sourceHandle: 'btn-verify-otp', label: 'Yes' },
    { fromRouteId: 'otp', toRouteId: 'payment-declined', sourceHandle: 'btn-verify-otp', label: 'No' },
  ],
};

/** Per-route action ports used in grid/play view for DOM-reflection handles. */
const BOOKGEEK_ACTION_PORTS: Record<string, Array<{ id: string; label?: string; top: number }>> = {
  welcome:          [{ id: 'btn-get-started',     label: 'Get Started',         top: 430 }],
  signin:           [{ id: 'btn-signin-submit',   label: 'Sign In',             top: 160 }],
  signup:           [
    { id: 'btn-signup-submit', label: 'Sign Up',              top: 560 },
    { id: 'btn-signup-google', label: 'Sign Up with Google',  top: 590 },
  ],
  'google-signup':  [{ id: 'btn-google-continue', label: 'Sign In',             top: 935 }],
  categories:       [{ id: 'btn-cat-next',         label: 'Next',                top: 640 }],
  authors:          [{ id: 'btn-authors-done',     label: 'Done',                top: 640 }],
  subscribe:        [
    { id: 'btn-add-voucher',   label: 'Add Voucher',          top: 595 },
    { id: 'btn-activate-now',  label: 'Activate Now',         top: 680 },
  ],
  discount:         [{ id: 'btn-apply-voucher',    label: 'Apply',               top: 370 }],
  checkout:         [{ id: 'btn-pay-otp',          label: 'Pay',                 top: 440 }],
  'checkout-voucher': [{ id: 'btn-pay-voucher-otp', label: 'Pay',               top: 660 }],
  otp:              [{ id: 'btn-verify-otp',       label: 'Verify and Proceed',  top: 675 }],
};

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

  // Run ELK layout whenever view mode or preset changes — same pattern as useNodeEditor.ts
  React.useEffect(() => {
    if (viewMode !== "grid" && viewMode !== "play") {
      // Single / interactive: one node, no layout needed
      const resolved = activeRoute ?? BOOKGEEK_MANIFEST.routes.find((r) => r.isInitial)?.id ?? BOOKGEEK_MANIFEST.routes[0]?.id;
      const route = BOOKGEEK_MANIFEST.routes.find((r) => r.id === resolved);
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

    // Grid / play: full Bookgeek flow — devicePreview nodes + condition transition nodes + all edges.
    // We call getLayoutedElements directly so ELK receives ALL node types and can lay them out together.
    import("@/components/blocks/PreviewCanvas/preview-layout").then(({ deviceNodeSize }) => {
      import("@/components/blocks/WorkflowCanvas/layout-engine").then(({ getLayoutedElements }) => {
        const devSize = deviceNodeSize(presetId, true);

        // ── All nodes: 13 screens + 2 condition diamonds ──────────────────────────
        const allNodes: WorkflowNode[] = [
          // Device screen nodes
          ...BOOKGEEK_MANIFEST.routes.map((r) => ({
            id: `preview-${r.id}`,
            type: "devicePreview" as const,
            position: { x: 0, y: 0 },
            data: {
              type: "devicePreview" as const,
              src: DEVICE_PREVIEW_SRC,
              route: r.path,
              label: r.label,
              presetId,
              isInitial: r.isInitial,
              hideControls: true,
              actionPorts: BOOKGEEK_ACTION_PORTS[r.id] ?? [],
              ...states,
            },
          })),
          // Condition: Existing user? (between Welcome and Sign In / Sign Up)
          {
            id: "cond-existing-user",
            type: "transition" as const,
            position: { x: 0, y: 0 },
            data: {
              type: "transition" as const,
              label: "Existing user?",
              transitionType: "conditional" as const,
              description: "Branch to Sign In or Sign Up",
            },
          },
          // Condition: OTP Verified? (after OTP screen)
          {
            id: "cond-otp-verified",
            type: "transition" as const,
            position: { x: 0, y: 0 },
            data: {
              type: "transition" as const,
              label: "OTP Verified?",
              transitionType: "conditional" as const,
              description: "Verify SMS code",
            },
          },
        ];

        // ── Edges: screen → condition → screen connections ────────────────────────
        const allEdges: WorkflowEdge[] = [
          // Welcome → Existing user? condition
          { id: "e-welcome-cond", source: "preview-welcome", target: "cond-existing-user", sourceHandle: "btn-get-started", type: "straight" },
          // Condition → Sign In / Sign Up branches
          { id: "e-cond-signin",  source: "cond-existing-user", target: "preview-signin",  label: "Yes", type: "straight" },
          { id: "e-cond-signup",  source: "cond-existing-user", target: "preview-signup",  label: "No",  type: "straight" },
          // Sign In → content
          { id: "e-signin-subscribe", source: "preview-signin", target: "preview-subscribe", sourceHandle: "btn-signin-submit", label: "To content", type: "straight" },
          // Sign Up → onboarding / Google
          { id: "e-signup-cat",    source: "preview-signup", target: "preview-categories",  sourceHandle: "btn-signup-submit",  label: "To onboarding", type: "straight" },
          { id: "e-signup-google", source: "preview-signup", target: "preview-google-signup", sourceHandle: "btn-signup-google", label: "Google sign up", type: "straight" },
          // Google Sign Up → content
          { id: "e-google-subscribe", source: "preview-google-signup", target: "preview-subscribe", sourceHandle: "btn-google-continue", label: "To content", type: "straight" },
          // Onboarding chain
          { id: "e-cat-authors",      source: "preview-categories", target: "preview-authors",   sourceHandle: "btn-cat-next",    label: "Next step",  type: "straight" },
          { id: "e-authors-subscribe", source: "preview-authors",   target: "preview-subscribe", sourceHandle: "btn-authors-done", label: "To content", type: "straight" },
          // Subscribe → voucher / direct checkout
          { id: "e-subscribe-discount",  source: "preview-subscribe", target: "preview-discount",         sourceHandle: "btn-add-voucher",  label: "Add voucher",              type: "straight" },
          { id: "e-subscribe-checkout",  source: "preview-subscribe", target: "preview-checkout",          sourceHandle: "btn-activate-now", label: "Checkout without voucher", type: "straight" },
          // Discount → checkout with voucher
          { id: "e-discount-checkout-v", source: "preview-discount", target: "preview-checkout-voucher", sourceHandle: "btn-apply-voucher", label: "Checkout with voucher", type: "straight" },
          // Both checkouts → OTP
          { id: "e-checkout-otp",   source: "preview-checkout",         target: "preview-otp", sourceHandle: "btn-pay-otp",         label: "To OTP", type: "straight" },
          { id: "e-checkout-v-otp", source: "preview-checkout-voucher", target: "preview-otp", sourceHandle: "btn-pay-voucher-otp", label: "To OTP", type: "straight" },
          // OTP → OTP Verified? condition
          { id: "e-otp-cond", source: "preview-otp", target: "cond-otp-verified", sourceHandle: "btn-verify-otp", type: "straight" },
          // Condition → Payment results
          { id: "e-cond-success",  source: "cond-otp-verified", target: "preview-payment-success",  label: "Yes", type: "straight" },
          { id: "e-cond-declined", source: "cond-otp-verified", target: "preview-payment-declined", label: "No",  type: "straight" },
        ];

        return getLayoutedElements(allNodes, allEdges, {
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
      const fallback = BOOKGEEK_MANIFEST.routes.map((r, i) => ({
        id: `preview-${r.id}`,
        type: "devicePreview" as const,
        position: { x: i * 560, y: 200 },
        data: { type: "devicePreview" as const, src: DEVICE_PREVIEW_SRC, route: r.path, label: r.label, presetId, hideControls: true, ...states },
      }));
      setLayoutNodes(fallback);
      setLayoutEdges([]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, presetId, nodeState]);

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
              routes={BOOKGEEK_MANIFEST.routes.map((r) => ({ id: r.id, label: r.label }))}
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

