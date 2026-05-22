/**
 * AIDocEditor Feature Component
 * 
 * Complete document editor with inline comment annotations
 * Supports both single-document and multi-tab modes
 */

export { AIDocEditor } from './AIDocEditor'
export type {
  AIDocEditorProps,
  AIDocEditorSingleProps,
  AIDocEditorMultiTabProps,
} from './AIDocEditor'

export { useAIDocEditorMock, useAIMultiTabDocEditorMock } from './useAIDocEditor.mock'
export type { UseAIDocEditorReturn, UseAIMultiTabDocEditorReturn } from './useAIDocEditor'

export {
  sampleContent,
  currentUser,
  sampleAnnotations,
  sampleDocumentFiles,
  sampleMultiTabDocuments,
} from './AIDocEditor.mocks'
