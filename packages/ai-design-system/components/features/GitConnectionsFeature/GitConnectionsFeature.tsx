"use client";

import * as React from "react";
import { GitHubAppCard } from "@/components/composites/GitHubAppCard";
import { GitRepositoryCard } from "@/components/composites/GitRepositoryCard";
import { KamarkatBoxesCard } from "@/components/composites/KamarkatBoxesCard";
import { cn } from "@/lib/utils";
import type { UseGitConnectionsFeatureReturn } from "./useGitConnectionsFeature.d";

export interface GitConnectionsFeatureProps {
  data: UseGitConnectionsFeatureReturn["data"];
  actions: UseGitConnectionsFeatureReturn["actions"];
  className?: string;
}

/**
 * GitConnectionsFeature
 *
 * Implements the Mintlify design pattern for GitHub App connection
 * and Business repository configuration.
 * Composes GitHubAppCard, GitRepositoryCard, and KamarkatBoxesCard composites.
 */
export function GitConnectionsFeature({
  data,
  actions,
  className,
}: GitConnectionsFeatureProps) {
  const {
    state,
    organizations,
    selectedOrgId,
    suggestedRepoName,
    defaultBranch = "main",
    repository,
    releases = [],
    boxes = [],
    busy,
  } = data;

  const currentOrgId =
    selectedOrgId ?? (organizations.length > 0 ? organizations[0].installationId : undefined);
  const currentOrg = organizations.find((o) => o.installationId === currentOrgId);

  return (
    <div className={cn("mx-auto flex w-full max-w-4xl flex-col gap-8", className)}>
      {/* ── Section 1: GitHub App ────────────────────────────────────────── */}
      <GitHubAppCard
        state={state}
        orgName={currentOrg?.login}
        orgAccountType={currentOrg?.accountType}
        busy={busy}
        onInstallApp={actions.onInstallApp}
      />

      {/* ── Section 2: Repository ────────────────────────────────────────── */}
      <GitRepositoryCard
        state={state}
        organizations={organizations}
        selectedOrgId={currentOrgId}
        suggestedRepoName={suggestedRepoName}
        defaultBranch={defaultBranch}
        repository={repository}
        releases={releases}
        busy={busy}
        onSelectOrg={actions.onSelectOrg}
        onCreateRepository={actions.onCreateRepository}
        onOpenRepository={actions.onOpenRepository}
      />

      {/* ── Section 3: Kamarkat boxes ────────────────────────────────────── */}
      <KamarkatBoxesCard
        boxes={boxes}
        busy={busy}
        onDetectBoxes={actions.onDetectBoxes}
        onConnectBox={actions.onConnectBox}
      />
    </div>
  );
}
