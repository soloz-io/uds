import { Button, type ButtonProps } from "@/components/primitives/Button"
import { Icon } from "@/components/primitives/Icon"
import * as React from "react"

export interface ChatToggleButtonProps extends Omit<ButtonProps, "children"> {
  isOpen?: boolean
  label?: string
}

export function ChatToggleButton({
  isOpen = true,
  label = "Hide Chat",
  className,
  ...props
}: ChatToggleButtonProps) {
  return (
    <Button
      variant="ghost"
      className={`-ml-2 h-8 text-muted-foreground hover:text-foreground ${className ?? ""}`}
      {...props}
    >
      <Icon name="panel-left" size="sm" />
      {label}
    </Button>
  )
}
