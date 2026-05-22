import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select"

/**
 * ThemeSelector Composite
 *
 * A theme variant selector component that allows users to choose from multiple theme options.
 * Composes Select primitive.
 *
 * @example
 * ```tsx
 * const themes = [
 *   { label: "Default", value: "default" },
 *   { label: "Ocean", value: "ocean" },
 *   { label: "Forest", value: "forest" },
 * ]
 * <ThemeSelector themes={themes} value="default" onValueChange={setTheme} />
 * ```
 */

export interface Theme {
  label: string
  value: string
}

export interface ThemeSelectorProps {
  /**
   * Available theme options
   */
  themes: Theme[]
  /**
   * Currently selected theme value
   */
  value?: string
  /**
   * Callback when theme selection changes
   */
  onValueChange?: (value: string) => void
  /**
   * Placeholder text when no theme is selected
   */
  placeholder?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * ThemeSelector component
 *
 * Provides a select dropdown to choose from multiple theme variants.
 */
export const ThemeSelector = React.memo<ThemeSelectorProps>(
  ({ themes, value, onValueChange, placeholder = "Select theme", className }) => {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)

ThemeSelector.displayName = "ThemeSelector"
