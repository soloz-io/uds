/**
 * TextEditor Feature Component
 * 
 * Complete document editor with inline comment annotations
 * Supports both single-document and multi-tab modes
 */

export { TextEditor } from './TextEditor'
export type {
  TextEditorProps,
  TextEditorSingleProps,
  TextEditorMultiTabProps,
} from './TextEditor'

export { useTextEditorMock, useAIMultiTabDocEditorMock } from './useTextEditor.mock'
export type { UseTextEditorReturn, UseAIMultiTabDocEditorReturn } from './useTextEditor'

export {
  sampleContent,
  currentUser,
  sampleAnnotations,
  sampleDocumentFiles,
  sampleMultiTabDocuments,
} from './TextEditor.mocks'

export { MediaPreview, isMediaFile, isVideoFile, isAudioFile, isImageFile, isPdfFile } from '@/components/composites/MediaPreview'
export type { MediaPreviewProps } from '@/components/composites/MediaPreview'
