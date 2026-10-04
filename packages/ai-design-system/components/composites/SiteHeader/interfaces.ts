import type * as React from "react"

export interface NavDropdownItem {
  title: string
  description?: string
  href: string
  icon?: React.ReactNode | string
}

export interface NavItem {
  title: string
  href?: string
  items?: NavDropdownItem[]
}

export interface SiteHeaderProps {
  logo?: React.ReactNode
  navItems?: NavItem[]
  actions?: React.ReactNode
  className?: string
  onNavigate?: (href: string) => void
  onSignIn?: () => void
  onSignUp?: () => void
}
