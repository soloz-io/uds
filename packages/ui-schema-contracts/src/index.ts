import { z } from "zod"

export const DYNAMIC_TABLE_SCHEMA_VERSION = "2" as const
export const FORM_SCHEMA_VERSION = "1" as const

export const tableColumnOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  color: z.string().optional(),
  icon: z.string().optional(),
})

export const tableRenderTypeSchema = z.enum([
  "text",
  "badge",
  "status",
  "progress",
  "number",
  "currency",
  "percent",
  "date",
  "datetime",
  "boolean",
  "link",
  "avatar",
  "custom",
])

export const tableInputTypeSchema = z.enum([
  "none",
  "text",
  "number",
  "select",
  "boolean",
  "date",
  "textarea",
])

export const tableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  renderType: tableRenderTypeSchema.default("text"),
  inputType: tableInputTypeSchema.default("none"),
  editable: z.boolean().default(false),
  align: z.enum(["left", "center", "right"]).default("left"),
  width: z.number().optional(),
  placeholder: z.string().optional(),
  format: z.string().optional(),
  options: z.array(tableColumnOptionSchema).optional(),
  sortable: z.boolean().default(true),
  filterable: z.boolean().default(true),
  hideable: z.boolean().default(true),
  required: z.boolean().default(false),
  meta: z.record(z.string(), z.unknown()).optional(),
})

export const dynamicTableSchema = z.object({
  schemaVersion: z.literal(DYNAMIC_TABLE_SCHEMA_VERSION),
  rowKey: z.string().default("id"),
  columns: z.array(tableColumnSchema),
  emptyMessage: z.string().optional(),
  enableRowSelection: z.boolean().default(false),
  enablePagination: z.boolean().default(true),
  enableFiltering: z.boolean().default(true),
  defaultSearchColumn: z.string().optional(),
})

export const dynamicTablePayloadSchema = z.object({
  data: z.array(z.record(z.string(), z.unknown())),
  table: dynamicTableSchema,
})

export const formFieldTypeSchema = z.enum([
  "text",
  "number",
  "textarea",
  "select",
  "date",
  "boolean",
])

export const formFieldValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])

export const formFieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const formFieldDefinitionSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: formFieldTypeSchema,
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  defaultValue: formFieldValueSchema.optional(),
  options: z.array(formFieldOptionSchema).optional(),
})

export const formSchema = z.object({
  schemaVersion: z.literal(FORM_SCHEMA_VERSION),
  fields: z.array(formFieldDefinitionSchema),
})

export type TableColumnOption = z.infer<typeof tableColumnOptionSchema>
export type TableRenderType = z.infer<typeof tableRenderTypeSchema>
export type TableInputType = z.infer<typeof tableInputTypeSchema>
export type TableColumn = z.infer<typeof tableColumnSchema>
export type DynamicTableSchema = z.infer<typeof dynamicTableSchema>
export type DynamicTablePayload = z.infer<typeof dynamicTablePayloadSchema>
export type FormFieldType = z.infer<typeof formFieldTypeSchema>
export type FormFieldValue = z.infer<typeof formFieldValueSchema>
export type FormFieldOption = z.infer<typeof formFieldOptionSchema>
export type FormFieldDefinition = z.infer<typeof formFieldDefinitionSchema>
export type FormSchema = z.infer<typeof formSchema>
