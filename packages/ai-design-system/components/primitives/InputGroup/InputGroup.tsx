"use client";

import * as React from "react";
import {
  InputGroup as ShadcnInputGroup,
  InputGroupAddon as ShadcnInputGroupAddon,
  InputGroupButton as ShadcnInputGroupButton,
  InputGroupInput as ShadcnInputGroupInput,
  InputGroupText as ShadcnInputGroupText,
  InputGroupTextarea as ShadcnInputGroupTextarea,
} from "@/components/ui/input-group";

export type InputGroupProps = React.ComponentProps<typeof ShadcnInputGroup>;
export type InputGroupAddonProps = React.ComponentProps<typeof ShadcnInputGroupAddon>;
export type InputGroupButtonProps = React.ComponentProps<typeof ShadcnInputGroupButton>;
export type InputGroupInputProps = React.ComponentProps<typeof ShadcnInputGroupInput>;
export type InputGroupTextProps = React.ComponentProps<typeof ShadcnInputGroupText>;
export type InputGroupTextareaProps = React.ComponentProps<typeof ShadcnInputGroupTextarea>;

export const InputGroup = React.memo<InputGroupProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnInputGroup>, InputGroupProps>(
    (props, ref) => {
      return <ShadcnInputGroup ref={ref} {...props} />;
    }
  )
);
InputGroup.displayName = "InputGroup";

export const InputGroupAddon = React.memo<InputGroupAddonProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnInputGroupAddon>, InputGroupAddonProps>(
    (props, ref) => {
      return <ShadcnInputGroupAddon ref={ref} {...props} />;
    }
  )
);
InputGroupAddon.displayName = "InputGroupAddon";

export const InputGroupButton = React.memo<InputGroupButtonProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnInputGroupButton>, InputGroupButtonProps>(
    (props, ref) => {
      return <ShadcnInputGroupButton ref={ref} {...props} />;
    }
  )
);
InputGroupButton.displayName = "InputGroupButton";

export const InputGroupInput = React.memo<InputGroupInputProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnInputGroupInput>, InputGroupInputProps>(
    (props, ref) => {
      return <ShadcnInputGroupInput ref={ref} {...props} />;
    }
  )
);
InputGroupInput.displayName = "InputGroupInput";

export const InputGroupText = React.memo<InputGroupTextProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnInputGroupText>, InputGroupTextProps>(
    (props, ref) => {
      return <ShadcnInputGroupText ref={ref} {...props} />;
    }
  )
);
InputGroupText.displayName = "InputGroupText";

export const InputGroupTextarea = React.memo<InputGroupTextareaProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnInputGroupTextarea>, InputGroupTextareaProps>(
    (props, ref) => {
      return <ShadcnInputGroupTextarea ref={ref} {...props} />;
    }
  )
);
InputGroupTextarea.displayName = "InputGroupTextarea";
