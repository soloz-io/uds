import type { Meta, StoryObj } from "@storybook/react";
import { AuthCard } from "./AuthCard";
import { fn } from "@storybook/test";

const meta: Meta<typeof AuthCard> = {
  title: "Composites/AuthCard",
  component: AuthCard,
  parameters: {
    layout: "centered",
  },
  args: {
    appName: "Waypoint",
    mode: "login",
    email: "",
    isLoading: false,
    allowSso: true,
    socialProviders: ["apple", "google"],
    onEmailChange: fn(),
    onNameChange: fn(),
    onPasswordChange: fn(),
    onConfirmPasswordChange: fn(),
    onSubmit: fn(),
    onSsoClick: fn(),
    onSocialClick: fn(),
    onToggleMode: fn(),
  },
} satisfies Meta<typeof AuthCard>;

export default meta;
type Story = StoryObj<typeof AuthCard>;

export const LoginDefault: Story = {
  args: {
    mode: "login",
  },
};

export const LoginFilled: Story = {
  args: {
    mode: "login",
    email: "alex@example.com",
  },
};

export const SignupDefault: Story = {
  args: {
    mode: "signup",
  },
};

export const LoadingState: Story = {
  args: {
    mode: "login",
    email: "alex@example.com",
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    mode: "login",
    email: "alex@example.com",
    error: "Invalid email or authentication session expired. Please try again.",
  },
};
