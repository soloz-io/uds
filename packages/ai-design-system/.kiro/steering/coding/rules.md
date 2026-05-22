---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description that will apply across all your workspaces.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
------------------------------------------------------------------------------------->

- Dont create summary post implementation or updates.
- Refer to the skills on-demand to understand and clarify on the the existing project patterns and standards.
- Keep your reporting short and concise post implementations.
- Always provide references to source file paths and do not write logics in conversations.
- You are not allowed to create scripts for validation or testing purposes. Only manual testing in actula cluster or environment is permitted.
- You should never craete UI components in apps. Everything UI component should be from ai design system npm package  only. Only pages are built in builder.
- **NO custom UI in waypoint-builder**: All UI components come from `ai-design-system` only. Never build Button, Card, Dialog, Form, Input, Table, or any other UI primitive from scratch in `waypoint-builder/frontend/src/`. If a component doesn't exist in the design system, build it in `ai-design-system` first, publish, then import.
- **Consume via published package, not direct file import**: All consumers must use the published `ai-design-system` npm package. Do NOT import individual component files directly from the `ai-design-system` source (e.g., not `@ai-design-system/components/Button`). Only import from the top-level feature exports (e.g., `WorkflowBuilder`, `PageLayout`, `AIConversation`).