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

export interface FileDownloadResult {
  blob: Blob
  filename: string
}

export interface FileTreeExplorerProps {
  tree: FileTreeNode[]
  defaultExpanded?: Set<string>
  selectedPath?: string
  onSelect?: (path: string) => void
  searchPlaceholder?: string
  onCreateClick?: () => void
  createButtonLabel?: string
  onDownload?: () => Promise<FileDownloadResult | undefined>
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
    onDownload,
    headerClassName,
    className,
  }) => {
    const downloadRef = React.useRef<HTMLAnchorElement>(null)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [userExpanded, setUserExpanded] = React.useState<Set<string>>(defaultExpanded || new Set())

    const handleDownloadClick = React.useCallback(async () => {
      if (!onDownload) return
      const result = await onDownload()
      if (!result) return
      const url = URL.createObjectURL(result.blob)
      const anchor = downloadRef.current
      if (anchor) {
        anchor.href = url
        anchor.download = result.filename
        anchor.click()
      }
      URL.revokeObjectURL(url)
    }, [onDownload])

    // Auto-expand parents when selectedPath changes
    React.useEffect(() => {
      if (selectedPath) {
        const parts = selectedPath.split('/')
        if (parts.length > 1) {
          setUserExpanded(prev => {
            const next = new Set(prev)
            let currentPath = ''
            for (let i = 0; i < parts.length - 1; i++) {
              currentPath += (i === 0 ? '' : '/') + parts[i]
              next.add(currentPath)
            }
            return next
          })
        }
      }
    }, [selectedPath])

    const filteredTree = React.useMemo(() => {
      return filterTree(tree, searchQuery)
    }, [tree, searchQuery])

    const activeExpanded = React.useMemo(() => {
      if (searchQuery) {
        return getAllFolderPaths(filteredTree)
      }
      return userExpanded
    }, [searchQuery, filteredTree, userExpanded])

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
          {onDownload ? (
            <button
              type="button"
              onClick={handleDownloadClick}
              title="Download all files"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon name="download" size="sm" />
            </button>
          ) : null}
          <a ref={downloadRef} style={{ display: 'none' }} />
        </div>
        <div className="p-2">
          <FileTree
            className="border-none bg-transparent"
            expanded={activeExpanded}
            onExpandedChange={setUserExpanded}
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
