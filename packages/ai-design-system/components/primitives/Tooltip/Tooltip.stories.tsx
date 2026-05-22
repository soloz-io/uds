import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { Button } from "../Button";

/**
 * Tooltip component displays contextual information when hovering or focusing on an element.
 *
 * ## Features
 * - Keyboard accessible (focus trigger)
 * - Customizable positioning (top, right, bottom, left)
 * - Configurable delay
 * - Arrow indicator
 * - Portal rendering
 * - WCAG 2.1 Level AA compliant
 *
 * ## Usage
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger>Hover me</TooltipTrigger>
 *   <TooltipContent>Helpful information</TooltipContent>
 * </Tooltip>
 * ```
 *
 * ## Accessibility
 * - Triggered by both hover and keyboard focus
 * - Dismissed with Escape key
 * - Screen reader compatible
 * - Proper ARIA attributes
 */
const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A popup that displays information when hovering or focusing on an element.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/**
 * Default tooltip on top
 */
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a helpful tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip positioned on different sides
 */
export const Positions: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * Tooltip with custom delay duration
 */
export const WithDelay: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">Instant</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>No delay (0ms)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button variant="outline">Delayed</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>500ms delay</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button variant="outline">Very Delayed</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>1000ms delay</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * Tooltip on icon button
 */
export const OnIconButton: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Settings</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Help</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Help & Documentation</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * Tooltip with rich content
 */
export const RichContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">View Details</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">User Information</p>
          <p className="text-xs opacity-90">John Doe</p>
          <p className="text-xs opacity-90">john.doe@example.com</p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Disabled element with tooltip
 */
export const OnDisabledElement: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block">
          <Button variant="outline" disabled className="pointer-events-none">
            Disabled Button
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>This action is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Multiple tooltips
 */
export const MultipleTooltips: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Save</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Save changes (Ctrl+S)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Copy</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy to clipboard (Ctrl+C)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Paste</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Paste from clipboard (Ctrl+V)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Undo</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Undo last action (Ctrl+Z)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * Dark mode support
 */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Dark Mode Tooltip</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip in dark mode</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * With custom side offset
 */
export const WithSideOffset: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Default Offset</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Default offset (0px)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Large Offset</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={20}>
          <p>Large offset (20px)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};
