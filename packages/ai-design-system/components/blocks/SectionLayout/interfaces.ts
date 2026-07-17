import type React from "react";
import type { AppHeaderProps } from "@/components/composites/AppHeader/interfaces";

export interface SectionLayoutSection {
  id: string;
  content: React.ReactNode;
  fixedSize?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  header?: AppHeaderProps;
  variant?: "default" | "ghost";
}

export interface SectionLayoutProps extends React.ComponentPropsWithoutRef<"div"> {
  sections: SectionLayoutSection[];
  orientation?: "horizontal" | "vertical";
  storageKey?: string;
  onSectionResize?: (sectionId: string, newSize: number) => void;
  resizable?: boolean;
  dragHandleColor?: "primary" | "secondary" | "accent" | "border" | "muted";
  padded?: boolean;
}
