/**
 * Mock implementation of useAIDocEditor hook for Storybook
 * 
 * This mock provides realistic state management and simulated async operations
 * for visual testing and interactive demos in Storybook.
 */

import React, { useState, useCallback } from 'react'
import type { JSONContent } from '@tiptap/core'
import type { Annotation } from '@/types/ai-editor/annotations'
import type { FileTreeNode } from '@/components/composites/FileTreeExplorer'
import type { UseAIDocEditorReturn, UseAIMultiTabDocEditorReturn } from './useAIDocEditor'
import { sampleDocumentFiles, sampleMultiTabDocuments } from './AIDocEditor.mocks'

interface DocumentFile {
  id: string
  name: string
  isDirty: boolean
  format?: 'json' | 'markdown'
  lastModified: number
}

interface DocumentWithAnnotations {
  file: DocumentFile
  content: JSONContent | string
  annotations: Annotation[]
}

type MultiDocMockConfig = {
  multiDoc: true
  initialDocuments?: DocumentWithAnnotations[]
}

function useSingleDocEditorMockState(
  initialAnnotations: Annotation[]
): UseAIDocEditorReturn {
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations)
  const [loading, setLoading] = useState(false)

  const addAnnotation = useCallback(async (annotation: Annotation) => {
    console.log('[AIDocEditor Mock] Adding annotation:', annotation)
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    setAnnotations(prev => {
      const updated = [...prev, annotation]
      console.log('[AIDocEditor Mock] Annotations after add:', updated)
      return updated
    })
    setLoading(false)
  }, [])

  const updateAnnotation = useCallback(async (annotation: Annotation) => {
    console.log('[AIDocEditor Mock] Updating annotation:', annotation)
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    setAnnotations(prev => {
      const updated = prev.map(a => (a.id === annotation.id ? annotation : a))
      console.log('[AIDocEditor Mock] Annotations after update:', updated)
      return updated
    })
    setLoading(false)
  }, [])

  const deleteAnnotation = useCallback(async (annotationId: string) => {
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    setAnnotations(prev => prev.filter(a => a.id !== annotationId))
    setLoading(false)
  }, [])

  return {
    annotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    loading,
  }
}

function useMultiTabDocEditorMockState(
  initialDocuments: DocumentWithAnnotations[]
): UseAIMultiTabDocEditorReturn {
  const [documents, setDocuments] = useState(initialDocuments)
  const [activeDocumentId, setActiveDocumentId] = useState<string | undefined>(
    initialDocuments[0]?.file.id
  )
  const [loading, setLoading] = useState(false)

  const fileTree = React.useMemo(() => {
    const rootNodes: FileTreeNode[] = []
    sampleDocumentFiles.forEach((doc) => {
      const parts = doc.id.split('/')
      if (parts.length > 1) {
        const folderName = parts[0]
        let folderNode = rootNodes.find(n => n.name === folderName && n.type === 'folder')
        if (!folderNode) {
          folderNode = { name: folderName, path: folderName, type: 'folder', children: [] }
          rootNodes.push(folderNode)
        }
        folderNode.children!.push({
          name: doc.name,
          path: doc.id,
          type: 'file',
        })
      } else {
        rootNodes.push({
          name: doc.name,
          path: doc.id,
          type: 'file',
        })
      }
    })
    return rootNodes
  }, [])

  const addDocument = useCallback((file: DocumentFile, content: unknown) => {
    console.log('[Multi-Tab Mock] Adding document:', file.name)
    setDocuments(prev => [...prev, { file, content: content as JSONContent | string, annotations: [] }])
    setActiveDocumentId(file.id)
  }, [])

  const closeDocument = useCallback((documentId: string) => {
    console.log('[Multi-Tab Mock] Closing document:', documentId)
    setDocuments(prev => {
      const filtered = prev.filter(doc => doc.file.id !== documentId)
      if (activeDocumentId === documentId && filtered.length > 0) {
        setActiveDocumentId(filtered[0].file.id)
      }
      if (filtered.length === 0) {
        setActiveDocumentId(undefined)
      }
      return filtered
    })
  }, [activeDocumentId])

  const switchDocument = useCallback((documentId: string) => {
    console.log('[Multi-Tab Mock] Switching to document:', documentId)
    setDocuments(prev => {
      const exists = prev.some(doc => doc.file.id === documentId)
      if (!exists) {
        console.log('[Multi-Tab Mock] Re-opening closed document:', documentId)
        let mockDoc = sampleMultiTabDocuments.find(d => d.file.id === documentId) as unknown as DocumentWithAnnotations
        if (!mockDoc) {
          const file = sampleDocumentFiles.find(f => f.id === documentId)
          if (file) {
            mockDoc = { file, content: '# ' + file.name, annotations: [] } as unknown as DocumentWithAnnotations
          }
        }
        if (mockDoc) {
          return [...prev, mockDoc]
        }
      }
      return prev
    })
    setActiveDocumentId(documentId)
  }, [])

  const addAnnotation = useCallback(async (annotation: Annotation) => {
    if (!activeDocumentId) {
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setDocuments(prev =>
      prev.map(doc =>
        doc.file.id === activeDocumentId
          ? { ...doc, annotations: [...doc.annotations, annotation] }
          : doc
      )
    )
    setLoading(false)
  }, [activeDocumentId])

  const updateAnnotation = useCallback(async (annotation: Annotation) => {
    if (!activeDocumentId) {
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setDocuments(prev =>
      prev.map(doc =>
        doc.file.id === activeDocumentId
          ? {
            ...doc,
            annotations: doc.annotations.map(a =>
              a.id === annotation.id ? annotation : a
            ),
          }
          : doc
      )
    )
    setLoading(false)
  }, [activeDocumentId])

  const deleteAnnotation = useCallback(async (annotationId: string) => {
    if (!activeDocumentId) {
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setDocuments(prev =>
      prev.map(doc =>
        doc.file.id === activeDocumentId
          ? {
            ...doc,
            annotations: doc.annotations.filter(a => a.id !== annotationId),
          }
          : doc
      )
    )
    setLoading(false)
  }, [activeDocumentId])

  const setDocumentDirty = useCallback((documentId: string, isDirty: boolean) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.file.id === documentId
          ? { ...doc, file: { ...doc.file, isDirty } }
          : doc
      )
    )
  }, [])

  return {
    documents,
    activeDocumentId,
    addDocument,
    closeDocument,
    switchDocument,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    setDocumentDirty,
    loading,
    fileTree,
  }
}

/**
 * Mock hook for managing document annotations in Storybook
 * 
 * Simulates async operations with setTimeout to demonstrate loading states
 * and realistic user interactions.
 * 
 * @param initialAnnotations - Initial annotations to display
 * @returns Mock implementation of UseAIDocEditorReturn
 */
export function useAIDocEditorMock(
  initialAnnotations: Annotation[]
): UseAIDocEditorReturn
export function useAIDocEditorMock(config: MultiDocMockConfig): UseAIMultiTabDocEditorReturn
export function useAIDocEditorMock(
  initialAnnotationsOrConfig: Annotation[] | MultiDocMockConfig = []
): UseAIDocEditorReturn | UseAIMultiTabDocEditorReturn {
  const isMultiDoc = !Array.isArray(initialAnnotationsOrConfig) && initialAnnotationsOrConfig.multiDoc === true
  const singleInitialAnnotations = Array.isArray(initialAnnotationsOrConfig) ? initialAnnotationsOrConfig : []
  const multiInitialDocuments = !Array.isArray(initialAnnotationsOrConfig)
    ? (initialAnnotationsOrConfig.initialDocuments ?? [])
    : []

  const singleState = useSingleDocEditorMockState(singleInitialAnnotations)
  const multiState = useMultiTabDocEditorMockState(multiInitialDocuments)

  if (isMultiDoc) {
    return multiState
  }

  return singleState
}

/**
 * Mock hook for managing multi-tab documents in Storybook
 * 
 * Simulates multi-document state management with tab switching, closing, and annotation updates.
 * 
 * @param initialDocuments - Initial documents to display
 * @returns Mock implementation of UseAIMultiTabDocEditorReturn
 */
export function useAIMultiTabDocEditorMock(initialDocuments: unknown[] = []): UseAIMultiTabDocEditorReturn {
  return useMultiTabDocEditorMockState(initialDocuments as DocumentWithAnnotations[])
}
