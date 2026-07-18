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

export interface Project {
  id: string
  name: string
}

export interface ProjectSwitcherProps {
  projects: Project[]
  selectedProjectId?: string | null
  onSelectProject: (id: string) => void
  onCreateProject: () => void
  className?: string
}

export const ProjectSwitcher = React.memo<ProjectSwitcherProps>(
  ({ projects, selectedProjectId, onSelectProject, onCreateProject, className }) => {
    const [open, setOpen] = React.useState(false)

    const selectedProject = projects.find((p) => String(p.id) === String(selectedProjectId))
    const displayLabel = selectedProject ? selectedProject.name : "Select Project..."

    const defaultValue = selectedProject ? `${selectedProject.name}-${selectedProject.id}` : undefined

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
                placeholder="Find Project..."
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">Esc</kbd>
            </div>
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                <div className="flex flex-col items-center justify-center p-6 text-center text-sm text-muted-foreground">
                  No projects, yet!
                </div>
              </CommandEmpty>
              {projects.length > 0 && (
                <CommandGroup>
                  {projects.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={`${project.name}-${project.id}`}
                      onSelect={() => {
                        onSelectProject(project.id)
                        setOpen(false)
                      }}
                      className="mb-1 last:mb-0 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        {project.name}
                      </div>
                      <Icon name="check"
                        className={`h-4 w-4 ${
                          String(selectedProjectId) === String(project.id) ? "opacity-100" : "opacity-0"
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
                  onCreateProject()
                }}
              >
                <Icon name="plus" size="sm" className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

ProjectSwitcher.displayName = "ProjectSwitcher"
