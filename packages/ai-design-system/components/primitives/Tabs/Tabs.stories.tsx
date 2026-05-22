import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Card"

/**
 * Tabs Primitive Stories
 *
 * The Tabs component organizes content into switchable panels with accessible keyboard navigation.
 *
 * ## Accessibility Features
 * - Arrow keys navigate between tabs
 * - Home/End keys jump to first/last tab
 * - Tab key moves focus in/out of tab list
 * - Proper ARIA roles and attributes
 *
 * ## Usage Guidelines
 * - Use for content that naturally divides into categories
 * - Keep tab labels short and descriptive
 * - Ensure content in each tab is independent
 * - Don't nest tabs within tabs
 */
const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm">Make changes to your account here.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm">Change your password here.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithCards: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Your account overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">View your account summary and recent activity.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Track your performance and engagement.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Access your generated reports.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Configure your notification preferences.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <p className="text-sm">Make changes to your account here.</p>
        </TabsContent>
        <TabsContent value="password">
          <p className="text-sm">Change your password here.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
}
