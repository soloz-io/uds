import * as React from "react";
import { Checkbox } from "@/components/primitives/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/Dialog";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  isTask: boolean;
}

function parseChecklistItems(content?: string) {
  if (!content) {
    return [] as ChecklistItem[];
  }

  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let inCodeBlock = false;

  return lines.reduce<ChecklistItem[]>((items, line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return items;
      }

      if (trimmed.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return items;
      }

      if (inCodeBlock) {
        return items;
      }

      if (/^#{1,6}\s/.test(trimmed) || /^-{3,}$/.test(trimmed)) {
        return items;
      }

      const taskMatch = trimmed.match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/);

      if (taskMatch) {
        items.push({
          id: `checklist-${index}`,
          label: taskMatch[2],
          checked: taskMatch[1].toLowerCase() === "x",
          isTask: true,
        });
        return items;
      }

      const bulletStripped = trimmed.replace(/^[-*+]\s+/, "");
      const numberStripped = bulletStripped.replace(/^\d+\.\s+/, "");

      items.push({
        id: `checklist-${index}`,
        label: numberStripped,
        checked: false,
        isTask: false,
      });

      return items;
    }, []);
}

export interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  content?: string;
  emptyMessage?: React.ReactNode;
  className?: string;
}

export const FilePreviewDialog = React.memo<FilePreviewDialogProps>(
  ({
    open,
    onOpenChange,
    title,
    description,
    content,
    emptyMessage,
    className,
  }) => {
    const checklistItems = React.useMemo(() => parseChecklistItems(content), [content]);
    const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

    React.useEffect(() => {
      setCheckedItems(
        Object.fromEntries(
          checklistItems.map((item) => [item.id, item.checked])
        )
      );
    }, [checklistItems]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "max-h-[min(90vh,900px)] max-w-[min(96vw,1200px)] overflow-hidden p-0 sm:max-w-[min(96vw,1200px)]",
            className
          )}
        >
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>{title ?? "Preview"}</DialogTitle>
            <DialogDescription>
              {description ?? "Document preview"}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 overflow-y-auto px-6 py-5">
            {checklistItems.length > 0 ? (
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 rounded-md px-1 py-1 text-sm leading-6"
                  >
                    {item.isTask && (
                      <Checkbox
                        checked={checkedItems[item.id] ?? false}
                        onCheckedChange={(checked) => {
                          setCheckedItems((prev) => ({
                            ...prev,
                            [item.id]: checked === true,
                          }));
                        }}
                        className="mt-1"
                      />
                    )}
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-muted-foreground text-sm">
                {emptyMessage ?? "No preview content is available yet."}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

FilePreviewDialog.displayName = "FilePreviewDialog";
