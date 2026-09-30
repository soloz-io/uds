import * as React from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/primitives/Drawer"
import { Icon } from "@/components/primitives/Icon"
import { Button } from "@/components/primitives/Button"
import { FileTreeExplorer, type FileTreeExplorerProps } from "./FileTreeExplorer"
import { cn } from "@/lib/utils"

export interface FileTreeDrawerProps extends FileTreeExplorerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
}

export const FileTreeDrawer = React.memo<FileTreeDrawerProps>(
  ({
    open,
    onOpenChange,
    title = "Files",
    tree,
    selectedPath,
    onSelect,
    onDownload,
    className,
    ...props
  }) => {
    return (
      <Drawer direction="left" open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={cn("w-[85vw] max-w-[320px] h-full flex flex-col p-0 focus:outline-none", className)}>
          <DrawerHeader className="p-3 border-b flex items-center justify-between shrink-0">
            <DrawerTitle className="text-sm font-semibold flex items-center gap-2">
              <Icon name="folder" size="xs" />
              {title}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                <Icon name="x" size="xs" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <FileTreeExplorer
              className="h-full w-full rounded-none border-0"
              tree={tree}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onDownload={onDownload}
              {...props}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }
)

FileTreeDrawer.displayName = "FileTreeDrawer"
