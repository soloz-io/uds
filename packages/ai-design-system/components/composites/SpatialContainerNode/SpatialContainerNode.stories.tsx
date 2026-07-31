import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SpatialContainerNode } from "./SpatialContainerNode";

/**
 * SpatialContainerNode Composite Stories
 *
 * SpatialContainerNode represents a 2.5D visual container or spatial grid region
 * in node editors and workflow canvas components. It acts as a parent node for grouping
 * sub-nodes, cards, and sticky notes inside defined spatial domains.
 *
 * ## Features
 * - 2.5D Extruded 3D visual styling, flat border regions, or glassmorphism aesthetics
 * - Built-in Resizer (`NodeResizer`) for interactive sizing
 * - Themed color variants (Blue, Indigo, Emerald, Amber, Purple, Rose, Cyan, Slate)
 * - Category badges and node action toolbars
 * - Built-in connection handles for inter-container relationship routing
 */
const meta = {
  title: "Composites/SpatialContainerNode",
  component: SpatialContainerNode,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Visual container node for grouping sub-nodes in spatial layouts, Business Model Canvas grids, and architectural region diagrams.",
      },
    },
  },
} satisfies Meta<typeof SpatialContainerNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "container-1",
    selected: false,
    width: 340,
    height: 220,
    data: {
      label: "Value Propositions",
      description: "Core products, services, and bundle offerings for target customers",
      type: "spatialContainer",
      themeColor: "indigo",
      variant: "extruded3d",
      icon: "box",
      badgeText: "3 Services",
    },
  },
};

export const Extruded3D: Story = {
  args: {
    id: "container-2",
    selected: true,
    width: 340,
    height: 220,
    data: {
      label: "Key Activities",
      description: "Production, problem-solving, and platform maintenance tasks",
      type: "spatialContainer",
      themeColor: "emerald",
      variant: "extruded3d",
      icon: "activity",
      badgeText: "Active",
    },
  },
};

export const Glassmorphism: Story = {
  args: {
    id: "container-3",
    selected: false,
    width: 340,
    height: 220,
    data: {
      label: "Customer Relationships",
      description: "Automated onboarding, dedicated personal assistance, and community support",
      type: "spatialContainer",
      themeColor: "purple",
      variant: "glassmorphism",
      icon: "heart",
      badgeText: "High Touch",
    },
  },
};

export const FlatRegion: Story = {
  args: {
    id: "container-4",
    selected: false,
    width: 340,
    height: 220,
    data: {
      label: "Cost Structure",
      description: "Fixed cloud infrastructure, developer salaries, and R&D licenses",
      type: "spatialContainer",
      themeColor: "rose",
      variant: "flat",
      icon: "wallet",
      badgeText: "$120k/mo",
    },
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-4">
      <SpatialContainerNode
        id="c-blue"
        selected={false}
        width={300}
        height={180}
        data={{
          label: "Key Partners",
          type: "spatialContainer",
          themeColor: "blue",
          variant: "extruded3d",
          icon: "handshake",
          badgeText: "Suppliers",
        }}
      />
      <SpatialContainerNode
        id="c-emerald"
        selected={false}
        width={300}
        height={180}
        data={{
          label: "Key Resources",
          type: "spatialContainer",
          themeColor: "emerald",
          variant: "extruded3d",
          icon: "database",
          badgeText: "Assets",
        }}
      />
      <SpatialContainerNode
        id="c-amber"
        selected={false}
        width={300}
        height={180}
        data={{
          label: "Channels",
          type: "spatialContainer",
          themeColor: "amber",
          variant: "extruded3d",
          icon: "truck",
          badgeText: "Distribution",
        }}
      />
      <SpatialContainerNode
        id="c-purple"
        selected={false}
        width={300}
        height={180}
        data={{
          label: "Customer Segments",
          type: "spatialContainer",
          themeColor: "purple",
          variant: "extruded3d",
          icon: "users",
          badgeText: "B2B & B2C",
        }}
      />
    </div>
  ),
};
