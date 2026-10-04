import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { SiteHeader } from "./SiteHeader"

const meta: Meta<typeof SiteHeader> = {
  title: "Composites/SiteHeader",
  component: SiteHeader,
  tags: ["autodocs"],
  args: {
    logo: <span className="font-semibold text-lg">Nutgraf</span>,
    navItems: [
      {
        title: "Products",
        items: [
          {
            title: "Collar",
            description: "Where product ideas become shaped features.",
            href: "/solutions/collar",
          },
        ],
      },
      {
        title: "Features",
        href: "/",
      },
      {
        title: "Pricing",
        href: "/pricing",
      },
    ],
    actions: (
      <button type="button" className="text-sm font-medium px-3 py-1.5 rounded-md border">
        Sign in
      </button>
    ),
  },
}

export default meta
type Story = StoryObj<typeof SiteHeader>

export const Default: Story = {}
