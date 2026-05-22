import * as React from "react";
import { FileQueue, type FileGroup } from "@/components/composites/FileQueue";
import { cn } from "@/lib/utils";

/**
 * SpecNavigator Feature
 *
 * Domain-specific navigation for browsing specification files.
 * Uses FileQueue block for rendering grouped file lists.
 */

/**
 * SpecNavigator component props
 */
export interface SpecNavigatorProps {
  /** Array of file groups to display */
  groups: FileGroup[];
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
    return (
      <div className={cn("flex h-full flex-col", className)}>
        <FileQueue
          groups={groups}
          selectedFileId={selectedFileId}
          onFileSelect={onFileSelect}
        />
      </div>
    );
  }
);

SpecNavigator.displayName = "SpecNavigator";
