"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/primitives/Accordion"
import { cn } from "@/lib/utils"
import type { FaqSectionProps } from "./interfaces"

export const FaqSection = React.memo<FaqSectionProps>(
  ({
    title = "Frequently asked questions",
    subtitle,
    items = [],
    className,
  }) => {
    return (
      <section
        className={cn(
          "flex flex-col w-full max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16 gap-8",
          className
        )}
      >
        {(title || subtitle) && (
          <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <Accordion type="single" collapsible className="w-full border-t border-border/40">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-b border-border/40 py-1">
              <AccordionTrigger className="text-left font-semibold text-foreground text-base md:text-lg hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pt-2 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    )
  }
)

FaqSection.displayName = "FaqSection"
