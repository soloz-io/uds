# FormReportsFeature

FormReportsFeature is a content-only feature for creating dynamic entities via a right drawer form and listing created entities in a dashboard-style reports section.

## Capabilities

- Create action that opens a right-side drawer form (bottom drawer on mobile).
- Dynamic field rendering based on consumer-provided schema.
- Reports listing table with selection, column visibility, row actions, and pagination callbacks.
- Contract-first action handlers so consumers own business logic.

## Core Contracts

`useFormReportsFeature.d.ts` provides the public contract reference for consumers.

- `FormReportsFeatureActionHandlers`
- `UseFormReportsFeatureReturn`

## Usage Example

```tsx
<FormReportsFeature
  entityName="Feature Flag"
  fields={fields}
  columns={columns}
  items={items}
  rowActions={rowActions}
  actionHandlers={{
    onCreateClick: (source) => {},
    onDrawerOpenChange: (open) => {},
    onFieldChange: (name, value, values) => {},
    onFieldBlur: (name, value, values) => {},
    onSubmit: async (values) => {},
    onCancel: () => {},
    table: {
      onColumnsChange: (keys) => {},
      onRowAction: (action, row) => {},
      onRowSelectionChange: (ids, rows) => {},
      onPaginationChange: (pageIndex, pageSize) => {},
    },
  }}
/>
```
