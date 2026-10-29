"use client";

import * as React from "react";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { Badge } from "@/components/primitives/Badge";
import { Icon } from "@/components/primitives/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/primitives/Table";
import { ConfirmDialog } from "@/components/composites/ConfirmDialog";
import { cn } from "@/lib/utils";

export type OrganisationRole = "owner" | "admin" | "spender" | "viewer";

export interface OrganisationMember {
  userId: string;
  email: string;
  role: OrganisationRole;
  isCurrentUser?: boolean;
}

export interface OrganisationMembersProps {
  members: OrganisationMember[];
  currentUserId?: string;
  canManage?: boolean;
  onAdd?: (email: string, role: OrganisationRole) => void | Promise<void>;
  onChangeRole?: (userId: string, role: OrganisationRole) => void | Promise<void>;
  onRemove?: (userId: string) => void | Promise<void>;
  className?: string;
}

const ROLES: { value: OrganisationRole; label: string; description: string }[] = [
  { value: "owner", label: "Owner", description: "Full access to billing, members, and resources" },
  { value: "admin", label: "Admin", description: "Can manage members and spend credits" },
  { value: "spender", label: "Spender", description: "Can run computers and consume credits" },
  { value: "viewer", label: "Viewer", description: "Read-only access, cannot consume credits" },
];

export const OrganisationMembers = React.memo<OrganisationMembersProps>(
  ({
    members,
    currentUserId,
    canManage = true,
    onAdd,
    onChangeRole,
    onRemove,
    className,
  }) => {
    const [newEmail, setNewEmail] = React.useState("");
    const [newRole, setNewRole] = React.useState<OrganisationRole>("spender");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [memberToRemove, setMemberToRemove] = React.useState<OrganisationMember | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newEmail.trim().toLowerCase();
      if (!trimmed || !onAdd) return;

      try {
        setIsSubmitting(true);
        await onAdd(trimmed, newRole);
        setNewEmail("");
        setNewRole("spender");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className={cn("w-full space-y-6", className)}>
        {/* Add Member Bar */}
        {canManage && onAdd && (
          <form
            onSubmit={handleAdd}
            className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3"
          >
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Invite team member
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add a member to this organization to share workspace compute and credits.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full text-xs sm:text-sm"
                />
              </div>

              <div className="w-full sm:w-36">
                <Select
                  value={newRole}
                  onValueChange={(val) => setNewRole(val as OrganisationRole)}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value} className="text-xs">
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !newEmail.trim()}
                className="shrink-0 cursor-pointer text-xs font-medium"
              >
                <Icon name="plus" className="w-3.5 h-3.5 mr-1" />
                Add member
              </Button>
            </div>
          </form>
        )}

        {/* Members Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50%]">Member</TableHead>
                <TableHead className="w-[30%]">Role</TableHead>
                <TableHead className="w-[20%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No members found in this organisation.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => {
                  const isCurrent =
                    member.isCurrentUser ||
                    (Boolean(currentUserId) && member.userId === currentUserId);
                  const isOwner = member.role === "owner";
                  const canEditRole = canManage && !isOwner && onChangeRole;
                  const canDelete = canManage && !isOwner && !isCurrent && onRemove;

                  return (
                    <TableRow key={member.userId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 select-none">
                            {member.email[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate flex items-center gap-1.5">
                              <span>{member.email}</span>
                              {isCurrent && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  You
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {canEditRole ? (
                          <div className="w-32">
                            <Select
                              value={member.role}
                              onValueChange={(val) =>
                                onChangeRole(member.userId, val as OrganisationRole)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLES.map((r) => (
                                  <SelectItem key={r.value} value={r.value} className="text-xs">
                                    {r.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <Badge
                            variant={isOwner ? "default" : "outline"}
                            className="text-xs capitalize font-medium"
                          >
                            {member.role}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {canDelete ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMemberToRemove(member)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                            aria-label={`Remove ${member.email}`}
                          >
                            <Icon name="trash-2" className="w-4 h-4" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Remove Member Confirmation Dialog */}
        <ConfirmDialog
          open={Boolean(memberToRemove)}
          onOpenChange={(open) => !open && setMemberToRemove(null)}
          title="Remove member"
          description={
            memberToRemove
              ? `Are you sure you want to remove ${memberToRemove.email} from this organisation? They will lose access immediately.`
              : ""
          }
          confirmLabel="Remove"
          destructive
          onConfirm={() => {
            if (memberToRemove && onRemove) {
              onRemove(memberToRemove.userId);
            }
            setMemberToRemove(null);
          }}
        />
      </div>
    );
  }
);

OrganisationMembers.displayName = "OrganisationMembers";
