import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  ],
  {
    variants: {
      size: {
        sm: "h-8 py-1 text-sm md:text-xs",
        default: "h-9 py-1 text-base md:text-sm",
        lg: "h-12 py-2 text-lg md:text-base",
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

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

function Input({ className, type, size, state, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, state }), className)}
      aria-invalid={state === "error" ? true : props["aria-invalid"]}
      {...props}
    />
  )
}

export { Input, inputVariants }
