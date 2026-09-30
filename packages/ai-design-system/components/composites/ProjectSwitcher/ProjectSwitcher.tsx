import * as React from "react"
import { Icon } from "@/components/primitives/Icon"
import { Command as CommandPrimitive } from "cmdk"

import { Button } from "@/components/primitives/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/primitives/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/primitives/Popover"

export interface ProjectSwitcherItem {
  id: string
  name: string
}

// Backwards compatibility alias
export type Project = ProjectSwitcherItem

export interface ProjectSwitcherProps {
  /** List of projects / channels / workspaces to switch between */
  projects?: ProjectSwitcherItem[]
  /** Generic alias for projects */
  items?: ProjectSwitcherItem[]
  /** ID of the currently selected item */
  selectedProjectId?: string | null
  /** Generic alias for selectedProjectId */
  selectedId?: string | null
  /** Callback fired when an item is selected */
  onSelectProject?: (id: string) => void
  /** Generic alias for onSelectProject */
  onSelect?: (id: string) => void
  /** Callback fired when creating a new item */
  onCreateProject?: () => void
  /** Generic alias for onCreateProject */
  onCreate?: () => void
  /** Custom CSS class names */
  className?: string
  /**
   * Domain entity name used to automatically derive labels (e.g. "Project", "Channel", "Workspace").
   * @default "Project"
   */
  entityName?: string
  /** Placeholder when nothing is selected. Defaults to "Select <entityName>..." */
  placeholder?: string
  /** Search input placeholder. Defaults to "Find <entityName>..." */
  searchPlaceholder?: string
  /** Empty state message. Defaults to "No <entityName.toLowerCase()>s, yet!" */
  emptyMessage?: string
  /** Create button label. Defaults to "Create <entityName>" */
  createButtonText?: string
}

export const ProjectSwitcher = React.memo<ProjectSwitcherProps>(
  ({
    projects,
    items,
    selectedProjectId,
    selectedId,
    onSelectProject,
    onSelect,
    onCreateProject,
    onCreate,
    className,
    entityName = "Project",
    placeholder,
    searchPlaceholder,
    emptyMessage,
    createButtonText,
  }) => {
    const [open, setOpen] = React.useState(false)

    const list = items ?? projects ?? []
    const activeId = selectedId !== undefined ? selectedId : selectedProjectId
    const handleSelect = onSelect ?? onSelectProject ?? (() => {})
    const handleCreate = onCreate ?? onCreateProject ?? (() => {})

    const resolvedPlaceholder = placeholder ?? `Select ${entityName}...`
    const resolvedSearchPlaceholder = searchPlaceholder ?? `Find ${entityName}...`
    const resolvedEmptyMessage = emptyMessage ?? `No ${entityName.toLowerCase()}s, yet!`
    const resolvedCreateButtonText = createButtonText ?? `Create ${entityName}`

    const selectedItem = list.find((p) => String(p.id) === String(activeId))
    const displayLabel = selectedItem ? selectedItem.name : resolvedPlaceholder

    const defaultValue = selectedItem ? `${selectedItem.name}-${selectedItem.id}` : undefined

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={`w-[240px] justify-between font-medium ${className || ""}`}
          >
            <div className="flex items-center">
              {displayLabel}
            </div>
            <Icon name="chevrons-up-down" size="sm" className="ml-2 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <Command defaultValue={defaultValue}>
            <div className="flex items-center justify-between border-b border-neutral-600 px-3" cmdk-input-wrapper="">
              <CommandPrimitive.Input
                placeholder={resolvedSearchPlaceholder}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">Esc</kbd>
            </div>
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                <div className="flex flex-col items-center justify-center p-6 text-center text-sm text-muted-foreground">
                  {resolvedEmptyMessage}
                </div>
              </CommandEmpty>
              {list.length > 0 && (
                <CommandGroup>
                  {list.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.name}-${item.id}`}
                      onSelect={() => {
                        handleSelect(item.id)
                        setOpen(false)
                      }}
                      className="mb-1 last:mb-0 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        {item.name}
                      </div>
                      <Icon
                        name="check"
                        className={`h-4 w-4 ${
                          String(activeId) === String(item.id) ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <div className="p-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal"
                onClick={() => {
                  setOpen(false)
                  handleCreate()
                }}
              >
                <Icon name="plus" size="sm" className="mr-2 h-4 w-4" />
                {resolvedCreateButtonText}
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

ProjectSwitcher.displayName = "ProjectSwitcher"
