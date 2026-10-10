import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "./ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
	title: "Composites/ConfirmDialog",
	component: ConfirmDialog,
	args: {
		open: true,
		onOpenChange: () => {},
		onConfirm: () => {},
		title: "Stop this computer?",
		description: "Its sandbox is shut down. The workspace is kept, and starting the computer again restores it.",
		confirmLabel: "Stop computer",
		destructive: true,
	},
};
export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {};
export const Busy: Story = { args: { busy: true } };
