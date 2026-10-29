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
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/utils";

export interface AccountItem {
  id: string;
  name: string;
  kind: "personal" | "organisation";
  role?: string;
  plan?: { code: string; name: string } | null;
}

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
  accounts?: AccountItem[];
  selectedAccountId?: string;
  onSelectAccount?: (id: string) => void;
  onCreateOrganisation?: () => void;
  planName?: string;
  creditsBalance?: number;
  onOpenCredits?: () => void;
  onOpenSettings?: () => void;
  onOpenAccount?: () => void;
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
            avatarColor ? "" : "bg-gradient-to-br from-teal-800 to-emerald-600"
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
      accounts,
      selectedAccountId,
      onSelectAccount,
      onCreateOrganisation,
      planName,
      creditsBalance,
      onOpenCredits,
      onOpenSettings,
      onOpenAccount: _onOpenAccount,
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
    const [isSwitcherOpen, setIsSwitcherOpen] = React.useState(false);

    const activeAccount = React.useMemo(() => {
      if (!accounts || accounts.length === 0) return null;
      if (selectedAccountId) {
        const found = accounts.find((a) => a.id === selectedAccountId);
        if (found) return found;
      }
      return accounts[0];
    }, [accounts, selectedAccountId]);

    const email = user?.email || (activeAccount?.kind === "personal" ? activeAccount.name : undefined);
    const displayName = activeAccount?.name || user?.name || email || "Account";
    const initial =
      user?.initial ||
      (displayName ? displayName[0].toUpperCase() : "A");

    // Plan precedence: explicit planName prop, then active account plan, then user.plan.
    // If none passed, currentPlan is empty and no plan row is shown.
    const currentPlan =
      planName ||
      (activeAccount?.plan ? activeAccount.plan.name : user?.plan);

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

          <div className="mt-4 space-y-4">
            {/* Account Switcher Header */}
            {accounts && accounts.length > 0 ? (
              <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsSwitcherOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-left cursor-pointer"
                  aria-expanded={isSwitcherOpen}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 select-none">
                      {displayName[0]?.toUpperCase() || "A"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {displayName}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize flex items-center gap-1.5">
                        <span>{activeAccount?.kind ?? "personal"}</span>
                        {activeAccount?.role && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 uppercase">
                            {activeAccount.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Icon
                    name="chevrons-up-down"
                    className="w-4 h-4 text-muted-foreground shrink-0"
                  />
                </button>

                {/* Switcher list */}
                {isSwitcherOpen && (
                  <div className="border-t border-border bg-card divide-y divide-border">
                    <div className="py-1">
                      {accounts.map((acc) => {
                        const isSelected = activeAccount?.id === acc.id;
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => {
                              onSelectAccount?.(acc.id);
                              setIsSwitcherOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-muted/50 transition-colors text-left cursor-pointer",
                              isSelected && "bg-muted/30"
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground shrink-0">
                                {acc.name[0]?.toUpperCase() || "A"}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-foreground truncate">
                                  {acc.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground capitalize">
                                  {acc.kind}
                                  {acc.role ? ` · ${acc.role}` : ""}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <Icon name="check" className="w-4 h-4 text-primary shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {onCreateOrganisation && (
                      <button
                        type="button"
                        onClick={() => {
                          onCreateOrganisation();
                          setIsSwitcherOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium text-primary hover:bg-muted/40 transition-colors cursor-pointer"
                      >
                        <Icon name="plus" className="w-3.5 h-3.5" />
                        <span>Create organisation</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : null}

            {/* Plan and Actions Block */}
            <div className="rounded-xl border border-border bg-muted/30 divide-y divide-border overflow-hidden">
              {/* Plan Row: shown when there is a plan, or an upgrade to offer an account without one */}
              {currentPlan || onUpgrade ? (
                <div className="flex items-center justify-between p-3.5 gap-3">
                  <div className="min-w-0 pr-1">
                    <div className="text-sm font-semibold text-foreground">
                      {currentPlan || "No plan"}
                    </div>
                    {user?.planDescription && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                        {user.planDescription}
                      </p>
                    )}
                  </div>
                  {onUpgrade && (
                    <Button
                      size="sm"
                      onClick={onUpgrade}
                      className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs px-3.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
              ) : null}

              {/* Credits Row */}
              {(creditsBalance !== undefined || onOpenCredits) && (
                <button
                  type="button"
                  onClick={onOpenCredits}
                  className="w-full flex items-center justify-between p-3.5 gap-3 text-left hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon name="sparkles" className="w-4 h-4 text-foreground/80 shrink-0" />
                    <span className="text-sm font-medium text-foreground">Credits</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                    {creditsBalance !== undefined && (
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {creditsBalance.toLocaleString()}
                      </span>
                    )}
                    <Icon name="chevron-right" className="w-4 h-4" />
                  </div>
                </button>
              )}

              {/* Settings Row */}
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="w-full flex items-center justify-between p-3.5 gap-3 text-left hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon name="settings" className="w-4 h-4 text-foreground/80 shrink-0" />
                    <span className="text-sm font-medium text-foreground">Settings</span>
                  </div>
                  <Icon name="chevron-right" className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              )}

              {/* Email / Sign Out Row */}
              {(email || onSignOut) && (
                <div className="flex items-center justify-between p-3.5 gap-3">
                  {email ? (
                    <div className="min-w-0 pr-1">
                      <div className="text-xs text-muted-foreground uppercase font-semibold">
                        Email
                      </div>
                      <div className="text-xs text-foreground mt-0.5 font-normal truncate">
                        {email}
                      </div>
                    </div>
                  ) : <div />}
                  {onSignOut && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onSignOut}
                      className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Sign Out
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Footer Note */}
            <div className="text-xs text-muted-foreground text-left">
              By using this app, you agree to its{" "}
              <a
                href={termsUrl}
                onClick={onTermsClick ?? ((e) => e.preventDefault())}
                className="text-primary hover:underline cursor-pointer"
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
