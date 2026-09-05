import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DevicePreviewToolbar } from "./DevicePreviewToolbar";
import type { DevicePreviewRoute } from "./interfaces";

/**
 * DevicePreviewToolbar Composite Stories
 *
 * Center header for the device-preview canvas: route selector and
 * device-preset switcher. No mode toggle — the device preview is always
 * interactive; picking "All" from the route selector (added by the
 * caller) shows every screen at once instead of one device.
 *
 * ## Usage Guidelines
 * ### Do's
 * - Place in the canvas `topCenter` panel slot
 * - Wire `onRouteChange`/`onDevicePresetChange` for interactivity
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
          "Center toolbar for the device-preview canvas: route selector and device preset switcher.",
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
    routes: ROUTES,
    activeRoute: "/login",
    devicePresetId: "iphone-16-pro",
  },
};

/**
 * Interactive story — switch routes and presets live.
 */
export const Interactive: Story = {
  render: () => {
    const [route, setRoute] = useState("/login");
    const [presetId, setPresetId] = useState("iphone-16-pro");
    return (
      <DevicePreviewToolbar
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
 * Device preset only — no route selector (e.g. a single-screen app).
 */
export const PresetOnly: Story = {
  args: {
    devicePresetId: "iphone-16-pro",
  },
};
