"use client";

import * as React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/primitives/AlertDialog";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/primitives/Dialog";
import { Icon } from "@/components/primitives/Icon";
import { Input } from "@/components/primitives/Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/primitives/Select";
import { toast } from "@/components/primitives/Toaster";
import { cn } from "@/lib/utils";

export type ExpiryDuration = "7d" | "30d" | "never";

export interface ShareItem {
	id: string;
	createdAt: string;
	expiresAt: string | null;
	revokedAt: string | null;
}

export interface ShareDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	shares?: ShareItem[];
	onCreate: (
		expiresIn: ExpiryDuration,
	) => Promise<{ url: string; expiresAt: string | null }>;
	onRevoke: (id: string) => Promise<void>;
	loading?: boolean;
	error?: string | Error | null;
	initialUrl?: string;
	className?: string;
}

function formatDate(dateStr: string | null | undefined): string {
	if (!dateStr) return "Never";
	const d = new Date(dateStr);
	if (Number.isNaN(d.getTime())) return dateStr;
	return d.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function getShareStatus(share: ShareItem): "active" | "expired" | "revoked" {
	if (share.revokedAt) return "revoked";
	if (share.expiresAt) {
		const expiryTime = new Date(share.expiresAt).getTime();
		if (expiryTime <= Date.now()) return "expired";
	}
	return "active";
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
	open,
	onOpenChange,
	shares = [],
	onCreate,
	onRevoke,
	loading = false,
	error,
	initialUrl = "",
	className,
}) => {
	const [expiresIn, setExpiresIn] = React.useState<ExpiryDuration>("30d");
	const [createdUrl, setCreatedUrl] = React.useState<string>(initialUrl);
	const [isCreating, setIsCreating] = React.useState(false);
	const [shareToRevoke, setShareToRevoke] = React.useState<string | null>(null);
	const [isRevoking, setIsRevoking] = React.useState(false);
	const [copied, setCopied] = React.useState(false);
	const [copyHint, setCopyHint] = React.useState<string | null>(null);
	const urlInputRef = React.useRef<HTMLInputElement>(null);

	const [prevInitialUrl, setPrevInitialUrl] = React.useState(initialUrl);

	if (initialUrl !== prevInitialUrl) {
		setPrevInitialUrl(initialUrl);
		setCreatedUrl(initialUrl);
	}

	// Reset transient state when dialog closes
	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			setCreatedUrl("");
			setCopied(false);
			setCopyHint(null);
			setShareToRevoke(null);
		}
		onOpenChange?.(nextOpen);
	};

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			const res = await onCreate(expiresIn);
			setCreatedUrl(res.url);
			setCopied(false);
			setCopyHint(null);
			toast.success("Share link created");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to create share link";
			toast.error(message);
		} finally {
			setIsCreating(false);
		}
	};

	const handleCopy = async () => {
		if (!createdUrl) return;
		try {
			if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(createdUrl);
				setCopied(true);
				setCopyHint(null);
				toast.success("Link copied");
				setTimeout(() => setCopied(false), 2000);
			} else {
				urlInputRef.current?.select();
				setCopyHint("Press Ctrl/Cmd+C to copy");
				toast.info("Press Ctrl/Cmd+C to copy");
			}
		} catch {
			urlInputRef.current?.select();
			setCopyHint("Press Ctrl/Cmd+C to copy");
			toast.info("Press Ctrl/Cmd+C to copy");
		}
	};

	const confirmRevoke = async (e?: React.MouseEvent) => {
		e?.preventDefault();
		if (!shareToRevoke) return;
		try {
			setIsRevoking(true);
			await onRevoke(shareToRevoke);
			toast.success("Share link revoked");
			setShareToRevoke(null);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to revoke share link";
			toast.error(message);
		} finally {
			setIsRevoking(false);
		}
	};

	const errorMessage =
		typeof error === "string"
			? error
			: error instanceof Error
				? error.message
				: null;

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent
					className={cn("sm:max-w-[520px] gap-6", className)}
					data-testid="share-dialog-content"
				>
					<DialogHeader>
						<DialogTitle>Share conversation</DialogTitle>
						<DialogDescription>
							Anyone with the link can view a replay of this conversation.
						</DialogDescription>
					</DialogHeader>

					{errorMessage && (
						<div
							role="alert"
							className="p-3 text-sm rounded-md bg-destructive/15 text-destructive border border-destructive/20"
							data-testid="share-dialog-error"
						>
							{errorMessage}
						</div>
					)}

					{/* Creation Section */}
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
							<div className="flex items-center gap-2 flex-1">
								<span className="text-sm text-muted-foreground whitespace-nowrap">
									Link expires in:
								</span>
								<Select
									value={expiresIn}
									onValueChange={(val) => setExpiresIn(val as ExpiryDuration)}
								>
									<SelectTrigger
										className="w-[130px]"
										aria-label="Link expires in"
										data-testid="share-expiry-select"
									>
										<SelectValue placeholder="30 days" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="7d">7 days</SelectItem>
										<SelectItem value="30d">30 days</SelectItem>
										<SelectItem value="never">Never</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button
								type="button"
								onClick={handleCreate}
								disabled={isCreating || loading}
								data-testid="share-create-btn"
							>
								{isCreating ? "Creating..." : "Create link"}
							</Button>
						</div>

						{/* Created URL output (shown right after creation) */}
						{createdUrl && (
							<div
								className="p-3 rounded-lg border border-border bg-muted/30 space-y-2 animate-in fade-in-50 duration-150"
								data-testid="share-created-url-box"
							>
								<div className="flex items-center gap-2">
									<Input
										ref={urlInputRef}
										readOnly
										value={createdUrl}
										className="flex-1 font-mono text-xs bg-background"
										data-testid="share-created-url-input"
										aria-label="Generated share link"
									/>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleCopy}
										className="gap-1.5 shrink-0"
										data-testid="share-copy-btn"
									>
										<Icon
											name={copied ? "check" : "copy"}
											className="h-3.5 w-3.5"
										/>
										<span>{copied ? "Copied" : "Copy"}</span>
									</Button>
								</div>
								{copyHint && (
									<p
										className="text-xs text-muted-foreground"
										data-testid="share-copy-hint"
									>
										{copyHint}
									</p>
								)}
							</div>
						)}
					</div>

					{/* Existing links list (never shows URLs) */}
					<div className="space-y-3">
						<h4 className="text-sm font-medium text-foreground">
							Existing links
						</h4>
						{loading && shares.length === 0 ? (
							<div className="py-6 text-center text-sm text-muted-foreground">
								Loading links...
							</div>
						) : shares.length === 0 ? (
							<div
								className="py-6 text-center text-sm text-muted-foreground border border-dashed rounded-lg border-border"
								data-testid="share-empty-state"
							>
								No links created yet.
							</div>
						) : (
							<div
								className="divide-y divide-border border border-border rounded-lg max-h-[220px] overflow-y-auto"
								data-testid="share-links-list"
							>
								{shares.map((share) => {
									const status = getShareStatus(share);
									return (
										<div
											key={share.id}
											className="p-3 flex items-center justify-between gap-3 text-sm"
											data-testid={`share-item-${share.id}`}
										>
											<div className="space-y-1 min-w-0">
												<div className="flex items-center gap-2">
													<span className="font-medium text-foreground text-xs">
														Created {formatDate(share.createdAt)}
													</span>
													{status === "revoked" ? (
														<Badge
															variant="destructive"
															className="text-[10px] px-1.5 py-0"
														>
															Revoked
														</Badge>
													) : status === "expired" ? (
														<Badge
															variant="secondary"
															className="text-[10px] px-1.5 py-0"
														>
															Expired
														</Badge>
													) : (
														<Badge
															variant="success"
															className="text-[10px] px-1.5 py-0"
														>
															Active
														</Badge>
													)}
												</div>
												<div className="text-xs text-muted-foreground">
													{status === "revoked"
														? `Revoked ${formatDate(share.revokedAt)}`
														: share.expiresAt
															? `Expires ${formatDate(share.expiresAt)}`
															: "Never expires"}
												</div>
											</div>

											{status === "active" && (
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7 px-2"
													onClick={() => setShareToRevoke(share.id)}
													data-testid={`share-revoke-btn-${share.id}`}
												>
													Revoke
												</Button>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Revocation Confirmation Dialog */}
			<AlertDialog
				open={Boolean(shareToRevoke)}
				onOpenChange={(next) => {
					if (!next && !isRevoking) setShareToRevoke(null);
				}}
			>
				<AlertDialogContent data-testid="share-revoke-confirm-dialog">
					<AlertDialogHeader>
						<AlertDialogTitle>Revoke share link?</AlertDialogTitle>
						<AlertDialogDescription>
							Anyone with this link will no longer be able to view this
							conversation replay. This action cannot be undone. Media files
							someone already opened from the replay may stay reachable by their
							own links.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							disabled={isRevoking}
							data-testid="share-revoke-cancel-btn"
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmRevoke}
							disabled={isRevoking}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							data-testid="share-revoke-confirm-btn"
						>
							{isRevoking ? "Revoking..." : "Revoke link"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

ShareDialog.displayName = "ShareDialog";
