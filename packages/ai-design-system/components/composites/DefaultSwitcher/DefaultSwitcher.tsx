import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select"

/**
 * DefaultSwitcher Composite
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
 * <DefaultSwitcher themes={themes} value="default" onValueChange={setTheme} />
 * ```
 */

export interface DefaultSwitcherItem {
  label: string
  value: string
}

export interface DefaultSwitcherProps {
  /**
   * Available theme options
   */
  themes: DefaultSwitcherItem[]
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
 * DefaultSwitcher component
 *
 * Provides a select dropdown to choose from multiple theme variants.
 */
export const DefaultSwitcher = React.memo<DefaultSwitcherProps>(
  ({ themes, value, onValueChange, placeholder = "Select theme", className }) => {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem 
              key={theme.value} 
              value={theme.value}
              onClick={() => onValueChange?.(theme.value)}
            >
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)

DefaultSwitcher.displayName = "DefaultSwitcher"
