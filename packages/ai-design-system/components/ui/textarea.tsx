import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  [
    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "py-2 text-sm md:text-xs",
        default: "py-3 text-base md:text-sm",
        lg: "py-4 text-lg md:text-base",
      },
      state: {
        default: "",
        error: "border-destructive ring-destructive/20 dark:ring-destructive/40",
        success: "border-green-500 dark:border-green-600 ring-green-500/20 dark:ring-green-600/40",
        warning: "border-orange-500 dark:border-orange-600 ring-orange-500/20 dark:ring-orange-600/40",
      },
    },
    defaultVariants: {
      size: "default",
      state: "default",
    },
  }
)

export interface TextareaProps
  extends React.ComponentProps<"textarea">,
    VariantProps<typeof textareaVariants> {}

function Textarea({ className, size, state, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size, state }), className)}
      aria-invalid={state === "error" ? true : props["aria-invalid"]}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
