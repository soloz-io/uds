# WorkflowObservabilityFeature

WorkflowObservabilityFeature renders the run observability detail experience.

## Implementation Status

Last updated: 2026-05-25

### Overall

- Status: mostly implemented for design-system demo parity.
- Scope covered: run trace visualization, details inspection, and action surfaces for run and sleep flows.
- Scope still pending for full archived behavioral parity: hook-specific interactive flow and context-menu actions.

### Feature Coverage Matrix

- Trace / Events / Streams tabs: implemented.
- Search spans input wiring: implemented.
- Span selection and details panel rendering: implemented.
- Dynamic details chips (resource + state): implemented.
- Run details payload blocks (Arguments/Input/Output): implemented.
- Header overflow dropdown actions (run-scoped menu actions): implemented.
- Details panel actions filtered by selected resource: implemented.
- WithStateManagement story + mock hook flow: implemented.
- Sleep behavior story assertions: implemented.
- Full archived hook action parity (for example Resolve Hook flow): pending.
- Context menu actions on timeline rows (right-click menu behavior): pending.

## Purpose

- Provides a run detail experience with Trace, Events, and Streams tabs.
- Keeps consumer logic in hook contracts while shipping reusable feature UI OOB.

## Composition

- `WorkflowRunObservabilityPanel` composite for run details.

## Current Action Model

- Run-level actions:
- Details panel: Replay Run, Cancel.
- Header menu: Re-enqueue, Cancel Active Sleeps.
- Sleep-level actions:
- Details panel: Wake Up Sleep (enabled when selected sleep span is live).
- Action placement control:
- `surface: "details" | "menu" | "both"`.
- Resource targeting:
- `resourceTypes: ["run" | "step" | "hook" | "sleep"]`.

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
  runActions={[
    {
      id: "replay-run",
      label: "Replay Run",
      onClick: onReplayRun,
      resourceTypes: ["run"],
      surface: "details",
      tone: "neutral",
    },
    {
      id: "reenqueue-run",
      label: "Re-enqueue",
      onClick: onReenqueue,
      resourceTypes: ["run"],
      surface: "menu",
      tone: "neutral",
    },
    {
      id: "cancel-active-sleeps",
      label: "Cancel Active Sleeps",
      onClick: onCancelActiveSleeps,
      resourceTypes: ["run"],
      surface: "menu",
      tone: "amber",
    },
    {
      id: "wake-up-sleep",
      label: "Wake Up Sleep",
      onClick: onWakeUpSleep,
      resourceTypes: ["sleep"],
      surface: "details",
      tone: "amber",
    },
    {
      id: "cancel-run",
      label: "Cancel",
      onClick: onCancelRun,
      resourceTypes: ["run"],
      surface: "details",
      tone: "danger",
    },
  ]}
/>
```

## README Update Checklist

When changing this feature, update this README in the same PR:

- Update Last updated date.
- Update Feature Coverage Matrix items that changed.
- Update Current Action Model if labels, surfaces, or resource targeting changed.
- Update Usage example if action contracts changed.
