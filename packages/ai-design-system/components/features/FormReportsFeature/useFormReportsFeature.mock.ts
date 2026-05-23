import * as React from "react"

import type { FormReportsEntity, FormReportsValues } from "@/components/composites/FormReports"

import {
  formReportsColumns,
  formReportsEntityName,
  formReportsFields,
  formReportsItems,
  formReportsRowActions,
} from "./FormReportsFeature.mocks"
import type { UseFormReportsFeatureReturn } from "./useFormReportsFeature.d"

export function useFormReportsFeatureMock(): UseFormReportsFeatureReturn {
  const [items, setItems] = React.useState<FormReportsEntity[]>(formReportsItems)

  return {
    entityName: formReportsEntityName,
    fields: formReportsFields,
    columns: formReportsColumns,
    rowActions: formReportsRowActions,
    items,
    createButtonLabel: "Create",
    actionHandlers: {
      onSubmit: (values: FormReportsValues) => {
        setItems((prev) => {
          const nextId = prev.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1
          const nextItem: FormReportsEntity = {
            id: nextId,
            name: String(values.slug || `entity-${nextId}`),
            sectionType: String(values.type || "Custom"),
            status: values.enabled ? "Done" : "Not Started",
            target: 0,
            limit: 0,
            reviewer: "Assign reviewer",
          }
          return [nextItem, ...prev]
        })
      },
      table: {
        onDeleteRow: (row) => {
          setItems((prev) => prev.filter((item) => String(item.id) !== String(row.id)))
        },
      },
    },
  }
}
