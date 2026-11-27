import * as React from "react";
import { Card, CardContent } from "@/components/primitives/Card";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export type GitHubAppConnectionState =
  | "not_configured"
  | "installation_needed"
  | "ready"
  | "provisioning"
  | "provisioned";

export interface GitHubAppCardProps {
  state: GitHubAppConnectionState;
  orgName?: string;
  orgAccountType?: string;
  busy?: string | null;
  onInstallApp?: () => void;
  className?: string;
}

/**
 * GitHubAppCard Composite
 *
 * Displays the Waypoint GitHub App installation status and action controls.
 */
export function GitHubAppCard({
  state,
  orgName,
  orgAccountType = "Organization",
  busy,
  onInstallApp,
  className,
}: GitHubAppCardProps) {
  const isConnected = state === "ready" || state === "provisioned" || state === "provisioning";

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            GitHub app
          </h2>
          <p className="text-sm text-muted-foreground">
            Install the GitHub app to enable automatic updates and releases
          </p>
        </div>
        {isConnected && (
          <Button
            variant="outline"
            size="sm"
            onClick={onInstallApp}
            disabled={busy === "install"}
            className="gap-1.5 text-xs font-medium"
          >
            <span>Add to new organization</span>
            <Icon name="external-link" size="xs" />
          </Button>
        )}
      </div>

      <Card className="border-border bg-card/50">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-foreground">
                Waypoint GitHub app
              </span>
              {state === "not_configured" && (
                <Badge variant="destructive" className="text-xs">
                  Not configured
                </Badge>
              )}
              {state === "installation_needed" && (
                <Badge variant="warning" className="text-xs">
                  Installation needed
                </Badge>
              )}
              {isConnected && (
                <Badge variant="success" className="text-xs">
                  Installed
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {state === "not_configured" &&
                "The GitHub App credentials are not configured on this deployment."}
              {state === "installation_needed" &&
                "You will be redirected to GitHub to connect an existing installation or install the GitHub App."}
              {isConnected &&
                `Connected to ${orgName ?? "organization"} (${orgAccountType}). Webhooks and releases active.`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {state === "installation_needed" && (
              <Button
                onClick={onInstallApp}
                disabled={busy === "install"}
                className="gap-1.5"
              >
                <span>Connect GitHub</span>
                <Icon name="external-link" size="xs" />
              </Button>
            )}
            {isConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={onInstallApp}
                disabled={busy === "install"}
                className="gap-1.5"
              >
                <span>Manage on GitHub</span>
                <Icon name="external-link" size="xs" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
