# WorkflowObservabilityFeature

WorkflowObservabilityFeature renders the run observability detail experience.

## Purpose

- Provides a run detail experience with Trace, Events, and Streams tabs.
- Keeps consumer logic in hook contracts while shipping reusable feature UI OOB.

## Composition

- `WorkflowRunObservabilityPanel` composite for run details.

## Usage

```tsx
<WorkflowObservabilityFeature
  selectedRun={selectedRun}
  spans={spans}
  events={events}
  streams={streams}
  selectedSpanId={selectedSpanId}
  searchQuery={searchQuery}
  onSearchQueryChange={setSearchQuery}
  onSelectSpan={setSelectedSpanId}
  runActions={[{ id: "wake-up", label: "Wake Up Sleep", onClick: onWakeUp }]}
/>
```
