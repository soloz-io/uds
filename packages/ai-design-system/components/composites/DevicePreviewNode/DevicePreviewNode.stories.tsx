import type { Meta, StoryObj } from "@storybook/react";
import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";
import { DevicePreviewNode } from "./DevicePreviewNode";
import { DEVICE_PRESETS, type DevicePreviewNodeData } from "./interfaces";
import "@xyflow/react/dist/style.css";

/**
 * DevicePreviewNode Composite Stories
 *
 * An `@xyflow/react` canvas node that renders a sandboxed app preview inside a
 * device bezel with a floating toolbar (device preset switcher, screenshot,
 * reload).
 *
 * ## Features
 * - Curated device presets (hardcoded — Expo exposes no device-dimension catalog)
 * - Screenshot button emits `onTakeScreenshot({ route, iframe })` for consumer capture
 * - Reload button remounts the iframe
 * - Route badge overlay (grid mode) + optional app label footer
 * - Interactive mode passes pointer events through to the iframe
 *
 * ## Usage Guidelines
 * ### Do's
 * - Pass the app URL via `data.src`
 * - Use `data.onTakeScreenshot` to hand the iframe element to capture tooling
 * - Set `interactive: true` to let users tap through the app
 * ### Don'ts
 * - Don't own screenshot/URL logic inside the node (consumer responsibility)
 * - Don't render without a ReactFlowProvider
 */
const meta = {
  title: "Composites/DevicePreviewNode",
  component: DevicePreviewNode,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div style={{ width: "560px", height: "720px", padding: "24px" }}>
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Canvas node rendering a sandboxed app preview inside a device bezel with screenshot/reload controls.",
      },
    },
  },
} satisfies Meta<typeof DevicePreviewNode>;

export default meta;
type Story = StoryObj<typeof meta>;

const BASE_DATA: DevicePreviewNodeData = {
  type: "devicePreview",
  src: "about:blank",
  presetId: "iphone-16-pro",
};

/**
 * Single route — one device showing one screen with a route badge.
 */
export const SingleRoute: Story = {
  args: {
    id: "preview-1",
    data: {
      ...BASE_DATA,
      label: "demo-app",
      route: "/login",
      showRouteBadge: true,
    },
    selected: false,
  },
};

/**
 * Interactive mode — pointer events reach the iframe so users can tap through.
 */
export const Interactive: Story = {
  args: {
    id: "preview-2",
    data: {
      ...BASE_DATA,
      label: "demo-app",
      route: "/login",
      interactive: true,
      onTakeScreenshot: (req) => {
        console.log("screenshot requested", req.route, req.iframe);
      },
    },
    selected: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`interactive: true` lets pointer events reach the embedded app so reviewers can tap through the UI.",
      },
    },
  },
};

/**
 * Different device presets showcase.
 */
export const DevicePresets: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
      {DEVICE_PRESETS.map((preset) => (
        <DevicePreviewNode
          key={preset.id}
          id={`preset-${preset.id}`}
          data={{
            ...BASE_DATA,
            presetId: preset.id,
            label: preset.label,
          }}
          selected={false}
        />
      ))}
    </div>
  ),
};

/**
 * All-routes grid mode — same app src with different `?route=` params.
 */
export const AllRoutesGrid: Story = {
  render: () => {
    const routes = ["/login", "/signup", "/dashboard", "/settings"];
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
        }}
      >
        {routes.map((route, i) => (
          <DevicePreviewNode
            key={route}
            id={`grid-${i}`}
            data={{
              ...BASE_DATA,
              label: `demo-app · ${route}`,
              route,
              showRouteBadge: true,
            }}
            selected={false}
          />
        ))}
      </div>
    );
  },
};

/**
 * Empty state — e.g. no build deployed yet.
 */
export const EmptyState: Story = {
  render: () => {
    const [data, setData] = useState<DevicePreviewNodeData>({
      ...BASE_DATA,
      label: "demo-app",
      route: "/login",
      isEmpty: true,
      onPresetChange: (presetId) =>
        setData((d) => ({ ...d, presetId })),
    });
    return (
      <DevicePreviewNode
        id="preview-empty"
        data={data}
        selected={false}
      />
    );
  },
};

/**
 * Loading state — e.g. app build in progress.
 */
export const Loading: Story = {
  args: {
    id: "preview-loading",
    data: {
      ...BASE_DATA,
      label: "demo-app",
      route: "/login",
      loading: true,
    },
    selected: false,
  },
};

/**
 * Error state — e.g. preview unavailable.
 */
export const ErrorState: Story = {
  args: {
    id: "preview-error",
    data: {
      ...BASE_DATA,
      label: "demo-app",
      route: "/login",
      error: "Metro dev server is not running.",
    },
    selected: false,
  },
};