/**
 * Hook contract for AIDocEditor feature
 * 
 * This interface defines the contract for managing document annotations.
 * Applications should implement this hook to provide real data management,
 * while Storybook uses mock implementations for visual testing.
 * 
 * @example
 * ```tsx
 * // Real implementation in application
 * export function useAIDocEditor(documentId: string): UseAIDocEditorReturn {
 *   const [annotations, setAnnotations] = useState<Annotation[]>([])
 *   const [loading, setLoading] = useState(false)
 * 
 *   const addAnnotation = async (annotation: Annotation) => {
 *     setLoading(true)
 *     await api.createAnnotation(documentId, annotation)
 *     setAnnotations(prev => [...prev, annotation])
 *     setLoading(false)
 *   }
 * 
 *   // ... other methods
 * 
 *   return { annotations, addAnnotation, updateAnnotation, deleteAnnotation, loading }
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Usage in component
 * const MyDocumentEditor = ({ documentId }) => {
 *   const { annotations, addAnnotation, updateAnnotation, loading } = useAIDocEditor(documentId)
 * 
 *   return (
 *     <AIDocEditor
 *       content={document}
 *       annotations={annotations}
 *       currentUser={user}
 *       mode="review"
 *       onAnnotationAdd={addAnnotation}
 *       onAnnotationUpdate={updateAnnotation}
 *     />
 *   )
 * }
 * ```
 */

import type { Annotation } from '@/types/ai-editor/annotations'
import type { DocumentFile, DocumentWithAnnotations } from '@/types/ai-editor/editor'
import type { FileTreeNode } from '@/components/composites/FileTreeExplorer'
import type { JSONContent } from '@tiptap/core'

/**
 * Return type for useAIDocEditor hook (single document)
 * @deprecated Use UseAIMultiTabDocEditorReturn for multi-tab support
 */
export interface UseAIDocEditorReturn {
  /**
   * Array of annotations for the document
   */
  annotations: Annotation[]

  /**
   * Add a new annotation to the document
   * @param annotation - The annotation to add
   */
  addAnnotation: (annotation: Annotation) => Promise<void> | void

  /**
   * Update an existing annotation (e.g., add reply, edit comment)
   * @param annotation - The updated annotation
   */
  updateAnnotation: (annotation: Annotation) => Promise<void> | void

  /**
   * Delete an annotation from the document
   * @param annotationId - ID of the annotation to delete
   */
  deleteAnnotation: (annotationId: string) => Promise<void> | void

  /**
   * Loading state for async operations
   */
  loading: boolean
}

/**
 * Return type for multi-tab document editor hook
 */
export interface UseAIMultiTabDocEditorReturn {
  /**
   * Array of open documents
   */
  documents: DocumentWithAnnotations[]

  /**
   * ID of currently active document
   */
  activeDocumentId?: string

  /**
   * Add a new document tab
   * @param file - Document metadata
   * @param content - Initial document content
   */
  addDocument: (file: DocumentFile, content: JSONContent | string) => void,

  /**
   * Close a document tab
   * @param documentId - ID of the document to close
   */
  closeDocument: (documentId: string) => void

  /**
   * Switch to a different document tab
   * @param documentId - ID of the document to switch to
   */
  switchDocument: (documentId: string) => void

  /**
    * Add annotation to the currently active document
   * @param annotation - The annotation to add
   */
    addAnnotation: (annotation: Annotation) => Promise<void> | void

  /**
    * Update annotation in the currently active document
   * @param annotation - The updated annotation
   */
    updateAnnotation: (annotation: Annotation) => Promise<void> | void

  /**
    * Delete annotation from the currently active document
   * @param annotationId - ID of the annotation to delete
   */
    deleteAnnotation: (annotationId: string) => Promise<void> | void

  /**
   * Mark document as dirty
   * @param documentId - ID of the document
   * @param isDirty - Whether document has unsaved changes
   */
  setDocumentDirty: (documentId: string, isDirty: boolean) => void

  /**
   * Loading state for async operations
   */
  loading: boolean

  /**
   * Full workspace file tree, independent of open tabs
   */
  fileTree?: FileTreeNode[]
}

/**
 * Hook for managing document annotations (single document, backward compatible)
 * 
 * @deprecated Use useAIMultiTabDocEditor for multi-tab support
 * Applications must implement this hook to provide real data management.
 * The hook should handle:
 * - Fetching annotations from API
 * - Creating new annotations
 * - Updating existing annotations
 * - Deleting annotations
 * - Managing loading states
 * 
 * @param documentId - ID of the document to manage annotations for
 * @returns Object containing annotations array and mutation methods
 */
export function useAIDocEditor(documentId: string): UseAIDocEditorReturn

/**
 * Hook for managing multi-tab documents with annotations
 * 
 * Applications must implement this hook to provide real data management.
 * The hook should handle:
 * - Managing multiple open documents
 * - Tracking active document
 * - Fetching/creating annotations per document
 * - Document dirty state tracking
 * - Adding/removing document tabs
 * 
 * @returns Object containing documents array, active document ID, and mutation methods
 */
export function useAIMultiTabDocEditor(): UseAIMultiTabDocEditorReturn
