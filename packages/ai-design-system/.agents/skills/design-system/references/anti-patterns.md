---
title: Anti-Patterns
description: Common mistakes to avoid when designing reusable layers in ai-design-system.
type: reference
summary: Anti-patterns that should be avoided when naming and shaping reusable components.
related:
	- ./layer-architecture.md
	- ./import-rules.md
warning: |
	MANDATORY RULES - NEVER COMPROMISE:
	These anti-patterns are strict governance rules.
	- Never create feature-aligned names in reusable layers
	- Never add local exceptions for one consuming feature
	- If a deviation seems required, escalate and get explicit approval first
---

## Anti-Patterns to Avoid

This document outlines common mistakes that reduce reuse and introduce feature coupling in ai-design-system.

---

### 1. Feature-Aligned Names in Reusable Layers

**Anti-Pattern**: Naming composites and blocks with feature-specific terminology.

**Incorrect**:
```tsx
// ❌ Composite name tied to a specific feature context
export function WorkflowObservabilityRunInboxList() {
	// ...
}

// ❌ Block name tied to a specific feature context
export function WorkflowObservabilityInboxPanel() {
	// ...
}
```

**Correct**:
```tsx
// ✅ Composite name is generic and reusable
export function InboxList() {
	// ...
}

// ✅ Block name is generic and reusable
export function InboxPanel() {
	// ...
}

// ✅ Feature name can be feature-aligned
export function WorkflowRunInboxFeature() {
	// ...
}
```

**Why**:
- Preserves reuse across multiple features.
- Prevents business-context leakage into reusable layers.
- Reduces refactor churn when use cases expand.

**Rule**:
Composites and blocks must use general names that any feature can consume. Only features may use feature-aligned names.
