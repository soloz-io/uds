import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";
import { iconRegistry } from "@/registry/icons";
import { Button } from "../Button";

const meta: Meta<typeof Icon> = {
  title: "Primitives/Icon",
  component: Icon,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    name: {
      control: "select",
      options: iconRegistry.getNames(),
      description: "Name of the icon from the registry",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl"],
      description: "Size variant of the icon",
    },
    "aria-label": {
      control: "text",
      description: "Accessibility label for screen readers",
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default icon display
 */
export const Default: Story = {
  args: {
    name: "check",
    size: "default",
  },
};

/**
 * Icon gallery showing all available icons
 */
export const AllIcons: Story = {
  render: () => {
    const iconNames = iconRegistry.getNames();

    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">
            All Available Icons ({iconNames.length})
          </h3>
          <div className="grid grid-cols-8 gap-4 md:grid-cols-12">
            {iconNames.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-md border border-border p-3 hover:bg-accent"
              >
                <Icon name={name} size="default" aria-label={name} />
                <span className="text-center text-muted-foreground text-xs">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Size variants comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Icon name="check" size="xs" />
          <span className="text-muted-foreground text-xs">xs (12px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon name="check" size="sm" />
          <span className="text-muted-foreground text-xs">sm (16px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon name="check" size="default" />
          <span className="text-muted-foreground text-xs">default (20px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon name="check" size="lg" />
          <span className="text-muted-foreground text-xs">lg (24px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon name="check" size="xl" />
          <span className="text-muted-foreground text-xs">xl (32px)</span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Icons with different colors (inherits from currentColor)
 */
export const WithColor: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Icon name="check-circle" size="lg" className="text-green-600" />
        <span className="text-muted-foreground text-xs">Success</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="alert-circle" size="lg" className="text-yellow-600" />
        <span className="text-muted-foreground text-xs">Warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="info" size="lg" className="text-blue-600" />
        <span className="text-muted-foreground text-xs">Info</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="x" size="lg" className="text-red-600" />
        <span className="text-muted-foreground text-xs">Error</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="settings" size="lg" className="text-purple-600" />
        <span className="text-muted-foreground text-xs">Custom</span>
      </div>
    </div>
  ),
};

/**
 * Accessible icons with aria-label
 */
export const Accessible: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-muted p-4">
        <p className="mb-4 text-sm">
          Icons with aria-label are announced by screen readers:
        </p>
        <div className="flex items-center gap-4">
          <Icon name="check" size="default" aria-label="Success" />
          <Icon name="x" size="default" aria-label="Error" />
          <Icon name="info" size="default" aria-label="Information" />
          <Icon name="warning" size="default" aria-label="Warning" />
        </div>
      </div>
      <div className="rounded-md border border-border bg-muted p-4">
        <p className="mb-4 text-sm">
          Decorative icons without aria-label are hidden from screen readers:
        </p>
        <div className="flex items-center gap-4">
          <Icon name="chevron-right" size="sm" />
          <Icon name="menu" size="sm" />
          <Icon name="more-horizontal" size="sm" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Error handling for missing icons
 */
export const NotFound: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-muted p-4">
        <p className="mb-4 text-sm">
          Missing icons are handled gracefully (returns null and logs warning in
          dev):
        </p>
        <div className="flex items-center gap-4">
          <Icon name="check" size="default" />
          <Icon name="invalid-icon-name" size="default" />
          <Icon name="x" size="default" />
        </div>
        <p className="mt-4 text-muted-foreground text-xs">
          Open browser console to see the warning for "invalid-icon-name"
        </p>
      </div>
    </div>
  ),
};

/**
 * Icons in buttons
 */
export const InButtons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button>
        <Icon name="plus" size="sm" className="mr-2" />
        Add Item
      </Button>
      <Button variant="secondary">
        <Icon name="download" size="sm" className="mr-2" />
        Download
      </Button>
      <Button variant="outline">
        <Icon name="settings" size="sm" className="mr-2" />
        Settings
      </Button>
      <Button variant="ghost">
        <Icon name="refresh-cw" size="sm" className="mr-2" />
        Refresh
      </Button>
      <Button variant="destructive">
        <Icon name="x" size="sm" className="mr-2" />
        Delete
      </Button>
      <Button size="icon" variant="outline">
        <Icon name="search" size="sm" aria-label="Search" />
      </Button>
      <Button size="icon" variant="ghost">
        <Icon name="more-vertical" size="sm" aria-label="More options" />
      </Button>
    </div>
  ),
};

/**
 * Loading spinner animation
 */
export const LoadingSpinner: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Icon
        name="loader-2"
        size="default"
        className="animate-spin"
        aria-label="Loading"
      />
      <Icon
        name="loader-2"
        size="lg"
        className="animate-spin text-primary"
        aria-label="Loading"
      />
      <Icon
        name="loader-2"
        size="xl"
        className="animate-spin text-muted-foreground"
        aria-label="Loading"
      />
    </div>
  ),
};

/**
 * Navigation icons
 */
export const Navigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 font-semibold text-sm">Chevrons</h4>
        <div className="flex items-center gap-4">
          <Icon name="chevron-up" size="default" />
          <Icon name="chevron-down" size="default" />
          <Icon name="chevron-left" size="default" />
          <Icon name="chevron-right" size="default" />
          <Icon name="chevrons-up-down" size="default" />
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-semibold text-sm">Arrows</h4>
        <div className="flex items-center gap-4">
          <Icon name="arrow-left" size="default" />
          <Icon name="arrow-right" size="default" />
        </div>
      </div>
    </div>
  ),
};
