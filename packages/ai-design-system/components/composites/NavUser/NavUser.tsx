import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/primitives/Sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/primitives/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu"

export interface NavUserProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  actions?: { label: string; onClick: () => void }[]
  className?: string
}

export const NavUser = React.memo<NavUserProps>(({ user, actions, className }) => {
  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {actions && actions.length > 0 && (
            <DropdownMenuContent align="end" className="w-56">
              {actions.map((action) => (
                <DropdownMenuItem key={action.label} onClick={action.onClick}>
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
})

NavUser.displayName = "NavUser"
