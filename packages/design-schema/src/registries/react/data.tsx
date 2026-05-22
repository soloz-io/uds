"use client";

import React from "react";
import { defineRegistry } from "@json-render/react";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import {
  StatsCard,
  DataTable,
  InteractiveChart,
  type InteractiveChartProps,
} from "ai-design-system";

import { dataSchemas } from "../../schemas/data/index.js";

/**
 * Data registry — wires StatsCard, charts, and DataTable from ai-design-system.
 *
 * Chart wrappers (AreaChart, BarChart, LineChart) compose Recharts internals
 * internally so AI specs only need to provide { title, data, xKey, yKey }.
 */
const dataCatalog = defineCatalog(schema, {
  components: dataSchemas as Parameters<typeof defineCatalog>[1]["components"],
  actions: {},
});

export const { registry: dataRegistry } = defineRegistry(dataCatalog, {
  components: {
    StatsCard: ({ props }) => (
      <StatsCard
        title={props.title}
        value={props.value}
        trend={props.trend ?? undefined}
        footer={props.footer ?? undefined}
        className={props.className ?? undefined}
      />
    ),

    AreaChart: ({ props }) => {
      const chartData = Array.isArray(props.data) ? props.data : [];
      const config = {
        [props.yKey]: { label: props.yKey, color: props.color ?? "hsl(var(--chart-1))" },
      } satisfies InteractiveChartProps["config"];

      return (
        <InteractiveChart
          title={props.title ?? ""}
          description={props.description ?? undefined}
          data={chartData}
          config={config}
          className={undefined}
        >
          {/* Children (Recharts primitives) are composed by InteractiveChart internally */}
          {null}
        </InteractiveChart>
      );
    },

    BarChart: ({ props }) => {
      const chartData = Array.isArray(props.data) ? props.data : [];
      const config = {
        [props.yKey]: { label: props.yKey, color: props.color ?? "hsl(var(--chart-2))" },
      } satisfies InteractiveChartProps["config"];

      return (
        <InteractiveChart
          title={props.title ?? ""}
          description={props.description ?? undefined}
          data={chartData}
          config={config}
        >
          {null}
        </InteractiveChart>
      );
    },

    LineChart: ({ props }) => {
      const chartData = Array.isArray(props.data) ? props.data : [];
      const config = {
        [props.yKey]: { label: props.yKey, color: props.color ?? "hsl(var(--chart-3))" },
      } satisfies InteractiveChartProps["config"];

      return (
        <InteractiveChart
          title={props.title ?? ""}
          description={props.description ?? undefined}
          data={chartData}
          config={config}
        >
          {null}
        </InteractiveChart>
      );
    },

    DataTable: ({ props }) => {
      const rows = Array.isArray(props.data) ? props.data : [];
      const cols = props.columns.map((col) => ({
        accessorKey: col.key,
        header: col.label,
      }));

      return (
        <DataTable
          data={rows}
          columns={cols}
          enableRowSelection={props.enableRowSelection ?? false}
          enablePagination={props.enablePagination ?? true}
          enableFiltering={props.enableFiltering ?? false}
          searchColumn={props.searchColumn ?? undefined}
        />
      );
    },

    Metric: ({ props }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{props.label}</span>
        <span className="text-2xl font-semibold tabular-nums">{props.value}</span>
        {props.subtext ? (
          <span className="text-xs text-muted-foreground">{props.subtext}</span>
        ) : null}
      </div>
    ),
  },
});

export { dataCatalog };
