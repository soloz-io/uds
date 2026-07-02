/**
 * AIDocEditor Feature Component
 * 
 * Complete document editor with inline comment annotations.
 * Supports both single-document and multi-tab modes.
 * 
 * Single-document mode (backward compatible):
 * ```tsx
 * <AIDocEditor
 *   content={document}
 *   annotations={annotations}
 *   currentUser={user}
 *   mode="review"
 *   onAnnotationAdd={(annotation) => saveAnnotation(annotation)}
 * />
 * ```
 * 
 * Multi-tab mode:
 * ```tsx
 * <AIDocEditor
 *   documents={[
 *     { file: { id: 'doc-1', name: 'File.md', isDirty: false, lastModified: now }, 
 *       content: '...',
 *       annotations: [] }
 *   ]}
 *   activeDocumentId="doc-1"
 *   currentUser={user}
 *   mode="review"
 *   onTabSelect={(id) => switchDocument(id)}
 *   onTabClose={(id) => closeDocument(id)}
 * />
 * ```
 */

import React, { useCallback, useMemo } from 'react'
import { DocumentEditorWithComments } from '@/components/blocks/DocumentEditorWithComments'
import { DocumentTabBar } from '@/components/composites/DocumentTabBar'
import { AdjustableLayout } from '@/components/composites/AdjustableLayout'
import { FileTreeExplorer } from '@/components/composites/FileTreeExplorer'
import type { FileTreeNode } from '@/components/composites/FileTreeExplorer'
import { cn } from '@/lib/utils'
import type { JSONContent } from '@tiptap/core'
import type { Annotation, User } from '@/types/ai-editor/annotations'
import { StreamingMarkdown } from '@/components/composites/StreamingMarkdown'

interface DocumentWithAnnotations {
  file: { id: string; name: string; isDirty?: boolean; format?: 'json' | 'markdown' | string; lastModified?: number }
  content: JSONContent | string
  annotations: Annotation[]
}

/**
 * Props for AIDocEditor feature component - Single document mode (backward compatible)
 */
export interface AIDocEditorSingleProps {
  /** 
   * Document content - can be either:
   * - JSONContent: Tiptap's JSON format (default)
   * - string: Markdown string (when format='markdown')
   */
  content: JSONContent | string
  /** 
   * Content format - determines how content prop is interpreted
   * - 'json': Content is Tiptap JSONContent (default)
   * - 'markdown': Content is a markdown string
   * 
   * @default 'json'
   */
  format?: 'json' | 'markdown'
  /** Array of annotations to display */
  annotations: Annotation[]
  /** ID of currently selected annotation */
  selectedAnnotationId?: string
  /** Multi-document array (not provided in single-doc mode) */
  documents?: never
  /** Active document ID (not provided in single-doc mode) */
  activeDocumentId?: never
  /** Tab selection callback (not provided in single-doc mode) */
  onTabSelect?: never
  /** Tab close callback (not provided in single-doc mode) */
  onTabClose?: never
}

/**
 * Props for AIDocEditor feature component - Multi-tab mode
 */
export interface AIDocEditorMultiTabProps {
  /** Array of open documents with their content and annotations */
  documents: DocumentWithAnnotations[]
  /** ID of currently active document */
  activeDocumentId?: string
  /** Content prop (not provided in multi-tab mode) */
  content?: never
  /** Format prop (not provided in multi-tab mode) */
  format?: never
  /** Annotations prop (not provided in multi-tab mode) */
  annotations?: never
  /** Selected annotation ID (not provided in multi-tab mode) */
  selectedAnnotationId?: never
  /** Callback when tab is selected */
  onTabSelect?: (documentId: string) => void
  /** Callback when tab close button is clicked */
  onTabClose?: (documentId: string) => void
  /** Optional completely separate file tree to show all available files in the explorer (even closed ones). If not provided, it falls back to showing only the currently open documents. */
  fileTree?: FileTreeNode[]
  /** When true, hides the document tab bar — useful for single-file mode where the file tree provides navigation. */
  hideTabBar?: boolean
}

/**
 * Props for AIDocEditor feature component
 */
export type AIDocEditorProps = (AIDocEditorSingleProps | AIDocEditorMultiTabProps) & {
  /** Current user information */
  currentUser: User
  /** Editor mode: 'review' allows commenting, 'readonly' disables interactions */
  mode: 'review' | 'readonly'
  /** Callback when document content is updated */
  onContentUpdate?: (content: JSONContent) => void
  /** Callback when annotation is clicked */
  onAnnotationClick?: (annotation: Annotation) => void
  /** Callback when annotation is hovered */
  onAnnotationHover?: (annotation: Annotation | null) => void
  /** Callback when text is selected */
  onTextSelect?: (range: { from: number; to: number }, selectedText: string) => void
  /** Callback when new annotation is added */
  onAnnotationAdd?: (annotation: Annotation) => void
  /** Callback when annotation is updated (e.g., reply added) */
  onAnnotationUpdate?: (annotation: Annotation) => void
  /** Callback when annotation is deleted */
  onAnnotationDelete?: (annotationId: string) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Determine if props are multi-tab mode
 */
function isMultiTabMode(props: AIDocEditorProps): props is AIDocEditorMultiTabProps & {
  currentUser: User
  mode: 'review' | 'readonly'
} {
  return 'documents' in props && props.documents !== undefined
}

function formatJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    return text
  }
}

/**
 * AIDocEditor - Document editor with inline comment annotations
 * 
 * This feature component provides a complete document review experience with:
 * - Single-document or multi-tab display modes
 * - Read-only document display with annotation highlights
 * - Inline comment box for viewing and adding comments
 * - Support for comments, suggestions, and block additions
 * - Controlled component pattern (all state managed by parent)
 * - Backward-compatible with single-document consumers
 * - Markdown content rendered via Streamdown for proper formatting
 * 
 * Note: The refinement panel (right sidebar with Accept All/Reject All) is a
 * separate component in the parent application, not part of this feature.
 */
export const AIDocEditor = React.memo<AIDocEditorProps>(
  (props) => {
    const {
      mode = 'review',
      currentUser,
      className,
      onAnnotationAdd,
      onAnnotationUpdate,
      onAnnotationClick,
    } = props

    const isMultiTab = isMultiTabMode(props)

    /**
     * Get current document for rendering
     */
    const currentDocument = useMemo(() => {
      if (isMultiTab && props.documents) {
        return (
          props.documents.find((doc) => doc.file.id === props.activeDocumentId) ||
          props.documents[0]
        )
      }
      return null
    }, [isMultiTab, props])

    /**
     * Handle annotation add - emit event to parent
     */
    const handleAnnotationAdd = useCallback(
      (annotation: Annotation) => {
        onAnnotationAdd?.(annotation)
      },
      [onAnnotationAdd]
    )

    /**
     * Handle annotation update - emit event to parent
     */
    const handleAnnotationUpdate = useCallback(
      (annotation: Annotation) => {
        onAnnotationUpdate?.(annotation)
      },
      [onAnnotationUpdate]
    )
    const fileTreeNodes = useMemo(() => {
      if (!isMultiTab) return []
      
      const multiProps = props as AIDocEditorMultiTabProps
      if (multiProps.fileTree) {
        return multiProps.fileTree
      }

      if (!multiProps.documents) return []
      const rootNodes: FileTreeNode[] = []

      multiProps.documents.forEach((doc) => {
        const parts = doc.file.id.split('/')
        if (parts.length === 1) {
          rootNodes.push({
            name: doc.file.name,
            path: doc.file.id,
            type: 'file',
          })
          return
        }

        let currentLevel = rootNodes
        for (let i = 0; i < parts.length - 1; i++) {
          const segment = parts[i]
          let folderNode = currentLevel.find(n => n.name === segment && n.type === 'folder')
          if (!folderNode) {
            folderNode = {
              name: segment,
              path: parts.slice(0, i + 1).join('/'),
              type: 'folder',
              children: [],
            }
            currentLevel.push(folderNode)
          }
          currentLevel = folderNode.children!
        }

        currentLevel.push({
          name: doc.file.name,
          path: doc.file.id,
          type: 'file',
        })
      })
      return rootNodes
    }, [isMultiTab, (props as AIDocEditorMultiTabProps).documents, (props as AIDocEditorMultiTabProps).fileTree])

    /**
     * Single-document mode
     */
    if (!isMultiTab) {
      const isMarkdown = props.format === 'markdown'
      const isJson = props.format === 'json'
      if (isMarkdown || isJson) {
        const content = isJson
          ? `\`\`\`json\n${formatJson(props.content as string)}\n\`\`\``
          : (props.content as string)
        return (
          <div className={cn('ai-doc-editor p-6 flex flex-col h-screen w-full flex-1', className)}>
            <StreamingMarkdown mode="streaming">
              {content}
            </StreamingMarkdown>
          </div>
        )
      }
      return (
        <div className={cn('ai-doc-editor flex flex-col h-screen w-full flex-1', className)}>
          <DocumentEditorWithComments
            content={props.content}
            format={props.format}
            annotations={props.annotations}
            selectedAnnotationId={props.selectedAnnotationId}
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
            readOnly={mode === 'readonly'}
            onAnnotationAdd={handleAnnotationAdd}
            onAnnotationUpdate={handleAnnotationUpdate}
            className={cn('ai-doc-editor p-6 h-full flex flex-col', className)}
          />
        </div>
      )
    }

    /**
     * Multi-tab mode
     */
    const { hideTabBar } = props as AIDocEditorMultiTabProps

    let editorPane: React.ReactNode

    if (!currentDocument) {
      editorPane = (
        <div className="ai-doc-editor flex flex-col h-full w-full">
          {!hideTabBar && (
            <DocumentTabBar
              className="w-full"
              tabs={props.documents?.map((doc) => doc.file) || []}
              activeTabId={props.activeDocumentId}
              onTabSelect={props.onTabSelect}
              onTabClose={props.onTabClose}
            />
          )}
          <div className="flex-1 flex items-center justify-center p-6 text-muted-foreground">
            No documents open
          </div>
        </div>
      )
    } else {
      const isMarkdownMulti = currentDocument.file.format === 'markdown'
      const isJsonMulti = currentDocument.file.format === 'json'
      const renderAsStreamdown = isMarkdownMulti || isJsonMulti

      editorPane = (
        <div className="ai-doc-editor flex flex-col h-full w-full">
          {!hideTabBar && (
            <DocumentTabBar
              className="w-full"
              tabs={props.documents?.map((doc) => doc.file) || []}
              activeTabId={props.activeDocumentId}
              onTabSelect={props.onTabSelect}
              onTabClose={props.onTabClose}
            />
          )}
          <div className="flex-1 overflow-auto">
            {renderAsStreamdown ? (
              <div className="p-6">
                <StreamingMarkdown
                  mode="streaming"
                  isAnimating
                  className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                >
                  {isJsonMulti
                    ? `\`\`\`json\n${formatJson(currentDocument.content as string)}\n\`\`\``
                    : (currentDocument.content as string)}
                </StreamingMarkdown>
              </div>
            ) : (
              <DocumentEditorWithComments
                content={currentDocument.content}
                format={currentDocument.file.format as 'json' | 'markdown' | undefined}
                annotations={currentDocument.annotations}
                selectedAnnotationId={props.selectedAnnotationId}
                currentUserId={currentUser.id}
                currentUserName={currentUser.name}
                readOnly={mode === 'readonly'}
                onAnnotationAdd={handleAnnotationAdd}
                onAnnotationUpdate={handleAnnotationUpdate}
                className="ai-doc-editor p-6 min-h-full"
              />
            )}
          </div>
        </div>
      )
    }

    return (
      <AdjustableLayout
        className={cn("flex-1 h-screen w-full bg-background", className)}
        orientation="horizontal"
        sections={[
          {
            id: 'explorer',
            defaultSize: 20,
            minSize: 15,
            maxSize: 30,
            className: 'border-r rounded-none border-y-0 border-l-0',
            content: (
              <FileTreeExplorer
                className="h-full w-full rounded-none border-0"
                headerClassName="border-b"
                tree={fileTreeNodes}
                selectedPath={props.activeDocumentId}
                onSelect={props.onTabSelect}
              />
            ),
          },
          {
            id: 'editor',
            defaultSize: 80,
            minSize: 50,
            className: 'rounded-none border-0',
            content: editorPane,
          },
        ]}
      />
    )
  }
)

AIDocEditor.displayName = 'AIDocEditor'
