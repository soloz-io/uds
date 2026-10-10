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
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
	/** Whether the dialog is shown. */
	open: boolean;
	/** Called to close it (Cancel, Escape, a click outside), never while `busy`. */
	onOpenChange: (open: boolean) => void;
	/** The question, e.g. "Stop this computer?" */
	title: string;
	/** What confirming does, in a sentence or two. */
	description?: React.ReactNode;
	/** Label of the confirming button. Defaults to "Confirm". */
	confirmLabel?: string;
	/** Label of the button that changes nothing. Defaults to "Cancel". */
	cancelLabel?: string;
	/** Draw the confirming button as destructive (red). */
	destructive?: boolean;
	/** Confirming is in progress: both buttons are disabled and the dialog stays open. */
	busy?: boolean;
	/** The user confirmed. The caller closes the dialog when its work is done. */
	onConfirm: () => void;
	className?: string;
}

/**
 * ConfirmDialog Composite
 *
 * A modal that asks the user to confirm one action before it happens: a title,
 * what the action does, and Cancel / Confirm. Confirming does not close it by
 * itself; the caller closes it once the action has finished, and `busy` keeps
 * it open and inert meanwhile.
 */
export const ConfirmDialog = React.memo<ConfirmDialogProps>(
	({
		open,
		onOpenChange,
		title,
		description,
		confirmLabel = "Confirm",
		cancelLabel = "Cancel",
		destructive = false,
		busy = false,
		onConfirm,
		className,
	}) => (
		<AlertDialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
			<AlertDialogContent className={className} data-testid="confirm-dialog">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description && <AlertDialogDescription>{description}</AlertDialogDescription>}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={busy} data-testid="confirm-dialog-cancel">
						{cancelLabel}
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={busy}
						data-testid="confirm-dialog-confirm"
						onClick={(event) => {
							// Stays open until the caller has done the work.
							event.preventDefault();
							onConfirm();
						}}
						className={cn(
							destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
						)}
					>
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
);

ConfirmDialog.displayName = "ConfirmDialog";
