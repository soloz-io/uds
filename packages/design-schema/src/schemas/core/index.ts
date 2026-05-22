import { z } from "zod";

/**
 * Core layout and primitive schemas.
 * Re-exports the shadcn subset of @json-render/shadcn component definitions,
 * plus adds Grid and Card wrappers aligned to ai-design-system.
 *
 * Backend-safe: no React imports.
 */

const validationCheckSchema = z
  .array(
    z.object({
      type: z.string(),
      message: z.string(),
      args: z.record(z.string(), z.unknown()).optional(),
    })
  )
  .nullable();

const validateOnSchema = z.enum(["change", "blur", "submit"]).nullable();

export const coreSchemas = {
  // ---- Layout ----
  Stack: {
    props: z.object({
      direction: z.enum(["horizontal", "vertical"]).nullable(),
      gap: z.enum(["none", "sm", "md", "lg", "xl"]).nullable(),
      align: z.enum(["start", "center", "end", "stretch"]).nullable(),
      justify: z.enum(["start", "center", "end", "between", "around"]).nullable(),
      className: z.string().nullable(),
    }),
    slots: ["default"],
    description: "Flex layout container. Use direction='horizontal' for side-by-side, 'vertical' for stacked.",
    example: { direction: "vertical", gap: "md" },
  },

  Grid: {
    props: z.object({
      columns: z.number().nullable().describe("Number of columns (1-6)"),
      gap: z.enum(["sm", "md", "lg", "xl"]).nullable(),
      className: z.string().nullable(),
    }),
    slots: ["default"],
    description: "CSS grid layout. Use columns=4 for stat cards, columns=2 for side-by-side panels.",
    example: { columns: 4, gap: "md" },
  },

  Card: {
    props: z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      maxWidth: z.enum(["sm", "md", "lg", "full"]).nullable(),
      centered: z.boolean().nullable(),
      className: z.string().nullable(),
    }),
    slots: ["default"],
    description: "Card container. Use for grouping related content. Do NOT use for stat metrics — use StatsCard instead.",
    example: { title: "Overview", description: "Your account summary" },
  },

  Separator: {
    props: z.object({
      orientation: z.enum(["horizontal", "vertical"]).nullable(),
    }),
    description: "Visual divider line.",
  },

  // ---- Typography ----
  Heading: {
    props: z.object({
      text: z.string(),
      level: z.enum(["h1", "h2", "h3", "h4"]).nullable(),
    }),
    description: "Section heading.",
    example: { text: "Dashboard", level: "h1" },
  },

  Text: {
    props: z.object({
      content: z.string(),
      muted: z.boolean().nullable(),
    }),
    description: "Paragraph text. Set muted=true for secondary/caption text.",
    example: { content: "Here is your overview." },
  },

  // ---- Forms ----
  Button: {
    props: z.object({
      label: z.string(),
      variant: z.enum(["default", "secondary", "destructive", "outline", "ghost"]).nullable(),
      action: z.string(),
      actionParams: z.record(z.string(), z.unknown()).nullable(),
      disabled: z.boolean().nullable(),
    }),
    description: "Clickable button. action must match a registered action name. Use actionParams to pass parameters.",
    example: { label: "Save", variant: "default", action: "formSubmit" },
  },

  Input: {
    props: z.object({
      label: z.string().nullable(),
      value: z.string().nullable().describe("Use { $bindState: '/path' } for two-way binding"),
      placeholder: z.string().nullable(),
      type: z.enum(["text", "email", "password", "number", "tel"]).nullable(),
      validation: validationCheckSchema,
      validateOn: validateOnSchema,
    }),
    description: "Text input field. Use value with $bindState for two-way binding.",
    example: { label: "Email", value: { $bindState: "/form/email" }, placeholder: "you@example.com", type: "email" },
  },

  Form: {
    props: z.object({
      submitAction: z.string(),
      submitActionParams: z.record(z.string(), z.unknown()).nullable(),
    }),
    slots: ["default"],
    description: "Form container. Wrap Input, Select, Checkbox etc and a submit Button inside. Handles Enter key submission.",
  },

  Select: {
    props: z.object({
      label: z.string().nullable(),
      value: z.string().nullable().describe("Use { $bindState: '/path' } for two-way binding"),
      placeholder: z.string().nullable(),
      options: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
    description: "Dropdown select. Use value with $bindState for two-way binding.",
  },

  Checkbox: {
    props: z.object({
      label: z.string().nullable(),
      checked: z.boolean().nullable().describe("Use { $bindState: '/path' } for two-way binding"),
      defaultChecked: z.boolean().nullable(),
    }),
    description: "Checkbox input.",
  },

  Switch: {
    props: z.object({
      label: z.string().nullable(),
      checked: z.boolean().nullable().describe("Use { $bindState: '/path' } for two-way binding"),
      defaultChecked: z.boolean().nullable(),
    }),
    description: "Toggle switch.",
  },

  Textarea: {
    props: z.object({
      label: z.string().nullable(),
      value: z.string().nullable().describe("Use { $bindState: '/path' } for two-way binding"),
      placeholder: z.string().nullable(),
      rows: z.number().nullable(),
    }),
    description: "Multi-line text input.",
  },

  RadioGroup: {
    props: z.object({
      label: z.string().nullable(),
      value: z.string().nullable().describe("Use { $bindState: '/path' } for two-way binding"),
      options: z.array(z.object({ value: z.string(), label: z.string() })),
      defaultValue: z.string().nullable(),
    }),
    description: "Radio button group.",
  },

  // ---- Feedback ----
  Badge: {
    props: z.object({
      text: z.string(),
      variant: z.enum(["default", "secondary", "destructive", "outline"]).nullable(),
    }),
    description: "Status badge.",
    example: { text: "Active", variant: "default" },
  },

  Alert: {
    props: z.object({
      variant: z.enum(["default", "destructive"]).nullable(),
      title: z.string(),
      description: z.string().nullable(),
    }),
    description: "Alert message box.",
  },

  Progress: {
    props: z.object({
      value: z.number().describe("0-100"),
      max: z.number().nullable(),
      label: z.string().nullable(),
    }),
    description: "Horizontal progress bar (0-100).",
  },

  Skeleton: {
    props: z.object({
      width: z.string().nullable(),
      height: z.string().nullable(),
    }),
    description: "Loading placeholder shimmer.",
  },

  Spinner: {
    props: z.object({
      size: z.enum(["sm", "md", "lg"]).nullable(),
    }),
    description: "Circular loading spinner.",
  },

  // ---- Navigation ----
  Tabs: {
    props: z.object({
      defaultValue: z.string().nullable(),
      tabs: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
    slots: ["default"],
    description: "Tabbed navigation container. Each tab's content must be a TabContent child.",
    example: { tabs: [{ value: "overview", label: "Overview" }, { value: "details", label: "Details" }], defaultValue: "overview" },
  },

  TabContent: {
    props: z.object({ value: z.string() }),
    slots: ["default"],
    description: "Content panel for a specific tab. value must match a tab in the parent Tabs.",
  },

  Pagination: {
    props: z.object({
      currentPage: z.number(),
      totalPages: z.number(),
      onPageChange: z.string().nullable(),
    }),
    description: "Page navigation.",
  },

  // ---- Overlays ----
  Dialog: {
    props: z.object({
      trigger: z.string().describe("Label for the trigger button"),
      title: z.string(),
      description: z.string().nullable(),
    }),
    slots: ["default"],
    description: "Modal dialog. trigger is the button label that opens it.",
  },

  Drawer: {
    props: z.object({
      trigger: z.string().describe("Label for the trigger button"),
      title: z.string(),
      description: z.string().nullable(),
      side: z.enum(["top", "bottom", "left", "right"]).nullable(),
    }),
    slots: ["default"],
    description: "Slide-out drawer panel.",
  },

  DropdownMenu: {
    props: z.object({
      trigger: z.string().describe("Label for the trigger button"),
      items: z.array(z.object({
        label: z.string(),
        action: z.string().nullable(),
        actionParams: z.record(z.string(), z.unknown()).nullable(),
      })),
    }),
    description: "Dropdown menu with action items.",
  },

  Tooltip: {
    props: z.object({ content: z.string() }),
    slots: ["default"],
    description: "Tooltip shown on hover over children.",
  },

  Popover: {
    props: z.object({ trigger: z.string() }),
    slots: ["default"],
    description: "Popover panel triggered by a button.",
  },

  Avatar: {
    props: z.object({
      src: z.string().nullable(),
      alt: z.string().nullable(),
      fallback: z.string().describe("Initials shown when image unavailable"),
    }),
    description: "User avatar with image or initials fallback.",
  },

  Label: {
    props: z.object({
      text: z.string(),
      htmlFor: z.string().nullable(),
    }),
    description: "Accessible form label.",
  },

  // ---- Accordion ----
  Accordion: {
    props: z.object({
      type: z.enum(["single", "multiple"]).nullable(),
    }),
    slots: ["default"],
    description: "Collapsible accordion container.",
  },

  AccordionItem: {
    props: z.object({
      value: z.string(),
      title: z.string(),
    }),
    slots: ["default"],
    description: "Single accordion section.",
  },
} as const;

export type CoreComponentName = keyof typeof coreSchemas;
