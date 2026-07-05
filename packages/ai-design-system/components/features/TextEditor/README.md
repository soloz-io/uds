# AIDocEditor Feature

Document editor with inline comment annotations for AI-powered document review workflows.

Supports both single-document and multi-tab modes for flexible document management.

## Architecture

- **Component Layer**: Pure UI component (`AIDocEditor.tsx`) with mode detection
- **Hook Contract**: Interface definitions (`useAIDocEditor.d.ts`) for single and multi-tab modes
- **Composite Layer**: `DocumentTabBar` composite for tab rendering
- **Mock Implementation**: Storybook testing (`useAIDocEditor.mock.ts`)
- **Application Layer**: Real implementation (in your app)

## Usage

### Single-Document Mode (Backward Compatible)

#### In Your Application

```tsx
// app/hooks/useAIDocEditor.ts
import type { UseAIDocEditorReturn } from 'ui-lib/components/features/AIDocEditor';

export function useAIDocEditor(documentId: string): UseAIDocEditorReturn {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(false);

  const addAnnotation = async (annotation: Annotation) => {
    setLoading(true);
    await api.createAnnotation(documentId, annotation);
    setAnnotations(prev => [...prev, annotation]);
    setLoading(false);
  };

  return { annotations, addAnnotation, updateAnnotation, deleteAnnotation, loading };
}
```

```tsx
// app/components/DocEditorContainer.tsx
import { AIDocEditor } from 'ui-lib/components/features/AIDocEditor';
import { useAIDocEditor } from '../hooks/useAIDocEditor';

export function DocEditorContainer({ documentId, content, currentUser }) {
  const { annotations, addAnnotation, updateAnnotation } = useAIDocEditor(documentId);

  return (
    <AIDocEditor
      content={content}
      annotations={annotations}
      currentUser={currentUser}
      mode="review"
      onAnnotationAdd={addAnnotation}
      onAnnotationUpdate={updateAnnotation}
    />
  );
}
```

### Multi-Tab Mode

#### In Your Application

```tsx
// app/hooks/useMultiTabDocEditor.ts
import type { UseAIMultiTabDocEditorReturn, DocumentWithAnnotations } from 'ui-lib/components/features/AIDocEditor';

export function useAIMultiTabDocEditor(): UseAIMultiTabDocEditorReturn {
  const [documents, setDocuments] = useState<DocumentWithAnnotations[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string>();
  const [loading, setLoading] = useState(false);

  const switchDocument = (documentId: string) => {
    setActiveDocumentId(documentId);
  };

  const closeDocument = (documentId: string) => {
    setDocuments(prev => {
      const filtered = prev.filter(doc => doc.file.id !== documentId);
      if (activeDocumentId === documentId && filtered.length > 0) {
        setActiveDocumentId(filtered[0].file.id);
      }
      return filtered;
    });
  };

  const addAnnotation = async (documentId: string, annotation: Annotation) => {
    setLoading(true);
    await api.createAnnotation(documentId, annotation);
    setDocuments(prev =>
      prev.map(doc =>
        doc.file.id === documentId
          ? { ...doc, annotations: [...doc.annotations, annotation] }
          : doc
      )
    );
    setLoading(false);
  };

  // ... other methods

  return {
    documents,
    activeDocumentId,
    switchDocument,
    closeDocument,
    addAnnotation,
    // ... other methods
  };
}
```

```tsx
// app/components/MultiDocEditorContainer.tsx
import { AIDocEditor } from 'ui-lib/components/features/AIDocEditor';
import { useAIMultiTabDocEditor } from '../hooks/useMultiTabDocEditor';

export function MultiDocEditorContainer({ currentUser }) {
  const { documents, activeDocumentId, switchDocument, closeDocument } = useAIMultiTabDocEditor();

  return (
    <AIDocEditor
      documents={documents}
      activeDocumentId={activeDocumentId}
      currentUser={currentUser}
      mode="review"
      onTabSelect={switchDocument}
      onTabClose={closeDocument}
    />
  );
}
```

### In Storybook (use mock hook)

#### Single-Document Mode

```tsx
import { AIDocEditor, useAIDocEditorMock, sampleAnnotations } from 'ui-lib/components/features/AIDocEditor';

export const Default = () => {
  const { annotations, addAnnotation, updateAnnotation } = useAIDocEditorMock(sampleAnnotations);

  return (
    <AIDocEditor
      content={mockContent}
      annotations={annotations}
      currentUser={mockUser}
      mode="review"
      onAnnotationAdd={addAnnotation}
      onAnnotationUpdate={updateAnnotation}
    />
  );
};
```

#### Multi-Tab Mode

```tsx
import { 
  AIDocEditor, 
  useAIMultiTabDocEditorMock, 
  sampleMultiTabDocuments 
} from 'ui-lib/components/features/AIDocEditor';

export const MultiTab = () => {
  const [documents, activeDocumentId, , , switchDocument, closeDocument] = Object.values(
    useAIMultiTabDocEditorMock(sampleMultiTabDocuments)
  );

  return (
    <AIDocEditor
      documents={documents}
      activeDocumentId={activeDocumentId}
      currentUser={mockUser}
      mode="review"
      onTabSelect={switchDocument}
      onTabClose={closeDocument}
    />
  );
};
```

## Hook Contracts

### `UseAIDocEditorReturn` (Single-Document, Deprecated)

```typescript
interface UseAIDocEditorReturn {
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => Promise<void> | void;
  updateAnnotation: (annotation: Annotation) => Promise<void> | void;
  deleteAnnotation: (annotationId: string) => Promise<void> | void;
  loading: boolean;
}
```

### `UseAIMultiTabDocEditorReturn` (Multi-Tab, Recommended)

```typescript
interface UseAIMultiTabDocEditorReturn {
  documents: DocumentWithAnnotations[];
  activeDocumentId?: string;
  addDocument: (file: DocumentFile, content: string | JSONContent) => void;
  closeDocument: (documentId: string) => void;
  switchDocument: (documentId: string) => void;
  addAnnotation: (documentId: string, annotation: Annotation) => Promise<void> | void;
  updateAnnotation: (documentId: string, annotation: Annotation) => Promise<void> | void;
  deleteAnnotation: (documentId: string, annotationId: string) => Promise<void> | void;
  setDocumentDirty: (documentId: string, isDirty: boolean) => void;
  loading: boolean;
}
```

## Component Props

### `AIDocEditorSingleProps` (Single-Document Mode)

```typescript
interface AIDocEditorSingleProps {
  content: JSONContent | string;
  format?: 'json' | 'markdown';
  annotations: Annotation[];
  selectedAnnotationId?: string;
  currentUser: User;
  mode: 'review' | 'readonly';
  // ... event callbacks (onAnnotationAdd, etc.)
}
```

### `AIDocEditorMultiTabProps` (Multi-Tab Mode)

```typescript
interface AIDocEditorMultiTabProps {
  documents: DocumentWithAnnotations[];
  activeDocumentId?: string;
  currentUser: User;
  mode: 'review' | 'readonly';
  onTabSelect?: (documentId: string) => void;
  onTabClose?: (documentId: string) => void;
  // ... other event callbacks
}
```

### Shared Props (Both Modes)

```typescript
onContentUpdate?: (content: JSONContent) => void;
onAnnotationClick?: (annotation: Annotation) => void;
onAnnotationHover?: (annotation: Annotation | null) => void;
onTextSelect?: (range: { from: number; to: number }, selectedText: string) => void;
onAnnotationAdd?: (annotation: Annotation) => void;
onAnnotationUpdate?: (annotation: Annotation) => void;
onAnnotationDelete?: (annotationId: string) => void;
className?: string;
```

## Files

- `AIDocEditor.tsx` - Main component implementation with mode detection
- `AIDocEditor.stories.tsx` - Storybook stories for both single-doc and multi-tab modes
- `AIDocEditor.behaviors.stories.tsx` - Behavior-driven stories including tab interactions
- `AIDocEditor.mocks.ts` - Shared mock data for both modes
- `useAIDocEditor.d.ts` - Hook contract definitions
- `useAIDocEditor.mock.ts` - Mock implementations for both single and multi-tab modes
- `index.ts` - Public exports
- `README.md` - This file

## Composites Used

- `DocumentTabBar` - VS Code-style tab bar for multi-document display
  - Displays open documents as tabs with dirty indicators
  - Handles tab selection and closing
  - Horizontally scrollable when many tabs are open

## References

See `.kiro/skills/storybook-guidelines/references/feature-mock-and-hook-pattern.md`
