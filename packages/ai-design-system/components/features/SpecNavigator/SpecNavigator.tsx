import * as React from "react";
import { FilePreviewDialog, FileQueue } from "@/components/composites";
import { cn } from "@/lib/utils";
import type { IconName } from "@/registry/icons";

export interface SpecNavigatorFile {
  /** Optional dialog title override */
  previewTitle?: string;
  /** Optional dialog subtitle or path description */
  previewDescription?: string;
  /** Optional markdown content rendered in the preview dialog */
  previewContent?: string;
  /** Unique identifier */
  id: string;
  /** File name (shown as label) */
  name: string;
  /** File path prefix (shown as secondary info) */
  path?: string;
  /** Optional icon name from the DS icon registry */
  icon?: IconName;
  /** Optional icon color utility class */
  iconColor?: string;
  /** Set false to disable click events and hover/selection highlight on this item */
  clickable?: boolean;
}

export interface SpecNavigatorGroup {
  id: string;
  title: string;
  icon?: IconName;
  iconColor?: string;
  files: SpecNavigatorFile[];
  defaultOpen?: boolean;
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
  /** Disable click events, selection highlights, and preview dialogs across all items */
  disableItemClick?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SpecNavigator component - domain-specific spec file navigation
 */
export const SpecNavigator = React.memo<SpecNavigatorProps>(
  ({ groups, selectedFileId, onFileSelect, disableItemClick = false, className }) => {
    const [previewFileId, setPreviewFileId] = React.useState<string | null>(null);

    const fileById = React.useMemo(() => {
      const entries = groups.flatMap((group) =>
        group.files.map((file) => [file.id, file] as const)
      );

      return new Map(entries);
    }, [groups]);

    const previewFile = !disableItemClick && previewFileId ? fileById.get(previewFileId) : undefined;

    const handleFileSelect = React.useCallback(
      (fileId: string) => {
        if (disableItemClick) return;
        const file = fileById.get(fileId);
        if (file?.clickable === false) return;
        setPreviewFileId(fileId);
        onFileSelect?.(fileId);
      },
      [disableItemClick, fileById, onFileSelect]
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
          selectedFileId={disableItemClick ? undefined : selectedFileId}
          onFileSelect={disableItemClick ? undefined : handleFileSelect}
        />

        {!disableItemClick && (
          <FilePreviewDialog
            open={!!previewFile}
            onOpenChange={handleOpenChange}
            title={previewFile?.previewTitle ?? previewFile?.name}
            description={previewFile?.previewDescription ?? previewFile?.path}
            content={previewFile?.previewContent}
            emptyMessage="No preview content is available for this spec yet."
          />
        )}
      </div>
    );
  }
);

SpecNavigator.displayName = "SpecNavigator";
