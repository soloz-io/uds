import * as React from "react";
import { Badge } from "@/components/primitives/Badge";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

/**
 * FileStatusBadge
 *
 * Displays file change status with color-coded badge and icon.
 * Adapted from Tool AI element's status badge pattern.
 */

export type FileStatus = "pending" | "modified" | "created" | "deleted";

export interface FileStatusBadgeProps {
  status: FileStatus;
  className?: string;
}

const statusConfig: Record<
  FileStatus,
  {
    label: string;
    icon: string;
    colorClass: string;
  }
> = {
  pending: {
    label: "Pending",
    icon: "loader-2",
    colorClass: "text-warning",
  },
  modified: {
    label: "Modified",
    icon: "file-text",
    colorClass: "text-info",
  },
  created: {
    label: "Created",
    icon: "plus",
    colorClass: "text-success",
  },
  deleted: {
    label: "Deleted",
    icon: "x",
    colorClass: "text-destructive",
  },
};

/**
 * FileStatusBadge component - displays file change status
 */
export const FileStatusBadge = React.memo<FileStatusBadgeProps>(
  ({ status, className }) => {
    const config = statusConfig[status];

    return (
      <Badge
        variant="secondary"
        className={cn("gap-1.5 rounded-full text-xs", className)}
      >
        <Icon
          name={config.icon}
          size="xs"
          className={config.colorClass}
          aria-hidden="true"
        />
        <span className={config.colorClass}>{config.label}</span>
      </Badge>
    );
  }
);

FileStatusBadge.displayName = "FileStatusBadge";
