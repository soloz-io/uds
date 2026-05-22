# DashboardFeature

Dashboard feature that mirrors the v4 dashboard composition and interaction surface:

- KPI cards row
- Interactive chart with time-range controls
- Enhanced table with drag/drop, selection, inline editing, reviewer assignment, view tabs, and row detail drawer

## Action Handler Contracts

Consumers can pass logic handlers through `actionHandlers` on `DashboardFeatureProps`.

```ts
import type {
	DashboardFeatureActionHandlers,
	DashboardTableActionHandlers,
} from "@/components/features/DashboardFeature"

const tableHandlers: DashboardTableActionHandlers = {
	onViewChange: (view) => {},
	onAddSection: () => {},
	onColumnsChange: (visibleColumnIds) => {},
	onRowReorder: (rows) => {},
	onRowUpdate: (rowId, key, value, row) => {},
	onInlineEditSave: (rowId, field, value, row) => {},
	onReviewerAssign: (rowId, reviewer, row) => {},
	onRowAction: (action, row) => {},
	onRowSelectionChange: (selectedRowIds, selectedRows) => {},
	onPaginationChange: (pageIndex, pageSize) => {},
	onPageSizeChange: (pageSize) => {},
	onPageChange: (pageIndex) => {},
}

const actionHandlers: DashboardFeatureActionHandlers = {
	onChartTimeRangeChange: (range) => {},
	table: tableHandlers,
}
```

## Files

- `DashboardFeature.tsx`: feature component composition
- `DashboardFeature.stories.tsx`: docs stories including `WithStateManagement`
- `DashboardFeature.behaviors.stories.tsx`: interaction behavior stories
- `DashboardFeature.mocks.ts`: mock data
- `useDashboardFeature.d.ts`: hook contract
- `useDashboardFeature.mock.ts`: mock hook implementation
- `index.ts`: public exports
