import * as React from "react"
import { SidebarTrigger } from "@/components/primitives/Sidebar"
import { Separator } from "@/components/primitives/Separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/primitives/Tabs"
import type { AppHeaderProps } from "./interfaces"

export const AppHeader = React.memo<AppHeaderProps>(({ 
  title, 
  actions, 
  tabs, 
  defaultTab, 
  onTabChange, 
  className,
  showSidebarToggle = true,
  showTitle = true 
}) => {
  return (
    <header className={`flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 ${className || ""}`}>
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 lg:px-6">
        <div className="min-w-0 flex items-center gap-1 lg:gap-2">
          {showSidebarToggle && <SidebarTrigger className="-ml-1" />}
          {showSidebarToggle && showTitle && title && (
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          )}
          {showTitle && title && <h1 className="max-w-[28rem] truncate text-base font-medium">{title}</h1>}
        </div>

        <div className="justify-self-center">
          {tabs && tabs.length > 0 && (
            <Tabs defaultValue={defaultTab || tabs[0]?.value} onValueChange={onTabChange}>
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2">{actions}</div>
      </div>
    </header>
  )
})

AppHeader.displayName = "AppHeader"
