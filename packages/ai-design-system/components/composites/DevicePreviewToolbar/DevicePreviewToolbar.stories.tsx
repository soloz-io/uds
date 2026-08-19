import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DevicePreviewToolbar } from "./DevicePreviewToolbar";
import type { DevicePreviewRoute, DevicePreviewViewMode } from "./interfaces";

/**
 * DevicePreviewToolbar Composite Stories
 *
 * Center header for the device-preview canvas: view-mode group (Play, Single
 * Route, Interactive, All Routes), route selector and device-preset switcher.
 *
 * ## Usage Guidelines
 * ### Do's
 * - Place in the canvas `topCenter` panel slot
 * - Wire `onViewModeChange`/`onRouteChange`/`onDevicePresetChange` for interactivity
 * ### Don'ts
 * - Don't render it above the canvas outside a ReactFlow panel (use `topCenter`)
 */
const meta = {
  title: "Composites/DevicePreviewToolbar",
  component: DevicePreviewToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Center toolbar for the device-preview canvas: view modes, route selector and device preset switcher.",
      },
    },
  },
} satisfies Meta<typeof DevicePreviewToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROUTES: DevicePreviewRoute[] = [
  { id: "/login", label: "Login" },
  { id: "/signup", label: "Signup" },
  { id: "/dashboard", label: "Dashboard" },
];

export const Default: Story = {
  args: {
    viewMode: "single",
    routes: ROUTES,
    activeRoute: "/login",
    devicePresetId: "iphone-16-pro",
  },
};

/**
 * Interactive story — switch modes, routes and presets live.
 */
export const Interactive: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState<DevicePreviewViewMode>("single");
    const [route, setRoute] = useState("/login");
    const [presetId, setPresetId] = useState("iphone-16-pro");
    return (
      <DevicePreviewToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        routes={ROUTES}
        activeRoute={route}
        onRouteChange={setRoute}
        devicePresetId={presetId}
        onDevicePresetChange={setPresetId}
      />
    );
  },
};

/**
 * Modes only — no route/preset selectors (e.g. Play mode entry point).
 */
export const ModesOnly: Story = {
  args: {
    viewMode: "play",
  },
};