import * as React from "react"
import { Icon } from "@/components/primitives/Icon"

import { Button } from "@/components/primitives/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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

    const selectedProject = projects.find((p) => p.id === selectedProjectId)
    const displayLabel = selectedProject ? selectedProject.name : "Select Project..."

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={`w-[240px] justify-between font-medium ${className || ""}`}
          >
            {displayLabel}
            <Icon name="chevrons-up-down" size="sm" className="ml-2 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Find Project..." />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                <div className="flex flex-col items-center justify-center p-6 text-center text-sm text-muted-foreground">
                  No projects, yet!
                </div>
              </CommandEmpty>
              {projects.length > 0 && (
                <CommandGroup heading="All Projects">
                  {projects.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={project.name}
                      onSelect={() => {
                        onSelectProject(project.id)
                        setOpen(false)
                      }}
                    >
                      <Icon name="check"
                        className={`mr-2 h-4 w-4 ${
                          selectedProjectId === project.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {project.name}
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
                <Icon name="plus" size="sm" className="mr-2" />
                Create App
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

ProjectSwitcher.displayName = "ProjectSwitcher"
