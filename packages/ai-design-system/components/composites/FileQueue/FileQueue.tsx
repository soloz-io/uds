import * as React from "react";
import {
  Queue,
  QueueSection,
  QueueSectionTrigger,
  QueueSectionLabel,
  QueueSectionContent,
  QueueList,
  QueueItem,
  QueueItemContent,
} from "@/components/ai-elements/queue";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";
import type { FileQueueProps } from "./interfaces";

/**
 * FileQueue Block
 *
 * Generic block component for displaying files organized into collapsible groups.
 * Supports optional file selection with visual feedback and keyboard navigation.
 * Uses Queue AI element for structure.
 */

/**
 * File item structure
 */

/**
 * File group structure
 */

/**
 * FileQueue component props
 */

/**
 * FileQueue component - displays files organized into collapsible groups
 */
export const FileQueue = React.memo<FileQueueProps>(
  ({ groups, selectedFileId, onFileSelect, className }) => {
    const handleFileClick = React.useCallback(
      (fileId: string) => {
        if (onFileSelect) {
          onFileSelect(fileId);
        }
      },
      [onFileSelect]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent, fileId: string) => {
        if (onFileSelect && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleFileClick(fileId);
        }
      },
      [onFileSelect, handleFileClick]
    );

    return (
      <Queue className={cn("w-full", className)}>
        {groups.map((group) => {
          return (
            <QueueSection key={group.id} defaultOpen={group.defaultOpen}>
              <QueueSectionTrigger>
                <QueueSectionLabel
                  count={group.files.length}
                  label={group.title}
                  icon={
                    group.icon ? (
                      <Icon
                        name={group.icon}
                        size="sm"
                        className={group.iconColor}
                      />
                    ) : undefined
                  }
                />
              </QueueSectionTrigger>
              <QueueSectionContent>
                <QueueList className="max-h-[300px]">
                  {group.files.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground italic">
                      No files yet
                    </div>
                  ) : (
                    group.files.map((file) => {
                      const isSelected = selectedFileId === file.id;
                      const isClickable = !!onFileSelect;

                      return (
                        <QueueItem
                          key={file.id}
                          className={cn(
                            isClickable && "cursor-pointer",
                            isSelected && "bg-accent"
                          )}
                          onClick={() => isClickable && handleFileClick(file.id)}
                          role={isClickable ? "button" : undefined}
                          tabIndex={isClickable ? 0 : undefined}
                          onKeyDown={(e) => handleKeyDown(e, file.id)}
                          aria-selected={isClickable ? isSelected : undefined}
                        >
                          <div className="flex items-start gap-2">
                            <Icon name="file" size="sm" className="mt-0.5" />
                            <QueueItemContent>
                              {file.name}
                              {file.path && (
                                <span className="text-muted-foreground/70">
                                  {" "}
                                  • {file.path}
                                </span>
                              )}
                            </QueueItemContent>
                          </div>
                        </QueueItem>
                      );
                    })
                  )}
                </QueueList>
              </QueueSectionContent>
            </QueueSection>
          );
        })}
      </Queue>
    );
  }
);

FileQueue.displayName = "FileQueue";
