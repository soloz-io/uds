import { z } from "zod";

/**
 * Data visualisation schemas.
 * Covers StatsCard, chart types, and DataTable from ai-design-system.
 *
 * Backend-safe: no React imports.
 */

export const dataSchemas = {
  // ---- Stat Cards ----
  StatsCard: {
    props: z.object({
      title: z.string().describe("Metric name, e.g. 'Total Revenue'"),
      value: z.string().describe("Formatted display value, e.g. '$12,450'"),
      trend: z
        .object({
          direction: z.enum(["up", "down"]),
          value: z.string().describe("Percentage or absolute, e.g. '+12%'"),
        })
        .nullable(),
      footer: z
        .object({
          message: z.string().describe("Primary footer message"),
          description: z.string().describe("Secondary footer description"),
        })
        .nullable(),
      className: z.string().nullable(),
    }),
    description:
      "Key metric card with trend indicator. Use for KPIs in a Grid layout. value is always a pre-formatted string.",
    example: {
      title: "Total Revenue",
      value: "$12,450",
      trend: { direction: "up", value: "+12%" },
      footer: { message: "Trending up this month", description: "Visitors over the last 6 months" },
    },
  },

  // ---- Charts ----
  AreaChart: {
    props: z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      data: z
        .array(z.record(z.string(), z.unknown()))
        .describe("Use { $state: '/path' } to bind to live data"),
      xKey: z.string().describe("Field name for the x-axis (usually a date/time field)"),
      yKey: z.string().describe("Field name for the numeric y-axis value"),
      color: z.string().nullable().describe("Hex or CSS color for the area"),
      height: z.number().nullable(),
    }),
    description:
      "Area chart for time-series data. xKey should be a date field; values are auto-formatted. Ideal for revenue or usage trends.",
    example: {
      title: "Revenue Over Time",
      data: { $state: "/analytics/revenue" },
      xKey: "date",
      yKey: "amount",
    },
  },

  BarChart: {
    props: z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      data: z
        .array(z.record(z.string(), z.unknown()))
        .describe("Use { $state: '/path' } to bind to live data"),
      xKey: z.string().describe("Category/group field for the x-axis"),
      yKey: z.string().describe("Numeric field for bar height"),
      aggregate: z
        .enum(["sum", "count", "avg"])
        .nullable()
        .describe("Use 'count' to count items grouped by xKey"),
      color: z.string().nullable(),
      height: z.number().nullable(),
    }),
    description:
      "Bar chart for categorical comparisons. Use aggregate='count' to count items per group. xKey is the category, yKey is the value.",
    example: {
      title: "Orders by Status",
      data: { $state: "/orders/data" },
      xKey: "status",
      yKey: "count",
      aggregate: "count",
    },
  },

  LineChart: {
    props: z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      data: z
        .array(z.record(z.string(), z.unknown()))
        .describe("Use { $state: '/path' } to bind to live data"),
      xKey: z.string().describe("x-axis field (usually time)"),
      yKey: z.string().describe("Numeric y-axis field"),
      aggregate: z.enum(["sum", "count", "avg"]).nullable(),
      color: z.string().nullable(),
      height: z.number().nullable(),
    }),
    description:
      "Line chart for trend data. Similar to AreaChart but without fill. Good for comparing multiple series.",
    example: {
      title: "Active Users",
      data: { $state: "/analytics/users" },
      xKey: "date",
      yKey: "count",
    },
  },

  // ---- Table ----
  DataTable: {
    props: z.object({
      data: z
        .array(z.record(z.string(), z.unknown()))
        .describe("Use { $state: '/path' } to bind to live data"),
      columns: z.array(
        z.object({
          key: z.string().describe("Object field name"),
          label: z.string().describe("Column header label"),
        })
      ),
      enableRowSelection: z.boolean().nullable(),
      enablePagination: z.boolean().nullable(),
      enableFiltering: z.boolean().nullable(),
      searchColumn: z.string().nullable().describe("Which column to filter by (requires enableFiltering)"),
      emptyMessage: z.string().nullable(),
    }),
    description:
      "Feature-rich data table with optional search, pagination, and row selection. data should use { $state } for live data binding.",
    example: {
      data: { $state: "/customers/data" },
      columns: [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status" },
      ],
      enablePagination: true,
      enableFiltering: true,
      searchColumn: "name",
    },
  },

  // ---- Single Metric ----
  Metric: {
    props: z.object({
      label: z.string(),
      value: z.string(),
      subtext: z.string().nullable(),
    }),
    description:
      "Compact single-value metric display. Lighter than StatsCard — no trend/footer. Use inside a Grid for multiple inline metrics.",
    example: { label: "Active Users", value: "1,284", subtext: "Last 30 days" },
  },
} as const;

export type DataComponentName = keyof typeof dataSchemas;
