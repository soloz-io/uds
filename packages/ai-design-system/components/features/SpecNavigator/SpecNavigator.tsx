import * as React from "react";
import {
  FilePreviewDialog,
  FileQueue,
  type FileGroup,
  type FileItem,
} from "@/components/composites";
import { cn } from "@/lib/utils";

/**
 * SpecNavigator Feature
 *
 * Domain-specific navigation for browsing specification files.
 * Uses FileQueue block for rendering grouped file lists.
 */

export interface SpecNavigatorFile extends FileItem {
  /** Optional markdown content rendered in the preview dialog */
  previewContent?: string;
  /** Optional dialog title override */
  previewTitle?: string;
  /** Optional dialog subtitle or path description */
  previewDescription?: string;
}

export interface SpecNavigatorGroup extends Omit<FileGroup, "files"> {
  files: SpecNavigatorFile[];
}

/**
 * SpecNavigator component props
 */
export interface SpecNavigatorProps {
  /** Array of file groups to display */
  groups: SpecNavigatorGroup[];
  /** ID of currently selected file */
  selectedFileId?: string;
  /** Callback when a file is selected */
  onFileSelect?: (fileId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SpecNavigator component - domain-specific spec file navigation
 */
export const SpecNavigator = React.memo<SpecNavigatorProps>(
  ({ groups, selectedFileId, onFileSelect, className }) => {
    const [previewFileId, setPreviewFileId] = React.useState<string | null>(null);

    const fileById = React.useMemo(() => {
      const entries = groups.flatMap((group) =>
        group.files.map((file) => [file.id, file] as const)
      );

      return new Map(entries);
    }, [groups]);

    const previewFile = previewFileId ? fileById.get(previewFileId) : undefined;

    const handleFileSelect = React.useCallback(
      (fileId: string) => {
        setPreviewFileId(fileId);
        onFileSelect?.(fileId);
      },
      [onFileSelect]
    );

    const handleOpenChange = React.useCallback((open: boolean) => {
      if (!open) {
        setPreviewFileId(null);
      }
    }, []);

    return (
      <div className={cn("flex h-full flex-col", className)}>
        <FileQueue
          groups={groups}
          selectedFileId={selectedFileId}
          onFileSelect={handleFileSelect}
        />

        <FilePreviewDialog
          open={!!previewFile}
          onOpenChange={handleOpenChange}
          title={previewFile?.previewTitle ?? previewFile?.name}
          description={previewFile?.previewDescription ?? previewFile?.path}
          content={previewFile?.previewContent}
          emptyMessage="No preview content is available for this spec yet."
        />
      </div>
    );
  }
);

SpecNavigator.displayName = "SpecNavigator";
