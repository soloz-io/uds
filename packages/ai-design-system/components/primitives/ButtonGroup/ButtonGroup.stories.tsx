import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/primitives/Button";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "Primitives/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <ButtonGroup orientation="horizontal">
      <Button variant="secondary">Button 1</Button>
      <Button variant="secondary">Button 2</Button>
      <Button variant="secondary">Button 3</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="secondary">Button 1</Button>
      <Button variant="secondary">Button 2</Button>
      <Button variant="secondary">Button 3</Button>
    </ButtonGroup>
  ),
};
