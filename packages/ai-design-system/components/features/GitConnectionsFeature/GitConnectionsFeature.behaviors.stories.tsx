import type { Meta, StoryObj } from '@storybook/react'
import { expect, within, fn, userEvent } from '@storybook/test'
import { GitConnectionsFeature } from './GitConnectionsFeature'
import {
  mockUninstalledData,
  mockReadyData,
  mockProvisionedData,
} from './GitConnectionsFeature.mocks'

const meta: Meta<typeof GitConnectionsFeature> = {
  title: 'Features/GitConnectionsFeature/Behaviors',
  component: GitConnectionsFeature,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const createActions = () => ({
  onInstallApp: fn(),
  onSelectOrg: fn(),
  onCreateRepository: fn(),
  onOpenRepository: fn(),
  onDetectBoxes: fn(),
  onConnectBox: fn(),
})

/** GitHub App not yet installed — user must connect GitHub */
export const BehaviorAppNotInstalled: Story = {
  name: 'Behavior: App Not Installed',
  args: {
    data: mockUninstalledData,
    actions: createActions(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText("GitHub app")).toBeInTheDocument()
    expect(await canvas.findByText("Installation needed")).toBeInTheDocument()

    const connectButton = await canvas.findByRole('button', { name: /Connect GitHub/i })
    expect(connectButton).toBeInTheDocument()
    await userEvent.click(connectButton)
    expect(args.actions.onInstallApp).toHaveBeenCalled()
  },
}

/** GitHub App installed, org connected — user can create repository */
export const BehaviorReadyToProvision: Story = {
  name: 'Behavior: Ready to Provision',
  args: {
    data: mockReadyData,
    actions: createActions(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText("Waypoint GitHub app")).toBeInTheDocument()
    expect(await canvas.findByText("Installed")).toBeInTheDocument()

    const createButton = await canvas.findByRole('button', { name: /Create in /i })
    expect(createButton).toBeInTheDocument()
    await userEvent.click(createButton)
    expect(args.actions.onCreateRepository).toHaveBeenCalled()
  },
}

/** Repository already provisioned and release published */
export const BehaviorProvisioned: Story = {
  name: 'Behavior: Repository Provisioned',
  args: {
    data: mockProvisionedData,
    actions: createActions(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText("Release status")).toBeInTheDocument()

    const openButton = await canvas.findByRole('button', { name: /Open repository/i })
    expect(openButton).toBeInTheDocument()
    await userEvent.click(openButton)
    expect(args.actions.onOpenRepository).toHaveBeenCalled()
  },
}
