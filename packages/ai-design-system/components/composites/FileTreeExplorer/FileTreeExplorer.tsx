import * as React from "react"

import {
  FileTree,
  FileTreeFolder,
  FileTreeFile,
} from "@/components/ai-elements/file-tree"
import { Icon } from "@/components/primitives/Icon"
import { Input } from "@/components/primitives/Input"
import { cn } from "@/lib/utils"

export type FileTreeNode = {
  name: string
  path: string
  type: "file" | "folder"
  children?: FileTreeNode[]
}

export interface FileTreeExplorerProps {
  tree: FileTreeNode[]
  defaultExpanded?: Set<string>
  selectedPath?: string
  onSelect?: (path: string) => void
  searchPlaceholder?: string
  onCreateClick?: () => void
  createButtonLabel?: string
  headerClassName?: string
  className?: string
}

function renderTree(nodes: FileTreeNode[]): React.ReactNode {
  return nodes.map((node) => {
    if (node.type === "folder") {
      return (
        <FileTreeFolder key={node.path} name={node.name} path={node.path}>
          {node.children ? renderTree(node.children) : null}
        </FileTreeFolder>
      )
    }
    return <FileTreeFile key={node.path} name={node.name} path={node.path} />
  })
}

function filterTree(nodes: FileTreeNode[], query: string): FileTreeNode[] {
  if (!query) return nodes;
  const lowerQuery = query.toLowerCase();

  return nodes.reduce<FileTreeNode[]>((acc, node) => {
    if (node.type === 'file') {
      if (node.name.toLowerCase().includes(lowerQuery)) {
        acc.push(node);
      }
    } else if (node.type === 'folder' && node.children) {
      const filteredChildren = filterTree(node.children, query);
      // Keep the folder if it matches the query itself, or if any of its children match
      if (node.name.toLowerCase().includes(lowerQuery) || filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }
    }
    return acc;
  }, []);
}

function getAllFolderPaths(nodes: FileTreeNode[]): Set<string> {
  const paths = new Set<string>();
  function traverse(n: FileTreeNode[]) {
    for (const node of n) {
      if (node.type === 'folder') {
        paths.add(node.path);
        if (node.children) traverse(node.children);
      }
    }
  }
  traverse(nodes);
  return paths;
}

export const FileTreeExplorer = React.memo<FileTreeExplorerProps>(
  ({
    tree,
    defaultExpanded,
    selectedPath,
    onSelect,
    searchPlaceholder = "Filter files...",
    onCreateClick,
    createButtonLabel,
    headerClassName,
    className,
  }) => {
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredTree = React.useMemo(() => {
      return filterTree(tree, searchQuery)
    }, [tree, searchQuery])

    const expandedPaths = React.useMemo(() => {
      if (searchQuery) {
        return getAllFolderPaths(filteredTree)
      }
      return defaultExpanded
    }, [searchQuery, filteredTree, defaultExpanded])

    return (
      <div className={cn("flex flex-col rounded-lg border bg-background", className)}>
        <div className={cn("flex items-center gap-2 border-b px-3 py-2", headerClassName)}>
          <div className="relative flex-1">
            <Icon
              name="search"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          {onCreateClick ? (
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Icon name="plus" size="sm" />
              {createButtonLabel ?? "New"}
            </button>
          ) : null}
        </div>
        <div className="p-2">
          <FileTree
            className="border-none bg-transparent"
            defaultExpanded={expandedPaths}
            selectedPath={selectedPath}
            onSelect={onSelect}
          >
            {renderTree(filteredTree)}
          </FileTree>
        </div>
      </div>
    )
  }
)

FileTreeExplorer.displayName = "FileTreeExplorer"
