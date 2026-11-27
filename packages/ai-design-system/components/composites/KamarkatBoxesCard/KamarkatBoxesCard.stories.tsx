import type { Meta, StoryObj } from "@storybook/react";
import { KamarkatBoxesCard } from "./KamarkatBoxesCard";

const meta: Meta<typeof KamarkatBoxesCard> = {
  title: "Composites/KamarkatBoxesCard",
  component: KamarkatBoxesCard,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof KamarkatBoxesCard>;

export const Empty: Story = {
  args: {
    boxes: [],
    onDetectBoxes: () => console.log("detect"),
  },
};

export const WithBoxes: Story = {
  args: {
    boxes: [
      {
        id: "box_1",
        boxId: "acme-dev-box",
        hubDomain: "dev.acme.corp",
        managementCluster: "cluster-us-east-1",
        connection: "connected",
      },
      {
        id: "box_2",
        boxId: "acme-prod-box",
        hubDomain: "prod.acme.corp",
        managementCluster: "cluster-us-west-2",
        connection: "none",
      },
    ],
    onDetectBoxes: () => console.log("detect"),
    onConnectBox: (id) => console.log("connect", id),
  },
};
