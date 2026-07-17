# EvalDashboardFeature

EvalDashboardFeature provides a dashboard for reviewing evaluation results, system prompts, and output transcripts for agent sessions.

## Anatomy

The feature uses a split-pane layout:
- **Left Pane:** Inbox-style list of evaluated sessions (`InboxList`) and a trend graph section.
- **Right Pane:** Tabbed detail view (`Tabs`, `DataTable`) showing Golden Evals, System Prompts, and Outputs.

## State Management

The component expects a flat set of props that provide:
1. `inbox`: The state for the session list (items, selected item, loading state).
2. `data`: The detailed data for the currently selected session (golden evals, system prompt, output).
3. `actionHandlers`: Callback functions for actions like triggering evaluations.

## Example

```tsx
import { EvalDashboardFeature } from "@/components/features/EvalDashboardFeature"
import { useEvalDashboardFeatureMock } from "@/components/features/EvalDashboardFeature/useEvalDashboardFeature.mock"

export default function Page() {
  const state = useEvalDashboardFeatureMock()
  
  return (
    <div className="h-screen">
      <EvalDashboardFeature {...state} />
    </div>
  )
}
```
