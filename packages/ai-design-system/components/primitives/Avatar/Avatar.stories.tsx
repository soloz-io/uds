import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

/**
 * Avatar component displays a user profile picture with automatic fallback support.
 *
 * ## Features
 * - Automatic image loading with fallback
 * - Circular design (default) or custom shapes
 * - Size customization
 * - Lazy loading support
 * - Accessible with proper alt text
 * - WCAG 2.1 Level AA compliant
 *
 * ## Usage
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/user.jpg" alt="User Name" />
 *   <AvatarFallback>UN</AvatarFallback>
 * </Avatar>
 * ```
 *
 * ## Accessibility
 * - Always provide alt text for AvatarImage
 * - Fallback should contain initials or descriptive text
 * - Support for screen readers
 */
const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An image element with a fallback for representing a user or entity.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

/**
 * Default avatar with image
 */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatar with fallback (when image fails to load)
 */
export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/invalid-image-url.jpg" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Different avatar sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="size-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <AvatarFallback className="text-xs">XS</AvatarFallback>
      </Avatar>

      <Avatar className="size-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
        <AvatarFallback className="text-sm">SM</AvatarFallback>
      </Avatar>

      <Avatar className="size-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="Medium" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>

      <Avatar className="size-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <AvatarFallback className="text-lg">LG</AvatarFallback>
      </Avatar>

      <Avatar className="size-24">
        <AvatarImage src="https://github.com/shadcn.png" alt="Extra Large" />
        <AvatarFallback className="text-2xl">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Avatar with initials fallback
 */
export const WithInitials: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback>EF</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Avatar with colored backgrounds
 */
export const ColoredFallbacks: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback className="bg-red-500 text-white">AB</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">CD</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-green-500 text-white">EF</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-purple-500 text-white">GH</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-orange-500 text-white">IJ</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Avatar with icon fallback
 */
export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src="/invalid.jpg" alt="User" />
        <AvatarFallback>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </AvatarFallback>
      </Avatar>

      <Avatar className="size-12">
        <AvatarImage src="/invalid.jpg" alt="User" />
        <AvatarFallback>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Avatar group (stacked avatars)
 */
export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-4">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U4</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback className="text-xs">+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Avatar with status indicator
 */
export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Online user" />
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block size-3 rounded-full bg-green-500 ring-2 ring-background" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/vercel.png" alt="Away user" />
          <AvatarFallback>AW</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block size-3 rounded-full bg-yellow-500 ring-2 ring-background" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarFallback>OF</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block size-3 rounded-full bg-gray-400 ring-2 ring-background" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarFallback>DND</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block size-3 rounded-full bg-red-500 ring-2 ring-background" />
      </div>
    </div>
  ),
};

/**
 * Square avatar (custom shape)
 */
export const SquareShape: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar className="rounded-md">
        <AvatarImage src="https://github.com/shadcn.png" alt="Square avatar" />
        <AvatarFallback>SQ</AvatarFallback>
      </Avatar>

      <Avatar className="rounded-lg size-12">
        <AvatarImage src="https://github.com/vercel.png" alt="Rounded square" />
        <AvatarFallback>RS</AvatarFallback>
      </Avatar>

      <Avatar className="rounded-none size-12">
        <AvatarFallback>NS</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Dark mode support
 */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark flex gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Dark mode" />
        <AvatarFallback>DM</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          CD
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};
