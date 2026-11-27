import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/primitives/Card";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/primitives/Select";
import { Label } from "@/components/primitives/Label";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export interface GitOrganizationOption {
  installationId: string;
  login: string;
}

export interface GitRepositoryInfo {
  fullName: string;
  url: string;
}

export interface GitReleaseItem {
  version: string;
  commit_sha: string;
  digest: string;
  image: string;
}

export interface GitRepositoryCardProps {
  state: string;
  organizations: GitOrganizationOption[];
  selectedOrgId?: string;
  suggestedRepoName: string;
  defaultBranch?: string;
  repository?: GitRepositoryInfo | null;
  releases?: GitReleaseItem[];
  busy?: string | null;
  onSelectOrg?: (installationId: string) => void;
  onCreateRepository?: (installationId?: string) => void;
  onOpenRepository?: () => void;
  className?: string;
}

/**
 * GitRepositoryCard Composite
 *
 * Configures the business repository, organization selection, and displays release status.
 */
export function GitRepositoryCard({
  state,
  organizations,
  selectedOrgId,
  suggestedRepoName,
  defaultBranch = "main",
  repository,
  releases = [],
  busy,
  onSelectOrg,
  onCreateRepository,
  onOpenRepository,
  className,
}: GitRepositoryCardProps) {
  const currentOrgId =
    selectedOrgId ?? (organizations.length > 0 ? organizations[0].installationId : undefined);
  const currentOrg = organizations.find((o) => o.installationId === currentOrgId);
  const isProvisioned = state === "provisioned" && !!repository;
  const latestRelease = releases[0];

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Repository
        </h2>
        <p className="text-sm text-muted-foreground">
          Your business definition, as code, in your organization.
        </p>
      </div>

      <Card className="border-border">
        <CardContent className="flex flex-col divide-y divide-border p-0">
          {/* Row 1: Organization */}
          <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-foreground">
                Organization
              </Label>
              <p className="text-xs text-muted-foreground">
                GitHub account or organization with the Waypoint app installed.
              </p>
            </div>
            <div className="shrink-0">
              {organizations.length > 0 ? (
                <Select
                  value={currentOrgId}
                  onValueChange={onSelectOrg}
                  disabled={isProvisioned}
                >
                  <SelectTrigger className="w-full min-w-[200px] sm:w-[240px]">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.installationId} value={org.installationId}>
                        {org.login}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Connect GitHub app first
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Repository */}
          <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-foreground">
                Repository
              </Label>
              <p className="text-xs text-muted-foreground">
                {isProvisioned
                  ? "Private repository containing your business workflows and models."
                  : "Repository will be created as private with README.md and business-release.yml."}
              </p>
            </div>
            <div className="shrink-0">
              {isProvisioned && repository ? (
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-primary hover:underline"
                >
                  <span>{repository.fullName}</span>
                  <Icon name="external-link" size="xs" />
                </a>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">
                    {suggestedRepoName}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Private
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Branch */}
          <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-foreground">
                Branch
              </Label>
              <p className="text-xs text-muted-foreground">
                Commits pushed to this branch trigger a deployment.
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
              <Icon name="git-branch" size="sm" />
              <span>{defaultBranch}</span>
            </div>
          </div>

          {/* Row 4: Release Status (When provisioned) */}
          {isProvisioned && (
            <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-foreground">
                  Release status
                </Label>
                <p className="text-xs text-muted-foreground">
                  Immutable Business Release published to GitHub Container Registry.
                </p>
              </div>
              <div className="shrink-0">
                {latestRelease ? (
                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <Badge variant="success" className="font-mono text-xs">
                      v{latestRelease.version} · {latestRelease.commit_sha.slice(0, 7)}
                    </Badge>
                    <span className="max-w-[280px] truncate font-mono text-[11px] text-muted-foreground">
                      {latestRelease.image}@{latestRelease.digest.slice(0, 19)}…
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No release yet: the first merge to main publishes one.
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {/* Action Footer */}
        <CardFooter className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-5 py-3">
          {isProvisioned ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenRepository}
              className="gap-1.5"
            >
              <span>Open repository</span>
              <Icon name="external-link" size="xs" />
            </Button>
          ) : (
            <Button
              onClick={() => onCreateRepository?.(currentOrgId)}
              disabled={
                state !== "ready" ||
                organizations.length === 0 ||
                busy === "business-repo"
              }
              className="min-w-[130px]"
            >
              {busy === "business-repo" ? (
                "Creating…"
              ) : currentOrg ? (
                `Create in ${currentOrg.login}`
              ) : (
                "Create repository"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
