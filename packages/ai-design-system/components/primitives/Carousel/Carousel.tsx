"use client";

import * as React from "react";
import {
  Carousel as ShadcnCarousel,
  CarouselContent as ShadcnCarouselContent,
  CarouselItem as ShadcnCarouselItem,
  CarouselNext as ShadcnCarouselNext,
  CarouselPrevious as ShadcnCarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export type { CarouselApi };
export type CarouselProps = React.ComponentProps<typeof ShadcnCarousel>;
export type CarouselContentProps = React.ComponentProps<typeof ShadcnCarouselContent>;
export type CarouselItemProps = React.ComponentProps<typeof ShadcnCarouselItem>;
export type CarouselPreviousProps = React.ComponentProps<typeof ShadcnCarouselPrevious>;
export type CarouselNextProps = React.ComponentProps<typeof ShadcnCarouselNext>;

export const Carousel = React.memo<CarouselProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCarousel>, CarouselProps>(
    (props, ref) => {
      return <ShadcnCarousel ref={ref} {...props} />;
    }
  )
);
Carousel.displayName = "Carousel";

export const CarouselContent = React.memo<CarouselContentProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCarouselContent>, CarouselContentProps>(
    (props, ref) => {
      return <ShadcnCarouselContent ref={ref} {...props} />;
    }
  )
);
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.memo<CarouselItemProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCarouselItem>, CarouselItemProps>(
    (props, ref) => {
      return <ShadcnCarouselItem ref={ref} {...props} />;
    }
  )
);
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.memo<CarouselPreviousProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCarouselPrevious>, CarouselPreviousProps>(
    (props, ref) => {
      return <ShadcnCarouselPrevious ref={ref} {...props} />;
    }
  )
);
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.memo<CarouselNextProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCarouselNext>, CarouselNextProps>(
    (props, ref) => {
      return <ShadcnCarouselNext ref={ref} {...props} />;
    }
  )
);
CarouselNext.displayName = "CarouselNext";
