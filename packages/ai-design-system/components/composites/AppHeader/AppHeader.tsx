import * as React from "react"
import { SidebarTrigger } from "@/components/primitives/Sidebar"
import { Separator } from "@/components/primitives/Separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/primitives/Tabs"
import { ChatToggleButton } from "@/components/composites/ChatToggleButton"
import { ButtonSwitcher } from "@/components/composites/ButtonSwitcher"
import type { AppHeaderProps } from "./interfaces"

export const AppHeader = React.memo<AppHeaderProps>(({ 
  title, 
  actions, 
  tabs, 
  defaultTab, 
  activeTab,
  value,
  onTabChange, 
  className,
  tabsPosition = 'center',
  showSidebarToggle = true,
  showTitle = true,
  buttonSwitcherProps,
  chatToggleProps
}) => {
  const currentTab = activeTab ?? value;

  const renderTabs = (extraClass?: string) => {
    if (!tabs || tabs.length === 0) return null;
    return (
      <Tabs
        value={currentTab}
        defaultValue={currentTab !== undefined ? undefined : (defaultTab || tabs[0]?.value)}
        onValueChange={onTabChange}
        className={extraClass}
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  };

  return (
    <header className={`flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 ${className || ""}`}>
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 lg:px-6">
        <div className="min-w-0 flex items-center gap-1 lg:gap-2">
          {showSidebarToggle && <SidebarTrigger className="-ml-1" />}
          {showSidebarToggle && (showTitle && title || buttonSwitcherProps || chatToggleProps) && (
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          )}
          {showTitle && title && (
            typeof title === 'string' 
              ? <h1 className="max-w-[28rem] truncate text-base font-medium">{title}</h1>
              : title
          )}
          {chatToggleProps && <ChatToggleButton {...chatToggleProps} />}
          {tabsPosition === 'left' && renderTabs("ml-2")}
          {buttonSwitcherProps && <ButtonSwitcher {...buttonSwitcherProps} />}
        </div>

        <div className="justify-self-center">
          {tabsPosition === 'center' && renderTabs()}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2">
          {tabsPosition === 'right' && renderTabs()}
          {actions}
        </div>
      </div>
    </header>
  )
})

AppHeader.displayName = "AppHeader"
