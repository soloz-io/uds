import * as React from "react";
import { Confirmation, type ConfirmationProps } from "@/components/composites/Confirmation";
import { FileQueue, type FileGroup } from "@/components/composites/FileQueue";
import type { FileChangeData, FileStatus } from "@/components/composites/FileQueue";

/**
 * FileChangeQueue Section
 *
 * Composes FileQueue block with Confirmation block for file approval workflow.
 * Displays file modifications with approve/reject actions.
 */

export interface FileChangeQueueProps {
  /**
   * Array of file changes to display
   */
  changes: FileChangeData[];
  /**
   * Title/prompt text for the confirmation
   */
  title?: string;
  /**
   * Confirmation state
   */
  state: ConfirmationProps["state"];
  /**
   * Approval data
   */
  approval?: ConfirmationProps["approval"];
  /**
   * Approve all changes callback
   */
  onApprove?: () => void;
  /**
   * Reject all changes callback
   */
  onReject?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Transform file changes to groups for FileQueue
 * Maintains existing visual appearance with status-based grouping
 */
const transformFileChangesToGroups = (
  changes: FileChangeData[]
): FileGroup[] => {
  const statusConfig = {
    modified: {
      title: "Modified",
      icon: "file-text",
      iconColor: "text-blue-600 dark:text-blue-500",
    },
    created: {
      title: "Created",
      icon: "plus",
      iconColor: "text-green-600 dark:text-green-500",
    },
    deleted: {
      title: "Deleted",
      icon: "x",
      iconColor: "text-red-600 dark:text-red-500",
    },
    pending: {
      title: "Pending",
      icon: "loader-2",
      iconColor: "text-yellow-600 dark:text-yellow-500",
    },
  };

  const grouped: Record<FileStatus, FileChangeData[]> = {
    modified: [],
    created: [],
    deleted: [],
    pending: [],
  };

  changes.forEach((change) => {
    grouped[change.status].push(change);
  });

  const statusOrder: FileStatus[] = ["modified", "created", "deleted", "pending"];

  const result: FileGroup[] = [];

  statusOrder.forEach((status) => {
    const files = grouped[status];
    if (files.length === 0) return;

    const config = statusConfig[status];

    result.push({
      id: status,
      title: config.title,
      icon: config.icon,
      iconColor: config.iconColor,
      files: files.map((file) => ({
        id: file.id,
        name: file.filename,
        path: file.path,
      })),
      defaultOpen: false,
    });
  });

  return result;
};

/**
 * FileChangeQueue component - section-level component for file approval workflow
 */
export const FileChangeQueue = React.memo<FileChangeQueueProps>(
  ({ changes, title, state, approval, onApprove, onReject, className }) => {
    // Transform file changes to groups
    const groups = React.useMemo(
      () => transformFileChangesToGroups(changes),
      [changes]
    );

    // Only display if at least 1 file change exists
    if (changes.length === 0) {
      return null;
    }

    return (
      <Confirmation
        title={title}
        state={state}
        approval={approval}
        onApprove={onApprove}
        onReject={onReject}
        className={className}
      >
        <FileQueue groups={groups} />
      </Confirmation>
    );
  }
);

FileChangeQueue.displayName = "FileChangeQueue";
