"use client"

import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/primitives/NavigationMenu"
import { Icon } from "@/components/primitives/Icon"
import { Button } from "@/components/primitives/Button"
import { cn } from "@/lib/utils"
import type { SiteHeaderProps } from "./interfaces"

export const SiteHeader = React.memo<SiteHeaderProps>(
  ({ logo, navItems, actions, className, onNavigate, onSignIn, onSignUp }) => {
    return (
      <header
        className={cn(
          "relative z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          className
        )}
      >
        <div className="flex h-14 w-full items-center justify-between px-6">
          {/* Brand / Logo */}
          <div className="flex items-center gap-6">
            {logo}

            {/* Navigation Menu for routing pages and products */}
            {navItems && navItems.length > 0 && (
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {navItems.map((item) => {
                    if (item.items && item.items.length > 0) {
                      return (
                        <NavigationMenuItem key={item.title}>
                          <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 rounded-lg text-sm font-medium">
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="flex flex-col w-[260px] gap-1 p-1.5">
                              {item.items.map((subItem) => (
                                <li key={subItem.title}>
                                  <NavigationMenuLink asChild>
                                    <a
                                      href={subItem.href}
                                      onClick={(e) => {
                                        if (onNavigate) {
                                          e.preventDefault()
                                          onNavigate(subItem.href)
                                        }
                                      }}
                                      className="flex flex-row items-center gap-3 rounded-xl px-2.5 py-1.5 select-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group/item text-left w-full"
                                    >
                                      {subItem.icon && (
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/70 text-foreground transition-colors group-hover/item:bg-accent [&_svg]:size-4">
                                          {typeof subItem.icon === "string" ? (
                                            <Icon name={subItem.icon} size="sm" />
                                          ) : (
                                            subItem.icon
                                          )}
                                        </div>
                                      )}
                                      <div className="flex flex-col items-start text-left min-w-0">
                                        <span className="text-xs font-semibold leading-tight text-foreground text-left">
                                          {subItem.title}
                                        </span>
                                        {subItem.description && (
                                          <span className="text-[11px] leading-tight text-muted-foreground mt-0.5 line-clamp-1 text-left">
                                            {subItem.description}
                                          </span>
                                        )}
                                      </div>
                                    </a>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      )
                    }

                    return (
                      <NavigationMenuItem key={item.title}>
                        <NavigationMenuLink
                          asChild
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-accent/50 rounded-lg"
                          )}
                        >
                          <a
                            href={item.href || "#"}
                            onClick={(e) => {
                              if (onNavigate && item.href) {
                                e.preventDefault()
                                onNavigate(item.href)
                              }
                            }}
                          >
                            {item.title}
                          </a>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* Right Action slot (e.g. Sign in, Sign up) */}
          {actions ? (
            <div className="flex items-center gap-3">{actions}</div>
          ) : onSignIn || onSignUp ? (
            <div className="flex items-center gap-2">
              {onSignIn && (
                <Button variant="ghost" size="sm" onClick={onSignIn}>
                  Sign in
                </Button>
              )}
              {onSignUp && (
                <Button variant="default" size="sm" onClick={onSignUp}>
                  Sign up
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </header>
    )
  }
)

SiteHeader.displayName = "SiteHeader"
