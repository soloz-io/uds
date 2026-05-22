import * as React from "react"
import { Button } from "@/components/primitives/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu"
import { Icon } from "@/components/primitives/Icon"

/**
 * ModeToggle Composite
 *
 * A theme mode switcher component that allows users to toggle between light, dark, and system themes.
 * Composes Button and DropdownMenu primitives.
 *
 * @example
 * ```tsx
 * <ModeToggle />
 * ```
 */

export interface ModeToggleProps {
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * ModeToggle component
 *
 * Provides a dropdown menu to switch between light, dark, and system theme modes.
 * Uses local storage to persist the user's theme preference.
 */
export const ModeToggle = React.memo<ModeToggleProps>(({ className }) => {
  const [theme, setThemeState] = React.useState<"light" | "dark" | "system">("system")

  React.useEffect(() => {
    // Load theme from localStorage on mount
    const stored = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    if (stored) {
      setThemeState(stored)
    }
  }, [])

  React.useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const setTheme = (newTheme: "light" | "dark" | "system") => {
    localStorage.setItem("theme", newTheme)
    setThemeState(newTheme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Icon
            name="sun"
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Icon
            name="moon"
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Icon name="sun" className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Icon name="moon" className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Icon name="laptop" className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

ModeToggle.displayName = "ModeToggle"
