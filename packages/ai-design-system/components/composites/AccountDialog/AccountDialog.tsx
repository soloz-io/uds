"use client";

import * as React from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/Dialog";
import { cn } from "@/lib/utils";

export interface AccountUser {
  name?: string;
  email?: string;
  initial?: string;
  avatarColor?: string;
  plan?: string;
  planDescription?: string;
  [key: string]: unknown;
}

export interface AccountDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  user?: AccountUser;
  trigger?: React.ReactNode;
  showTrigger?: boolean;
  onUpgrade?: () => void;
  onSignOut?: () => void;
  termsUrl?: string;
  onTermsClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

export interface AccountButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  initial?: string;
  avatarColor?: string;
}

export const AccountButton = React.forwardRef<HTMLButtonElement, AccountButtonProps>(
  ({ initial = "R", avatarColor, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Account details"
        className={cn(
          "flex items-center gap-1.5 p-1 rounded-full hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold select-none text-white",
            avatarColor ? "" : "bg-emerald-700"
          )}
          style={avatarColor ? { backgroundColor: avatarColor } : undefined}
        >
          {initial}
        </div>
        <Icon name="chevron-down" className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    );
  }
);

AccountButton.displayName = "AccountButton";

export const AccountDialog = React.forwardRef<HTMLDivElement, AccountDialogProps>(
  (
    {
      user,
      trigger,
      showTrigger = true,
      onUpgrade,
      onSignOut,
      termsUrl = "/terms",
      onTermsClick,
      className,
      children,
      ...dialogProps
    },
    _ref
  ) => {
    const email = user?.email || "rajalakshmi2655@gmail.com";
    const initial =
      user?.initial ||
      (user?.name ? user.name[0].toUpperCase() : email[0].toUpperCase());
    const plan = user?.plan || "Google AI Pro";
    const planDescription =
      user?.planDescription ||
      "You can upgrade to a Google AI Ultra plan to receive higher rate limits.";

    const defaultTrigger = (
      <AccountButton initial={initial} avatarColor={user?.avatarColor} />
    );

    return (
      <Dialog {...dialogProps}>
        {showTrigger && (
          <DialogTrigger asChild>
            {trigger ?? defaultTrigger}
          </DialogTrigger>
        )}
        <DialogContent
          className={cn(
            "sm:max-w-md p-6 bg-card text-card-foreground border-border rounded-2xl shadow-2xl",
            className
          )}
        >
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Account
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Manage your plan, credentials, and general preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="text-xs font-semibold text-foreground/90 mb-2.5">
              Account
            </div>

            <div className="rounded-xl border border-border bg-muted/30 divide-y divide-border overflow-hidden">
              {/* Row 1: Plan Details */}
              <div className="flex items-center justify-between p-4 gap-3">
                <div className="min-w-0 pr-1">
                  <div className="text-sm font-semibold text-foreground">
                    Your Plan: {plan}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {planDescription}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={onUpgrade}
                  className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2 rounded-lg cursor-pointer"
                >
                  Upgrade
                </Button>
              </div>

              {/* Row 2: Email & Sign Out */}
              <div className="flex items-center justify-between p-4 gap-3">
                <div className="min-w-0 pr-1">
                  <div className="text-sm font-semibold text-foreground">
                    Email
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-normal truncate">
                    {email}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSignOut}
                  className="shrink-0 text-xs font-medium px-3.5 py-2 rounded-lg cursor-pointer"
                >
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-xs text-muted-foreground mt-6 text-left">
              By using this app, you agree to its{" "}
              <a
                href={termsUrl}
                onClick={onTermsClick ?? ((e) => e.preventDefault())}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Terms of Service
              </a>
            </div>
          </div>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);

AccountDialog.displayName = "AccountDialog";
