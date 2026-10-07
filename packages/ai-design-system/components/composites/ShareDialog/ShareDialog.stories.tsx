import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Toaster } from "@/components/primitives/Toaster";
import type { ShareItem } from "./ShareDialog";
import { ShareDialog } from "./ShareDialog";

const sampleShares: ShareItem[] = [
	{
		id: "share-active-1",
		createdAt: "2026-10-01T10:00:00Z",
		expiresAt: "2026-10-31T10:00:00Z",
		revokedAt: null,
	},
	{
		id: "share-expired-1",
		createdAt: "2026-08-01T10:00:00Z",
		expiresAt: "2026-08-31T10:00:00Z",
		revokedAt: null,
	},
	{
		id: "share-revoked-1",
		createdAt: "2026-09-01T10:00:00Z",
		expiresAt: "2026-10-01T10:00:00Z",
		revokedAt: "2026-09-15T12:00:00Z",
	},
	{
		id: "share-never-expire",
		createdAt: "2026-09-10T10:00:00Z",
		expiresAt: null,
		revokedAt: null,
	},
];

const meta = {
	title: "Composites/ShareDialog",
	component: ShareDialog,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		open: true,
		onCreate: fn(async (expiresIn) => ({
			url: "https://oranger.dev.nutgraf.in/share/AbC123xYz456Def789Gh01",
			expiresAt: expiresIn === "never" ? null : "2026-11-01T00:00:00Z",
		})),
		onRevoke: fn(async () => {}),
	},
	render: (args) => (
		<>
			<ShareDialog {...args} />
			<Toaster position="bottom-right" />
		</>
	),
} satisfies Meta<typeof ShareDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	args: {
		shares: [],
	},
};

export const WithLinks: Story = {
	args: {
		shares: sampleShares,
	},
};

export const JustCreated: Story = {
	args: {
		shares: sampleShares,
		initialUrl: "https://oranger.dev.nutgraf.in/share/AbC123xYz456Def789Gh01",
	},
};

export const WithError: Story = {
	args: {
		shares: sampleShares,
		error: "Failed to create share link. Please try again.",
	},
};

export const DefaultExpiryIs30Days: Story = {
	args: {
		shares: sampleShares,
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		const expirySelect = await body.findByTestId("share-expiry-select");
		await expect(expirySelect).toHaveTextContent("30 days");
	},
};

export const CopyCallsClipboard: Story = {
	args: {
		shares: sampleShares,
		initialUrl: "https://oranger.dev.nutgraf.in/share/AbC123xYz456Def789Gh01",
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		let writtenText = "";
		const originalClipboard = navigator.clipboard;
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: async (text: string) => {
					writtenText = text;
				},
			},
			configurable: true,
			writable: true,
		});

		try {
			const copyBtn = await body.findByTestId("share-copy-btn");
			await userEvent.click(copyBtn);
			await expect(writtenText).toBe(
				"https://oranger.dev.nutgraf.in/share/AbC123xYz456Def789Gh01",
			);
			await expect(copyBtn).toHaveTextContent("Copied");
		} finally {
			Object.defineProperty(navigator, "clipboard", {
				value: originalClipboard,
				configurable: true,
				writable: true,
			});
		}
	},
};

export const CopyWithoutClipboardShowsHint: Story = {
	args: {
		shares: sampleShares,
		initialUrl: "https://oranger.dev.nutgraf.in/share/AbC123xYz456Def789Gh01",
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		const originalClipboard = navigator.clipboard;
		Object.defineProperty(navigator, "clipboard", {
			value: undefined,
			configurable: true,
			writable: true,
		});

		try {
			const copyBtn = await body.findByTestId("share-copy-btn");
			const input = (await body.findByTestId(
				"share-created-url-input",
			)) as HTMLInputElement;

			await userEvent.click(copyBtn);

			// Should not report success
			await expect(copyBtn).toHaveTextContent("Copy");
			await expect(copyBtn).not.toHaveTextContent("Copied");

			// Should show hint
			const hint = await body.findByTestId("share-copy-hint");
			await expect(hint).toHaveTextContent("Press Ctrl/Cmd+C to copy");

			// Input text should be selected
			await expect(input.selectionStart).toBe(0);
			await expect(input.selectionEnd).toBe(input.value.length);
		} finally {
			Object.defineProperty(navigator, "clipboard", {
				value: originalClipboard,
				configurable: true,
				writable: true,
			});
		}
	},
};

export const RevokeFiresAfterConfirmation: Story = {
	args: {
		shares: sampleShares,
		onRevoke: fn(async () => {}),
	},
	play: async ({ args, canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		const revokeBtn = await body.findByTestId(
			"share-revoke-btn-share-active-1",
		);
		await userEvent.click(revokeBtn);

		const confirmDialog = await body.findByTestId(
			"share-revoke-confirm-dialog",
		);
		await expect(confirmDialog).toBeInTheDocument();

		const cancelBtn = await body.findByTestId("share-revoke-cancel-btn");
		await userEvent.click(cancelBtn);
		await expect(args.onRevoke).not.toHaveBeenCalled();

		const revokeBtnAgain = await body.findByTestId(
			"share-revoke-btn-share-active-1",
		);
		await userEvent.click(revokeBtnAgain);

		const confirmBtn = await body.findByTestId("share-revoke-confirm-btn");
		await userEvent.click(confirmBtn);
		await expect(args.onRevoke).toHaveBeenCalledWith("share-active-1");
	},
};

export const NoUrlAppearsInList: Story = {
	args: {
		shares: sampleShares,
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		const list = await body.findByTestId("share-links-list");
		const listText = list.textContent ?? "";
		await expect(listText).not.toContain("http://");
		await expect(listText).not.toContain("https://");
		await expect(listText).not.toContain("/share/");
	},
};
