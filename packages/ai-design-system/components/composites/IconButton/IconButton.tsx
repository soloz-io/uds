import { Button, type ButtonProps } from "@/components/primitives/Button"
import { Icon } from "@/components/primitives/Icon"
import * as React from "react"

export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: string
  iconClassName?: string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, iconClassName, className, ...props }, ref) => {
    return (
      <Button ref={ref} className={className} {...props}>
        <Icon name={icon} className={iconClassName ?? "w-4 h-4"} />
      </Button>
    )
  }
)

IconButton.displayName = "IconButton"
