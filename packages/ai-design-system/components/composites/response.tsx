"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { StreamingMarkdown } from "@/components/composites/StreamingMarkdown";

type ResponseProps = ComponentProps<typeof StreamingMarkdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <StreamingMarkdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
