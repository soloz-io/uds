import * as React from "react"

import { Button } from "@/components/primitives/Button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/primitives/Drawer"
import { Input } from "@/components/primitives/Input"
import { Label } from "@/components/primitives/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/primitives/Select"
import { Checkbox } from "@/components/primitives/Checkbox"
import { Textarea } from "@/components/primitives/Textarea"
import type {
  FormFieldDefinition,
  FormFieldOption,
  FormFieldType,
  FormFieldValue,
} from "design-schema"

export type FormReportsFieldType = FormFieldType

export type FormReportsValue = FormFieldValue

export type FormReportsValues = Record<string, FormReportsValue>

export type FormReportsFieldOption = FormFieldOption

export type FormReportsFieldDefinition = FormFieldDefinition

export interface FormReportsDrawerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: FormReportsFieldDefinition[]
  values: FormReportsValues
  submitLabel?: string
  cancelLabel?: string
  onFieldChange: (name: string, value: FormReportsValue, nextValues: FormReportsValues) => void
  onFieldBlur?: (name: string, value: FormReportsValue, values: FormReportsValues) => void
  onSubmit: (values: FormReportsValues) => void
  onCancel?: () => void
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const onChange = () => setIsMobile(media.matches)

    onChange()
    media.addEventListener("change", onChange)

    return () => media.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

function toInputValue(value: FormReportsValue): string {
  if (value === null || value === undefined) {
    return ""
  }
  return String(value)
}

export const FormReportsDrawerForm = React.memo<FormReportsDrawerFormProps>(
  ({
    open,
    onOpenChange,
    title,
    description,
    fields,
    values,
    submitLabel = "Create",
    cancelLabel = "Cancel",
    onFieldChange,
    onFieldBlur,
    onSubmit,
    onCancel,
  }) => {
    const isMobile = useIsMobile()

    const setField = React.useCallback(
      (name: string, value: FormReportsValue) => {
        const nextValues = { ...values, [name]: value }
        onFieldChange(name, value, nextValues)
      },
      [onFieldChange, values]
    )

    const handleSubmit = React.useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit(values)
      },
      [onSubmit, values]
    )

    return (
      <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
        <DrawerContent>
          <DrawerHeader className="gap-1">
            <DrawerTitle>{title}</DrawerTitle>
            {description ? <DrawerDescription>{description}</DrawerDescription> : null}
          </DrawerHeader>

          <form className="flex flex-col gap-4 overflow-y-auto px-4 text-sm" onSubmit={handleSubmit}>
            {fields.map((field) => {
              const value = values[field.name]

              return (
                <div key={field.name} className="flex flex-col gap-2">
                  <Label htmlFor={`form-reports-${field.name}`}>
                    {field.label}
                    {field.required ? <span className="ml-1 text-destructive">*</span> : null}
                  </Label>

                  {field.type === "textarea" ? (
                    <Textarea
                      id={`form-reports-${field.name}`}
                      value={toInputValue(value)}
                      placeholder={field.placeholder}
                      onChange={(event) => setField(field.name, event.target.value)}
                      onBlur={(event) => onFieldBlur?.(field.name, event.target.value, values)}
                      rows={4}
                    />
                  ) : null}

                  {field.type === "select" ? (
                    <Select
                      value={toInputValue(value)}
                      onValueChange={(nextValue) => setField(field.name, nextValue)}
                    >
                      <SelectTrigger id={`form-reports-${field.name}`}>
                        <SelectValue placeholder={field.placeholder ?? `Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {(field.options ?? []).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}

                  {field.type === "boolean" ? (
                    <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                      <Checkbox
                        id={`form-reports-${field.name}`}
                        checked={Boolean(value)}
                        onCheckedChange={(checked) => setField(field.name, Boolean(checked))}
                        onBlur={() => onFieldBlur?.(field.name, Boolean(value), values)}
                      />
                      <Label htmlFor={`form-reports-${field.name}`}>{field.placeholder ?? `Enable ${field.label}`}</Label>
                    </div>
                  ) : null}

                  {field.type === "text" || field.type === "number" || field.type === "date" ? (
                    <Input
                      id={`form-reports-${field.name}`}
                      type={field.type === "text" ? "text" : field.type}
                      value={toInputValue(value)}
                      placeholder={field.placeholder}
                      onChange={(event) => {
                        const nextValue =
                          field.type === "number"
                            ? event.target.value === ""
                              ? ""
                              : Number(event.target.value)
                            : event.target.value
                        setField(field.name, nextValue)
                      }}
                      onBlur={(event) => {
                        const blurValue =
                          field.type === "number"
                            ? event.target.value === ""
                              ? ""
                              : Number(event.target.value)
                            : event.target.value
                        onFieldBlur?.(field.name, blurValue, values)
                      }}
                    />
                  ) : null}

                  {field.description ? <p className="text-xs text-muted-foreground">{field.description}</p> : null}
                </div>
              )
            })}

            <DrawerFooter className="px-0">
              <Button type="submit">{submitLabel}</Button>
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onCancel?.()
                    onOpenChange(false)
                  }}
                >
                  {cancelLabel}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    )
  }
)

FormReportsDrawerForm.displayName = "FormReportsDrawerForm"
