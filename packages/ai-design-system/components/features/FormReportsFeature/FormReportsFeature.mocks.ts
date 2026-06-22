import type {
  FormReportsColumn,
  FormReportsEntity,
  FormReportsFieldDefinition,
  FormReportsRowAction,
} from "@/components/composites/FormReports"
import {
  DYNAMIC_TABLE_SCHEMA_VERSION,
  FORM_SCHEMA_VERSION,
  dynamicTableSchema,
  type DynamicTableSchema,
} from "ui-schema-contracts"

const formSchema = {
  parse<T>(input: T): T { return input },
}

export const formReportsEntityName = "Feature Flag"

const formReportsFormSchemaInput = {
  schemaVersion: FORM_SCHEMA_VERSION,
  fields: [
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "my-flag", description: "Unique identifier for this entity." },
    { name: "project", label: "Project", type: "select", placeholder: "Select project", options: [{ label: "Website", value: "website" }, { label: "Dashboard", value: "dashboard" }, { label: "Mobile App", value: "mobile" }] },
    { name: "description", label: "Description", type: "textarea", placeholder: "Describe what this entity controls..." },
    { name: "type", label: "Type", type: "select", defaultValue: "boolean", options: [{ label: "Boolean", value: "boolean" }, { label: "String", value: "string" }, { label: "Number", value: "number" }, { label: "JSON", value: "json" }] },
    { name: "enabled", label: "Enabled", type: "boolean", defaultValue: true, placeholder: "Enable immediately" },
  ],
}

export const formReportsFields: FormReportsFieldDefinition[] = formSchema.parse(formReportsFormSchemaInput).fields as unknown as FormReportsFieldDefinition[]

const formReportsTableSchemaInput = {
  schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
  rowKey: "id",
  columns: [
    {
      key: "name",
      label: "Header",
      align: "left",
      renderType: "text",
      inputType: "text",
      editable: true,
      sortable: true,
      filterable: true,
      hideable: false,
      required: false,
    },
    {
      key: "sectionType",
      label: "Section Type",
      align: "left",
      renderType: "badge",
      inputType: "none",
      editable: false,
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
    {
      key: "status",
      label: "Status",
      align: "left",
      renderType: "status",
      inputType: "select",
      editable: true,
      options: [
        { label: "Not Started", value: "Not Started" },
        { label: "In Process", value: "In Process" },
        { label: "Done", value: "Done" },
      ],
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
    {
      key: "target",
      label: "Target",
      align: "right",
      renderType: "text",
      inputType: "number",
      editable: true,
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
    {
      key: "limit",
      label: "Limit",
      align: "right",
      renderType: "text",
      inputType: "number",
      editable: true,
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
    {
      key: "reviewer",
      label: "Reviewer",
      align: "left",
      renderType: "text",
      inputType: "select",
      editable: true,
      options: [
        { label: "Eddie Lake", value: "Eddie Lake" },
        { label: "Jamik Tashpulatov", value: "Jamik Tashpulatov" },
        { label: "Emily Whalen", value: "Emily Whalen" },
        { label: "Assign reviewer", value: "Assign reviewer" },
      ],
      sortable: true,
      filterable: true,
      hideable: true,
      required: false,
    },
  ],
  enableFiltering: true,
  enablePagination: true,
  enableRowSelection: true,
} satisfies DynamicTableSchema

export const formReportsColumns: FormReportsColumn[] = dynamicTableSchema.parse(formReportsTableSchemaInput).columns

export const formReportsRowActions: FormReportsRowAction[] = [
  { key: "edit", label: "Edit" },
  { key: "duplicate", label: "Make a copy" },
  { key: "favorite", label: "Favorite" },
  { key: "delete", label: "Delete" },
]

export const formReportsItems: FormReportsEntity[] = [
  { id: 1, name: "Cover page", sectionType: "Cover page", status: "In Process", target: 18, limit: 5, reviewer: "Eddie Lake" },
  { id: 2, name: "Table of contents", sectionType: "Table of contents", status: "Done", target: 29, limit: 24, reviewer: "Eddie Lake" },
  { id: 3, name: "Executive summary", sectionType: "Narrative", status: "Done", target: 10, limit: 13, reviewer: "Eddie Lake" },
  { id: 4, name: "Technical approach", sectionType: "Narrative", status: "Done", target: 27, limit: 23, reviewer: "Jamik Tashpulatov" },
  { id: 5, name: "Design", sectionType: "Narrative", status: "In Process", target: 2, limit: 16, reviewer: "Jamik Tashpulatov" },
  { id: 6, name: "Capabilities", sectionType: "Narrative", status: "In Process", target: 20, limit: 8, reviewer: "Jamik Tashpulatov" },
  { id: 7, name: "Integration with existing systems", sectionType: "Narrative", status: "In Process", target: 19, limit: 21, reviewer: "Assign reviewer" },
  { id: 8, name: "Innovation and Advantages", sectionType: "Narrative", status: "Done", target: 25, limit: 26, reviewer: "Assign reviewer" },
  { id: 9, name: "Overview of EMR's Innovative Solutions", sectionType: "Technical content", status: "Done", target: 7, limit: 23, reviewer: "Assign reviewer" },
  { id: 10, name: "Advanced Algorithms and Machine Learning", sectionType: "Narrative", status: "Done", target: 30, limit: 28, reviewer: "Assign reviewer" },
  { id: 11, name: "Adaptive Communication Protocols", sectionType: "Narrative", status: "Done", target: 9, limit: 31, reviewer: "Assign reviewer" },
  { id: 12, name: "Advantages Over Current Technologies", sectionType: "Narrative", status: "Not Started", target: 12, limit: 0, reviewer: "Assign reviewer" },
]
