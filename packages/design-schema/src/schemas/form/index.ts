import { z } from "zod";

export const formFieldTypeSchema = z.enum(["text", "number", "textarea", "select", "date", "boolean"]);

export const formFieldValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const formFieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const formFieldDefinitionSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: formFieldTypeSchema,
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  defaultValue: formFieldValueSchema.optional(),
  options: z.array(formFieldOptionSchema).optional(),
});

export const formSchema = z.object({
  schemaVersion: z.literal("1"),
  fields: z.array(formFieldDefinitionSchema),
});

export const formSchemas = {
  Form: {
    props: formSchema,
    description: "Schema-driven form definition used by composable report and dashboard creation flows.",
    example: {
      schemaVersion: "1",
      fields: [
        {
          name: "slug",
          label: "Slug",
          type: "text",
          required: true,
          placeholder: "my-entity",
        },
      ],
    },
  },
} as const;

export type FormFieldType = z.infer<typeof formFieldTypeSchema>;
export type FormFieldValue = z.infer<typeof formFieldValueSchema>;
export type FormFieldOption = z.infer<typeof formFieldOptionSchema>;
export type FormFieldDefinition = z.infer<typeof formFieldDefinitionSchema>;
export type FormSchema = z.infer<typeof formSchema>;
